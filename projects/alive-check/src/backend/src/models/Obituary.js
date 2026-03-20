/**
 * 讣告模型
 */

const mongoose = require('mongoose');

const obituarySchema = new mongoose.Schema({
  deceasedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  templateId: {
    type: Number,
    default: 1
  },
  customText: {
    type: String,
    maxlength: 200
  },
  deathTime: {
    type: Date,
    default: Date.now,
    index: true
  },
  notifiedContacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  resurrectionTime: {
    type: Date
  },
  shareCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 索引
obituarySchema.index({ deceasedUserId: 1, deathTime: -1 });

// 静态方法：创建讣告
obituarySchema.statics.createObituary = async function(deceasedUserId, templateId = 1, customText = '') {
  return this.create({
    deceasedUserId,
    templateId,
    customText: templateId === 5 ? customText : ''
  });
};

// 实例方法：标记为已复活
obituarySchema.methods.markResurrected = function() {
  this.resurrectionTime = new Date();
  return this.save();
};

// 实例方法：增加分享次数
obituarySchema.methods.incrementShare = function() {
  this.shareCount += 1;
  return this.save();
};

// 实例方法：获取讣告文案
obituarySchema.methods.getObituaryText = function(userNickname) {
  const templates = [
    `您关注的好友 ${userNickname} 已超过 XX 小时未签到，系统判定其可能已...节哀。`,
    `${userNickname} 走了，带着没写完的 PPT 走了。`,
    `${userNickname} 终于不用再早起了，愿天堂没有打卡。`,
    `${userNickname} 走了，花呗还没还完。`,
    this.customText || `${userNickname} 走了...`
  ];
  
  let text = templates[this.templateId - 1] || templates[0];
  
  // 计算死亡时长
  const hours = Math.floor((new Date() - this.deathTime) / (1000 * 60 * 60));
  text = text.replace('XX', hours);
  
  return text;
};

module.exports = mongoose.model('Obituary', obituarySchema);
