/**
 * GIA SƯ CONTROLLER
 * Quản lý gia sư: CRUD, tìm kiếm, lọc
 */

import prisma from "../config/prisma.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.js";
import { parsePagination } from "../utils/pagination.js";
import { uploadFile, deleteFile } from "../services/uploadService.js";

/**
 * Lấy danh sách gia sư (có phân trang và filter)
 * GET /api/gia-su
 * Query: page, limit, chuyenMon, trinhDo, search
 */
export const getDanhSachGiaSu = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { chuyenMon, trinhDo, search } = req.query;

    // Build where clause
    const where = {
      taiKhoan: {
        trangThai: "Active",
      },
    };

    if (chuyenMon) {
      where.chuyenMon = {
        contains: chuyenMon,
        mode: "insensitive",
      };
    }

    if (trinhDo) {
      where.trinhDo = {
        contains: trinhDo,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { hoTen: { contains: search, mode: "insensitive" } },
        { chuyenMon: { contains: search, mode: "insensitive" } },
        { gioiThieu: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.giaSu.count({ where });

    // Get data
    const giaSuList = await prisma.giaSu.findMany({
      where,
      include: {
        taiKhoan: {
          select: {
            email: true,
            ngayTao: true,
          },
        },
        danhGias: {
          select: {
            diem: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { ngayTao: "desc" },
    });

    // Calculate average rating
    const giaSuWithRating = giaSuList.map((gs) => {
      const ratings = gs.danhGias.filter((dg) => dg.diem !== null);
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, dg) => sum + dg.diem, 0) / ratings.length
        : null;
      
      const { danhGias, ...rest } = gs;
      return {
        ...rest,
        diemTrungBinh: avgRating ? Math.round(avgRating * 10) / 10 : null,
        soLuotDanhGia: ratings.length,
      };
    });

    return paginatedResponse(res, giaSuWithRating, { page, limit, total });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết gia sư
 * GET /api/gia-su/:id
 */
export const getChiTietGiaSu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const giaSu = await prisma.giaSu.findUnique({
      where: { maGiaSu: id },
      include: {
        taiKhoan: {
          select: {
            email: true,
            ngayTao: true,
          },
        },
        hopDongs: {
          include: {
            lopHoc: {
              include: {
                monHoc: true,
              },
            },
          },
        },
        danhGias: {
          include: {
            hocVien: {
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
          orderBy: { ngayDanhGia: "desc" },
          take: 10,
        },
      },
    });

    if (!giaSu) {
      return errorResponse(res, "Không tìm thấy gia sư", 404);
    }

    // Calculate average rating
    const ratings = giaSu.danhGias.filter((dg) => dg.diem !== null);
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, dg) => sum + dg.diem, 0) / ratings.length
      : null;

    return successResponse(res, {
      ...giaSu,
      diemTrungBinh: avgRating ? Math.round(avgRating * 10) / 10 : null,
      soLuotDanhGia: ratings.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin gia sư (dựa trên token đăng nhập)
 * GET /api/gia-su/me
 */
export const getProfileGiaSu = async (req, res, next) => {
  try {
    if (req.user.role !== "GiaSu") {
      return errorResponse(res, "Chỉ gia sư mới có thể truy cập", 403);
    }

    const giaSu = await prisma.giaSu.findUnique({
      where: { taiKhoanId: req.user.id },
      include: {
        taiKhoan: {
          select: {
            email: true,
            ngayTao: true,
          },
        },
        hopDongs: {
          select: {
            maHopDong: true,
            trangThai: true,
            ngayNhanLop: true,
            maLop: true,
          },
        },
        danhGias: {
          select: {
            diem: true,
          },
        },
      },
    });

    if (!giaSu) {
      return errorResponse(res, "Không tìm thấy thông tin gia sư", 404);
    }

    const { taiKhoan, hopDongs, danhGias, ...profile } = giaSu;

    const diemHople = danhGias.filter((dg) => typeof dg.diem === "number");
    const diemTrungBinh =
      diemHople.length > 0
        ? Math.round((diemHople.reduce((sum, dg) => sum + dg.diem, 0) / diemHople.length) * 10) /
          10
        : null;

    const soLopDangDay = hopDongs.filter((hd) => hd.trangThai === "DangDay").length;

    return successResponse(res, {
      ...profile,
      email: taiKhoan.email,
      ngayThamGia: taiKhoan.ngayTao,
      thongKe: {
        soHopDong: hopDongs.length,
        soLopDangDay,
        diemTrungBinh,
        soDanhGia: diemHople.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật profile gia sư (chính mình)
 * PUT /api/gia-su/profile
 */
export const capNhatProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "GiaSu") {
      return errorResponse(res, "Chỉ gia sư mới có thể cập nhật profile", 403);
    }

    const { hoTen, soDienThoai, diaChi, namSinh, chuyenMon, kinhNghiem, trinhDo, gioiThieu } = req.body;

    const giaSu = await prisma.giaSu.update({
      where: { taiKhoanId: req.user.id },
      data: {
        hoTen,
        soDienThoai,
        diaChi,
        namSinh: namSinh ? parseInt(namSinh) : null,
        chuyenMon,
        kinhNghiem,
        trinhDo,
        gioiThieu,
      },
    });

    return successResponse(res, giaSu, "Cập nhật thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Upload ảnh đại diện gia sư
 * POST /api/gia-su/avatar
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (req.user.role !== "GiaSu") {
      return errorResponse(res, "Chỉ gia sư mới có thể upload ảnh", 403);
    }

    if (!req.file) {
      return errorResponse(res, "Không tìm thấy file ảnh", 400);
    }

    // Get current avatar to delete later
    const currentGiaSu = await prisma.giaSu.findUnique({
      where: { taiKhoanId: req.user.id },
      select: { hinhAnh: true },
    });

    // Upload new avatar
    const avatarUrl = await uploadFile(req.file, "avatars");

    // Update database
    const giaSu = await prisma.giaSu.update({
      where: { taiKhoanId: req.user.id },
      data: { hinhAnh: avatarUrl },
    });

    // Delete old avatar
    if (currentGiaSu?.hinhAnh) {
      await deleteFile(currentGiaSu.hinhAnh);
    }

    return successResponse(res, { hinhAnh: avatarUrl }, "Upload thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách lớp học của gia sư
 * GET /api/gia-su/lop-hoc
 */
export const getDanhSachLopHoc = async (req, res, next) => {
  try {
    if (req.user.role !== "GiaSu") {
      return errorResponse(res, "Bạn không có quyền truy cập", 403);
    }

    const { page, limit, skip } = parsePagination(req.query);
    const { trangThai } = req.query;

    const giaSu = await prisma.giaSu.findUnique({
      where: { taiKhoanId: req.user.id },
    });

    if (!giaSu) {
      return errorResponse(res, "Không tìm thấy thông tin gia sư", 404);
    }

    const where = {
      maGiaSu: giaSu.maGiaSu,
    };

    if (trangThai) {
      where.trangThai = trangThai;
    }

    const total = await prisma.hopDongGiangDay.count({ where });

    const hopDongs = await prisma.hopDongGiangDay.findMany({
      where,
      include: {
        lopHoc: {
          include: {
            monHoc: true,
            dangKys: {
              where: { trangThai: "DaDuyet" },
              include: {
                hocVien: {
                  select: {
                    hoTen: true,
                    soDienThoai: true,
                  },
                },
              },
            },
            lichHocs: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { ngayNhanLop: "desc" },
    });

    const formatted = hopDongs.map((hd) => {
      const soHocVien = hd.lopHoc?.dangKys?.length || 0;
      return {
        ...hd,
        lopHoc: hd.lopHoc
          ? {
              ...hd.lopHoc,
              soHocVien,
              isFull: soHocVien >= 1,
            }
          : null,
      };
    });

    return paginatedResponse(res, formatted, { page, limit, total });
  } catch (error) {
    next(error);
  }
};
