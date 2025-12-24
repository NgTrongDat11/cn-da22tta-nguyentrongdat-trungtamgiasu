/**
 * RESPONSE UTILITY
 *
 * Helper functions để tạo response chuẩn
 * Dùng ở controllers để return consistent format
 */

/**
 * Success Response
 * @param {Response} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
export const successResponse = (res, data = null, message = "Thành công", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error Response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Validation errors
 */
export const errorResponse = (res, message = "Có lỗi xảy ra", statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Paginated Response
 * @param {Response} res - Express response object
 * @param {Array} data - Data array
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
export const paginatedResponse = (res, data, pagination, message = "Thành công") => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

// Legacy exports for backward compatibility
export const sendSuccess = (data, message = "Success") => ({
  success: true,
  data,
  message,
});

export const sendError = (message, errors = null) => ({
  success: false,
  message,
  ...(errors && { errors }),
});
