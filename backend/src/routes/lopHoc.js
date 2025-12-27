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
  ketThucLopHoc,
  huyLopHoc,
  ketThucHangLoat,
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

// Protected routes - Phải đăng nhập mới xem được
router.get("/", auth, getDanhSachLopHoc);
router.get("/:id", auth, getChiTietLopHoc);

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

// Kết thúc lớp học (chỉ lớp đang dạy)
router.put(
  "/:id/ket-thuc",
  auth,
  authorize("GiaSu", "Admin"),
  ketThucLopHoc
);

// Kết thúc hàng loạt
router.put(
  "/ket-thuc-hang-loat",
  auth,
  authorize("GiaSu", "Admin"),
  [
    body("maLopList").isArray({ min: 1 }).withMessage("Danh sách lớp không hợp lệ"),
    body("lyDoKetThuc").notEmpty().withMessage("Vui lòng cung cấp lý do kết thúc"),
  ],
  validateRequest,
  ketThucHangLoat
);

// Hủy lớp học (chỉ lớp đang tuyển)
router.put(
  "/:id/huy",
  auth,
  authorize("GiaSu", "Admin"),
  [body("lyDoHuy").notEmpty().withMessage("Vui lòng cung cấp lý do hủy lớp")],
  validateRequest,
  huyLopHoc
);

export default router;
