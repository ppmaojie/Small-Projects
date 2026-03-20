/**
 * 联系人管理页面
 */

Page({
  data: {
    contacts: [],
    pendingInvites: [],
    loading: false,
    showAddModal: false,
    searchResult: null
  },

  onLoad() {
    this.fetchContacts();
    this.fetchPendingInvites();
  },

  // 获取联系人列表
  async fetchContacts() {
    this.setData({ loading: true });
    
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/contacts/list`,
        header: { Authorization: `Bearer ${token}` }
      });

      this.setData({
        contacts: res.data.contacts || [],
        loading: false
      });
    } catch (err) {
      console.error('获取联系人失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 获取待确认邀请
  async fetchPendingInvites() {
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/contacts/pending`,
        header: { Authorization: `Bearer ${token}` }
      });

      this.setData({
        pendingInvites: res.data.invites || []
      });
    } catch (err) {
      console.error('获取邀请失败:', err);
    }
  },

  // 打开添加联系人弹窗
  openAddModal() {
    this.setData({ showAddModal: true });
  },

  // 关闭弹窗
  closeAddModal() {
    this.setData({ 
      showAddModal: false,
      searchResult: null
    });
  },

  // 搜索用户
  async searchUser(e) {
    const { value } = e.detail;
    
    if (value.length < 2) {
      this.setData({ searchResult: null });
      return;
    }

    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/users/search?keyword=${value}`,
        header: { Authorization: `Bearer ${token}` }
      });

      this.setData({ searchResult: res.data.users || [] });
    } catch (err) {
      console.error('搜索失败:', err);
    }
  },

  // 邀请用户
  async inviteUser(e) {
    const { userid } = e.currentTarget.dataset;
    
    try {
      const token = wx.getStorageSync('token');
      await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/contacts/invite`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` },
        data: { contactUserId: userid, priority: 1 }
      });

      wx.showToast({ title: '邀请已发送', icon: 'success' });
      this.closeAddModal();
      this.fetchPendingInvites();
    } catch (err) {
      wx.showToast({ title: err.data?.error || '邀请失败', icon: 'none' });
    }
  },

  // 确认邀请
  async confirmInvite(e) {
    const { userid } = e.currentTarget.dataset;
    
    try {
      const token = wx.getStorageSync('token');
      await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/contacts/confirm`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` },
        data: { contactUserId: userid }
      });

      wx.showToast({ title: '已确认', icon: 'success' });
      this.fetchPendingInvites();
      this.fetchContacts();
    } catch (err) {
      wx.showToast({ title: '确认失败', icon: 'none' });
    }
  },

  // 拒绝邀请
  async rejectInvite(e) {
    const { inviteid } = e.currentTarget.dataset;
    
    try {
      const token = wx.getStorageSync('token');
      await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/contacts/${inviteid}/reject`,
        method: 'DELETE',
        header: { Authorization: `Bearer ${token}` }
      });

      wx.showToast({ title: '已拒绝', icon: 'success' });
      this.fetchPendingInvites();
    } catch (err) {
      wx.showToast({ title: '拒绝失败', icon: 'none' });
    }
  },

  // 删除联系人
  deleteContact(e) {
    const { contactid, nickname } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '删除联系人',
      content: `确定要删除 ${nickname} 吗？`,
      confirmColor: '#ff4757',
      success: async (res) => {
        if (res.confirm) {
          try {
            const token = wx.getStorageSync('token');
            await wx.request({
              url: `${getApp().globalData.apiBaseUrl}/api/contacts/${contactid}`,
              method: 'DELETE',
              header: { Authorization: `Bearer ${token}` }
            });

            wx.showToast({ title: '已删除', icon: 'success' });
            this.fetchContacts();
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  }
});
