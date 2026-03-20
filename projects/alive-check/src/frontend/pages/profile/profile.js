/**
 * 个人中心页面
 */

Page({
  data: {
    userInfo: null,
    stats: {
      consecutiveDays: 0,
      totalDeaths: 0,
      totalFlowers: 0
    }
  },

  onLoad() {
    this.fetchProfile();
    this.fetchStats();
  },

  // 获取用户信息
  async fetchProfile() {
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/auth/profile`,
        header: { Authorization: `Bearer ${token}` }
      });

      this.setData({
        userInfo: res.data.user
      });
    } catch (err) {
      console.error('获取用户信息失败:', err);
    }
  },

  // 获取统计数据
  async fetchStats() {
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/alive/status`,
        header: { Authorization: `Bearer ${token}` }
      });

      this.setData({
        'stats.consecutiveDays': res.data.consecutiveDays,
        'stats.totalDeaths': res.data.totalDeaths
      });
    } catch (err) {
      console.error('获取统计失败:', err);
    }
  },

  // 编辑资料
  editProfile() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '输入新昵称',
      success: async (res) => {
        if (res.confirm && res.content) {
          try {
            const token = wx.getStorageSync('token');
            await wx.request({
              url: `${getApp().globalData.apiBaseUrl}/api/auth/profile`,
              method: 'PUT',
              header: { Authorization: `Bearer ${token}` },
              data: { nickname: res.content }
            });

            wx.showToast({ title: '修改成功', icon: 'success' });
            this.fetchProfile();
          } catch (err) {
            wx.showToast({ title: '修改失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 设置存活周期
  setCycle() {
    wx.showActionSheet({
      itemList: ['12 小时', '24 小时', '48 小时', '72 小时'],
      success: async (res) => {
        const cycles = [12, 24, 48, 72];
        const newCycle = cycles[res.tapIndex];
        
        try {
          const token = wx.getStorageSync('token');
          await wx.request({
            url: `${getApp().globalData.apiBaseUrl}/api/alive/cycle`,
            method: 'PUT',
            header: { Authorization: `Bearer ${token}` },
            data: { cycleHours: newCycle }
          });

          wx.showToast({ title: '设置成功', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '设置失败', icon: 'none' });
        }
      }
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.reLaunch({ url: '/pages/index/index' });
        }
      }
    });
  }
});
