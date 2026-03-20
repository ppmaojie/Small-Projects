/**
 * 还活着么 - 小程序入口
 */

App({
  onLaunch() {
    console.log('还活着么 小程序启动');
    
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
  },
  
  globalData: {
    token: null,
    userInfo: null,
    apiBaseUrl: 'https://api.alive-check.com' // 生产环境替换
  }
});
