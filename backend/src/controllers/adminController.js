/**
 * ADMIN CONTROLLER
 * Quản lý hệ thống (Admin only)
 */

import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.js";
import { parsePagination } from "../utils/pagination.js";
import { 
  TRANG_THAI_LOP, 
  TRANG_THAI_DANG_KY, 
  TRANG_THAI_TINH_DOANH_THU 
} from "../constants/status.js";

/**
 * Dashboard statistics
 * GET /api/admin/dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const [
      tongTaiKhoan,
      tongGiaSu,
      tongHocVien,
      tongLopHoc,
      lopDangTuyen,
      lopDangDay,
      lopDaKetThuc,
      lopDaHuy,
      dangKyChoDuyet,
    ] = await Promise.all([
      prisma.taiKhoan.count(),
      prisma.giaSu.count(),
      prisma.hocVien.count(),
      prisma.lopHoc.count(),
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.DANG_TUYEN } }),
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.DANG_DAY } }),
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.KET_THUC } }),
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.HUY } }),
      prisma.dangKy.count({ where: { trangThai: TRANG_THAI_DANG_KY.CHO_DUYET } }),
    ]);

    // Tính tổng doanh thu (chỉ tính lớp đang dạy + đã kết thúc)
    const tongDoanhThu = await prisma.lopHoc.aggregate({
      where: {
        trangThai: {
          in: TRANG_THAI_TINH_DOANH_THU
        }
      },
      _sum: {
        hocPhi: true,
      },
    });

    return successResponse(res, {
      tongTaiKhoan,
      tongGiaSu,
      tongHocVien,
      tongLopHoc,
      lopDangTuyen,
      lopDangDay,
      lopDaKetThuc,
      lopDaHuy,
      dangKyChoDuyet,
      tongDoanhThu: Math.round(Number(tongDoanhThu._sum.hocPhi || 0)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Quản lý tài khoản - Danh sách
 * GET /api/admin/tai-khoan
 */
export const getDanhSachTaiKhoan = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { role, trangThai, search } = req.query;

    const where = {};

    if (role) {
      where.role = role;
    }

    if (trangThai) {
      where.trangThai = trangThai;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { giaSu: { hoTen: { contains: search, mode: "insensitive" } } },
        { hocVien: { hoTen: { contains: search, mode: "insensitive" } } },
      ];
    }

    const total = await prisma.taiKhoan.count({ where });

    const taiKhoanList = await prisma.taiKhoan.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        trangThai: true,
        ngayTao: true,
        ngayCapNhat: true,
        giaSu: {
          select: {
            maGiaSu: true,
            hoTen: true,
            soDienThoai: true,
          },
        },
        hocVien: {
          select: {
            maHocVien: true,
            hoTen: true,
            soDienThoai: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { ngayTao: "desc" },
    });

    return paginatedResponse(res, taiKhoanList, { page, limit, total });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo tài khoản Admin
 * POST /api/admin/tai-khoan/admin
 */
export const taoTaiKhoanAdmin = async (req, res, next) => {
  try {
    const { email, matKhau, hoTen } = req.body;

    // Check email exists
    const existing = await prisma.taiKhoan.findUnique({
      where: { email },
    });

    if (existing) {
      return errorResponse(res, "Email đã được sử dụng", 400);
    }

    const hashedPassword = await bcrypt.hash(matKhau, 12);

    const taiKhoan = await prisma.taiKhoan.create({
      data: {
        email,
        matKhau: hashedPassword,
        role: "Admin",
      },
      select: {
        id: true,
        email: true,
        role: true,
        trangThai: true,
        ngayTao: true,
      },
    });

    return successResponse(res, taiKhoan, "Tạo tài khoản Admin thành công", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Khóa/Mở khóa tài khoản
 * PUT /api/admin/tai-khoan/:id/trang-thai
 */
export const capNhatTrangThaiTaiKhoan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;

    if (!["Active", "Locked"].includes(trangThai)) {
      return errorResponse(res, "Trạng thái không hợp lệ", 400);
    }

    // Check exists
    const existing = await prisma.taiKhoan.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse(res, "Không tìm thấy tài khoản", 404);
    }

    // Prevent self-lock
    if (id === req.user.id && trangThai === "Locked") {
      return errorResponse(res, "Không thể khóa tài khoản của chính mình", 400);
    }

    const taiKhoan = await prisma.taiKhoan.update({
      where: { id },
      data: { trangThai },
      select: {
        id: true,
        email: true,
        role: true,
        trangThai: true,
      },
    });

    return successResponse(
      res,
      taiKhoan,
      trangThai === "Active" ? "Mở khóa tài khoản thành công" : "Khóa tài khoản thành công"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa tài khoản
 * DELETE /api/admin/tai-khoan/:id
 */
export const xoaTaiKhoan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check exists
    const existing = await prisma.taiKhoan.findUnique({
      where: { id },
      include: {
        giaSu: true,
        hocVien: true,
      },
    });

    if (!existing) {
      return errorResponse(res, "Không tìm thấy tài khoản", 404);
    }

    // Prevent self-delete
    if (id === req.user.id) {
      return errorResponse(res, "Không thể xóa tài khoản của chính mình", 400);
    }

    // Prevent deleting Admin accounts
    if (existing.role === "Admin") {
      return errorResponse(res, "Không thể xóa tài khoản Admin", 400);
    }

    // Check if tutor has active classes
    if (existing.giaSu) {
      const activeContracts = await prisma.hopDongGiangDay.count({
        where: {
          maGiaSu: existing.giaSu.maGiaSu,
          trangThai: "DangDay",
        },
      });

      if (activeContracts > 0) {
        return errorResponse(
          res,
          "Không thể xóa gia sư đang có lớp dạy. Vui lòng kết thúc các lớp học trước.",
          400
        );
      }
    }

    // Check if student has active registrations
    if (existing.hocVien) {
      const activeRegistrations = await prisma.dangKy.count({
        where: {
          maHocVien: existing.hocVien.maHocVien,
          trangThai: "DaDuyet",
        },
      });

      if (activeRegistrations > 0) {
        return errorResponse(
          res,
          "Không thể xóa học viên đang có lớp học. Vui lòng kết thúc các lớp học trước.",
          400
        );
      }
    }

    // Delete account (Cascade will handle related records)
    await prisma.taiKhoan.delete({
      where: { id },
    });

    return successResponse(res, null, "Xóa tài khoản thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Quản lý lớp học - Danh sách tất cả
 * GET /api/admin/lop-hoc
 */
export const getDanhSachLopHoc = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { trangThai, maMon } = req.query;

    const where = {};

    if (trangThai) {
      where.trangThai = trangThai;
    }

    if (maMon) {
      where.maMon = maMon;
    }

    const total = await prisma.lopHoc.count({ where });

    const lopHocList = await prisma.lopHoc.findMany({
      where,
      include: {
        monHoc: true,
        hopDongs: {
          include: {
            giaSu: {
              select: {
                hoTen: true,
                soDienThoai: true,
              },
            },
          },
        },
        _count: {
          select: {
            dangKys: {
              where: {
                trangThai: "DaDuyet",
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { ngayTao: "desc" },
    });

    return paginatedResponse(res, lopHocList, { page, limit, total });
  } catch (error) {
    next(error);
  }
};

/**
 * Gán gia sư cho lớp học
 * POST /api/admin/lop-hoc/:id/gan-gia-su
 */
export const ganGiaSuChoLop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { maGiaSu } = req.body;

    // Check lớp học exists
    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // Check gia sư exists
    const giaSu = await prisma.giaSu.findUnique({
      where: { maGiaSu },
    });

    if (!giaSu) {
      return errorResponse(res, "Không tìm thấy gia sư", 404);
    }

    // Check if already has active contract
    const existingContract = await prisma.hopDongGiangDay.findFirst({
      where: {
        maLop: id,
        trangThai: "DangDay",
      },
    });

    if (existingContract) {
      return errorResponse(res, "Lớp học đã có gia sư đang dạy", 400);
    }

    // Create hợp đồng
    const hopDong = await prisma.hopDongGiangDay.create({
      data: {
        maGiaSu,
        maLop: id,
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

    // Không tự đổi trạng thái lớp; vẫn giữ DangTuyen cho đến khi có học viên hoặc admin tự đổi
    return successResponse(res, hopDong, "Gán gia sư thành công", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa lớp học
 * DELETE /api/admin/lop-hoc/:id
 */
export const xoaLopHoc = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check exists
    const existing = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        _count: {
          select: {
            dangKys: true,
            hopDongs: true,
          },
        },
      },
    });

    if (!existing) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // Check if has active registrations or contracts
    const hasActiveRegistrations = await prisma.dangKy.count({
      where: {
        maLop: id,
        trangThai: "DaDuyet",
      },
    });

    const hasActiveContracts = await prisma.hopDongGiangDay.count({
      where: {
        maLop: id,
        trangThai: "DangDay",
      },
    });

    if (hasActiveRegistrations > 0 || hasActiveContracts > 0) {
      return errorResponse(
        res,
        "Không thể xóa lớp học đang có học viên hoặc đang dạy. Vui lòng kết thúc lớp học trước.",
        400
      );
    }

    // Delete lớp học (Cascade will handle related records)
    await prisma.lopHoc.delete({
      where: { maLop: id },
    });

    return successResponse(res, null, "Xóa lớp học thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Quản lý đăng ký - Danh sách chờ duyệt
 * GET /api/admin/dang-ky
 */
export const getDanhSachDangKy = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { trangThai } = req.query;

    const where = {};

    if (trangThai) {
      where.trangThai = trangThai;
    }

    const total = await prisma.dangKy.count({ where });

    const dangKyList = await prisma.dangKy.findMany({
      where,
      include: {
        hocVien: {
          select: {
            hoTen: true,
            soDienThoai: true,
          },
        },
        lopHoc: {
          include: {
            monHoc: true,
            hopDongs: {
              where: { trangThai: "DangDay" },
              include: {
                giaSu: {
                  select: {
                    hoTen: true,
                  },
                },
              },
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
 * Thống kê doanh thu theo thời gian
 * GET /api/admin/dashboard/revenue
 * Query params: period (day|month|year), year, month (optional)
 */
export const getRevenueStats = async (req, res, next) => {
  try {
    const { period = "month", year, month } = req.query;
    
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    let groupBy;
    let dateFilter = {};
    let labels = [];
    let rawData;

    // Xây dựng filter theo năm/tháng
    if (period === "day" && month) {
      const startDate = new Date(currentYear, currentMonth - 1, 1);
      const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);
      dateFilter = {
        ngayTao: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else {
      const startDate = new Date(currentYear, 0, 1);
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59);
      dateFilter = {
        ngayTao: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    // Lấy dữ liệu thô (chỉ tính lớp đang dạy + đã kết thúc)
    const lopHocList = await prisma.lopHoc.findMany({
      where: {
        ...dateFilter,
        trangThai: {
          in: TRANG_THAI_TINH_DOANH_THU
        }
      },
      select: {
        hocPhi: true,
        ngayTao: true,
      },
      orderBy: {
        ngayTao: "asc",
      },
    });

    // Xử lý dữ liệu theo period
    if (period === "day") {
      // Nhóm theo ngày trong tháng
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      const dataByDay = {};
      
      for (let d = 1; d <= daysInMonth; d++) {
        dataByDay[d] = 0;
        labels.push(`${d}/${currentMonth}`);
      }

      lopHocList.forEach((lop) => {
        const day = new Date(lop.ngayTao).getDate();
        dataByDay[day] += Number(lop.hocPhi);
      });

      rawData = Object.values(dataByDay);
    } else if (period === "month") {
      // Nhóm theo tháng trong năm
      const dataByMonth = {};
      const monthNames = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
      
      for (let m = 0; m < 12; m++) {
        dataByMonth[m] = 0;
        labels.push(monthNames[m]);
      }

      lopHocList.forEach((lop) => {
        const month = new Date(lop.ngayTao).getMonth();
        dataByMonth[month] += Number(lop.hocPhi);
      });

      rawData = Object.values(dataByMonth);
    } else if (period === "year") {
      // Nhóm theo năm (5 năm gần nhất)
      const dataByYear = {};
      
      for (let y = currentYear - 4; y <= currentYear; y++) {
        dataByYear[y] = 0;
        labels.push(y.toString());
      }

      const allLopHoc = await prisma.lopHoc.findMany({
        where: {
          ngayTao: {
            gte: new Date(currentYear - 4, 0, 1),
            lte: new Date(currentYear, 11, 31, 23, 59, 59),
          },
          trangThai: {
            in: TRANG_THAI_TINH_DOANH_THU
          }
        },
        select: {
          hocPhi: true,
          ngayTao: true,
        },
      });

      allLopHoc.forEach((lop) => {
        const year = new Date(lop.ngayTao).getFullYear();
        if (dataByYear[year] !== undefined) {
          dataByYear[year] += Number(lop.hocPhi);
        }
      });

      rawData = Object.values(dataByYear);
    }

    // Tính tổng
    const tongDoanhThu = rawData.reduce((sum, value) => sum + value, 0);

    return successResponse(res, {
      period,
      year: currentYear,
      month: period === "day" ? currentMonth : undefined,
      labels,
      data: rawData.map(val => Math.round(val)),
      tongDoanhThu: Math.round(tongDoanhThu),
    });
  } catch (error) {
    next(error);
  }
};
