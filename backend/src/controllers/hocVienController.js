/**
 * HỌC VIÊN CONTROLLER
 * Quản lý học viên: profile, đăng ký lớp
 */

import prisma from "../config/prisma.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.js";
import { parsePagination } from "../utils/pagination.js";
import { uploadFile, deleteFile } from "../services/uploadService.js";

/**
 * Lấy profile học viên (chính mình)
 * GET /api/hoc-vien/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "HocVien") {
      return errorResponse(res, "Bạn không phải học viên", 403);
    }

    const hocVien = await prisma.hocVien.findUnique({
      where: { taiKhoanId: req.user.id },
      include: {
        taiKhoan: {
          select: {
            email: true,
            ngayTao: true,
          },
        },
      },
    });

    if (!hocVien) {
      return errorResponse(res, "Không tìm thấy thông tin học viên", 404);
    }

    return successResponse(res, hocVien);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật profile học viên
 * PUT /api/hoc-vien/profile
 */
export const capNhatProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "HocVien") {
      return errorResponse(res, "Bạn không phải học viên", 403);
    }

    const { hoTen, namSinh, soDienThoai, diaChi, hinhAnh } = req.body;

    const hocVien = await prisma.hocVien.update({
      where: { taiKhoanId: req.user.id },
      data: {
        ...(hoTen && { hoTen }),
        ...(namSinh && { namSinh: parseInt(namSinh) }),
        ...(soDienThoai && { soDienThoai }),
        ...(diaChi && { diaChi }),
        ...(hinhAnh !== undefined && { hinhAnh }),
      },
    });

    return successResponse(res, hocVien, "Cập nhật thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách đăng ký lớp của học viên
 * GET /api/hoc-vien/dang-ky
 */
export const getDanhSachDangKy = async (req, res, next) => {
  try {
    if (req.user.role !== "HocVien") {
      return errorResponse(res, "Bạn không phải học viên", 403);
    }

    const { page, limit, skip } = parsePagination(req.query);
    const { trangThai } = req.query;

    const hocVien = await prisma.hocVien.findUnique({
      where: { taiKhoanId: req.user.id },
    });

    if (!hocVien) {
      return errorResponse(res, "Không tìm thấy thông tin học viên", 404);
    }

    const where = {
      maHocVien: hocVien.maHocVien,
    };

    if (trangThai) {
      where.trangThai = trangThai;
    }

    const total = await prisma.dangKy.count({ where });

    const dangKyList = await prisma.dangKy.findMany({
      where,
      include: {
        lopHoc: {
          include: {
            monHoc: true,
            hopDongs: {
              include: {
                giaSu: {
                  select: {
                    hoTen: true,
                    soDienThoai: true,
                    hinhAnh: true,
                  },
                },
              },
            },
            lichHocs: {
              orderBy: [
                { ngayHoc: "asc" },
                { thu: "asc" },
                { gioBatDau: "asc" }
              ]
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { ngayDangKy: "desc" },
    });

    return paginatedResponse(res, dangKyList, { page, limit, total });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng ký vào lớp học
 * POST /api/hoc-vien/dang-ky
 */
export const dangKyLop = async (req, res, next) => {
  try {
    if (req.user.role !== "HocVien") {
      return errorResponse(res, "Bạn không phải học viên", 403);
    }

    const { maLop, yeuCauThem } = req.body;

    // Get học viên info
    const hocVien = await prisma.hocVien.findUnique({
      where: { taiKhoanId: req.user.id },
    });

    if (!hocVien) {
      return errorResponse(res, "Không tìm thấy thông tin học viên", 404);
    }

    // Check lớp học exists and status
    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    if (lopHoc.trangThai !== "DangTuyen") {
      return errorResponse(res, "Lớp học không còn tuyển sinh", 400);
    }

    // Check if already registered
    const existingDangKy = await prisma.dangKy.findUnique({
      where: {
        maHocVien_maLop: {
          maHocVien: hocVien.maHocVien,
          maLop,
        },
      },
    });

    if (existingDangKy) {
      return errorResponse(res, "Bạn đã đăng ký lớp này rồi", 400);
    }

    // Enforce 1-1: reject if class already has an approved student
    const approvedCount = await prisma.dangKy.count({
      where: {
        maLop,
        trangThai: "DaDuyet",
      },
    });

    if (approvedCount >= 1) {
      return errorResponse(res, "Lớp 1-1 đã đủ học viên", 409);
    }

    // Create đăng ký
    const dangKy = await prisma.dangKy.create({
      data: {
        maHocVien: hocVien.maHocVien,
        maLop,
        yeuCauThem,
      },
      include: {
        lopHoc: {
          include: {
            monHoc: true,
          },
        },
      },
    });

    return successResponse(res, dangKy, "Đăng ký thành công", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Hủy đăng ký lớp
 * DELETE /api/hoc-vien/dang-ky/:id
 */
export const huyDangKy = async (req, res, next) => {
  try {
    if (req.user.role !== "HocVien") {
      return errorResponse(res, "Bạn không phải học viên", 403);
    }

    const { id } = req.params;

    const hocVien = await prisma.hocVien.findUnique({
      where: { taiKhoanId: req.user.id },
    });

    // Check đăng ký exists and belongs to user
    const dangKy = await prisma.dangKy.findUnique({
      where: { maDangKy: id },
    });

    if (!dangKy) {
      return errorResponse(res, "Không tìm thấy đăng ký", 404);
    }

    if (dangKy.maHocVien !== hocVien.maHocVien) {
      return errorResponse(res, "Bạn không có quyền hủy đăng ký này", 403);
    }

    if (dangKy.trangThai !== "ChoDuyet") {
      return errorResponse(res, "Không thể hủy đăng ký đã được xử lý", 400);
    }

    // Delete đăng ký (cho phép đăng ký lại sau này)
    await prisma.dangKy.delete({
      where: { maDangKy: id },
    });

    return successResponse(res, null, "Hủy đăng ký thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Đánh giá gia sư sau khi học
 * POST /api/hoc-vien/danh-gia
 */
export const danhGiaGiaSu = async (req, res, next) => {
  try {
    if (req.user.role !== "HocVien") {
      return errorResponse(res, "Bạn không phải học viên", 403);
    }

    const { maGiaSu, maLop, diem, nhanXet } = req.body;

    // Validate diem
    if (diem < 0 || diem > 5) {
      return errorResponse(res, "Điểm đánh giá phải từ 0 đến 5", 400);
    }

    const hocVien = await prisma.hocVien.findUnique({
      where: { taiKhoanId: req.user.id },
    });

    if (!hocVien) {
      return errorResponse(res, "Không tìm thấy thông tin học viên", 404);
    }

    // If maLop provided, check học viên đã học lớp này chưa
    if (maLop) {
      const dangKy = await prisma.dangKy.findFirst({
        where: {
          maHocVien: hocVien.maHocVien,
          maLop,
          trangThai: "DaDuyet",
        },
      });

      if (!dangKy) {
        return errorResponse(res, "Bạn chưa tham gia lớp học này", 400);
      }
    }

    // Create đánh giá
    const danhGia = await prisma.danhGia.create({
      data: {
        maHocVien: hocVien.maHocVien,
        maGiaSu,
        maLop,
        diem,
        nhanXet,
      },
      include: {
        giaSu: {
          select: {
            hoTen: true,
          },
        },
        lopHoc: {
          select: {
            tenLop: true,
          },
        },
      },
    });

    return successResponse(res, danhGia, "Đánh giá thành công", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload ảnh đại diện học viên
 * POST /api/hoc-vien/avatar
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (req.user.role !== "HocVien") {
      return errorResponse(res, "Chỉ học viên mới có thể upload ảnh", 403);
    }

    if (!req.file) {
      return errorResponse(res, "Không tìm thấy file ảnh", 400);
    }

    // Get current avatar to delete later
    const currentHocVien = await prisma.hocVien.findUnique({
      where: { taiKhoanId: req.user.id },
      select: { hinhAnh: true },
    });

    // Upload new avatar
    const avatarUrl = await uploadFile(req.file, "avatars");

    // Update database
    const hocVien = await prisma.hocVien.update({
      where: { taiKhoanId: req.user.id },
      data: { hinhAnh: avatarUrl },
    });

    // Delete old avatar
    if (currentHocVien?.hinhAnh) {
      await deleteFile(currentHocVien.hinhAnh);
    }

    return successResponse(res, { hinhAnh: avatarUrl }, "Upload thành công");
  } catch (error) {
    next(error);
  }
};
