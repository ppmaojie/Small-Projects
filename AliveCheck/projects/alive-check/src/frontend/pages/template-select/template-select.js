/**
 * 模板选择页面 - 用户选择讣告模板
 */

Page({
  data: {
    templates: [],
    categories: {},
    activeCategory: 'all',
    selectedTemplateId: null,
    loading: false,
    // 从上一页传来的参数
    obituaryId: null,
    returnPage: null
  },

  onLoad(options) {
    this.setData({
      obituaryId: options.obituaryId,
      returnPage: options.returnPage || '/pages/index/index'
    });
    this.fetchTemplates();
  },

  // 获取模板列表
  async fetchTemplates() {
    this.setData({ loading: true });
    
    try {
      const token = wx.getStorageSync('token');
      const res = await wx.request({
        url: `${getApp().globalData.apiBaseUrl}/api/templates`,
        header: { Authorization: `Bearer ${token}` }
      });

      const { data } = res;
      
      this.setData({
        templates: data.templates || [],
        categories: data.categories || {},
        loading: false
      });
    } catch (err) {
      console.error('获取模板失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 切换分类
  switchCategory(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ activeCategory: category });
  },

  // 选择模板
  selectTemplate(e) {
    const { templateid } = e.currentTarget.dataset;
    
    this.setData({ selectedTemplateId: templateid });
    
    // 高亮选中效果
    wx.vibrateShort({ type: 'light' });
  },

  // 确认选择
  async confirmSelect() {
    if (!this.data.selectedTemplateId) {
      wx.showToast({ title: '请选择模板', icon: 'none' });
      return;
    }

    try {
      const token = wx.getStorageSync('token');
      
      // 如果是编辑已有讣告
      if (this.data.obituaryId) {
        await wx.request({
          url: `${getApp().globalData.apiBaseUrl}/api/obituaries/${this.data.obituaryId}/template`,
          method: 'PUT',
          header: { Authorization: `Bearer ${token}` },
          data: { templateId: this.data.selectedTemplateId }
        });
      } else {
        // 保存为用户偏好
        await wx.request({
          url: `${getApp().globalData.apiBaseUrl}/api/user/template-preference`,
          method: 'PUT',
          header: { Authorization: `Bearer ${token}` },
          data: { templateId: this.data.selectedTemplateId }
        });
      }

      wx.showToast({ title: '设置成功', icon: 'success' });
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (err) {
      console.error('保存失败:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  // 预览模板文案
  previewTemplate(e) {
    const { templateid, templatename } = e.currentTarget.dataset;
    
    const template = this.data.templates.find(t => t.id === templateid);
    if (!template) return;

    wx.showModal({
      title: templatename,
      content: template.template,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 获取筛选后的模板列表
  get filteredTemplates() {
    const { templates, activeCategory } = this.data;
    
    if (activeCategory === 'all') {
      return templates;
    }
    
    return templates.filter(t => t.category === activeCategory);
  }
});

// 添加 computed 支持
const originalPage = Page;
Page = function(options) {
  const computed = options.computed || {};
  
  // 添加 getter 到 data
  Object.keys(computed).forEach(key => {
    if (!options.data) options.data = {};
    Object.defineProperty(options.data, key, {
      get: computed[key],
      enumerable: true,
      configurable: true
    });
  });
  
  originalPage(options);
};
