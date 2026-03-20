# 数据库 Schema 设计

**数据库**: MongoDB  
**版本**: v1.0

---

## 集合定义

### 1. users (用户表)

```javascript
{
  _id: ObjectId,
  openid: { 
    type: String, 
    unique: true, 
    sparse: true,
    index: true 
  },           // 微信 openid
  phone: { 
    type: String, 
    unique: true, 
    sparse: true,
    index: true 
  },           // 手机号
  nickname: { 
    type: String, 
    required: true,
    maxlength: 32 
  },        // 昵称
  avatar: { 
    type: String, 
    default: '' 
  },          // 头像 URL
  status: {
    type: String,
    enum: ['active', 'banned', 'deleted'],
    default: 'active'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}
```

**索引**:
- `{ openid: 1 }` - 唯一索引
- `{ phone: 1 }` - 唯一索引
- `{ createdAt: -1 }` - 用于查询新用户

---

### 2. alive_records (存活记录表)

```javascript
{
  _id: ObjectId,
  userId: { 
    type: ObjectId, 
    ref: 'users', 
    unique: true,
    index: true 
  },        // 用户 ID
  cycleHours: { 
    type: Number, 
    default: 24,
    min: 1,
    max: 720 
  },   // 存活周期（小时）
  lastCheckin: { 
    type: Date, 
    default: Date.now 
  },   // 最后签到时间
  nextDeadline: { 
    type: Date,
    index: true 
  },      // 下次截止时间
  status: { 
    type: String, 
    enum: ['alive', 'dead'],
    default: 'alive',
    index: true 
  },          // 状态
  consecutiveDays: { 
    type: Number, 
    default: 0 
  }, // 连续签到天数
  totalDeaths: { 
    type: Number, 
    default: 0 
  },     // 总死亡次数
  lastDeathTime: { 
    type: Date 
  },       // 最后死亡时间
  checkinHistory: [{
    date: Date,
    note: String  // 存活感言
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}
```

**索引**:
- `{ userId: 1 }` - 唯一索引
- `{ nextDeadline: 1 }` - 用于定时任务查询即将死亡的用户
- `{ status: 1, nextDeadline: 1 }` - 复合索引，查询已死亡用户
- `{ consecutiveDays: -1 }` - 用于排行榜
- `{ totalDeaths: -1 }` - 用于排行榜

---

### 3. contacts (联系人表)

```javascript
{
  _id: ObjectId,
  userId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  },        // 用户 ID
  contactUserId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  },  // 联系人用户 ID
  priority: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 3 
  },    // 通知优先级 1-3
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending',
    index: true 
  },      // 状态
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}
```

**索引**:
- `{ userId: 1, contactUserId: 1 }` - 唯一复合索引，防止重复绑定
- `{ userId: 1, status: 1 }` - 查询用户的联系人
- `{ contactUserId: 1, status: 1 }` - 查询待确认的邀请

---

### 4. obituaries (讣告表)

```javascript
{
  _id: ObjectId,
  deceasedUserId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  }, // 逝者用户 ID
  templateId: { 
    type: Number, 
    default: 1 
  },       // 讣告模板 ID (1-5)
  customText: { 
    type: String, 
    maxlength: 200 
  },      // 自定义文案
  deathTime: { 
    type: Date, 
    default: Date.now,
    index: true 
  },          // 死亡时间
  notifiedContacts: [{ 
    type: ObjectId, 
    ref: 'users' 
  }], // 已通知的联系人
  resurrectionTime: { 
    type: Date 
  },    // 复活时间（如果已复活）
  shareCount: { 
    type: Number, 
    default: 0 
  },       // 分享次数
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}
```

**索引**:
- `{ deceasedUserId: 1, deathTime: -1 }` - 查询用户的死亡历史
- `{ deathTime: -1 }` - 按死亡时间排序

---

### 5. graveyard_interactions (墓地互动表)

```javascript
{
  _id: ObjectId,
  deceasedUserId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  },  // 逝者用户 ID
  visitorUserId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  },   // 访客用户 ID
  type: { 
    type: String, 
    enum: ['flower', 'message', 'candle'],
    index: true 
  },             // 互动类型
  content: { 
    type: String, 
    maxlength: 200 
  },          // 留言内容
  likes: { 
    type: Number, 
    default: 0 
  },            // 点赞数
  likedBy: [{ 
    type: ObjectId, 
    ref: 'users' 
  }],          // 点赞用户列表
  isPrivate: { 
    type: Boolean, 
    default: false 
  },       // 是否私密
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}
```

**索引**:
- `{ deceasedUserId: 1, createdAt: -1 }` - 查询墓地的互动记录
- `{ visitorUserId: 1 }` - 查询用户的互动历史
- `{ type: 1, likes: -1 }` - 热门留言排行

---

### 6. leaderboards (排行榜表)

```javascript
{
  _id: ObjectId,
  type: { 
    type: String, 
    enum: ['consecutive_days', 'total_deaths', 'best_obituary'],
    index: true 
  },      // 排行榜类型
  userId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  },
  score: { 
    type: Number, 
    default: 0 
  },             // 分数
  week: { 
    type: Number,
    index: true 
  },              // 第几周 (ISO week)
  rank: { 
    type: Number 
  },               // 排名
  year: {
    type: Number,
    index: true
  },               // 年份
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}
```

**索引**:
- `{ type: 1, week: 1, score: -1 }` - 复合索引，快速查询周排行
- `{ type: 1, year: 1, week: 1, rank: 1 }` - 查询特定排行

---

### 7. notifications (通知记录表)

```javascript
{
  _id: ObjectId,
  userId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  },        // 接收通知的用户 ID
  type: { 
    type: String, 
    enum: ['death_alert', 'resurrection', 'flower', 'message', 'system'],
    index: true 
  },
  title: { 
    type: String, 
    required: true 
  },           // 通知标题
  content: { 
    type: String, 
    required: true 
  },         // 通知内容
  isRead: { 
    type: Boolean, 
    default: false,
    index: true 
  },         // 是否已读
  relatedUserId: { 
    type: ObjectId, 
    ref: 'users' 
  },  // 相关用户 ID
  relatedData: { 
    type: Object 
  },      // 相关数据（如讣告 ID）
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}
```

**索引**:
- `{ userId: 1, isRead: 1, createdAt: -1 }` - 查询用户未读通知
- `{ userId: 1, createdAt: -1 }` - 查询用户通知历史

---

### 8. share_logs (分享日志表)

```javascript
{
  _id: ObjectId,
  userId: { 
    type: ObjectId, 
    ref: 'users',
    index: true 
  },        // 分享者用户 ID
  type: { 
    type: String, 
    enum: ['obituary', 'resurrection', 'invite'] 
  },       // 分享类型
  platform: { 
    type: String, 
    enum: ['wechat', 'wechat_moment', 'weibo', 'qq'] 
  },  // 分享平台
  obituaryId: { 
    type: ObjectId, 
    ref: 'obituaries' 
  },  // 关联讣告 ID
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}
```

**索引**:
- `{ userId: 1, createdAt: -1 }` - 查询用户分享历史
- `{ type: 1, createdAt: -1 }` - 统计分享数据

---

## 数据字典

### 讣告模板 (templateId)

| ID | 模板名称 | 模板内容 |
|----|----------|----------|
| 1 | 标准版 | 您关注的好友 [XXX] 已超过 [XX] 小时未签到，系统判定其可能已...节哀。 |
| 2 | 打工人版 | [XXX] 走了，带着没写完的 PPT 走了。 |
| 3 | 社畜版 | [XXX] 终于不用再早起了，愿天堂没有打卡。 |
| 4 | 剁手版 | [XXX] 走了，花呗还没还完。 |
| 5 | 自定义 | 用户自定义文案 |

### 通知类型 (notifications.type)

| 类型 | 说明 | 触发条件 |
|------|------|----------|
| death_alert | 死亡通知 | 用户倒计时归零 |
| resurrection | 复活通知 | 用户复活 |
| flower | 献花通知 | 有人给好友献花 |
| message | 留言通知 | 有人给好友留言 |
| system | 系统通知 | 系统消息 |

---

## 定时任务

### 1. 死亡检测任务 (每 5 分钟执行)

```javascript
// 查询所有已过期但未标记为死亡的用户
db.alive_records.find({
  status: 'alive',
  nextDeadline: { $lte: new Date() }
})
```

### 2. 排行榜更新任务 (每周日凌晨执行)

```javascript
// 更新连续签到排行榜
db.alive_records.aggregate([
  { $match: { status: 'alive' } },
  { $sort: { consecutiveDays: -1 } },
  { $limit: 100 }
])
```

### 3. 数据清理任务 (每月 1 号执行)

```javascript
// 清理 90 天前的分享日志
db.share_logs.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
})
```

---

**文档结束**
