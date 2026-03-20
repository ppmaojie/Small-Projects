/**
 * 首页 - 存活状态
 */

Page({
  data: {
    status: 'alive', // alive / dead
    timeLeft: 0, // 剩余时间（毫秒）
    timeLeftText: '00:00:00',
    cycleHours: 24,
    consecutiveDays: 0,
    totalDeaths: 0,
    isCounting: false
  },

  timer: null,

  onLoad() {
    this.fetchStatus();
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  // 获取存活状态
  async fetchStatus() {
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/alive/status`,
        header: { Authorization: `Bearer ${token}` }
      });

      const { data } = res;
      
      this.setData({
        status: data.status,
        timeLeft: data.timeLeft,
        cycleHours: data.cycleHours,
        consecutiveDays: data.consecutiveDays,
        totalDeaths: data.totalDeaths
      });

      this.updateTimeLeftText();
      
      if (data.status === 'alive') {
        this.startTimer();
      }
    } catch (err) {
      console.error('获取状态失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 启动倒计时
  startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.setData({
        timeLeft: Math.max(0, this.data.timeLeft - 1000)
      });
      this.updateTimeLeftText();

      if (this.data.timeLeft <= 0) {
        this.handleDeath();
      }
    }, 1000);
  },

  // 更新倒计时文本
  updateTimeLeftText() {
    const seconds = Math.floor(this.data.timeLeft / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const timeLeftText = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');

    this.setData({ timeLeftText });
  },

  // 处理"死亡"
  handleDeath() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.setData({ status: 'dead' });
    
    wx.showModal({
      title: '💀 你已死亡',
      content: '超过 24 小时未签到，系统判定你已...节哀。',
      showCancel: false,
      confirmText: '我要复活',
      success: () => {
        this.resurrect();
      }
    });
  },

  // 签到续命
  async onCheckin() {
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/alive/checkin`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` }
      });

      const { data } = res;
      
      this.setData({
        status: 'alive',
        timeLeft: data.nextDeadline - new Date().getTime(),
        consecutiveDays: data.consecutiveDays
      });

      this.updateTimeLeftText();
      this.startTimer();

      wx.showToast({ title: '签到成功！', icon: 'success' });
    } catch (err) {
      console.error('签到失败:', err);
      wx.showToast({ title: '签到失败', icon: 'none' });
    }
  },

  // 复活
  async resurrect() {
    try {
      const token = wx.getStorageSync('token');
      await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/alive/checkin`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` }
      });

      this.fetchStatus();
      wx.showToast({ title: '复活成功！', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: '复活失败', icon: 'none' });
    }
  }
});
