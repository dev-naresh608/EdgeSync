import axios from "axios";
import { config } from "../../configs/config.js";
import Replication from "./replication.model.js";

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
        `${nodeUrl}/api/resources/internal/replicate`,
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
          targetNode: nodeId,
          status: "pending",
        });
      }
    }
  }

  return replication;
};
