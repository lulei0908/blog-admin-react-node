import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import { success } from '../utils/response.js';

// 仪表盘统计
export const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(today - 30 * 24 * 60 * 60 * 1000);
    
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      pendingComments,
      totalCategories,
      totalTags,
      todayPosts,
      todayComments,
    ] = await Promise.all([
      Post.countDocuments({ deletedAt: null }),
      Post.countDocuments({ deletedAt: null, status: 'published' }),
      Post.countDocuments({ deletedAt: null, status: 'draft' }),
      Comment.countDocuments(),
      Comment.countDocuments({ status: 'pending' }),
      Category.countDocuments(),
      Tag.countDocuments(),
      Post.countDocuments({ deletedAt: null, createdAt: { $gte: today } }),
      Comment.countDocuments({ createdAt: { $gte: today } }),
    ]);
    
    // 计算总阅读量
    const viewStats = await Post.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } },
    ]);
    const totalViews = viewStats[0]?.totalViews || 0;
    
    // 最近7天文章发布趋势
    const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
    const postTrend = await Post.aggregate([
      { $match: { deletedAt: null, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    // 最近7天评论趋势
    const commentTrend = await Comment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    return success(res, {
      overview: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalComments,
        pendingComments,
        totalCategories,
        totalTags,
        totalViews,
        todayPosts,
        todayComments,
      },
      postTrend,
      commentTrend,
    });
  } catch (err) {
    next(err);
  }
};
