/**
 * 配置文件
 */

require('dotenv').config();

module.exports = {
  // 服务配置
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/alive-check',
  redisUri: process.env.REDIS_URI || 'redis://localhost:6379',
  
  // JWT 配置
  jwtSecret: process.env.JWT_SECRET || 'alive-check-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // 微信配置
  wechatAppId: process.env.WECHAT_APP_ID || '',
  wechatAppSecret: process.env.WECHAT_APP_SECRET || '',
  
  // 阿里云配置
  aliyunAccessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
  aliyunAccessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
  aliyunOssBucket: process.env.ALIYUN_OSS_BUCKET || 'alive-check',
  aliyunOssRegion: process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou',
  
  // 短信配置
  smsSignName: process.env.SMS_SIGN_NAME || '还活着么',
  smsTemplateCode: process.env.SMS_TEMPLATE_CODE || 'SMS_123456789',
  
  // 日志配置
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // 业务配置
  defaultCycleHours: 24,
  minCycleHours: 1,
  maxCycleHours: 720,
  maxContacts: 3,
  
  // 讣告模板
  obituaryTemplates: [
    {
      id: 1,
      name: '标准版',
      template: '您关注的好友 [XXX] 已超过 [XX] 小时未签到，系统判定其可能已...节哀。'
    },
    {
      id: 2,
      name: '打工人版',
      template: '[XXX] 走了，带着没写完的 PPT 走了。'
    },
    {
      id: 3,
      name: '社畜版',
      template: '[XXX] 终于不用再早起了，愿天堂没有打卡。'
    },
    {
      id: 4,
      name: '剁手版',
      template: '[XXX] 走了，花呗还没还完。'
    },
    {
      id: 5,
      name: '自定义',
      template: null
    }
  ]
};
