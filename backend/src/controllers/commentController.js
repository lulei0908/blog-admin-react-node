import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { success, created, notFound } from '../utils/response.js';

// 获取评论列表
export const getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, postId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (postId) filter.postId = postId;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [total, comments] = await Promise.all([
      Comment.countDocuments(filter),
      Comment.find(filter)
        .populate('postId', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
    ]);
    
    return success(res, comments, '获取成功', {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// 审核评论
export const reviewComment = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ code: 400, message: '状态值无效' });
    }
    
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('postId', 'title slug');
    
    if (!comment) return notFound(res, '评论不存在');
    return success(res, comment, status === 'approved' ? '评论已通过' : '评论已拒绝');
  } catch (err) {
    next(err);
  }
};

// 回复评论
export const replyComment = async (req, res, next) => {
  try {
    const { reply } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { reply, replyAt: new Date(), status: 'approved' },
      { new: true }
    ).populate('postId', 'title slug');
    
    if (!comment) return notFound(res, '评论不存在');
    return success(res, comment, '回复成功');
  } catch (err) {
    next(err);
  }
};

// 删除评论
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return notFound(res, '评论不存在');
    return success(res, null, '评论删除成功');
  } catch (err) {
    next(err);
  }
};
