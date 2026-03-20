# 讣告模板系统 - 快速开始指南

> 📖 如何管理和自定义讣告文案

**最后更新**: 2026-03-20  
**版本**: v1.0

---

## 🎯 一句话介绍

这是一个**完全可配置**的讣告文案系统，你可以轻松添加、修改、管理任意数量的讣告模板，无需修改代码。

---

## 📁 配置文件位置

```
/home/admin/.openclaw/workspace/projects/alive-check/src/backend/src/config/obituaryTemplates.js
```

---

## 🚀 快速上手

### 方法一：修改配置文件（推荐）

适合：批量添加、永久保存的模板

#### 步骤

1. **打开配置文件**
```bash
code /home/admin/.openclaw/workspace/projects/alive-check/src/backend/src/config/obituaryTemplates.js
```

2. **找到 templates 数组**

3. **添加新模板**（在数组末尾添加）
```javascript
{
  id: 14,  // 唯一 ID，递增
  name: '我的自定义模板',  // 模板名称
  template: '{nickname} 走了，{hours} 小时了。',  // 文案
  category: 'funny',  // 分类
  enabled: true,  // 是否启用
  sortOrder: 14  // 排序
}
```

4. **保存文件**，nodemon 会自动重启服务

---

### 方法二：使用 API（动态添加）

适合：运行时动态添加、用户自定义模板

#### 添加模板
```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新模板",
    "template": "{nickname} 走了...",
    "category": "funny",
    "enabled": true
  }'
```

#### 查看模板列表
```bash
curl http://localhost:3000/api/templates
```

#### 测试模板生成
```bash
curl -X POST http://localhost:3000/api/templates/1/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nickname": "张三", "hours": 48}'
```

---

## 📝 模板配置详解

### 完整示例

```javascript
{
  id: 14,                    // 必填：唯一 ID（从 13 开始递增）
  name: '考研党版',           // 必填：模板名称
  template: '{nickname} 上岸了，这次是真的。',  // 必填：模板文案
  category: 'standard',      // 必填：分类（standard/work/funny/meme）
  enabled: true,             // 必填：是否启用
  sortOrder: 14              // 可选：排序号（越小越靠前）
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | Number | ✅ | 唯一 ID，建议从 13 开始递增 |
| `name` | String | ✅ | 模板名称，显示给用户 |
| `template` | String | ✅ | 模板文案，支持占位符 |
| `category` | String | ✅ | 分类：standard/work/funny/meme |
| `enabled` | Boolean | ✅ | 是否启用（false 则不显示） |
| `sortOrder` | Number | ⭕ | 排序号，越小越靠前 |

---

## 🔤 占位符说明

在 `template` 字段中使用以下占位符，系统会自动替换：

| 占位符 | 替换为 | 示例 |
|--------|--------|------|
| `{nickname}` | 逝者昵称 | 张三 |
| `{hours}` | 死亡时长（小时） | 24 |
| `{minutes}` | 死亡时长（分钟） | 60 |
| `{date}` | 死亡日期 | 2026/03/20 |
| `{time}` | 死亡时间 | 14:30 |

### 示例

**配置**:
```javascript
template: '{nickname} 走了 {hours} 小时了，时间是 {date} {time}'
```

**生成结果**:
```
张三 走了 24 小时了，时间是 2026/03/20 14:30
```

---

## 🏷️ 分类说明

| 分类 | 说明 | 适用场景 | 代表色 |
|------|------|----------|--------|
| `standard` | 标准、正式 | 通用场景 | 灰色 |
| `work` | 打工人、职场 | 工作相关 | 红色 |
| `funny` | 搞笑、幽默 | 轻松场景 | 青色 |
| `meme` | 梗文化、网络 | 年轻用户 | 绿色 |

---

## 📋 内置模板（12 个）

### 标准类 (4 个)
1. **标准版** - 您关注的好友 {nickname} 已超过 {hours} 小时未签到...
2. **自定义版** - {nickname} 走了...
3. **文艺青年版** - {nickname} 去了远方，那里没有闹钟。
4. **学霸版** - {nickname} 交卷了，提前离场。

### 打工人 (3 个)
5. **打工人版** - {nickname} 走了，带着没写完的 PPT 走了。
6. **社畜版** - {nickname} 终于不用再早起了，愿天堂没有打卡。
7. **程序员版** - {nickname} 走了，代码还没写完，没有 Bug 了。

### 搞笑类 (4 个)
8. **剁手版** - {nickname} 走了，花呗还没还完。
9. **干饭人版** - {nickname} 走了，外卖还没到。
10. **熬夜冠军版** - {nickname} 走了，这次是真的睡过去了。
11. **测试模板** - {nickname} 测试走了，已经 {hours} 小时了。

### 梗文化 (2 个)
12. **游戏玩家版** - {nickname} 下线了，这次没有复活币了。
13. **摆烂版** - {nickname} 不玩了，这个世界太卷了。

---

## 🛠️ 常用操作

### 添加新模板

```javascript
// 在配置文件中添加
{
  id: 14,
  name: '考研党版',
  template: '{nickname} 上岸了，这次是真的。',
  category: 'standard',
  enabled: true,
  sortOrder: 14
}
```

### 修改现有模板

找到对应 ID 的模板，修改 `template` 字段：

```javascript
// 修改前
template: '{nickname} 走了，带着没写完的 PPT 走了。'

// 修改后
template: '{nickname} 走了，PPT 终于不用改了。'
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

### 启用已禁用的模板

设置 `enabled: true`：

```javascript
{
  id: 5,
  name: '自定义版',
  template: '{nickname} 走了...',
  category: 'standard',
  enabled: true,  // 改这里
  sortOrder: 5
}
```

### 删除模板

直接从配置文件的 `templates` 数组中删除该对象。

---

## 🧪 测试模板

### 使用 API 测试

```bash
# 测试 ID=1 的模板
curl -X POST http://localhost:3000/api/templates/1/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "测试用户",
    "hours": 48,
    "minutes": 30
  }'
```

**响应示例**:
```json
{
  "templateId": 1,
  "data": {
    "nickname": "测试用户",
    "hours": 48,
    "minutes": 30
  },
  "generatedText": "您关注的好友 测试用户 已超过 48 小时未签到，系统判定其可能已...节哀。"
}
```

### 查看统计信息

```bash
curl http://localhost:3000/api/templates/stats
```

**响应示例**:
```json
{
  "stats": {
    "total": 13,
    "enabled": 13,
    "disabled": 0,
    "byCategory": [
      {
        "category": "standard",
        "name": "标准",
        "count": 4
      },
      {
        "category": "work",
        "name": "打工人",
        "count": 3
      },
      {
        "category": "funny",
        "name": "搞笑",
        "count": 4
      },
      {
        "category": "meme",
        "name": "梗文化",
        "count": 2
      }
    ]
  }
}
```

---

## 💡 创意模板参考

```javascript
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

// 猫奴版
{
  id: 19,
  name: '猫奴版',
  template: '{nickname} 走了，主子没人铲屎了。',
  category: 'funny',
  enabled: true,
  sortOrder: 19
}

// 打工人终极版
{
  id: 20,
  name: '打工人终极版',
  template: '{nickname} 下班了，这次是永远的下班。',
  category: 'work',
  enabled: true,
  sortOrder: 20
}
```

---

## ⚠️ 注意事项

### 1. ID 唯一性
- 每个模板的 ID 必须唯一
- 建议从 13 开始递增（1-12 已被占用）

### 2. 默认模板
- 至少保留一个启用的模板
- 默认模板 ID 为 1（标准版）

### 3. 文案规范
- 避免违法、违规内容
- 避免过于负面的内容
- 保持黑色幽默风格

### 4. 性能考虑
- 建议模板总数控制在 50 个以内
- 禁用的模板不会显示给用户

### 5. 修改后重启
- 修改配置文件后，nodemon 会自动重启
- 如果没有自动重启，手动执行：
```bash
cd /home/admin/.openclaw/workspace/projects/alive-check/src/backend
npm run dev
```

---

## 📚 相关文档

- **完整配置指南**: `docs/OBITUARY_TEMPLATES.md`
- **产品需求文档**: `docs/PRD.md`
- **开发指南**: `docs/DEVELOPMENT.md`
- **API 文档**: 查看路由文件 `src/routes/index.js`

---

## 🆘 常见问题

### Q: 添加了模板但不显示？
A: 检查 `enabled` 是否为 `true`，然后重启服务。

### Q: 如何恢复被删除的模板？
A: 从 git 历史恢复，或重新添加。

### Q: 可以支持更多占位符吗？
A: 可以，在 `OBituaryService.generateText()` 方法中添加。

### Q: 如何备份配置？
A: 
```bash
cp src/config/obituaryTemplates.js src/config/obituaryTemplates.js.bak
```

---

## 📞 需要帮助？

查看详细文档或联系开发团队。

**文档位置**: `/home/admin/.openclaw/workspace/projects/alive-check/docs/OBITUARY_TEMPLATES.md`

---

**Happy Coding! 🚀**
