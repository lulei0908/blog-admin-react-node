import Tag from '../models/Tag.js';
import Post from '../models/Post.js';
import { success, created, notFound } from '../utils/response.js';
import { generateSlug } from '../utils/slug.js';

// 获取标签列表
export const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    return success(res, tags);
  } catch (err) {
    next(err);
  }
};

// 获取单个标签
export const getTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return notFound(res, '标签不存在');
    return success(res, tag);
  } catch (err) {
    next(err);
  }
};

// 创建标签
export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    let slug = generateSlug(name);
    
    const exists = await Tag.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;
    
    const tag = await Tag.create({ name, slug });
    return created(res, tag, '标签创建成功');
  } catch (err) {
    next(err);
  }
};

// 更新标签
export const updateTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    let slug;
    if (name) {
      slug = generateSlug(name);
      const exists = await Tag.findOne({ slug, _id: { $ne: req.params.id } });
      if (exists) slug = `${slug}-${Date.now()}`;
    }
    
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(slug && { slug }) },
      { new: true }
    );
    
    if (!tag) return notFound(res, '标签不存在');
    return success(res, tag, '标签更新成功');
  } catch (err) {
    next(err);
  }
};

// 删除标签
export const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return notFound(res, '标签不存在');
    
    // 从文章中移除该标签
    await Post.updateMany({ tags: req.params.id }, { $pull: { tags: req.params.id } });
    
    return success(res, null, '标签删除成功');
  } catch (err) {
    next(err);
  }
};
