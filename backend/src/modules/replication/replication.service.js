import axios from "axios";
import { config } from "../../configs/config.js";
import Replication from "./replication.model.js";
import Resource from "../resource/resource.model.js";

export const saveReplicatedResource = async (resource) => {
  const existingResource = await Resource.findById(resource._id);

  if (existingResource) {
    return {
      success: true,
      message: "Resource already exists",
      resource: existingResource,
    };
  }

  const newResource = await Resource.create(resource);

  return {
    success: true,
    message: "Resource replicated successfully",
    resource: newResource,
  };
};

export const getResourceByIdInternal = async (resourceId) => {
  const resource = await Resource.findOne({ _id: resourceId });

  if (!resource) {
    return {
      success: false,
      message: "Resource not found",
    };
  }

  return {
    success: true,
    message: "Resource fetched successfully",
    resource,
  };
};

export const replicateResource = async (resource) => {
  const currentNode = config.node.id;

  const replication = {
    sourceNode: currentNode,
    synced: [],
    failed: [],
  };

  for (const [nodeId, nodeUrl] of Object.entries(config.nodes)) {
    if (nodeId === currentNode) continue;

    try {
      console.log(`Replicating resource to ${nodeId}`);

      await axios.post(
        `${nodeUrl}/api/replication/internal/replicate`,
        resource,
        {
          headers: {
            "x-node-id": currentNode,
            "x-server-secret": config.server.secret,
          },
        },
      );
      replication.synced.push(nodeId);

      console.log(`Resource synced to ${nodeId}`);
    } catch (error) {
      console.log(`Failed to sync resource to ${nodeId}`);

      replication.failed.push({
        node: nodeId,
        message: "Server unavailable",
      });

      const existingJob = await Replication.findOne({
        resourceId: resource._id,
        targetNode: nodeId,
        status: "pending",
      });
      if (!existingJob) {
        await Replication.create({
          resourceId: resource._id,
          sourceNode: currentNode,
          targetNode: nodeId,
          status: "pending",
        });
      }
    }
  }

  return replication;
};

export const fetchResourceFromSource = async (job) => {
  try {
    const sourceUrl = config.nodes[job.sourceNode];

    if (!sourceUrl) {
      throw new Error(`Source node not found: ${job.sourceNode}`);
    }

    const response = await axios.get(
      `${sourceUrl}/api/replication/internal/resource/${job.resourceId}`,
      {
        headers: {
          "x-node-id": config.node.id,
          "x-server-secret": config.server.secret,
        },
      },
    );

    if (!response.data?.success || !response.data?.resource) {
      throw new Error("Resource could not be fetched from source node");
    }

    return response.data.resource;
  } catch (error) {
    throw new Error(
      `Failed to fetch resource from ${job.sourceNode}: ${
        error.response?.data?.message || error.message
      }`,
    );
  }
};

export const replicatePendingResource = async (job, resource) => {
  try {
    const targetUrl = config.nodes[job.targetNode];

    if (!targetUrl) {
      throw new Error(`Target node not found: ${job.targetNode}`);
    }

    await axios.post(
      `${targetUrl}/api/replication/internal/replicate`,
      resource,
      {
        headers: {
          "x-node-id": config.node.id,
          "x-server-secret": config.server.secret,
        },
      },
    );

    await Replication.findByIdAndUpdate(job._id, {
      status: "completed",
    });

    return {
      success: true,
      message: `Resource replicated to ${job.targetNode}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to replicate to ${job.targetNode}: ${
        error.response?.data?.message || error.message
      }`,
    };
  }
};

export const processReplicationJob = async (job) => {
  try {
    const resource = await fetchResourceFromSource(job);

    const replicationResult = await replicatePendingResource(
      job,
      resource,
    );

    if (!replicationResult.success) {
      return replicationResult;
    }

    return {
      success: true,
      message: "Replication job completed",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to process replication job",
    };
  }
};

export const getPendingReplicationJobsSvc = async (targetNode) => {
  const jobs = await Replication.find({
    targetNode,
    status: "pending",
  });

  return {
    success: true,
    message: "Pending replication jobs fetched",
    jobs,
  };
};

export const processPendingReplicationJobs = async () => {
  const currentNode = config.node.id;

  console.log(`[Recovery] Starting replication recovery for node: ${currentNode}`);

  // 1. Process local pending jobs (where this node is the source)
  const localJobs = await Replication.find({ status: "pending" });

  for (const job of localJobs) {
    console.log(`[Recovery] Processing local pending job: ${job._id}`);
    await processReplicationJob(job);
  }

  // 2. Query all peer nodes for pending jobs targeting this node
  for (const [nodeId, nodeUrl] of Object.entries(config.nodes)) {
    if (nodeId === currentNode) continue;

    try {
      console.log(`[Recovery] Querying ${nodeId} for pending jobs targeting ${currentNode}`);

      const response = await axios.get(
        `${nodeUrl}/api/replication/internal/pending/${currentNode}`,
        {
          headers: {
            "x-node-id": currentNode,
            "x-server-secret": config.server.secret,
          },
        },
      );

      const pendingJobs = response.data?.jobs || [];

      if (pendingJobs.length === 0) {
        console.log(`[Recovery] No pending jobs from ${nodeId}`);
        continue;
      }

      console.log(`[Recovery] Found ${pendingJobs.length} pending jobs from ${nodeId}`);

      for (const job of pendingJobs) {
        try {
          const resource = await fetchResourceFromSource(job);

          await saveReplicatedResource(resource);

          // Mark job as completed on the source node
          await markRemoteJobCompleted(nodeId, job._id);

          console.log(`[Recovery] Replicated resource ${job.resourceId} from ${nodeId}`);
        } catch (error) {
          console.log(
            `[Recovery] Failed to process job ${job._id} from ${nodeId}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      console.log(
        `[Recovery] Could not reach ${nodeId}: ${error.message}`,
      );
    }
  }

  console.log(`[Recovery] Replication recovery completed for node: ${currentNode}`);
};

const markRemoteJobCompleted = async (sourceNodeId, jobId) => {
  const sourceUrl = config.nodes[sourceNodeId];

  if (!sourceUrl) {
    throw new Error(`Source node URL not found: ${sourceNodeId}`);
  }

  await axios.patch(
    `${sourceUrl}/api/replication/internal/jobs/${jobId}/complete`,
    {},
    {
      headers: {
        "x-node-id": config.node.id,
        "x-server-secret": config.server.secret,
      },
    },
  );
};

export const markJobCompletedSvc = async (jobId) => {
  const job = await Replication.findById(jobId);

  if (!job) {
    return {
      success: false,
      message: "Replication job not found",
    };
  }

  job.status = "completed";
  await job.save();

  return {
    success: true,
    message: "Replication job marked as completed",
  };
};