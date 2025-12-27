/**
 * GIA SƯ ROUTES
 * /api/gia-su
 */

import express from "express";
import { body } from "express-validator";
import {
  getDanhSachGiaSu,
  getChiTietGiaSu,
  getProfileGiaSu,
  capNhatProfile,
  uploadAvatar,
  getDanhSachLopHoc,
} from "../controllers/giaSuController.js";
import { tutorRateStudent, getTutorRatings, getTutorOwnRatings } from "../controllers/ratingController.js";
import { auth, optionalAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { uploadImage } from "../middleware/upload.js";

const router = express.Router();

// Protected routes - Phải đăng nhập mới xem được
router.get("/", auth, getDanhSachGiaSu);

// Protected routes (Gia sư only) - MUST be before /:id
router.get("/me", auth, getProfileGiaSu);
router.put("/profile", auth, capNhatProfile);
router.post("/avatar", auth, uploadImage.single("avatar"), uploadAvatar);
router.get("/me/lop-hoc", auth, getDanhSachLopHoc);

// Rating
router.get("/danh-gia-cua-toi", auth, getTutorOwnRatings);
router.post(
  "/danh-gia",
  auth,
  [
    body("maHocVien").isUUID().withMessage("Mã học viên không hợp lệ"),
    body("diem").optional().isFloat({ min: 0, max: 5 }).withMessage("Điểm phải từ 0 đến 5"),
  ],
  validateRequest,
  tutorRateStudent
);

// Dynamic route /:id must be last - Phải đăng nhập mới xem được
router.get("/:id", auth, getChiTietGiaSu);
router.get("/:id/danh-gia", auth, getTutorRatings);

export default router;
