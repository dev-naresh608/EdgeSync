import {
  saveReplicatedResource,
  getResourceByIdInternal,
  getPendingReplicationJobsSvc,
  markJobCompletedSvc,
} from "./replication.service.js";

import { serverError, badRequest } from "../../utils/response.js";

export const replicateResourceController = async (req, res) => {
  try {
    const resource = req.body;

    const response = await saveReplicatedResource(resource);

    if (!response?.success) {
      return badRequest(
        res,
        response?.message || "Resource replication failed",
      );
    }

    return res.status(201).json(response);
  } catch (error) {
    return serverError(res, error, "Resource replication failed");
  }
};

export const getResourceByIdInternalController = async (req, res) => {
  try {
    const response = await getResourceByIdInternal(req.params.id);

    if (!response?.success) {
      return badRequest(res, response?.message || "Resource not found");
    }

    return res.status(200).json(response);
  } catch (error) {
    return serverError(res, error, "Failed to fetch resource");
  }
};

export const getPendingReplicationJobsController = async (req, res) => {
  try {
    const response = await getPendingReplicationJobsSvc(
      req.params.targetNode,
    );

    return res.status(200).json(response);
  } catch (error) {
    return serverError(
      res,
      error,
      "Failed to fetch pending replication jobs",
    );
  }
};

export const markJobCompletedController = async (req, res) => {
  try {
    const response = await markJobCompletedSvc(req.params.jobId);

    if (!response?.success) {
      return badRequest(
        res,
        response?.message || "Failed to mark job as completed",
      );
    }

    return res.status(200).json(response);
  } catch (error) {
    return serverError(res, error, "Failed to mark job as completed");
  }
};