/**
 * Upload Service - Simplified (no MinIO)
 * Just return placeholder or save to local filesystem
 */

import { MINIO_BUCKET } from "../config/minio.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

/**
 * Upload file - simplified version
 * @param {Object} file - Multer file object
 * @param {string} folder - Subfolder (optional)
 * @returns {Promise<string>} URL placeholder
 */
export const uploadFile = async (file, folder = "") => {
  try {
    // Generate unique filename
    const ext = path.extname(file.originalname);
    const filename = `${folder ? folder + "/" : ""}${uuidv4()}${ext}`;

    // TODO: Save to local filesystem if needed
    // For now, just return a placeholder URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Không thể upload file");
  }
};

/**
 * Delete file - placeholder
 * @param {string} fileUrl - Full URL of file
 */
export const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    // TODO: Delete from filesystem if needed
    console.log("File deleted:", fileUrl);
  } catch (error) {
    console.error("Delete file error:", error);
  }
};
