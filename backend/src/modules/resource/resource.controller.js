import {
  createResourceSvc,
  getAllResourcesSvc,
  getResourceByIdSvc,
  deleteResourceSvc,
} from "./resource.service.js";

import { serverError, badRequest } from "../../utils/response.js";

export const createResource = async (req, res) => {
  try {
    if (!req.file) {
      return badRequest(res, "File is required");
    }

    const response = await createResourceSvc({
      name: req.body.name,
      description: req.body.description,
      file: req.file,
      ownerId: req.user.sub,
    });

    if (!response?.success) {
      return badRequest(res, response?.message || "Failed to create resource");
    }

    return res.status(201).json(response);
  } catch (error) {
    return serverError(res, error, "Failed to create resource");
  }
};

export const getAllResources = async (req, res) => {
  try {
    const response = await getAllResourcesSvc(req.user.sub);

    if (!response?.success) {
      return badRequest(res, response?.message || "Failed to fetch resources");
    }

    return res.status(200).json(response);
  } catch (error) {
    return serverError(res, error, "Failed to fetch resources");
  }
};

export const getResourceById = async (req, res) => {
  try {
    const response = await getResourceByIdSvc(req.params.id, req.user.sub);

    if (!response?.success) {
      return badRequest(res, response?.message || "Resource not found");
    }

    return res.status(200).json(response);
  } catch (error) {
    return serverError(res, error, "Failed to fetch resource");
  }
};

export const deleteResource = async (req, res) => {
  try {
    const response = await deleteResourceSvc(req.params.id, req.user.sub);

    if (!response?.success) {
      return badRequest(res, response?.message || "Failed to delete resource");
    }

    return res.status(200).json(response);
  } catch (error) {
    return serverError(res, error, "Failed to delete resource");
  }
};
