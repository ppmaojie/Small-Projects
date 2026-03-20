/**
 * 认证中间件
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: '未提供认证令牌' });
      }
      
      const token = authHeader.substring(7);
      
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: '令牌已过期' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: '令牌无效' });
      }
      next(err);
    }
  }
};
