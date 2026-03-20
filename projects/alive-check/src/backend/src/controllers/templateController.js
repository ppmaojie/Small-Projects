/**
 * 讣告模板控制器
 */

const ObituaryService = require('../services/obituaryService');

/**
 * 获取所有启用的模板
 */
exports.listTemplates = async (req, res, next) => {
  try {
    const templates = ObituaryService.getEnabledTemplates();
    const categories = ObituaryService.getCategories();
    
    res.json({
      templates,
      categories,
      defaultTemplateId: 1
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 获取所有模板（包括禁用的，管理员专用）
 */
exports.listAllTemplates = async (req, res, next) => {
  try {
    const templates = ObituaryService.getEnabledTemplates();
    const stats = ObituaryService.getStats();
    const categories = ObituaryService.getCategories();
    
    res.json({
      templates,
      stats,
      categories
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 获取单个模板
 */
exports.getTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = ObituaryService.getTemplateById(parseInt(id));
    
    if (!template) {
      return res.status(404).json({ error: '模板不存在' });
    }
    
    res.json({ template });
  } catch (err) {
    next(err);
  }
};

/**
 * 添加新模板
 */
exports.addTemplate = async (req, res, next) => {
  try {
    const { name, template, category, enabled, sortOrder } = req.body;
    
    if (!name || !template) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    const newTemplate = ObituaryService.addTemplate({
      name,
      template,
      category,
      enabled,
      sortOrder
    });
    
    res.json({
      message: '模板添加成功',
      template: newTemplate
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 更新模板
 */
exports.updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const template = ObituaryService.updateTemplate(parseInt(id), updates);
    
    res.json({
      message: '模板更新成功',
      template
    });
  } catch (err) {
    if (err.message.includes('不存在')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

/**
 * 禁用模板
 */
exports.disableTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = ObituaryService.disableTemplate(parseInt(id));
    
    res.json({
      message: '模板已禁用',
      template
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 启用模板
 */
exports.enableTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = ObituaryService.enableTemplate(parseInt(id));
    
    res.json({
      message: '模板已启用',
      template
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 删除模板
 */
exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = ObituaryService.deleteTemplate(parseInt(id));
    
    if (!success) {
      return res.status(404).json({ error: '模板不存在' });
    }
    
    res.json({
      message: '模板已删除'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 测试模板文案生成
 */
exports.testTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nickname, hours, minutes } = req.body;
    
    const data = {
      nickname: nickname || '测试用户',
      hours: hours || 24,
      minutes: minutes || 0
    };
    
    const text = ObituaryService.generateTextById(parseInt(id), data);
    
    res.json({
      templateId: parseInt(id),
      data,
      generatedText: text
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 获取模板统计
 */
exports.getStats = async (req, res, next) => {
  try {
    const stats = ObituaryService.getStats();
    res.json({ stats });
  } catch (err) {
    next(err);
  }
};
