/**
 * 讣告模板配置
 * 在此处添加/修改/删除讣告模板
 * 
 * 每个模板包含:
 * - id: 模板 ID (唯一)
 * - name: 模板名称
 * - template: 模板文案 (支持占位符)
 * - category: 分类 (standard/funny/work/meme)
 * - enabled: 是否启用
 * 
 * 占位符说明:
 * - {nickname}: 逝者昵称
 * - {hours}: 死亡时长 (小时)
 * - {minutes}: 死亡时长 (分钟)
 * - {date}: 死亡日期
 * - {time}: 死亡时间
 */

module.exports = {
  // 默认模板 ID (用户首次死亡时使用)
  defaultTemplateId: 1,
  
  // 模板列表
  templates: [
    {
      id: 1,
      name: '标准版',
      template: '您关注的好友 {nickname} 已超过 {hours} 小时未签到，系统判定其可能已...节哀。',
      category: 'standard',
      enabled: true,
      sortOrder: 1
    },
    {
      id: 2,
      name: '打工人版',
      template: '{nickname} 走了，带着没写完的 PPT 走了。',
      category: 'work',
      enabled: true,
      sortOrder: 2
    },
    {
      id: 3,
      name: '社畜版',
      template: '{nickname} 终于不用再早起了，愿天堂没有打卡。',
      category: 'work',
      enabled: true,
      sortOrder: 3
    },
    {
      id: 4,
      name: '剁手版',
      template: '{nickname} 走了，花呗还没还完。',
      category: 'funny',
      enabled: true,
      sortOrder: 4
    },
    {
      id: 5,
      name: '自定义版',
      template: '{nickname} 走了...',
      category: 'standard',
      enabled: true,
      sortOrder: 5
    },
    {
      id: 6,
      name: '程序员版',
      template: '{nickname} 走了，代码还没写完，没有 Bug 了。',
      category: 'work',
      enabled: true,
      sortOrder: 6
    },
    {
      id: 7,
      name: '干饭人版',
      template: '{nickname} 走了，外卖还没到。',
      category: 'funny',
      enabled: true,
      sortOrder: 7
    },
    {
      id: 8,
      name: '熬夜冠军版',
      template: '{nickname} 走了，这次是真的睡过去了。',
      category: 'funny',
      enabled: true,
      sortOrder: 8
    },
    {
      id: 9,
      name: '游戏玩家版',
      template: '{nickname} 下线了，这次没有复活币了。',
      category: 'meme',
      enabled: true,
      sortOrder: 9
    },
    {
      id: 10,
      name: '文艺青年版',
      template: '{nickname} 去了远方，那里没有闹钟。',
      category: 'standard',
      enabled: true,
      sortOrder: 10
    },
    {
      id: 11,
      name: '摆烂版',
      template: '{nickname} 不玩了，这个世界太卷了。',
      category: 'meme',
      enabled: true,
      sortOrder: 11
    },
    {
      id: 12,
      name: '学霸版',
      template: '{nickname} 交卷了，提前离场。',
      category: 'standard',
      enabled: true,
      sortOrder: 12
    }
  ],
  
  // 分类定义
  categories: {
    standard: { name: '标准', color: '#999999' },
    work: { name: '打工人', color: '#FF6B6B' },
    funny: { name: '搞笑', color: '#4ECDC4' },
    meme: { name: '梗文化', color: '#95E1D3' }
  }
};
