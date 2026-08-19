import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "./config.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadOnCloudinary = async (
  localFilePath,
  folder = "edgesync/resource",
) => {
  try {
    if (!localFilePath) {
      return {
        success: false,
        message: "Local file path is required",
      };
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      success: true,
      url: response.secure_url,
      resourceType: response.resource_type,
      publicId: response.public_id,
      format: response.format,
      bytes: response.bytes,
    };
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary upload failed:", error);

    return {
      success: false,
      message: error.message || "Cloudinary upload failed",
    };
  }
};

export const deleteOnCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      return {
        success: false,
        message: "public id is required",
      };
    }

    const response = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Cloudinary delete failed:", error);

    return {
      success: false,
      message: error.message || "Cloudinary delete failed",
    };
  }
};
