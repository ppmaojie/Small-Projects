/**
 * 分享服务
 * 生成讣告分享卡片、海报等
 */

const fs = require('fs');
const path = require('path');
const ObituaryService = require('./obituaryService');

class ShareService {
  /**
   * 生成讣告分享卡片数据
   * @param {Object} obituary - 讣告对象
   * @param {Object} user - 逝者用户对象
   * @returns {Object} 卡片数据
   */
  static generateCardData(obituary, user) {
    const deathTime = new Date(obituary.deathTime);
    const now = new Date();
    const hours = Math.floor((now - deathTime) / (1000 * 60 * 60));
    
    // 生成文案
    const text = obituary.getObituaryText(user.nickname);
    
    // 卡片数据
    return {
      title: '讣 告',
      subtitle: '还活着么 · 反向签到应用',
      deceasedName: user.nickname,
      deceasedAvatar: user.avatar || '',
      deathTime: deathTime.toLocaleString('zh-CN'),
      deathHours: hours,
      obituaryText: text,
      templateName: this.getTemplateName(obituary.templateId),
      shareUrl: `https://alive-check.com/m/graveyard/${obituary._id}`,
      qrCodeUrl: `https://api.alive-check.com/qr/${obituary._id}`,
      footer: '扫码查看墓地 · 献花悼念'
    };
  }

  /**
   * 获取模板名称
   */
  static getTemplateName(templateId) {
    const template = ObituaryService.getTemplateById(templateId);
    return template ? template.name : '标准版';
  }

  /**
   * 生成 HTML 分享卡片（用于截图）
   * @param {Object} cardData - 卡片数据
   * @returns {String} HTML 字符串
   */
  static generateHTMLCard(cardData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>讣告 - ${cardData.deceasedName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 40px;
      max-width: 400px;
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .title {
      font-size: 48px;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 8px;
    }
    .subtitle {
      font-size: 14px;
      color: #999999;
      margin-top: 10px;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
      margin: 30px 0;
      padding: 20px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 15px;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #333;
    }
    .name {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }
    .time {
      font-size: 14px;
      color: #999999;
      margin-top: 5px;
    }
    .obituary {
      font-size: 18px;
      line-height: 1.8;
      color: #cccccc;
      padding: 20px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      margin: 20px 0;
      border-left: 4px solid #667eea;
    }
    .template-name {
      text-align: right;
      font-size: 12px;
      color: #999999;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .footer-text {
      font-size: 14px;
      color: #999999;
    }
    .qr-placeholder {
      width: 100px;
      height: 100px;
      background: #ffffff;
      margin: 20px auto 10px;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">讣 告</div>
      <div class="subtitle">${cardData.subtitle}</div>
    </div>
    
    <div class="user-info">
      <img class="avatar" src="${cardData.deceasedAvatar || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/></svg>'}" alt="avatar" />
      <div>
        <div class="name">${cardData.deceasedName}</div>
        <div class="time">已故 ${cardData.deathHours} 小时</div>
        <div class="time">${cardData.deathTime}</div>
      </div>
    </div>
    
    <div class="obituary">
      ${cardData.obituaryText}
      <div class="template-name">· ${cardData.templateName} ·</div>
    </div>
    
    <div class="footer">
      <div class="qr-placeholder"></div>
      <div class="footer-text">${cardData.footer}</div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * 保存分享卡片 HTML
   * @param {String} html - HTML 内容
   * @param {String} obituaryId - 讣告 ID
   * @returns {String} 文件路径
   */
  static async saveCardHTML(html, obituaryId) {
    const dir = path.join(__dirname, '../../public/cards');
    
    // 确保目录存在
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const filePath = path.join(dir, `${obituaryId}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    
    return `/cards/${obituaryId}.html`;
  }

  /**
   * 生成分享文案（用于微信/微博）
   * @param {Object} cardData - 卡片数据
   * @returns {String} 分享文案
   */
  static generateShareText(cardData) {
    const texts = [
      `${cardData.deceasedName} 在「还活着么」被宣告死亡，已经 ${cardData.deathHours} 小时了...`,
      `快来「还活着么」查看 ${cardData.deceasedName} 的墓地，献花悼念`,
      `「还活着么」- 用死亡焦虑，治你的拖延症`
    ];
    
    return texts.join('\n\n');
  }

  /**
   * 记录分享日志
   * @param {Object} data - 分享数据
   */
  static async logShare(data) {
    // TODO: 保存到数据库
    console.log('分享日志:', data);
  }
}

module.exports = ShareService;
