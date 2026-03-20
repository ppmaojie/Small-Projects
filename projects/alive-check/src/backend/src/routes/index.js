/**
 * API 路由
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const aliveController = require('../controllers/aliveController');
const contactController = require('../controllers/contactController');
const graveyardController = require('../controllers/graveyardController');
const leaderboardController = require('../controllers/leaderboardController');

// 认证中间件
const auth = require('../middleware/auth');

// 认证相关
router.post('/auth/wechat-login', authController.wechatLogin);
router.post('/auth/phone-login', authController.phoneLogin);
router.get('/auth/profile', auth.authenticate, authController.getProfile);
router.put('/auth/profile', auth.authenticate, authController.updateProfile);

// 存活相关
router.get('/alive/status', auth.authenticate, aliveController.getStatus);
router.post('/alive/checkin', auth.authenticate, aliveController.checkin);
router.put('/alive/cycle', auth.authenticate, aliveController.updateCycle);

// 联系人相关
router.get('/contacts/list', auth.authenticate, contactController.list);
router.post('/contacts/invite', auth.authenticate, contactController.invite);
router.post('/contacts/confirm', auth.authenticate, contactController.confirm);
router.get('/contacts/pending', auth.authenticate, contactController.getPendingInvites);

// 墓地相关
router.get('/graveyard/list', auth.authenticate, graveyardController.getList);
router.post('/graveyard/flower', auth.authenticate, graveyardController.addFlower);
router.post('/graveyard/message', auth.authenticate, graveyardController.addMessage);
router.post('/graveyard/like', auth.authenticate, graveyardController.like);

// 排行榜相关
router.get('/leaderboard/:type', leaderboardController.getLeaderboard);

module.exports = router;
