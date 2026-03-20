/**
 * 分页工具
 */
export const paginate = (query, page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const pageSize = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * pageSize;
  return { skip, limit: pageSize, page: pageNum };
};

export const buildMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
