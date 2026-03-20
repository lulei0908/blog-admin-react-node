/**
 * 统一响应格式
 */
export const success = (res, data = null, message = '操作成功', meta = null) => {
  const payload = { code: 200, message, data };
  if (meta) payload.meta = meta;
  return res.status(200).json(payload);
};

export const created = (res, data, message = '创建成功') => {
  return res.status(201).json({ code: 201, message, data });
};

export const error = (res, message = '服务器错误', code = 500, statusCode = 500) => {
  return res.status(statusCode).json({ code, message });
};

export const unauthorized = (res, message = '未授权，请登录') => {
  return res.status(401).json({ code: 401, message });
};

export const forbidden = (res, message = '权限不足') => {
  return res.status(403).json({ code: 403, message });
};

export const notFound = (res, message = '资源不存在') => {
  return res.status(404).json({ code: 404, message });
};

export const validationError = (res, errors) => {
  return res.status(400).json({ code: 400, message: '参数验证失败', errors });
};
