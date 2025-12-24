/**
 * LỚP HỌC ROUTES
 * /api/lop-hoc
 */

import express from "express";
import { body } from "express-validator";
import {
  getDanhSachLopHoc,
  getChiTietLopHoc,
  taoLopHoc,
  capNhatLopHoc,
  capNhatLichHoc,
  duyetDangKy,
  getDanhSachDangKyLop,
} from "../controllers/lopHocController.js";
import { auth, optionalAuth, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

// Validation rules
const createLopHocValidation = [
  body("maMon").isUUID().withMessage("Mã môn không hợp lệ"),
  body("tenLop").notEmpty().withMessage("Tên lớp không được để trống"),
  body("hocPhi").isFloat({ min: 0 }).withMessage("Học phí phải là số dương"),
];

// Public routes
router.get("/", optionalAuth, getDanhSachLopHoc);
router.get("/:id", getChiTietLopHoc);

// Protected routes
router.post(
  "/",
  auth,
  authorize("GiaSu", "Admin"),
  createLopHocValidation,
  validateRequest,
  taoLopHoc
);

router.put(
  "/:id",
  auth,
  authorize("GiaSu", "Admin"),
  capNhatLopHoc
);

router.put(
  "/:id/lich-hoc",
  auth,
  authorize("GiaSu", "Admin"),
  capNhatLichHoc
);

// Quản lý đăng ký
router.get(
  "/:id/dang-ky",
  auth,
  authorize("GiaSu", "Admin"),
  getDanhSachDangKyLop
);

router.put(
  "/:id/duyet-dang-ky/:dangKyId",
  auth,
  authorize("GiaSu", "Admin"),
  [body("trangThai").isIn(["DaDuyet", "TuChoi"]).withMessage("Trạng thái không hợp lệ")],
  validateRequest,
  duyetDangKy
);

export default router;
