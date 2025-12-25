/**
 * LỚP HỌC CONTROLLER
 * Quản lý lớp học: CRUD, đăng ký, lịch học
 */

import prisma from "../config/prisma.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.js";
import { parsePagination } from "../utils/pagination.js";
import { TRANG_THAI_LOP, TRANG_THAI_HOP_DONG } from "../constants/status.js";

/**
 * Lấy danh sách lớp học (public)
 * GET /api/lop-hoc
 */
export const getDanhSachLopHoc = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { maMon, hinhThuc, trangThai, search, minHocPhi, maxHocPhi } = req.query;

    // Build where clause
    const where = {};

    if (maMon) {
      where.maMon = maMon;
    }

    if (hinhThuc) {
      where.hinhThuc = hinhThuc;
    }

    if (trangThai) {
      where.trangThai = trangThai;
    } else {
      // Default: chỉ hiển thị lớp đang tuyển
      where.trangThai = "DangTuyen";
    }

    if (search) {
      where.OR = [
        { tenLop: { contains: search, mode: "insensitive" } },
        { moTa: { contains: search, mode: "insensitive" } },
        { monHoc: { tenMon: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (minHocPhi || maxHocPhi) {
      where.hocPhi = {};
      if (minHocPhi) where.hocPhi.gte = parseFloat(minHocPhi);
      if (maxHocPhi) where.hocPhi.lte = parseFloat(maxHocPhi);
    }

    // Get total count
    const total = await prisma.lopHoc.count({ where });

    // Get data
    const lopHocList = await prisma.lopHoc.findMany({
      where,
      include: {
        monHoc: true,
        hopDongs: {
          where: { trangThai: "DangDay" },
          include: {
            giaSu: {
              select: {
                maGiaSu: true,
                hoTen: true,
                hinhAnh: true,
                chuyenMon: true,
              },
            },
          },
        },
        lichHocs: true,
        _count: {
          select: {
            dangKys: {
              where: { trangThai: "DaDuyet" },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { ngayTao: "desc" },
    });

    // Format response
    const formattedList = lopHocList.map((lop) => ({
      ...lop,
      giaSu: lop.hopDongs[0]?.giaSu || null,
      soHocVien: lop._count.dangKys,
      isFull: lop._count.dangKys >= 1,
      hopDongs: undefined,
      _count: undefined,
    }));

    return paginatedResponse(res, formattedList, { page, limit, total });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết lớp học
 * GET /api/lop-hoc/:id
 */
export const getChiTietLopHoc = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        monHoc: true,
        hopDongs: {
          include: {
            giaSu: {
              select: {
                maGiaSu: true,
                hoTen: true,
                hinhAnh: true,
                chuyenMon: true,
                kinhNghiem: true,
                trinhDo: true,
                gioiThieu: true,
              },
            },
          },
        },
        lichHocs: true,
        dangKys: {
          where: { trangThai: "DaDuyet" },
          select: {
            maDangKy: true,
          },
        },
      },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    const result = {
      ...lopHoc,
      giaSu: lopHoc.hopDongs.find((hd) => hd.trangThai === "DangDay")?.giaSu || null,
      soHocVien: lopHoc.dangKys.length,
      isFull: lopHoc.dangKys.length >= 1,
      dangKys: undefined,
    };

    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo lớp học mới (Gia sư hoặc Admin)
 * POST /api/lop-hoc
 */
export const taoLopHoc = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (!["GiaSu", "Admin"].includes(role)) {
      return errorResponse(res, "Bạn không có quyền tạo lớp học", 403);
    }

    const {
      maMon,
      tenLop,
      hocPhi,
      moTa,
      hinhThuc,
      soBuoiDuKien,
      lichHocs,
    } = req.body;

    // Check môn học exists
    const monHoc = await prisma.monHoc.findUnique({
      where: { maMon },
    });

    if (!monHoc) {
      return errorResponse(res, "Môn học không tồn tại", 404);
    }

    // Create lớp học
    const lopHoc = await prisma.lopHoc.create({
      data: {
        maMon,
        tenLop,
        hocPhi,
        moTa,
        hinhThuc: hinhThuc || "Offline",
        soBuoiDuKien,
        // Create lịch học if provided
        ...(lichHocs?.length > 0 && {
          lichHocs: {
            create: lichHocs.map((lich) => ({
              thu: lich.thu,
              gioBatDau: new Date(`1970-01-01T${lich.gioBatDau}`),
              gioKetThuc: new Date(`1970-01-01T${lich.gioKetThuc}`),
              phongHoc: lich.phongHoc,
              linkHocOnline: lich.linkHocOnline,
            })),
          },
        }),
      },
      include: {
        monHoc: true,
        lichHocs: true,
      },
    });

    // If created by Gia sư, automatically create hợp đồng
    if (role === "GiaSu") {
      const giaSu = await prisma.giaSu.findUnique({
        where: { taiKhoanId: req.user.id },
      });

      if (giaSu) {
        await prisma.hopDongGiangDay.create({
          data: {
            maGiaSu: giaSu.maGiaSu,
            maLop: lopHoc.maLop,
            luongTheoGio: hocPhi / (soBuoiDuKien || 1), // Estimate hourly rate
          },
        });
      }
    }

    return successResponse(res, lopHoc, "Tạo lớp học thành công", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật lớp học
 * PUT /api/lop-hoc/:id
 */
export const capNhatLopHoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    // Check quyền
    if (!["GiaSu", "Admin"].includes(role)) {
      return errorResponse(res, "Bạn không có quyền cập nhật lớp học", 403);
    }

    // Check lớp học exists
    const existingLop = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        hopDongs: true,
      },
    });

    if (!existingLop) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // If Gia sư, check if they own this class
    if (role === "GiaSu") {
      const giaSu = await prisma.giaSu.findUnique({
        where: { taiKhoanId: req.user.id },
      });

      const isOwner = existingLop.hopDongs.some((hd) => hd.maGiaSu === giaSu?.maGiaSu);
      if (!isOwner) {
        return errorResponse(res, "Bạn không phải gia sư của lớp này", 403);
      }
    }

    const { maMon, tenLop, hocPhi, moTa, hinhThuc, soBuoiDuKien, trangThai, lichHocs } = req.body;

    // Validate môn học mới (nếu có yêu cầu đổi)
    if (maMon) {
      const monHoc = await prisma.monHoc.findUnique({ where: { maMon } });
      if (!monHoc) {
        return errorResponse(res, "Môn học không tồn tại", 404);
      }
    }

    // Update lớp học
    const lopHoc = await prisma.lopHoc.update({
      where: { maLop: id },
      data: {
        tenLop,
        hocPhi,
        moTa,
        hinhThuc,
        soBuoiDuKien,
        trangThai,
        ...(maMon && { maMon }),
      },
      include: {
        monHoc: true,
        lichHocs: true,
      },
    });

    // Update lichHocs if provided
    if (lichHocs !== undefined) {
      // Delete existing schedules
      await prisma.lichHoc.deleteMany({
        where: { maLop: id },
      });

      // Create new schedules
      if (lichHocs?.length > 0) {
        await prisma.lichHoc.createMany({
          data: lichHocs.map((lich) => ({
            maLop: id,
            thu: lich.thu,
            gioBatDau: new Date(`1970-01-01T${lich.gioBatDau}`),
            gioKetThuc: new Date(`1970-01-01T${lich.gioKetThuc}`),
            phongHoc: lich.phongHoc,
            linkHocOnline: lich.linkHocOnline,
          })),
        });
      }
    }

    // Fetch updated class with schedules
    const updatedLopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        monHoc: true,
        lichHocs: true,
      },
    });

    return successResponse(res, updatedLopHoc, "Cập nhật thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật lịch học
 * PUT /api/lop-hoc/:id/lich-hoc
 */
export const capNhatLichHoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lichHocs } = req.body;

    // Check lớp học exists
    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // Delete old schedules
    await prisma.lichHoc.deleteMany({
      where: { maLop: id },
    });

    // Create new schedules
    if (lichHocs?.length > 0) {
      await prisma.lichHoc.createMany({
        data: lichHocs.map((lich) => ({
          maLop: id,
          thu: lich.thu,
          gioBatDau: new Date(`1970-01-01T${lich.gioBatDau}`),
          gioKetThuc: new Date(`1970-01-01T${lich.gioKetThuc}`),
          phongHoc: lich.phongHoc,
          linkHocOnline: lich.linkHocOnline,
        })),
      });
    }

    // Get updated lớp học
    const updatedLop = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        lichHocs: true,
      },
    });

    return successResponse(res, updatedLop, "Cập nhật lịch học thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Duyệt đăng ký học viên (Gia sư hoặc Admin)
 * PUT /api/lop-hoc/:id/duyet-dang-ky/:dangKyId
 */
export const duyetDangKy = async (req, res, next) => {
  try {
    const { id, dangKyId } = req.params;
    const { trangThai, lyDoTuChoi } = req.body; // DaDuyet or TuChoi

    if (!["DaDuyet", "TuChoi"].includes(trangThai)) {
      return errorResponse(res, "Trạng thái không hợp lệ", 400);
    }

    // Check đăng ký exists
    const dangKy = await prisma.dangKy.findUnique({
      where: { maDangKy: dangKyId },
      include: {
        lopHoc: {
          include: {
            hopDongs: true,
          },
        },
      },
    });

    if (!dangKy || dangKy.maLop !== id) {
      return errorResponse(res, "Không tìm thấy đăng ký", 404);
    }

    // Check quyền
    if (req.user.role === "GiaSu") {
      const giaSu = await prisma.giaSu.findUnique({
        where: { taiKhoanId: req.user.id },
      });

      const isOwner = dangKy.lopHoc.hopDongs.some((hd) => hd.maGiaSu === giaSu?.maGiaSu);
      if (!isOwner) {
        return errorResponse(res, "Bạn không có quyền duyệt đăng ký này", 403);
      }
    }

    // Validate lyDoTuChoi if rejecting
    if (trangThai === "TuChoi" && !lyDoTuChoi) {
      return errorResponse(res, "Vui lòng cung cấp lý do từ chối", 400);
    }

    // Enforce 1-1: only one approved registration per class
    let approvedCountBefore = 0;
    if (trangThai === "DaDuyet") {
      approvedCountBefore = await prisma.dangKy.count({
        where: {
          maLop: id,
          trangThai: "DaDuyet",
          NOT: { maDangKy: dangKyId },
        },
      });

      if (approvedCountBefore >= 1) {
        return errorResponse(res, "Lớp 1-1 đã có học viên khác được duyệt", 409);
      }
    }

    // Update trạng thái với tracking
    const updatedDangKy = await prisma.dangKy.update({
      where: { maDangKy: dangKyId },
      data: { 
        trangThai,
        nguoiDuyet: req.user.id,
        ngayDuyet: new Date(),
        ...(trangThai === "TuChoi" && lyDoTuChoi && { lyDoTuChoi }),
      },
      include: {
        hocVien: {
          select: {
            hoTen: true,
            soDienThoai: true,
          },
        },
        nguoiDuyetRef: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    // If approved, flip class status to DangDay and compute new count
    let lopHocMeta = null;
    if (trangThai === "DaDuyet") {
      const approvedCountAfter = approvedCountBefore + 1;
      const lopHocUpdated = await prisma.lopHoc.update({
        where: { maLop: id },
        data: { trangThai: "DangDay" },
        select: { maLop: true, trangThai: true },
      });
      lopHocMeta = {
        maLop: lopHocUpdated.maLop,
        trangThai: lopHocUpdated.trangThai,
        soHocVien: approvedCountAfter,
        isFull: approvedCountAfter >= 1,
      };
    }

    return successResponse(
      res,
      {
        dangKy: updatedDangKy,
        lopHoc: lopHocMeta,
      },
      trangThai === "DaDuyet" ? "Đã duyệt đăng ký" : "Đã từ chối đăng ký"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách đăng ký của lớp (Gia sư)
 * GET /api/lop-hoc/:id/dang-ky
 */
export const getDanhSachDangKyLop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit, skip } = parsePagination(req.query);
    const { trangThai } = req.query;

    const where = {
      maLop: id,
    };

    if (trangThai) {
      where.trangThai = trangThai;
    }

    const total = await prisma.dangKy.count({ where });

    const dangKyList = await prisma.dangKy.findMany({
      where,
      include: {
        hocVien: {
          select: {
            maHocVien: true,
            hoTen: true,
            soDienThoai: true,
            diaChi: true,
            namSinh: true,
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
 * Kết thúc lớp học
 * PUT /api/lop-hoc/:id/ket-thuc
 * Body: { lyDoKetThuc?: string }
 */
export const ketThucLopHoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lyDoKetThuc } = req.body;
    const { role } = req.user;

    // 1. Kiểm tra quyền
    if (!["GiaSu", "Admin"].includes(role)) {
      return errorResponse(res, "Bạn không có quyền thực hiện thao tác này", 403);
    }

    // 2. Tìm lớp học
    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        hopDongs: {
          where: { trangThai: TRANG_THAI_HOP_DONG.DANG_DAY }
        },
        dangKys: {
          where: { trangThai: "DaDuyet" }
        },
        monHoc: true,
      },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // 3. Kiểm tra trạng thái hiện tại
    if (lopHoc.trangThai === TRANG_THAI_LOP.KET_THUC) {
      return errorResponse(res, "Lớp học đã kết thúc trước đó", 400);
    }

    if (lopHoc.trangThai === TRANG_THAI_LOP.HUY) {
      return errorResponse(res, "Không thể kết thúc lớp đã bị hủy", 400);
    }

    if (lopHoc.trangThai === TRANG_THAI_LOP.DANG_TUYEN) {
      return errorResponse(res, "Lớp chưa bắt đầu, hãy hủy thay vì kết thúc", 400);
    }

    // 4. Nếu là Gia sư, kiểm tra có phải gia sư của lớp không
    if (role === "GiaSu") {
      const giaSu = await prisma.giaSu.findUnique({
        where: { taiKhoanId: req.user.id },
      });

      const isOwner = lopHoc.hopDongs.some((hd) => hd.maGiaSu === giaSu?.maGiaSu);
      if (!isOwner) {
        return errorResponse(res, "Bạn không phải gia sư của lớp này", 403);
      }
    }

    // 5. Thực hiện transaction: Update lớp + hợp đồng
    const result = await prisma.$transaction(async (tx) => {
      // Update trạng thái lớp học
      const updatedLop = await tx.lopHoc.update({
        where: { maLop: id },
        data: {
          trangThai: TRANG_THAI_LOP.KET_THUC,
          ngayKetThuc: new Date(),
        },
        include: {
          monHoc: true,
        },
      });

      // Update tất cả hợp đồng đang active của lớp này
      await tx.hopDongGiangDay.updateMany({
        where: {
          maLop: id,
          trangThai: TRANG_THAI_HOP_DONG.DANG_DAY,
        },
        data: {
          trangThai: TRANG_THAI_HOP_DONG.DA_KET_THUC,
        },
      });

      return updatedLop;
    });

    return successResponse(res, {
      lopHoc: result,
      soHocVien: lopHoc.dangKys.length,
      lyDoKetThuc: lyDoKetThuc || "Hoàn thành khóa học",
    }, "Đã kết thúc lớp học thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Hủy lớp học (Chưa bắt đầu)
 * PUT /api/lop-hoc/:id/huy
 * Body: { lyDoHuy: string }
 */
export const huyLopHoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lyDoHuy } = req.body;
    const { role } = req.user;

    // Validate
    if (!lyDoHuy) {
      return errorResponse(res, "Vui lòng cung cấp lý do hủy lớp", 400);
    }

    // Kiểm tra quyền
    if (!["GiaSu", "Admin"].includes(role)) {
      return errorResponse(res, "Bạn không có quyền thực hiện thao tác này", 403);
    }

    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        hopDongs: true,
        dangKys: {
          where: { trangThai: "DaDuyet" }
        }
      },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // Chỉ cho phép hủy lớp đang tuyển
    if (lopHoc.trangThai !== TRANG_THAI_LOP.DANG_TUYEN) {
      return errorResponse(res, "Chỉ có thể hủy lớp đang trong giai đoạn tuyển sinh", 400);
    }

    // Nếu là Gia sư, kiểm tra có phải gia sư của lớp không
    if (role === "GiaSu") {
      const giaSu = await prisma.giaSu.findUnique({
        where: { taiKhoanId: req.user.id },
      });

      const isOwner = lopHoc.hopDongs.some((hd) => hd.maGiaSu === giaSu?.maGiaSu);
      if (!isOwner) {
        return errorResponse(res, "Bạn không phải gia sư của lớp này", 403);
      }
    }

    // Update trạng thái
    const result = await prisma.lopHoc.update({
      where: { maLop: id },
      data: {
        trangThai: TRANG_THAI_LOP.HUY,
      },
      include: {
        monHoc: true,
      },
    });

    return successResponse(res, result, `Đã hủy lớp học. Lý do: ${lyDoHuy}`);
  } catch (error) {
    next(error);
  }
};
