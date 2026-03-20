/**
 * 定时任务
 */

const AliveRecord = require('../models/AliveRecord');
const Obituary = require('../models/Obituary');
const Contact = require('../models/Contact');
const { sendDeathNotification } = require('../services/notificationService');

/**
 * 死亡检测任务
 * 每 5 分钟执行一次，检查是否有用户倒计时归零
 */
exports.deathDetectionJob = async () => {
  const now = new Date();
  
  // 查询所有已过期但未标记为死亡的用户
  const deadRecords = await AliveRecord.find({
    status: 'alive',
    nextDeadline: { $lte: now }
  }).populate('userId');
  
  console.log(`死亡检测：发现 ${deadRecords.length} 名用户已死亡`);
  
  for (const record of deadRecords) {
    try {
      // 标记为死亡
      await record.markAsDead();
      
      // 创建讣告
      const obituary = await Obituary.createObituary(record.userId._id);
      
      // 获取联系人并发送通知
      const contacts = await Contact.getUserContacts(record.userId._id, 'confirmed');
      
      console.log(`用户 ${record.userId._id} 死亡，通知 ${contacts.length} 个联系人`);
      
      for (const contact of contacts) {
        try {
          await sendDeathNotification(
            contact.contactUserId._id,
            record.userId,
            obituary
          );
          obituary.notifiedContacts.push(contact.contactUserId._id);
        } catch (err) {
          console.error(`发送死亡通知失败 (${contact.contactUserId._id}):`, err.message);
        }
      }
      
      await obituary.save();
      
    } catch (err) {
      console.error(`处理死亡用户 ${record.userId._id} 失败:`, err.message);
    }
  }
  
  return deadRecords.length;
};

/**
 * 排行榜更新任务
 * 每周日凌晨 0 点执行
 */
exports.leaderboardUpdateJob = async () => {
  // TODO: 实现排行榜更新逻辑
  // 目前排行榜是实时计算的，这个任务可以用于：
  // 1. 清理过期排行榜数据
  // 2. 生成历史排行榜快照
  // 3. 发送周榜奖励
  
  console.log('排行榜更新任务执行完毕');
  return true;
};

/**
 * 数据清理任务
 * 每月 1 号执行
 */
exports.cleanupJob = async () => {
  // TODO: 清理过期数据
  // 1. 清理 90 天前的分享日志
  // 2. 清理测试数据
  // 3. 归档旧讣告
  
  console.log('数据清理任务执行完毕');
  return true;
};
