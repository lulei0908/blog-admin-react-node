import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
}, { timestamps: true });

// 更新关联文章数
tagSchema.statics.updatePostCount = async function (tagId) {
  const Post = mongoose.model('Post');
  const count = await Post.countDocuments({ tags: tagId, deletedAt: null });
  await this.findByIdAndUpdate(tagId, { $set: { postCount: count } });
};

export default mongoose.model('Tag', tagSchema);
