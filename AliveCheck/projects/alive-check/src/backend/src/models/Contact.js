/**
 * 联系人模型
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  contactUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
});

// 唯一索引：防止重复绑定
contactSchema.index({ userId: 1, contactUserId: 1 }, { unique: true });
contactSchema.index({ userId: 1, status: 1 });
contactSchema.index({ contactUserId: 1, status: 1 });

// 静态方法：邀请联系人
contactSchema.statics.inviteContact = async function(userId, contactUserId, priority = 1) {
  try {
    const contact = await this.create({
      userId,
      contactUserId,
      priority,
      status: 'pending'
    });
    return contact;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error('已存在该联系人');
    }
    throw err;
  }
};

// 静态方法：确认联系人邀请
contactSchema.statics.confirmContact = async function(userId, contactUserId) {
  const contact = await this.findOneAndUpdate(
    {
      userId: contactUserId,
      contactUserId: userId,
      status: 'pending'
    },
    {
      status: 'confirmed'
    },
    { new: true }
  );
  
  if (!contact) {
    throw new Error('未找到待确认的邀请');
  }
  
  return contact;
};

// 静态方法：获取用户的联系人列表
contactSchema.statics.getUserContacts = async function(userId, status = 'confirmed') {
  return this.find({
    userId,
    status
  }).populate('contactUserId', 'nickname avatar');
};

// 静态方法：获取待确认的邀请
contactSchema.statics.getPendingInvites = async function(userId) {
  return this.find({
    contactUserId: userId,
    status: 'pending'
  }).populate('userId', 'nickname avatar');
};

module.exports = mongoose.model('Contact', contactSchema);
