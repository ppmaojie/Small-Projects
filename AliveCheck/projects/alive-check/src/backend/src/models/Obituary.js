/**
 * 讣告模型
 */

const mongoose = require('mongoose');
const ObituaryService = require('../services/obituaryService');

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
  // 计算死亡时长
  const now = new Date();
  const hours = Math.floor((now - this.deathTime) / (1000 * 60 * 60));
  const minutes = Math.floor((now - this.deathTime) / (1000 * 60));
  
  // 使用讣告服务生成文案
  const data = {
    nickname: userNickname,
    hours,
    minutes,
    date: this.deathTime.toLocaleDateString('zh-CN'),
    time: this.deathTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };
  
  // 如果是自定义模板 (ID=5)，使用自定义文案
  if (this.templateId === 5 && this.customText) {
    return this.customText.replace('{nickname}', userNickname);
  }
  
  return ObituaryService.generateTextById(this.templateId, data);
};

module.exports = mongoose.model('Obituary', obituarySchema);
