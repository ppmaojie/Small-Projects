/**
 * 通知服务
 */

const User = require('../models/User');

/**
 * 发送死亡通知
 * @param {string} recipientUserId - 接收通知的用户 ID
 * @param {Object} deceasedUser - 逝者用户对象
 * @param {Object} obituary - 讣告对象
 */
exports.sendDeathNotification = async (recipientUserId, deceasedUser, obituary) => {
  // TODO: 实现实际的通知发送逻辑
  // 1. 微信模板消息
  // 2. 短信通知
  // 3. App 推送
  
  console.log(`发送死亡通知给 ${recipientUserId}: ${deceasedUser.nickname} 已死亡`);
  
  // 模拟发送成功
  return {
    success: true,
    recipientUserId,
    obituaryId: obituary._id
  };
};

/**
 * 发送复活通知
 */
exports.sendResurrectionNotification = async (recipientUserId, resurrectedUser) => {
  console.log(`发送复活通知给 ${recipientUserId}: ${resurrectedUser.nickname} 诈尸了！`);
  
  return {
    success: true,
    recipientUserId
  };
};

/**
 * 发送献花通知
 */
exports.sendFlowerNotification = async (deceasedUserId, visitorUser) => {
  console.log(`${visitorUser.nickname} 给 ${deceasedUserId} 献了花`);
  
  return {
    success: true
  };
};

/**
 * 发送留言通知
 */
exports.sendMessageNotification = async (deceasedUserId, visitorUser, content) => {
  console.log(`${visitorUser.nickname} 给 ${deceasedUserId} 留言：${content}`);
  
  return {
    success: true
  };
};
