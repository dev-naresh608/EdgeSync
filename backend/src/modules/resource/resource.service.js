import Resource from "./resource.model.js";
import { uploadOnCloudinary } from "../../configs/cloudinary.js";

export const createResourceSvc = async ({ name, description, file, ownerId }) => {
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
  });

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
  const resource = await Resource.findOneAndDelete({ _id: resourceId, ownerId });

  if (!resource) {
    return {
      success: false,
      message: "Resource not found",
    };
  }

  return {
    success: true,
    message: "Resource deleted successfully",
  };
};
