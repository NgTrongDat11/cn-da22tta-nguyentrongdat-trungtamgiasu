/**
 * MÔN HỌC CONTROLLER
 * Quản lý môn học (Admin)
 */

import prisma from "../config/prisma.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.js";
import { parsePagination } from "../utils/pagination.js";

/**
 * Lấy danh sách môn học
 * GET /api/mon-hoc
 */
export const getDanhSachMonHoc = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { tenMon: { contains: search, mode: "insensitive" } },
        { moTa: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.monHoc.count({ where });

    const monHocList = await prisma.monHoc.findMany({
      where,
      include: {
        _count: {
          select: {
            lopHocs: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { tenMon: "asc" },
    });

    const formattedList = monHocList.map((mh) => ({
      ...mh,
      soLopHoc: mh._count.lopHocs,
      _count: undefined,
    }));

    return paginatedResponse(res, formattedList, { page, limit, total });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy tất cả môn học (không phân trang - cho dropdown)
 * GET /api/mon-hoc/all
 */
export const getAllMonHoc = async (req, res, next) => {
  try {
    const monHocList = await prisma.monHoc.findMany({
      include: {
        _count: {
          select: {
            lopHocs: true,
          },
        },
      },
      orderBy: { tenMon: "asc" },
    });

    const formattedList = monHocList.map((mh) => ({
      ...mh,
      soLopHoc: mh._count.lopHocs,
      _count: undefined,
    }));

    return successResponse(res, formattedList);
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết môn học
 * GET /api/mon-hoc/:id
 */
export const getChiTietMonHoc = async (req, res, next) => {
  try {
    const { id } = req.params;

    const monHoc = await prisma.monHoc.findUnique({
      where: { maMon: id },
      include: {
        lopHocs: {
          where: { trangThai: "DangTuyen" },
          take: 10,
          orderBy: { ngayTao: "desc" },
        },
      },
    });

    if (!monHoc) {
      return errorResponse(res, "Không tìm thấy môn học", 404);
    }

    return successResponse(res, monHoc);
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo môn học mới (Admin)
 * POST /api/mon-hoc
 */
export const taoMonHoc = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return errorResponse(res, "Chỉ Admin mới có quyền tạo môn học", 403);
    }

    const { tenMon, moTa } = req.body;

    // Check duplicate
    const existing = await prisma.monHoc.findUnique({
      where: { tenMon },
    });

    if (existing) {
      return errorResponse(res, "Môn học đã tồn tại", 400);
    }

    const monHoc = await prisma.monHoc.create({
      data: {
        tenMon,
        moTa,
      },
    });

    return successResponse(res, monHoc, "Tạo môn học thành công", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật môn học (Admin)
 * PUT /api/mon-hoc/:id
 */
export const capNhatMonHoc = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return errorResponse(res, "Chỉ Admin mới có quyền cập nhật môn học", 403);
    }

    const { id } = req.params;
    const { tenMon, moTa } = req.body;

    // Check exists
    const existing = await prisma.monHoc.findUnique({
      where: { maMon: id },
    });

    if (!existing) {
      return errorResponse(res, "Không tìm thấy môn học", 404);
    }

    // Check duplicate name (if changed)
    if (tenMon !== existing.tenMon) {
      const duplicate = await prisma.monHoc.findUnique({
        where: { tenMon },
      });

      if (duplicate) {
        return errorResponse(res, "Tên môn học đã tồn tại", 400);
      }
    }

    const monHoc = await prisma.monHoc.update({
      where: { maMon: id },
      data: {
        tenMon,
        moTa,
      },
    });

    return successResponse(res, monHoc, "Cập nhật thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa môn học (Admin)
 * DELETE /api/mon-hoc/:id
 */
export const xoaMonHoc = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return errorResponse(res, "Chỉ Admin mới có quyền xóa môn học", 403);
    }

    const { id } = req.params;

    // Check exists
    const existing = await prisma.monHoc.findUnique({
      where: { maMon: id },
      include: {
        _count: {
          select: { lopHocs: true },
        },
      },
    });

    if (!existing) {
      return errorResponse(res, "Không tìm thấy môn học", 404);
    }

    // Check if has classes
    if (existing._count.lopHocs > 0) {
      return errorResponse(res, "Không thể xóa môn học đang có lớp học", 400);
    }

    await prisma.monHoc.delete({
      where: { maMon: id },
    });

    return successResponse(res, null, "Xóa môn học thành công");
  } catch (error) {
    next(error);
  }
};
