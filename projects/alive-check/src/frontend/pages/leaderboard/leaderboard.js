/**
 * 排行榜页面
 */

Page({
  data: {
    activeTab: 'consecutive_days',
    leaderboards: {
      consecutive_days: [],
      total_deaths: [],
      best_obituary: []
    },
    loading: false
  },

  tabs: [
    { key: 'consecutive_days', name: '🏆 连续存活' },
    { key: 'total_deaths', name: '💀 死亡次数' },
    { key: 'best_obituary', name: '📢 最佳讣告' }
  ],

  onLoad() {
    this.fetchLeaderboard('consecutive_days');
  },

  // 切换 Tab
  switchTab(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ activeTab: type });
    this.fetchLeaderboard(type);
  },

  // 获取排行榜
  async fetchLeaderboard(type) {
    this.setData({ loading: true });
    
    try {
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/leaderboard/${type}`
      });

      const { data } = res;
      
      const key = type;
      this.setData({
        [`leaderboards.${key}`]: data.leaderboard || [],
        loading: false
      });
    } catch (err) {
      console.error('获取排行榜失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 获取排名图标
  getRankIcon(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }
});
