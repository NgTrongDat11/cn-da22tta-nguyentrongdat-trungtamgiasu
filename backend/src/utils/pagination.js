/**
 * Pagination Utility
 */

/**
 * Parse pagination parameters from query
 * @param {Object} query - Express query object
 * @returns {Object} { page, limit, skip }
 */
export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

/**
 * Build pagination metadata
 * @param {number} total - Total records
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const buildPaginationMeta = (total, page, limit) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
};
