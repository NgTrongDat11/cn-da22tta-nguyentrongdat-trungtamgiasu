/**
 * MÔN HỌC ROUTES
 * /api/mon-hoc
 */

import express from "express";
import { body } from "express-validator";
import {
  getDanhSachMonHoc,
  getAllMonHoc,
  getChiTietMonHoc,
  taoMonHoc,
  capNhatMonHoc,
  xoaMonHoc,
} from "../controllers/monHocController.js";
import { auth, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

// Validation
const monHocValidation = [
  body("tenMon").notEmpty().withMessage("Tên môn học không được để trống"),
];

// Protected routes - Phải đăng nhập mới xem được
router.get("/", auth, getDanhSachMonHoc);
router.get("/all", auth, getAllMonHoc);
router.get("/:id", auth, getChiTietMonHoc);

// Admin only routes
router.post(
  "/",
  auth,
  authorize("Admin"),
  monHocValidation,
  validateRequest,
  taoMonHoc
);

router.put(
  "/:id",
  auth,
  authorize("Admin"),
  monHocValidation,
  validateRequest,
  capNhatMonHoc
);

router.delete(
  "/:id",
  auth,
  authorize("Admin"),
  xoaMonHoc
);

export default router;
