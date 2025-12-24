/**
 * AUTH MIDDLEWARE
 *
 * Kiểm tra JWT token từ request header
 * Nếu hợp lệ → set req.user để controllers dùng
 * Nếu ko hợp lệ → return 401 Unauthorized
 */

import { verifyToken } from "../utils/jwt.js";
import prisma from "../config/prisma.js";
import { errorResponse } from "../utils/response.js";

/**
 * Middleware xác thực token
 * Authorization: Bearer <token>
 */
export const auth = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Không tìm thấy token xác thực", 401);
    }

    const token = authHeader.replace("Bearer ", "");

    // 2. Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(res, "Token không hợp lệ hoặc đã hết hạn", 401);
    }

    // 3. Kiểm tra tài khoản còn tồn tại không
    const taiKhoan = await prisma.taiKhoan.findUnique({
      where: { id: decoded.id },
      include: {
        giaSu: true,
        hocVien: true,
      },
    });

    if (!taiKhoan) {
      return errorResponse(res, "Tài khoản không tồn tại", 401);
    }

    if (taiKhoan.trangThai !== "Active") {
      return errorResponse(res, "Tài khoản đã bị khóa", 403);
    }

    // 4. Set user info vào request
    req.user = {
      id: taiKhoan.id,
      email: taiKhoan.email,
      role: taiKhoan.role,
      giaSu: taiKhoan.giaSu,
      hocVien: taiKhoan.hocVien,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return errorResponse(res, "Lỗi xác thực", 500);
  }
};

/**
 * Middleware kiểm tra role
 * @param {...string} roles - Các role được phép truy cập
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Chưa đăng nhập", 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "Bạn không có quyền thực hiện hành động này", 403);
    }

    next();
  };
};

/**
 * Middleware optional auth - không bắt buộc login
 * Nếu có token hợp lệ thì set req.user, không có thì vẫn next()
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    
    if (decoded) {
      const taiKhoan = await prisma.taiKhoan.findUnique({
        where: { id: decoded.id },
        include: {
          giaSu: true,
          hocVien: true,
        },
      });

      if (taiKhoan && taiKhoan.trangThai === "Active") {
        req.user = {
          id: taiKhoan.id,
          email: taiKhoan.email,
          role: taiKhoan.role,
          giaSu: taiKhoan.giaSu,
          hocVien: taiKhoan.hocVien,
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
};
