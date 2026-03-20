/**
 * 墓地互动模型
 */

const mongoose = require('mongoose');

const graveyardInteractionSchema = new mongoose.Schema({
  deceasedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  visitorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  type: {
    type: String,
    enum: ['flower', 'message', 'candle'],
    index: true,
    required: true
  },
  content: {
    type: String,
    maxlength: 200
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 索引
graveyardInteractionSchema.index({ deceasedUserId: 1, createdAt: -1 });
graveyardInteractionSchema.index({ type: 1, likes: -1 });

// 静态方法：献花
graveyardInteractionSchema.statics.addFlower = async function(deceasedUserId, visitorUserId) {
  return this.create({
    deceasedUserId,
    visitorUserId,
    type: 'flower'
  });
};

// 静态方法：留言
graveyardInteractionSchema.statics.addMessage = async function(deceasedUserId, visitorUserId, content, isPrivate = false) {
  return this.create({
    deceasedUserId,
    visitorUserId,
    type: 'message',
    content: content.substring(0, 200),
    isPrivate
  });
};

// 静态方法：获取墓地互动列表
graveyardInteractionSchema.statics.getGraveyardInteractions = async function(deceasedUserId, limit = 50) {
  return this.find({
    deceasedUserId,
    isPrivate: false
  })
  .populate('visitorUserId', 'nickname avatar')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// 实例方法：点赞
graveyardInteractionSchema.methods.like = async function(userId) {
  if (!this.likedBy.includes(userId)) {
    this.likedBy.push(userId);
    this.likes += 1;
    await this.save();
  }
  return this;
};

// 实例方法：取消点赞
graveyardInteractionSchema.methods.unlike = async function(userId) {
  const index = this.likedBy.indexOf(userId);
  if (index > -1) {
    this.likedBy.splice(index, 1);
    this.likes = Math.max(0, this.likes - 1);
    await this.save();
  }
  return this;
};

module.exports = mongoose.model('GraveyardInteraction', graveyardInteractionSchema);
