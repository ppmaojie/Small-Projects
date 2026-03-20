/**
 * 讣告服务
 * 负责讣告模板管理、文案生成等
 */

const obituaryConfig = require('../config/obituaryTemplates');

class ObituaryService {
  /**
   * 获取所有启用的模板
   */
  static getEnabledTemplates() {
    return obituaryConfig.templates
      .filter(t => t.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  /**
   * 根据 ID 获取模板
   */
  static getTemplateById(templateId) {
    return obituaryConfig.templates.find(t => t.id === templateId);
  }
  
  /**
   * 获取默认模板
   */
  static getDefaultTemplate() {
    return this.getTemplateById(obituaryConfig.defaultTemplateId);
  }
  
  /**
   * 按分类获取模板
   */
  static getTemplatesByCategory(category) {
    return obituaryConfig.templates
      .filter(t => t.enabled && t.category === category)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  /**
   * 获取所有分类
   */
  static getCategories() {
    return obituaryConfig.categories;
  }
  
  /**
   * 生成讣告文案
   * @param {Object} template - 模板对象
   * @param {Object} data - 替换数据
   * @returns {String} 生成的文案
   */
  static generateText(template, data) {
    if (!template || !template.template) {
      return `${data.nickname || '用户'} 走了...`;
    }
    
    let text = template.template;
    
    // 替换占位符
    if (data.nickname) {
      text = text.replace(/{nickname}/g, data.nickname);
    }
    if (data.hours !== undefined) {
      text = text.replace(/{hours}/g, data.hours);
    }
    if (data.minutes !== undefined) {
      text = text.replace(/{minutes}/g, data.minutes);
    }
    if (data.date) {
      text = text.replace(/{date}/g, data.date);
    }
    if (data.time) {
      text = text.replace(/{time}/g, data.time);
    }
    
    return text;
  }
  
  /**
   * 根据模板 ID 生成讣告文案
   * @param {Number} templateId - 模板 ID
   * @param {Object} data - 替换数据
   * @returns {String} 生成的文案
   */
  static generateTextById(templateId, data) {
    const template = this.getTemplateById(templateId);
    return this.generateText(template, data);
  }
  
  /**
   * 添加新模板（运行时）
   * @param {Object} templateData - 模板数据
   * @returns {Object} 新模板
   */
  static addTemplate(templateData) {
    const maxId = Math.max(...obituaryConfig.templates.map(t => t.id), 0);
    const newTemplate = {
      id: maxId + 1,
      name: templateData.name,
      template: templateData.template,
      category: templateData.category || 'standard',
      enabled: templateData.enabled !== false,
      sortOrder: templateData.sortOrder || (obituaryConfig.templates.length + 1)
    };
    
    obituaryConfig.templates.push(newTemplate);
    return newTemplate;
  }
  
  /**
   * 更新模板
   * @param {Number} templateId - 模板 ID
   * @param {Object} updates - 更新内容
   * @returns {Object} 更新后的模板
   */
  static updateTemplate(templateId, updates) {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`模板 ${templateId} 不存在`);
    }
    
    Object.assign(template, updates);
    return template;
  }
  
  /**
   * 禁用模板
   * @param {Number} templateId - 模板 ID
   */
  static disableTemplate(templateId) {
    return this.updateTemplate(templateId, { enabled: false });
  }
  
  /**
   * 启用模板
   * @param {Number} templateId - 模板 ID
   */
  static enableTemplate(templateId) {
    return this.updateTemplate(templateId, { enabled: true });
  }
  
  /**
   * 删除模板
   * @param {Number} templateId - 模板 ID
   * @returns {Boolean} 是否删除成功
   */
  static deleteTemplate(templateId) {
    const index = obituaryConfig.templates.findIndex(t => t.id === templateId);
    if (index === -1) {
      return false;
    }
    
    obituaryConfig.templates.splice(index, 1);
    return true;
  }
  
  /**
   * 获取模板统计信息
   */
  static getStats() {
    const templates = obituaryConfig.templates;
    return {
      total: templates.length,
      enabled: templates.filter(t => t.enabled).length,
      disabled: templates.filter(t => !t.enabled).length,
      byCategory: Object.keys(obituaryConfig.categories).map(cat => ({
        category: cat,
        name: obituaryConfig.categories[cat].name,
        count: templates.filter(t => t.enabled && t.category === cat).length
      }))
    };
  }
}

module.exports = ObituaryService;
