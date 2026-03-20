/**
 * 存活记录模型
 */

const mongoose = require('mongoose');

const aliveRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    index: true,
    required: true
  },
  cycleHours: {
    type: Number,
    default: 24,
    min: 1,
    max: 720
  },
  lastCheckin: {
    type: Date,
    default: Date.now
  },
  nextDeadline: {
    type: Date,
    index: true
  },
  status: {
    type: String,
    enum: ['alive', 'dead'],
    default: 'alive',
    index: true
  },
  consecutiveDays: {
    type: Number,
    default: 0
  },
  totalDeaths: {
    type: Number,
    default: 0
  },
  lastDeathTime: {
    type: Date
  },
  checkinHistory: [{
    date: Date,
    note: String
  }]
}, {
  timestamps: true
});

// 索引
aliveRecordSchema.index({ nextDeadline: 1 });
aliveRecordSchema.index({ status: 1, nextDeadline: 1 });
aliveRecordSchema.index({ consecutiveDays: -1 });
aliveRecordSchema.index({ totalDeaths: -1 });

// 静态方法：创建新用户的存活记录
aliveRecordSchema.statics.createForUser = async function(userId, cycleHours = 24) {
  const now = new Date();
  const nextDeadline = new Date(now.getTime() + cycleHours * 60 * 60 * 1000);
  
  return this.create({
    userId,
    cycleHours,
    lastCheckin: now,
    nextDeadline,
    status: 'alive'
  });
};

// 实例方法：签到续命
aliveRecordSchema.methods.checkin = function(note = '') {
  const now = new Date();
  const isConsecutive = (now - this.lastCheckin) < (24 * 60 * 60 * 1000);
  
  this.lastCheckin = now;
  this.nextDeadline = new Date(now.getTime() + this.cycleHours * 60 * 60 * 1000);
  this.status = 'alive';
  
  if (isConsecutive && this.status === 'dead') {
    this.consecutiveDays += 1;
  } else if (!isConsecutive) {
    this.consecutiveDays = 1;
  }
  
  if (note) {
    this.checkinHistory.push({
      date: now,
      note: note.substring(0, 50)
    });
    // 保留最近 100 条记录
    if (this.checkinHistory.length > 100) {
      this.checkinHistory = this.checkinHistory.slice(-100);
    }
  }
  
  return this.save();
};

// 实例方法：标记为死亡
aliveRecordSchema.methods.markAsDead = function() {
  this.status = 'dead';
  this.lastDeathTime = new Date();
  this.totalDeaths += 1;
  return this.save();
};

// 实例方法：复活
aliveRecordSchema.methods.resurrect = function() {
  const now = new Date();
  this.status = 'alive';
  this.lastCheckin = now;
  this.nextDeadline = new Date(now.getTime() + this.cycleHours * 60 * 60 * 1000);
  return this.save();
};

// 实例方法：修改存活周期
aliveRecordSchema.methods.updateCycle = function(newCycleHours) {
  this.cycleHours = newCycleHours;
  // 重新计算截止时间
  const now = new Date();
  this.nextDeadline = new Date(now.getTime() + newCycleHours * 60 * 60 * 1000);
  this.lastCheckin = now;
  return this.save();
};

module.exports = mongoose.model('AliveRecord', aliveRecordSchema);
