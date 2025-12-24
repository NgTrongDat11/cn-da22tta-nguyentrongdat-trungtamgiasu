/**
 * AUTH ROUTES
 * /api/auth
 */

import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  getProfile,
  changePassword,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("matKhau").isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("role").isIn(["GiaSu", "HocVien"]).withMessage("Role không hợp lệ"),
  body("hoTen").notEmpty().withMessage("Họ tên không được để trống"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("matKhau").notEmpty().withMessage("Mật khẩu không được để trống"),
];

const changePasswordValidation = [
  body("matKhauCu").notEmpty().withMessage("Mật khẩu cũ không được để trống"),
  body("matKhauMoi").isLength({ min: 6 }).withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
];

// Public routes
router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);

// Protected routes
router.get("/profile", auth, getProfile);
router.put("/change-password", auth, changePasswordValidation, validateRequest, changePassword);
router.post("/logout", auth, logout);

export default router;
