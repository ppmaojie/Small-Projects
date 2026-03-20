/**
 * 墓地页面 - 查看已故好友
 */

Page({
  data: {
    graveyard: [],
    loading: false
  },

  onLoad() {
    this.fetchGraveyard();
  },

  onPullDownRefresh() {
    this.fetchGraveyard().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 获取墓地列表
  async fetchGraveyard() {
    this.setData({ loading: true });
    
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/graveyard/list`,
        header: { Authorization: `Bearer ${token}` }
      });

      const { data } = res;
      
      this.setData({
        graveyard: data.graveyard || [],
        loading: false
      });
    } catch (err) {
      console.error('获取墓地失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 献花
  async addFlower(e) {
    const { deceaseduserid } = e.currentTarget.dataset;
    
    try {
      const token = wx.getStorageSync('token');
      await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/graveyard/flower`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` },
        data: { deceasedUserId: deceaseduserid }
      });

      wx.showToast({ title: '献花成功 🌸', icon: 'success' });
      this.fetchGraveyard();
    } catch (err) {
      wx.showToast({ title: '献花失败', icon: 'none' });
    }
  },

  // 留言
  addMessage(e) {
    const { deceaseduserid, nickname } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '给 TA 留言',
      editable: true,
      placeholderText: '写下你想说的话...',
      success: async (res) => {
        if (res.confirm && res.content) {
          try {
            const token = wx.getStorageSync('token');
            await wx.request({
              url: `${getApp().globalData.apiBaseUrl}/api/graveyard/message`,
              method: 'POST',
              header: { Authorization: `Bearer ${token}` },
              data: {
                deceasedUserId: deceaseduserid,
                content: res.content
              }
            });

            wx.showToast({ title: '留言成功', icon: 'success' });
          } catch (err) {
            wx.showToast({ title: '留言失败', icon: 'none' });
          }
        }
      }
    });
  }
});
