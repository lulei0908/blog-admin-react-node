import Category from '../models/Category.js';
import { success, created, notFound } from '../utils/response.js';
import { generateSlug } from '../utils/slug.js';

// 获取分类列表（树形）
export const getCategories = async (req, res, next) => {
  try {
    const tree = await Category.getTree();
    return success(res, tree);
  } catch (err) {
    next(err);
  }
};

// 获取单个分类
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return notFound(res, '分类不存在');
    return success(res, category);
  } catch (err) {
    next(err);
  }
};

// 创建分类
export const createCategory = async (req, res, next) => {
  try {
    const { name, parentId, order, description } = req.body;
    let slug = generateSlug(name);
    
    const exists = await Category.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;
    
    const category = await Category.create({ name, slug, parentId, order, description });
    return created(res, category, '分类创建成功');
  } catch (err) {
    next(err);
  }
};

// 更新分类
export const updateCategory = async (req, res, next) => {
  try {
    const { name, parentId, order, description } = req.body;
    let slug;
    if (name) {
      slug = generateSlug(name);
      const exists = await Category.findOne({ slug, _id: { $ne: req.params.id } });
      if (exists) slug = `${slug}-${Date.now()}`;
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name, slug }), ...(parentId !== undefined && { parentId }), ...(order !== undefined && { order }), ...(description !== undefined && { description }) },
      { new: true, runValidators: true }
    );
    
    if (!category) return notFound(res, '分类不存在');
    return success(res, category, '分类更新成功');
  } catch (err) {
    next(err);
  }
};

// 删除分类
export const deleteCategory = async (req, res, next) => {
  try {
    // 检查是否有子分类
    const childCount = await Category.countDocuments({ parentId: req.params.id });
    if (childCount > 0) {
      return res.status(400).json({ code: 400, message: '请先删除子分类' });
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return notFound(res, '分类不存在');
    return success(res, null, '分类删除成功');
  } catch (err) {
    next(err);
  }
};
