/**
 * 排行榜控制器
 */

const AliveRecord = require('../models/AliveRecord');
const Obituary = require('../models/Obituary');

/**
 * 获取排行榜
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { limit = 100 } = req.query;
    
    let leaderboard = [];
    
    switch (type) {
      case 'consecutive_days':
        leaderboard = await getConsecutiveDaysLeaderboard(parseInt(limit));
        break;
      case 'total_deaths':
        leaderboard = await getTotalDeathsLeaderboard(parseInt(limit));
        break;
      case 'best_obituary':
        leaderboard = await getBestObituaryLeaderboard(parseInt(limit));
        break;
      default:
        return res.status(400).json({ error: '无效的排行榜类型' });
    }
    
    res.json({
      type,
      leaderboard,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 连续签到排行榜
 */
async function getConsecutiveDaysLeaderboard(limit = 100) {
  const records = await AliveRecord.find({ status: 'alive' })
    .populate('userId', 'nickname avatar')
    .sort({ consecutiveDays: -1 })
    .limit(limit);
  
  return records.map((record, index) => ({
    rank: index + 1,
    user: record.userId,
    score: record.consecutiveDays,
    unit: '天'
  }));
}

/**
 * 死亡次数排行榜
 */
async function getTotalDeathsLeaderboard(limit = 100) {
  const records = await AliveRecord.find()
    .populate('userId', 'nickname avatar')
    .sort({ totalDeaths: -1 })
    .limit(limit);
  
  return records.map((record, index) => ({
    rank: index + 1,
    user: record.userId,
    score: record.totalDeaths,
    unit: '次'
  }));
}

/**
 * 最佳讣告排行榜（按分享次数）
 */
async function getBestObituaryLeaderboard(limit = 100) {
  const obituaries = await Obituary.find()
    .populate('deceasedUserId', 'nickname avatar')
    .sort({ shareCount: -1 })
    .limit(limit);
  
  return obituaries.map((obituary, index) => ({
    rank: index + 1,
    user: obituary.deceasedUserId,
    score: obituary.shareCount,
    unit: '次分享',
    deathTime: obituary.deathTime
  }));
}
