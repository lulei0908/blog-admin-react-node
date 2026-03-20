import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  order: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    maxlength: 200,
  },
}, { timestamps: true });

// 获取树形结构
categorySchema.statics.getTree = async function () {
  const categories = await this.find().sort({ order: 1 }).lean();
  
  const buildTree = (parentId = null) => {
    return categories
      .filter(c => String(c.parentId) === String(parentId))
      .map(c => ({
        ...c,
        children: buildTree(c._id),
      }));
  };
  
  return buildTree();
};

export default mongoose.model('Category', categorySchema);
