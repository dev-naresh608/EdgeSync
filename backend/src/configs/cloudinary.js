import { config } from "./config";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadOnCloudinary = async (
  localFilePath,
  folder = "edgeSync/resource",
) => {
  try {
    if (!localFilePath) {
      throw new Error("No localFilePath found");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    console.log("File upload on cloudinary successfull");

    const url = cloudinary.url(result.public_id, {
      width: 400,
      height: 400,
      crop: "fill",
      gravity: "auto",
      fetch_format: "auto",
      quality: "auto",
      secure: true,
    });

    return {
      success: true,
      message: "image uploade successfully on cloudinary",
      url,
      public_id: response.public_id,
      response,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath);

    return {
      success: false,
      message: error.message || "Failed to upload image",
    };
  }
};
