import Post from '../models/Post.js';
import { success, created, notFound, error } from '../utils/response.js';
import { paginate, buildMeta } from '../utils/paginate.js';
import { generateSlug } from '../utils/slug.js';

// 获取文章列表
export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, category, tag, keyword, sortBy, order } = req.query;
    const options = { page: +page, limit: +limit, status, category, tag, keyword, sortBy, order };
    
    const result = await Post.getList({}, options);
    return success(res, result.data, '获取成功', buildMeta(result.total, +page, +limit));
  } catch (err) {
    next(err);
  }
};

// 获取文章详情
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, deletedAt: null })
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .lean();
    
    if (!post) return notFound(res, '文章不存在');
    return success(res, post);
  } catch (err) {
    next(err);
  }
};

// 创建文章
export const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status, isSticky } = req.body;
    
    // 自动生成 slug
    let slug = generateSlug(title);
    const exists = await Post.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;
    
    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      status,
      isSticky,
    });
    
    const populated = await Post.findById(post._id)
      .populate('category', 'name slug')
      .populate('tags', 'name slug');
    
    return created(res, populated, '文章创建成功');
  } catch (err) {
    next(err);
  }
};

// 更新文章
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug').populate('tags', 'name slug');
    
    if (!post) return notFound(res, '文章不存在');
    return success(res, post, '文章更新成功');
  } catch (err) {
    next(err);
  }
};

// 删除文章（软删除）
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    
    if (!post) return notFound(res, '文章不存在');
    return success(res, null, '文章删除成功');
  } catch (err) {
    next(err);
  }
};

// 置顶/取消置顶
export const toggleSticky = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, deletedAt: null });
    if (!post) return notFound(res, '文章不存在');
    
    post.isSticky = !post.isSticky;
    await post.save();
    
    return success(res, { isSticky: post.isSticky }, post.isSticky ? '文章已置顶' : '文章已取消置顶');
  } catch (err) {
    next(err);
  }
};
