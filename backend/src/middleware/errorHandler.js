/**
 * ERROR HANDLER MIDDLEWARE
 *
 * Xử lý tất cả errors xảy ra trong app
 * PHẢI đặt ở cuối cùng trong app.use()
 */

import { Prisma } from "@prisma/client";

/**
 * Centralized error handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Có lỗi xảy ra";

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        status = 400;
        const field = err.meta?.target?.[0] || "field";
        message = `${field} đã tồn tại`;
        break;
      case "P2025":
        // Record not found
        status = 404;
        message = "Không tìm thấy dữ liệu";
        break;
      case "P2003":
        // Foreign key constraint failed
        status = 400;
        message = "Dữ liệu liên quan không tồn tại";
        break;
      default:
        status = 500;
        message = "Lỗi cơ sở dữ liệu";
    }
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    message = "Dữ liệu không hợp lệ";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Token không hợp lệ";
  }

  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token đã hết hạn";
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    status = 400;
    message = "File quá lớn";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    status = 400;
    message = "Không hỗ trợ loại file này";
  }

  // Send response
  const response = {
    success: false,
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(status).json(response);
};

/**
 * Async handler wrapper
 * Wrap async functions để tự động catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
