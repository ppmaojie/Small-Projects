# 项目开发指南

> 快速开始开发"还活着么"应用

---

## 📋 前置准备

### 1. 安装依赖

```bash
# 后端
cd src/backend
npm install

# 前端（小程序）
cd src/frontend
npm install
```

### 2. 启动 MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. 配置环境变量

```bash
cd src/backend
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

---

## 🚀 开发流程

### 后端开发

1. **启动开发服务器**
```bash
cd src/backend
npm run dev
```

2. **测试 API**
```bash
# 健康检查
curl http://localhost:3000/health

# 微信登录（模拟）
curl -X POST http://localhost:3000/api/auth/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code": "test123", "nickname": "测试用户"}'
```

3. **查看日志**
```bash
tail -f logs/combined.log
```

### 前端开发（小程序）

1. **安装微信开发者工具**
   - 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2. **导入项目**
   - 打开微信开发者工具
   - 导入项目：选择 `src/frontend` 目录
   - AppID：使用测试号或你的小程序 AppID

3. **编译预览**
   - 点击"编译"按钮
   - 扫码在手机上预览

4. **构建发布**
```bash
cd src/frontend
npm run build:weapp
```

---

## 🧪 测试

### 后端单元测试

```bash
cd src/backend
npm test
```

### API 测试用例

#### 1. 用户登录
```bash
curl -X POST http://localhost:3000/api/auth/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code": "test_code", "nickname": "张三"}'
```

响应：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "nickname": "张三",
    "avatar": ""
  }
}
```

#### 2. 获取存活状态
```bash
curl http://localhost:3000/api/alive/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 3. 签到续命
```bash
curl -X POST http://localhost:3000/api/alive/checkin \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note": "今天也要好好活着"}'
```

#### 4. 邀请联系人
```bash
curl -X POST http://localhost:3000/api/contacts/invite \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"contactUserId": "65f1234567890abcdef67890", "priority": 1}'
```

---

## 📦 部署

### 后端部署（阿里云 ECS）

1. **安装 Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **安装 PM2**
```bash
sudo npm install -g pm2
```

3. **部署代码**
```bash
git clone <your-repo>
cd alive-check/src/backend
npm install --production
```

4. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env
```

5. **启动服务**
```bash
pm2 start src/server.js --name alive-check
pm2 save
pm2 startup
```

6. **配置 Nginx**
```nginx
server {
    listen 80;
    server_name api.alive-check.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 前端部署（小程序）

1. **登录微信小程序后台**
   - https://mp.weixin.qq.com

2. **上传代码**
   - 微信开发者工具 → 上传

3. **提交审核**
   - 填写版本信息
   - 提交审核

4. **发布上线**
   - 审核通过后发布

---

## 🔧 常见问题

### 1. MongoDB 连接失败
```bash
# 检查 MongoDB 是否运行
sudo systemctl status mongod

# 重启 MongoDB
sudo systemctl restart mongod
```

### 2. 端口被占用
```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 3. 小程序无法请求 API
- 检查小程序后台是否配置了合法域名
- 开发阶段可以勾选"不校验合法域名"

---

## 📚 相关文档

- [产品需求文档](../docs/PRD.md)
- [数据库设计](../docs/DB_SCHEMA.md)
- [README](../README.md)

---

## 👥 需要帮助？

遇到问题可以：

1. 查看日志文件 `logs/combined.log`
2. 检查 `.env` 配置是否正确
3. 重启服务 `pm2 restart alive-check`

---

**Good Luck & Have Fun! 🚀**
