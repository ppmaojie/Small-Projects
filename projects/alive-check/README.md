# 还活着么 (Alive Check)

> 用"死亡焦虑"，治你的拖延症

一款反向签到社交应用，用黑色幽默制造社交传播。

---

## 📖 项目简介

**还活着么** 是一款创新的反向签到应用：

- 用户设置一个存活周期（默认 24 小时）
- 必须在倒计时结束前点击"我还活着"续命
- 超时未签到，系统自动通知好友："XXX 可能已经..."
- 好友可以进入"墓地"献花、留言
- 用户可以"复活"，继续下一轮游戏

**核心亮点**：
- 🎭 黑色幽默 + 社交压力
- 💀 死亡主题包装日常签到
- 🔥 讣告卡片自带病毒传播属性

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- MongoDB >= 6
- Redis >= 6 (可选)

### 安装依赖

```bash
cd src/backend
npm install
```

### 配置环境变量

创建 `.env` 文件：

```env
# 服务配置
PORT=3000
NODE_ENV=development

# 数据库
MONGO_URI=mongodb://localhost:27017/alive-check
REDIS_URI=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 微信（小程序登录）
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret

# 阿里云（OSS + 短信）
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_OSS_BUCKET=alive-check
ALIYUN_OSS_REGION=oss-cn-hangzhou

# 短信
SMS_SIGN_NAME=还活着么
SMS_TEMPLATE_CODE=SMS_123456789

# 日志
LOG_LEVEL=info
```

### 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 健康检查

```bash
curl http://localhost:3000/health
```

---

## 📁 项目结构

```
alive-check/
├── docs/                      # 文档
│   ├── PRD.md                # 产品需求文档
│   └── DB_SCHEMA.md          # 数据库设计
├── src/
│   ├── backend/              # 后端代码
│   │   ├── src/
│   │   │   ├── controllers/  # 控制器
│   │   │   ├── models/       # 数据模型
│   │   │   ├── routes/       # 路由
│   │   │   ├── middleware/   # 中间件
│   │   │   ├── services/     # 服务层
│   │   │   ├── jobs/         # 定时任务
│   │   │   ├── config.js     # 配置
│   │   │   └── server.js     # 入口
│   │   └── package.json
│   └── frontend/             # 前端代码（待开发）
└── README.md
```

---

## 🛠️ API 接口

### 认证

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/auth/wechat-login` | POST | 微信登录 |
| `/api/auth/phone-login` | POST | 手机号登录 |
| `/api/auth/profile` | GET | 获取用户信息 |
| `/api/auth/profile` | PUT | 更新用户信息 |

### 存活

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/alive/status` | GET | 获取存活状态 |
| `/api/alive/checkin` | POST | 签到续命 |
| `/api/alive/cycle` | PUT | 修改存活周期 |

### 联系人

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/contacts/list` | GET | 获取联系人列表 |
| `/api/contacts/invite` | POST | 邀请联系人 |
| `/api/contacts/confirm` | POST | 确认邀请 |
| `/api/contacts/pending` | GET | 获取待确认邀请 |

### 墓地

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/graveyard/list` | GET | 获取墓地列表 |
| `/api/graveyard/flower` | POST | 献花 |
| `/api/graveyard/message` | POST | 留言 |
| `/api/graveyard/like` | POST | 点赞 |

### 排行榜

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/leaderboard/consecutive_days` | GET | 连续签到榜 |
| `/api/leaderboard/total_deaths` | GET | 死亡次数榜 |
| `/api/leaderboard/best_obituary` | GET | 最佳讣告榜 |

---

## 📊 数据模型

### 核心模型

- **User** - 用户
- **AliveRecord** - 存活记录
- **Contact** - 联系人
- **Obituary** - 讣告
- **GraveyardInteraction** - 墓地互动

详细设计见 [DB_SCHEMA.md](docs/DB_SCHEMA.md)

---

## ⏰ 定时任务

| 任务 | 频率 | 描述 |
|------|------|------|
| 死亡检测 | 每 5 分钟 | 检查超时用户，发送讣告通知 |
| 排行榜更新 | 每周日凌晨 | 更新周榜数据 |
| 数据清理 | 每月 1 号 | 清理过期数据 |

---

## 🎯 开发计划

### Phase 1 (Week 1-2): MVP ✅
- [x] 用户登录
- [x] 存活倒计时 + 签到
- [x] 讣告通知
- [x] 基础 API

### Phase 2 (Week 3-4): 社交功能
- [ ] 墓地页面
- [ ] 献花留言
- [ ] 讣告分享
- [ ] 小程序前端

### Phase 3 (Week 5-6): 运营功能
- [ ] 排行榜
- [ ] 徽章系统
- [ ] 数据分析后台

---

## 🧪 测试

```bash
npm test
```

---

## 📝 许可证

MIT

---

## 👥 团队

- 产品/后端：OpenClaw Agent
- 创建日期：2026-03-20

---

**⚠️ 免责声明**：本应用仅供娱乐，所有"死亡"内容均为游戏化设计，请勿当真。
