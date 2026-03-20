/**
 * 分享控制器
 */

const ShareService = require('../services/shareService');
const Obituary = require('../models/Obituary');
const User = require('../models/User');

/**
 * 获取讣告分享卡片
 */
exports.getShareCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 获取讣告
    const obituary = await Obituary.findById(id)
      .populate('deceasedUserId', 'nickname avatar');
    
    if (!obituary) {
      return res.status(404).json({ error: '讣告不存在' });
    }
    
    // 生成卡片数据
    const cardData = ShareService.generateCardData(
      obituary,
      obituary.deceasedUserId
    );
    
    // 生成 HTML
    const html = ShareService.generateHTMLCard(cardData);
    
    // 保存 HTML 文件
    const urlPath = await ShareService.saveCardHTML(html, id);
    
    res.json({
      card: cardData,
      shareText: ShareService.generateShareText(cardData),
      htmlUrl: `${process.env.APP_URL || 'http://localhost:3000'}${urlPath}`,
      qrcodeUrl: cardData.qrCodeUrl
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 分享到微信
 */
exports.shareToWechat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scene = 'session' } = req.body; // session: 聊天，timeline: 朋友圈
    
    // 获取讣告
    const obituary = await Obituary.findById(id)
      .populate('deceasedUserId', 'nickname avatar');
    
    if (!obituary) {
      return res.status(404).json({ error: '讣告不存在' });
    }
    
    const cardData = ShareService.generateCardData(
      obituary,
      obituary.deceasedUserId
    );
    
    // 记录分享
    await ShareService.logShare({
      obituaryId: id,
      platform: 'wechat',
      scene,
      userId: req.user.userId
    });
    
    // 增加分享次数
    await obituary.incrementShare();
    
    res.json({
      success: true,
      shareData: {
        title: `讣告 - ${cardData.deceasedName}`,
        description: cardData.obituaryText,
        imageUrl: cardData.deceasedAvatar,
        link: cardData.shareUrl
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 生成分享海报（需要 canvas 库）
 */
exports.generatePoster = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // TODO: 使用 canvas 生成图片海报
    // 目前先返回 HTML 卡片
    
    res.json({
      message: '海报生成功能开发中',
      alternative: `/api/share/${id}/card`
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 分享统计
 */
exports.getShareStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const obituary = await Obituary.findById(id);
    
    if (!obituary) {
      return res.status(404).json({ error: '讣告不存在' });
    }
    
    res.json({
      shareCount: obituary.shareCount || 0
    });
  } catch (err) {
    next(err);
  }
};
