import Media from '../models/Media.js';
import Post from '../models/Post.js';
import { success, created, notFound, error } from '../utils/response.js';
import fs from 'fs';
import path from 'path';

// 获取媒体列表
export const getMedia = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [total, files] = await Promise.all([
      Media.countDocuments(),
      Media.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    ]);
    
    return success(res, files, '获取成功', {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// 上传媒体
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) return error(res, '请选择文件', 400);
    
    const { filename, originalname, size, mimetype } = req.file;
    const url = `/uploads/${filename}`;
    
    const media = await Media.create({
      filename,
      originalName: originalname,
      url,
      size,
      mimeType: mimetype,
      uploaderId: req.userId,
    });
    
    return created(res, media, '上传成功');
  } catch (err) {
    next(err);
  }
};

// 删除媒体
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return notFound(res, '文件不存在');
    
    // 删除物理文件
    const filePath = path.join('uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // 删除数据库记录
    await Media.findByIdAndDelete(req.params.id);
    
    return success(res, null, '删除成功');
  } catch (err) {
    next(err);
  }
};
