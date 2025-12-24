/**
 * HỌC VIÊN ROUTES
 * /api/hoc-vien
 */

import express from "express";
import { body } from "express-validator";
import {
  getProfile,
  capNhatProfile,
  getDanhSachDangKy,
  dangKyLop,
  huyDangKy,
  uploadAvatar,
} from "../controllers/hocVienController.js";
import { studentRateTutor, getStudentRatings } from "../controllers/ratingController.js";
import { auth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Profile
router.get("/profile", getProfile);
router.put("/profile", capNhatProfile);
router.post("/avatar", uploadImage.single("avatar"), uploadAvatar);

// Đăng ký lớp
router.get("/dang-ky", getDanhSachDangKy);
router.post(
  "/dang-ky",
  [body("maLop").isUUID().withMessage("Mã lớp không hợp lệ")],
  validateRequest,
  dangKyLop
);
router.delete("/dang-ky/:id", huyDangKy);

// Đánh giá
router.post(
  "/danh-gia",
  [
    body("maGiaSu").isUUID().withMessage("Mã gia sư không hợp lệ"),
    body("diem").optional().isFloat({ min: 0, max: 5 }).withMessage("Điểm phải từ 0 đến 5"),
  ],
  validateRequest,
  studentRateTutor
);
router.get("/danh-gia-cua-toi", getStudentRatings); // Get my ratings (authenticated user)
router.get("/:id/danh-gia", getStudentRatings); // Get ratings by ID (admin/public)

export default router;
