/**
 * 用户模型
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  openid: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  nickname: {
    type: String,
    required: true,
    maxlength: 32
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'banned', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// 索引
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
