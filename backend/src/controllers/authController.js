import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';
import { success, created, unauthorized, error } from '../utils/response.js';

// 生成 Token
const generateToken = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  const refreshToken = jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: config.jwtRefreshExpiresIn });
  return { accessToken, refreshToken };
};

// 登录
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return unauthorized(res, '用户名或密码错误');
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return unauthorized(res, '用户名或密码错误');
    }
    
    const tokens = generateToken(user._id, user.role);
    
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return success(res, { user: user.toJSON(), ...tokens }, '登录成功');
  } catch (err) {
    next(err);
  }
};

// 注册（仅第一个用户可注册）
export const register = async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return error(res, '注册功能已关闭', 403);
    }
    
    const user = await User.create(req.body);
    const tokens = generateToken(user._id, user.role);
    
    return created(res, { user: user.toJSON(), ...tokens }, '注册成功');
  } catch (err) {
    next(err);
  }
};

// 获取当前用户
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return notFound(res, '用户不存在');
    return success(res, user.toJSON());
  } catch (err) {
    next(err);
  }
};

// 刷新 Token
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.cookies || req.body;
    if (!token) return unauthorized(res, '请提供刷新令牌');
    
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);
    if (!user) return unauthorized(res, '用户不存在');
    
    const tokens = generateToken(user._id, user.role);
    return success(res, tokens, '令牌刷新成功');
  } catch (err) {
    next(err);
  }
};

// 登出
export const logout = async (req, res, next) => {
  res.clearCookie('refreshToken');
  return success(res, null, '登出成功');
};
