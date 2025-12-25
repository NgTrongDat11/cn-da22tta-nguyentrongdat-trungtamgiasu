/**
 * ADMIN ROUTES
 * /api/admin
 */

import express from "express";
import { body } from "express-validator";
import {
  getDashboard,
  getDanhSachTaiKhoan,
  taoTaiKhoanAdmin,
  capNhatTrangThaiTaiKhoan,
  xoaTaiKhoan,
  getDanhSachLopHoc,
  ganGiaSuChoLop,
  xoaLopHoc,
  getDanhSachDangKy,
  getRevenueStats,
} from "../controllers/adminController.js";
import { auth, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

// All routes require Admin role
router.use(auth);
router.use(authorize("Admin"));

// Dashboard
router.get("/dashboard", getDashboard);
router.get("/dashboard/revenue", getRevenueStats);

// Quản lý tài khoản
router.get("/tai-khoan", getDanhSachTaiKhoan);
router.post(
  "/tai-khoan/admin",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("matKhau").isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  ],
  validateRequest,
  taoTaiKhoanAdmin
);
router.put(
  "/tai-khoan/:id/trang-thai",
  [body("trangThai").isIn(["Active", "Locked"]).withMessage("Trạng thái không hợp lệ")],
  validateRequest,
  capNhatTrangThaiTaiKhoan
);
router.delete("/tai-khoan/:id", xoaTaiKhoan);

// Quản lý lớp học
router.get("/lop-hoc", getDanhSachLopHoc);
router.post(
  "/lop-hoc/:id/gan-gia-su",
  [
    body("maGiaSu").isUUID().withMessage("Mã gia sư không hợp lệ"),
  ],
  validateRequest,
  ganGiaSuChoLop
);
router.delete("/lop-hoc/:id", xoaLopHoc);

// Quản lý đăng ký
router.get("/dang-ky", getDanhSachDangKy);

export default router;
