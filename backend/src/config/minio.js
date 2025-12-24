/**
 * File Storage Configuration
 * Đơn giản hóa - không cần MinIO
 * Avatar có thể lưu dạng URL hoặc base64
 */

export const MINIO_BUCKET = "avatars";

/**
 * Placeholder init function (không cần MinIO nữa)
 */
export const initMinio = async () => {
  console.log("✅ File storage ready (simplified mode)");
};

export default null;
