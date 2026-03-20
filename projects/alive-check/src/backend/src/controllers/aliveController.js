/**
 * 存活控制器
 */

const AliveRecord = require('../models/AliveRecord');
const Obituary = require('../models/Obituary');
const Contact = require('../models/Contact');
const { sendDeathNotification } = require('../services/notificationService');

/**
 * 获取存活状态
 */
exports.getStatus = async (req, res, next) => {
  try {
    const record = await AliveRecord.findOne({ userId: req.user.userId })
      .populate('userId', 'nickname avatar');
    
    if (!record) {
      return res.status(404).json({ error: '未找到存活记录' });
    }
    
    const now = new Date();
    const timeLeft = record.nextDeadline - now;
    const isDead = record.status === 'dead' || timeLeft <= 0;
    
    res.json({
      status: isDead ? 'dead' : 'alive',
      cycleHours: record.cycleHours,
      lastCheckin: record.lastCheckin,
      nextDeadline: record.nextDeadline,
      timeLeft: Math.max(0, timeLeft),
      consecutiveDays: record.consecutiveDays,
      totalDeaths: record.totalDeaths,
      lastDeathTime: record.lastDeathTime
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 签到续命
 */
exports.checkin = async (req, res, next) => {
  try {
    const { note } = req.body;
    
    let record = await AliveRecord.findOne({ userId: req.user.userId });
    
    if (!record) {
      record = await AliveRecord.createForUser(req.user.userId);
    }
    
    // 如果之前是死亡状态，先创建讣告复活记录
    if (record.status === 'dead') {
      await Obituary.findOneAndUpdate(
        { deceasedUserId: req.user.userId, resurrectionTime: null },
        { resurrectionTime: new Date() },
        { sort: { deathTime: -1 } }
      );
    }
    
    await record.checkin(note);
    
    res.json({
      message: '签到成功',
      status: 'alive',
      nextDeadline: record.nextDeadline,
      consecutiveDays: record.consecutiveDays
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 修改存活周期
 */
exports.updateCycle = async (req, res, next) => {
  try {
    const { cycleHours } = req.body;
    
    if (!cycleHours || cycleHours < 1 || cycleHours > 720) {
      return res.status(400).json({ error: '存活周期必须在 1-720 小时之间' });
    }
    
    const record = await AliveRecord.findOne({ userId: req.user.userId });
    
    if (!record) {
      return res.status(404).json({ error: '未找到存活记录' });
    }
    
    await record.updateCycle(cycleHours);
    
    res.json({
      message: '更新成功',
      cycleHours: record.cycleHours,
      nextDeadline: record.nextDeadline
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 定时任务：检测死亡用户
 */
exports.detectDeaths = async () => {
  const now = new Date();
  
  // 查询所有已过期但未标记为死亡的用户
  const deadRecords = await AliveRecord.find({
    status: 'alive',
    nextDeadline: { $lte: now }
  }).populate('userId');
  
  for (const record of deadRecords) {
    // 标记为死亡
    await record.markAsDead();
    
    // 创建讣告
    const obituary = await Obituary.createObituary(record.userId._id);
    
    // 获取联系人并发送通知
    const contacts = await Contact.getUserContacts(record.userId._id, 'confirmed');
    
    for (const contact of contacts) {
      try {
        await sendDeathNotification(
          contact.contactUserId._id,
          record.userId,
          obituary
        );
        obituary.notifiedContacts.push(contact.contactUserId._id);
      } catch (err) {
        console.error('发送死亡通知失败:', err);
      }
    }
    
    await obituary.save();
  }
  
  return deadRecords.length;
};
