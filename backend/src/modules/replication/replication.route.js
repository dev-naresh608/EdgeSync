import express from "express";

import {
  replicateResourceController,
  getResourceByIdInternalController,
  getPendingReplicationJobsController,
  markJobCompletedController,
} from "./replication.controller.js";

import { authenticateInternalServer } from "../../middlewares/internalAuth.middleware.js";

const replicationRouter = express.Router();

// Receive a replicated resource from another node
replicationRouter.post(
  "/internal/replicate",
  authenticateInternalServer,
  replicateResourceController,
);

// Return pending replication jobs for a target node
replicationRouter.get(
  "/internal/pending/:targetNode",
  authenticateInternalServer,
  getPendingReplicationJobsController,
);

// Fetch a resource by ID (used by peer nodes during replication)
replicationRouter.get(
  "/internal/resource/:id",
  authenticateInternalServer,
  getResourceByIdInternalController,
);

// Mark a replication job as completed (used by target node after recovery)
replicationRouter.patch(
  "/internal/jobs/:jobId/complete",
  authenticateInternalServer,
  markJobCompletedController,
);

export default replicationRouter;
