/**
 * 联系人控制器
 */

const Contact = require('../models/Contact');
const User = require('../models/User');

/**
 * 获取联系人列表
 */
exports.list = async (req, res, next) => {
  try {
    const { status = 'confirmed' } = req.query;
    
    const contacts = await Contact.getUserContacts(req.user.userId, status);
    
    res.json({ contacts });
  } catch (err) {
    next(err);
  }
};

/**
 * 邀请联系人
 */
exports.invite = async (req, res, next) => {
  try {
    const { contactUserId, priority = 1 } = req.body;
    
    if (!contactUserId) {
      return res.status(400).json({ error: '缺少联系人 ID' });
    }
    
    // 检查联系人是否存在
    const contactUser = await User.findById(contactUserId);
    if (!contactUser) {
      return res.status(404).json({ error: '联系人不存在' });
    }
    
    // 不能邀请自己
    if (contactUserId === req.user.userId) {
      return res.status(400).json({ error: '不能邀请自己' });
    }
    
    // 检查联系人数量限制
    const confirmedCount = await Contact.countDocuments({
      userId: req.user.userId,
      status: 'confirmed'
    });
    
    if (confirmedCount >= 3) {
      return res.status(400).json({ error: '最多只能绑定 3 个联系人' });
    }
    
    // 创建邀请
    const contact = await Contact.inviteContact(
      req.user.userId,
      contactUserId,
      priority
    );
    
    res.json({
      message: '邀请已发送',
      contact
    });
  } catch (err) {
    if (err.message === '已存在该联系人') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

/**
 * 确认联系人邀请
 */
exports.confirm = async (req, res, next) => {
  try {
    const { contactUserId } = req.body;
    
    if (!contactUserId) {
      return res.status(400).json({ error: '缺少联系人 ID' });
    }
    
    const contact = await Contact.confirmContact(
      req.user.userId,
      contactUserId
    );
    
    res.json({
      message: '已确认',
      contact
    });
  } catch (err) {
    if (err.message === '未找到待确认的邀请') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

/**
 * 获取待确认的邀请
 */
exports.getPendingInvites = async (req, res, next) => {
  try {
    const invites = await Contact.getPendingInvites(req.user.userId);
    
    res.json({ invites });
  } catch (err) {
    next(err);
  }
};
