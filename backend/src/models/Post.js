import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 500,
  },
  coverImage: {
    type: String,
    default: '',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  isSticky: {
    type: Boolean,
    default: false,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// 发布前自动生成摘要
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/[#*`\[\]]/g, '').substring(0, 200) + '...';
  }
  next();
});

// 静态方法：获取文章列表
postSchema.statics.getList = function (query = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    tag,
    keyword,
    sortBy = 'createdAt',
    order = 'desc',
  } = options;

  const filter = { deletedAt: null };
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { content: { $regex: keyword, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

  return Promise.all([
    this.countDocuments(filter),
    this.find(filter)
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]).then(([total, data]) => ({ total, page, limit, data }));
};

export default mongoose.model('Post', postSchema);
