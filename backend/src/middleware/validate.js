/**
 * Validation Middleware
 * Xử lý kết quả từ express-validator
 */

import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.js";

/**
 * Middleware kiểm tra validation errors
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    
    return errorResponse(res, "Dữ liệu không hợp lệ", 400, errorMessages);
  }
  
  next();
};
