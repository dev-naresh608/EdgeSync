import express from "express";

import {
  createResource,
  getAllResources,
  getResourceById,
  deleteResource,
} from "./resource.controller.js";

import { authenticateAccessToken } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js"
import { resourceSchema } from "./resource.schema.js";

const resourceRouter = express.Router();

resourceRouter.post(
  "/",
  authenticateAccessToken,
  upload.single("file"),
  validate(resourceSchema),
  createResource
);

resourceRouter.get("/", authenticateAccessToken, getAllResources);

resourceRouter.get("/:id", authenticateAccessToken, getResourceById);

resourceRouter.delete("/:id", authenticateAccessToken, deleteResource);

export default resourceRouter;
