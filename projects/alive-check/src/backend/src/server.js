/**
 * 还活着么 - 后端服务入口
 * @author OpenClaw Agent
 * @date 2026-03-20
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const winston = require('winston');

const config = require('./config');
const routes = require('./routes');
const { deathDetectionJob, leaderboardUpdateJob } = require('./jobs');

// 日志配置
const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// 初始化 Express 应用
const app = express();

// 中间件
app.use(helmet()); // 安全头
app.use(cors()); // 跨域
app.use(express.json()); // JSON 解析
app.use(express.urlencoded({ extended: true })); // URL 编码解析

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 每个 IP 最多 100 个请求
});
app.use('/api/', limiter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api', routes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 连接数据库
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('MongoDB connected');
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// 启动服务器
const PORT = config.port || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// 定时任务
// 死亡检测 - 每 5 分钟执行
cron.schedule('*/5 * * * *', async () => {
  logger.info('Running death detection job...');
  await deathDetectionJob();
});

// 排行榜更新 - 每周日凌晨 0 点
cron.schedule('0 0 * * 0', async () => {
  logger.info('Running leaderboard update job...');
  await leaderboardUpdateJob();
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
