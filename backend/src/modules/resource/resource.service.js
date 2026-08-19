import Resource from "./resource.model.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../../configs/cloudinary.js";
import { replicateResource } from "../../services/replication.service.js";
import User from "../user/user.model.js";

export const replicateResourceSvc = async (resource) => {
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

export const createResourceSvc = async ({
  name,
  description,
  file,
  ownerId,
  region,
}) => {
  const cloudinaryResult = await uploadOnCloudinary(file.path);

  if (!cloudinaryResult?.success) {
    return {
      success: false,
      message: cloudinaryResult?.message || "File upload failed",
    };
  }

  const resource = await Resource.create({
    name,
    description,
    fileUrl: cloudinaryResult.url,
    publicId: cloudinaryResult.publicId,
    fileType: file.mimetype,
    fileSize: file.size,
    ownerId,
    originRegion: region,
  });

  await replicateResource(resource);

  return {
    success: true,
    message: "Resource created successfully",
    resource,
  };
};

export const getAllResourcesSvc = async (ownerId) => {
  const resources = await Resource.find({ ownerId }).sort({ createdAt: -1 });

  return {
    success: true,
    message: "Resources fetched successfully",
    resources,
  };
};

export const getResourceByIdSvc = async (resourceId, ownerId) => {
  const resource = await Resource.findOne({ _id: resourceId, ownerId });

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

export const deleteResourceSvc = async (resourceId, ownerId) => {
  const resource = await Resource.findOne({
    _id: resourceId,
    ownerId,
  });

  if (!resource) {
    return {
      success: false,
      message: "Resource not found",
    };
  }

  const cloudinaryResult = await deleteOnCloudinary(resource.publicId);

  if (!cloudinaryResult.success) {
    return {
      success: false,
      message: cloudinaryResult.message || "Failed to delete from Cloudinary",
    };
  }

  if (cloudinaryResult.response?.result === "not found") {
    await Resource.findByIdAndDelete(resourceId);
    return {
      success: true,
      message: "Resource deleted from DB (file was already removed from cloud)",
    };
  }

  await Resource.findByIdAndDelete(resourceId);

  return {
    success: true,
    message: "Resource deleted successfully",
  };
};
