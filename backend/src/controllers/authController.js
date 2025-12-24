/**
 * AUTH CONTROLLER
 * Xử lý đăng ký, đăng nhập, profile
 */

import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Đăng ký tài khoản mới
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, matKhau, role, hoTen, soDienThoai, namSinh, diaChi, chuyenMon, kinhNghiem, trinhDo, gioiThieu } = req.body;

    // Validate role
    if (!["GiaSu", "HocVien"].includes(role)) {
      return errorResponse(res, "Role không hợp lệ", 400);
    }

    // Check email exists
    const existingUser = await prisma.taiKhoan.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(res, "Email đã được sử dụng", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(matKhau, 12);

    // Create account with profile
    const taiKhoan = await prisma.taiKhoan.create({
      data: {
        email,
        matKhau: hashedPassword,
        role,
        // Create profile based on role
        ...(role === "GiaSu" && {
          giaSu: {
            create: {
              hoTen,
              soDienThoai,
              diaChi,
              namSinh: namSinh ? parseInt(namSinh) : null,
              chuyenMon,
              kinhNghiem,
              trinhDo,
              gioiThieu,
            },
          },
        }),
        ...(role === "HocVien" && {
          hocVien: {
            create: {
              hoTen,
              soDienThoai,
              namSinh: namSinh ? parseInt(namSinh) : null,
              diaChi,
            },
          },
        }),
      },
      include: {
        giaSu: true,
        hocVien: true,
      },
    });

    // Generate token
    const token = generateToken({
      id: taiKhoan.id,
      email: taiKhoan.email,
      role: taiKhoan.role,
    });

    // Remove password from response
    const { matKhau: _, ...taiKhoanData } = taiKhoan;

    return successResponse(
      res,
      {
        taiKhoan: taiKhoanData,
        token,
      },
      "Đăng ký thành công",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng nhập
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, matKhau } = req.body;

    // Find user
    const taiKhoan = await prisma.taiKhoan.findUnique({
      where: { email },
      include: {
        giaSu: true,
        hocVien: true,
      },
    });

    if (!taiKhoan) {
      return errorResponse(res, "Email hoặc mật khẩu không đúng", 401);
    }

    // Check account status
    if (taiKhoan.trangThai !== "Active") {
      return errorResponse(res, "Tài khoản đã bị khóa", 403);
    }

    // Verify password
    const isMatch = await bcrypt.compare(matKhau, taiKhoan.matKhau);
    if (!isMatch) {
      return errorResponse(res, "Email hoặc mật khẩu không đúng", 401);
    }

    // Generate token
    const token = generateToken({
      id: taiKhoan.id,
      email: taiKhoan.email,
      role: taiKhoan.role,
    });

    // Remove password from response
    const { matKhau: _, ...taiKhoanData } = taiKhoan;

    return successResponse(res, {
      taiKhoan: taiKhoanData,
      token,
    }, "Đăng nhập thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const taiKhoan = await prisma.taiKhoan.findUnique({
      where: { id: req.user.id },
      include: {
        giaSu: true,
        hocVien: true,
      },
    });

    if (!taiKhoan) {
      return errorResponse(res, "Không tìm thấy tài khoản", 404);
    }

    const { matKhau: _, ...taiKhoanData } = taiKhoan;

    return successResponse(res, taiKhoanData);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật mật khẩu
 * PUT /api/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { matKhauCu, matKhauMoi } = req.body;

    // Get current user
    const taiKhoan = await prisma.taiKhoan.findUnique({
      where: { id: req.user.id },
    });

    // Verify old password
    const isMatch = await bcrypt.compare(matKhauCu, taiKhoan.matKhau);
    if (!isMatch) {
      return errorResponse(res, "Mật khẩu cũ không đúng", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(matKhauMoi, 12);

    // Update password
    await prisma.taiKhoan.update({
      where: { id: req.user.id },
      data: { matKhau: hashedPassword },
    });

    return successResponse(res, null, "Đổi mật khẩu thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng xuất (client-side xóa token)
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  return successResponse(res, null, "Đăng xuất thành công");
};
