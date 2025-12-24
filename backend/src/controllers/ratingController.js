/**
 * RATING CONTROLLER
 * Student rates tutor, Tutor rates student
 */
import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Học viên đánh giá gia sư
 * POST /api/hoc-vien/danh-gia
 */
export const studentRateTutor = async (req, res, next) => {
  try {
    const maHocVien = req.user.hocVien?.maHocVien;
    if (!maHocVien) {
      return errorResponse(res, "Không tìm thấy thông tin học viên", 404);
    }

    const { maGiaSu, maLop, diem, nhanXet } = req.body;

    // Validate
    if (!maGiaSu) {
      return errorResponse(res, "Vui lòng chọn gia sư cần đánh giá", 400);
    }

    if (diem && (diem < 0 || diem > 5)) {
      return errorResponse(res, "Điểm phải từ 0-5", 400);
    }

    // Check if already rated - if yes, update instead
    const existing = await prisma.danhGia.findFirst({
      where: { maHocVien, maGiaSu, maLop },
    });

    let danhGia;
    if (existing) {
      // Update existing rating
      danhGia = await prisma.danhGia.update({
        where: { maDanhGia: existing.maDanhGia },
        data: {
          diem: diem ? parseFloat(diem) : null,
          nhanXet,
          ngayDanhGia: new Date(),
        },
        include: {
          giaSu: { select: { hoTen: true } },
          lopHoc: { select: { tenLop: true } },
        },
      });
    } else {
      // Create rating
      danhGia = await prisma.danhGia.create({
        data: {
          maHocVien,
          maGiaSu,
          maLop,
          diem: diem ? parseFloat(diem) : null,
          nhanXet,
        },
        include: {
          giaSu: { select: { hoTen: true } },
          lopHoc: { select: { tenLop: true } },
        },
      });
    }

    return successResponse(res, danhGia, existing ? "Cập nhật đánh giá thành công" : "Đánh giá thành công", existing ? 200 : 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Gia sư đánh giá học viên
 * POST /api/gia-su/danh-gia
 */
export const tutorRateStudent = async (req, res, next) => {
  try {
    const maGiaSu = req.user.giaSu?.maGiaSu;
    if (!maGiaSu) {
      return errorResponse(res, "Không tìm thấy thông tin gia sư", 404);
    }

    const { maHocVien, maLop, diem, nhanXet } = req.body;

    // Validate
    if (!maHocVien) {
      return errorResponse(res, "Vui lòng chọn học viên cần đánh giá", 400);
    }

    if (diem && (diem < 0 || diem > 5)) {
      return errorResponse(res, "Điểm phải từ 0-5", 400);
    }

    // Check if already rated - if yes, update instead
    const existing = await prisma.danhGia.findFirst({
      where: { maHocVien, maGiaSu, maLop },
    });

    let danhGia;
    if (existing) {
      // Update existing rating
      danhGia = await prisma.danhGia.update({
        where: { maDanhGia: existing.maDanhGia },
        data: {
          diem: diem ? parseFloat(diem) : null,
          nhanXet,
          ngayDanhGia: new Date(),
        },
        include: {
          hocVien: { select: { hoTen: true } },
          lopHoc: { select: { tenLop: true } },
        },
      });
    } else {
      // Create new rating
      danhGia = await prisma.danhGia.create({
        data: {
          maHocVien,
          maGiaSu,
          maLop,
          diem: diem ? parseFloat(diem) : null,
          nhanXet,
        },
        include: {
          hocVien: { select: { hoTen: true } },
          lopHoc: { select: { tenLop: true } },
        },
      });
    }

    return successResponse(res, danhGia, existing ? "Cập nhật đánh giá thành công" : "Đánh giá thành công", existing ? 200 : 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách đánh giá của gia sư (được học viên đánh giá)
 * GET /api/gia-su/:id/danh-gia
 */
export const getTutorRatings = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ratings = await prisma.danhGia.findMany({
      where: { maGiaSu: id },
      include: {
        hocVien: { select: { hoTen: true, hinhAnh: true } },
        lopHoc: { select: { tenLop: true } },
      },
      orderBy: { ngayDanhGia: "desc" },
    });

    // Calculate average
    const avg = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + (r.diem || 0), 0) / ratings.filter(r => r.diem).length 
      : 0;

    return successResponse(res, {
      ratings,
      average: Math.round(avg * 10) / 10,
      total: ratings.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách đánh giá của học viên (được gia sư đánh giá)
 * GET /api/hoc-vien/:id/danh-gia OR /api/hoc-vien/danh-gia-cua-toi
 */
export const getStudentRatings = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // If no ID, use authenticated user's ID
    let maHocVien = id;
    if (!id) {
      if (!req.user?.hocVien?.maHocVien) {
        return errorResponse(res, "Không tìm thấy thông tin học viên", 404);
      }
      maHocVien = req.user.hocVien.maHocVien;
    }

    const ratings = await prisma.danhGia.findMany({
      where: { maHocVien },
      include: {
        giaSu: { select: { hoTen: true, hinhAnh: true } },
        lopHoc: { select: { tenLop: true } },
      },
      orderBy: { ngayDanhGia: "desc" },
    });

    return successResponse(res, ratings);
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách đánh giá mà gia sư đã đánh cho học viên
 * GET /api/gia-su/danh-gia-cua-toi
 */
export const getTutorOwnRatings = async (req, res, next) => {
  try {
    const maGiaSu = req.user?.giaSu?.maGiaSu;
    if (!maGiaSu) {
      return errorResponse(res, "Không tìm thấy thông tin gia sư", 404);
    }

    const ratings = await prisma.danhGia.findMany({
      where: { maGiaSu },
      include: {
        hocVien: { select: { hoTen: true, hinhAnh: true } },
        lopHoc: { select: { tenLop: true } },
      },
      orderBy: { ngayDanhGia: "desc" },
    });

    return successResponse(res, ratings);
  } catch (err) {
    next(err);
  }
};
