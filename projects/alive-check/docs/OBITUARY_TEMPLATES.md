# 讣告模板配置指南

> 如何管理和自定义讣告文案

---

## 📁 配置文件位置

```
/src/backend/src/config/obituaryTemplates.js
```

---

## 🎯 快速开始

### 添加新模板

在 `templates` 数组中添加新对象：

```javascript
{
  id: 13,  // 唯一 ID，从 13 开始递增
  name: '我的自定义模板',  // 模板名称
  template: '{nickname} 走了，{custom}。',  // 模板文案
  category: 'funny',  // 分类：standard/work/funny/meme
  enabled: true,  // 是否启用
  sortOrder: 13  // 排序号
}
```

### 修改现有模板

找到对应 ID 的模板，修改 `template` 字段：

```javascript
{
  id: 1,
  name: '标准版',
  template: '你的新文案...',  // 改这里
  category: 'standard',
  enabled: true,
  sortOrder: 1
}
```

### 禁用模板

设置 `enabled: false`：

```javascript
{
  id: 5,
  name: '自定义版',
  template: '{nickname} 走了...',
  category: 'standard',
  enabled: false,  // 改这里
  sortOrder: 5
}
```

---

## 📝 占位符说明

模板中可以使用以下占位符，会被自动替换：

| 占位符 | 说明 | 示例 |
|--------|------|------|
| `{nickname}` | 逝者昵称 | 张三 |
| `{hours}` | 死亡时长（小时） | 24 |
| `{minutes}` | 死亡时长（分钟） | 60 |
| `{date}` | 死亡日期 | 2026/03/20 |
| `{time}` | 死亡时间 | 14:30 |

### 示例

```javascript
// 模板
'{nickname} 走了 {hours} 小时了，时间是 {date} {time}'

// 生成结果
'张三 走了 24 小时了，时间是 2026/03/20 14:30'
```

---

## 🏷️ 分类说明

| 分类 | 说明 | 颜色 |
|------|------|------|
| `standard` | 标准、正式 | 灰色 |
| `work` | 打工人、职场 | 红色 |
| `funny` | 搞笑、幽默 | 青色 |
| `meme` | 梗文化、网络 | 绿色 |

---

## 🔧 管理 API

### 获取所有模板

```bash
GET /api/templates
```

响应：
```json
{
  "templates": [
    {
      "id": 1,
      "name": "标准版",
      "template": "...",
      "category": "standard",
      "enabled": true
    }
  ],
  "categories": {
    "standard": { "name": "标准", "color": "#999999" }
  },
  "defaultTemplateId": 1
}
```

### 添加模板

```bash
POST /api/templates
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "name": "新模板",
  "template": "{nickname} 走了...",
  "category": "funny",
  "enabled": true,
  "sortOrder": 13
}
```

### 更新模板

```bash
PUT /api/templates/13
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "name": "修改后的名称",
  "template": "新文案"
}
```

### 禁用模板

```bash
POST /api/templates/13/disable
Authorization: Bearer YOUR_TOKEN
```

### 启用模板

```bash
POST /api/templates/13/enable
Authorization: Bearer YOUR_TOKEN
```

### 删除模板

```bash
DELETE /api/templates/13
Authorization: Bearer YOUR_TOKEN
```

### 测试模板

```bash
POST /api/templates/1/test
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "nickname": "测试用户",
  "hours": 24,
  "minutes": 30
}
```

响应：
```json
{
  "templateId": 1,
  "data": {
    "nickname": "测试用户",
    "hours": 24,
    "minutes": 30
  },
  "generatedText": "您关注的好友 测试用户 已超过 24 小时未签到..."
}
```

### 获取统计

```bash
GET /api/templates/stats
```

响应：
```json
{
  "stats": {
    "total": 12,
    "enabled": 10,
    "disabled": 2,
    "byCategory": [
      {
        "category": "standard",
        "name": "标准",
        "count": 4
      }
    ]
  }
}
```

---

## 💡 最佳实践

### 1. 模板命名
- 简洁明了，体现风格
- 例如：`程序员版 `、`干饭人版`、` 摆烂版`

### 2. 文案设计
- 保持黑色幽默风格
- 避免过于敏感的内容
- 长度控制在 50 字以内

### 3. 分类使用
- 根据文案风格选择合适的分类
- 同一分类的模板风格应一致

### 4. 测试
- 添加新模板后，使用测试 API 验证
- 检查占位符是否正确替换

---

## 🎨 创意模板示例

```javascript
// 考研党版
{
  id: 14,
  name: '考研党版',
  template: '{nickname} 上岸了，这次是真的。',
  category: 'standard',
  enabled: true,
  sortOrder: 14
}

// 单身狗版
{
  id: 15,
  name: '单身狗版',
  template: '{nickname} 走了，还是单身。',
  category: 'funny',
  enabled: true,
  sortOrder: 15
}

// 减肥人版
{
  id: 16,
  name: '减肥人版',
  template: '{nickname} 走了，没瘦下来。',
  category: 'funny',
  enabled: true,
  sortOrder: 16
}

// 追星族版
{
  id: 17,
  name: '追星族版',
  template: '{nickname} 去见偶像了。',
  category: 'standard',
  enabled: true,
  sortOrder: 17
}

// 社恐版
{
  id: 18,
  name: '社恐版',
  template: '{nickname} 下线了，终于不用社交了。',
  category: 'meme',
  enabled: true,
  sortOrder: 18
}
```

---

## ⚠️ 注意事项

1. **ID 唯一性**: 确保每个模板的 ID 不重复
2. **默认模板**: 至少保留一个启用的模板作为默认
3. **文案审核**: 避免违法、违规、过于负面的内容
4. **性能考虑**: 模板数量建议控制在 50 个以内

---

## 🔄 版本历史

- **v1.0** (2026-03-20): 初始版本，支持 12 个模板
- **v1.1** (待更新): 支持用户自定义模板

---

**有问题？查看 API 文档或联系开发团队。**
