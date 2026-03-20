/**
 * 认证控制器
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AliveRecord = require('../models/AliveRecord');
const config = require('../config');

/**
 * 微信登录
 */
exports.wechatLogin = async (req, res, next) => {
  try {
    const { code, nickname, avatar } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: '缺少微信 code' });
    }
    
    // TODO: 调用微信 API 获取 openid
    // const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    //   params: {
    //     appid: config.wechatAppId,
    //     secret: config.wechatAppSecret,
    //     js_code: code,
    //     grant_type: 'authorization_code'
    //   }
    // });
    // const { openid } = response.data;
    
    // 模拟 openid（开发用）
    const openid = `mock_openid_${code}`;
    
    // 查找或创建用户
    let user = await User.findOne({ openid });
    
    if (!user) {
      user = await User.create({
        openid,
        nickname: nickname || '新用户',
        avatar: avatar || ''
      });
      
      // 创建存活记录
      await AliveRecord.createForUser(user._id);
    }
    
    // 生成 JWT
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    
    res.json({
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 手机号登录
 */
exports.phoneLogin = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ error: '缺少手机号或验证码' });
    }
    
    // TODO: 验证短信验证码
    
    // 查找或创建用户
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await User.create({
        phone,
        nickname: `用户${phone.slice(-4)}`,
        avatar: ''
      });
      
      // 创建存活记录
      await AliveRecord.createForUser(user._id);
    }
    
    // 生成 JWT
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    
    res.json({
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 获取用户信息
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-openid -phone');
    
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

/**
 * 更新用户信息
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { nickname, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { nickname, avatar },
      { new: true, runValidators: true }
    ).select('-openid -phone');
    
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
