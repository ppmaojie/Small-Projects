/**
 * 墓地控制器
 */

const GraveyardInteraction = require('../models/GraveyardInteraction');
const AliveRecord = require('../models/AliveRecord');
const Obituary = require('../models/Obituary');

/**
 * 获取墓地列表（已故好友）
 */
exports.getList = async (req, res, next) => {
  try {
    // 获取所有状态为 dead 的存活记录
    const deadRecords = await AliveRecord.find({ status: 'dead' })
      .populate('userId', 'nickname avatar')
      .sort({ lastDeathTime: -1 })
      .limit(50);
    
    const graveyard = [];
    
    for (const record of deadRecords) {
      // 获取死亡时长
      const deathTime = record.lastDeathTime;
      const hours = deathTime ? Math.floor((new Date() - deathTime) / (1000 * 60 * 60)) : 0;
      
      // 获取互动数量
      const flowerCount = await GraveyardInteraction.countDocuments({
        deceasedUserId: record.userId._id,
        type: 'flower'
      });
      
      const messageCount = await GraveyardInteraction.countDocuments({
        deceasedUserId: record.userId._id,
        type: 'message',
        isPrivate: false
      });
      
      graveyard.push({
        user: record.userId,
        deathTime,
        deathHours: hours,
        flowerCount,
        messageCount
      });
    }
    
    res.json({ graveyard });
  } catch (err) {
    next(err);
  }
};

/**
 * 献花
 */
exports.addFlower = async (req, res, next) => {
  try {
    const { deceasedUserId } = req.body;
    
    if (!deceasedUserId) {
      return res.status(400).json({ error: '缺少逝者 ID' });
    }
    
    // 检查逝者是否真的"死亡"
    const record = await AliveRecord.findOne({
      userId: deceasedUserId,
      status: 'dead'
    });
    
    if (!record) {
      return res.status(404).json({ error: '该用户还活着，无法献花' });
    }
    
    const interaction = await GraveyardInteraction.addFlower(
      deceasedUserId,
      req.user.userId
    );
    
    res.json({
      message: '献花成功',
      interaction
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 留言
 */
exports.addMessage = async (req, res, next) => {
  try {
    const { deceasedUserId, content, isPrivate = false } = req.body;
    
    if (!deceasedUserId || !content) {
      return res.status(400).json({ error: '缺少逝者 ID 或留言内容' });
    }
    
    // 检查逝者是否真的"死亡"
    const record = await AliveRecord.findOne({
      userId: deceasedUserId,
      status: 'dead'
    });
    
    if (!record) {
      return res.status(404).json({ error: '该用户还活着，无法留言' });
    }
    
    const interaction = await GraveyardInteraction.addMessage(
      deceasedUserId,
      req.user.userId,
      content,
      isPrivate
    );
    
    res.json({
      message: '留言成功',
      interaction
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 点赞留言
 */
exports.like = async (req, res, next) => {
  try {
    const { interactionId } = req.body;
    
    if (!interactionId) {
      return res.status(400).json({ error: '缺少互动 ID' });
    }
    
    const interaction = await GraveyardInteraction.findById(interactionId);
    
    if (!interaction) {
      return res.status(404).json({ error: '互动不存在' });
    }
    
    await interaction.like(req.user.userId);
    
    res.json({
      message: '已点赞',
      likes: interaction.likes
    });
  } catch (err) {
    next(err);
  }
};
