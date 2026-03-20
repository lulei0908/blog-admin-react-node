import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { unauthorized } from '../utils/response.js';

// JWT 认证中间件
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, '请提供有效的访问令牌');
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, '令牌已过期，请重新登录');
    }
    return unauthorized(res, '无效的访问令牌');
  }
};

// 管理员权限检查
export const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return forbidden(res, '需要管理员权限');
  }
  next();
};

// 错误处理中间件
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ code: 400, message: '数据验证失败', errors: messages });
  }
  
  // Mongoose 重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ code: 400, message: `${field} 已存在` });
  }
  
  // Mongoose CastError (无效的 ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ code: 400, message: `无效的 ${err.path}` });
  }
  
  res.status(err.status || 500).json({
    code: err.code || 500,
    message: err.message || '服务器内部错误',
  });
};

// 404 处理
export const notFoundHandler = (req, res) => {
  res.status(404).json({ code: 404, message: 'API 端点不存在' });
};
