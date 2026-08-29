# 📱 真机测试完整指南

> 如何在真实手机上测试"还活着么"小程序

**最后更新**: 2026-03-20  
**测试环境**: 开发环境

---

## 🎯 一句话总结

**微信开发者工具 → 导入项目 → 编译 → 预览 → 手机微信扫码**

---

## 📋 测试前准备

### 环境检查

运行快速启动脚本：
```bash
/home/admin/.openclaw/workspace/projects/alive-check/scripts/test-on-device.sh
```

会自动完成：
- ✅ MongoDB 检查
- ✅ 后端服务检查
- ✅ 获取本机 IP

**当前配置**:
- 后端地址：`http://172.19.4.89:3000`
- MongoDB: Docker 运行中
- 服务状态：✅ 正常运行

---

## 🚀 真机测试步骤

### 步骤 1：安装微信开发者工具

**下载地址**: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

选择对应系统：
- Windows
- macOS  
- Linux (测试版)

### 步骤 2：导入项目

1. 打开微信开发者工具
2. 扫码登录（用你的微信）
3. 点击 **"+"** 或 **"导入项目"**
4. 填写项目信息：
   - **项目目录**: 
     ```
     /home/admin/.openclaw/workspace/projects/alive-check/src/frontend
     ```
   - **AppID**: 
     - 选择 **"测试号"**（推荐新手）
     - 或填写已注册的 AppID
   - **项目名称**: 还活着么
   - **模板选择**: 不使用模板

### 步骤 3：配置 API 地址

编辑文件：
```
/home/admin/.openclaw/workspace/projects/alive-check/src/frontend/app.js
```

修改 `apiBaseUrl` 为你的电脑 IP：

```javascript
globalData: {
  token: null,
  userInfo: null,
  apiBaseUrl: 'http://172.19.4.89:3000'  // 改成你的 IP
}
```

**如何获取本机 IP**:
```bash
# Linux
hostname -I

# macOS
ipconfig getifaddr en0

# Windows
ipconfig
```

### 步骤 4：配置开发者工具

在微信开发者工具中：

1. 点击右上角 **"详情"**
2. 选择 **"本地设置"** 标签
3. 勾选：
   - ✅ 不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书
   - ✅ 开启 ES6 转 ES5
   - ✅ 增强编译

### 步骤 5：编译项目

1. 点击顶部工具栏 **"编译"** 按钮（绿色三角形）
2. 等待编译完成（约 5-10 秒）
3. 左侧模拟器会显示小程序界面

**预期效果**:
- 首页显示"你还活着"
- 倒计时正常显示
- 底部 Tab 导航正常

### 步骤 6：真机预览

1. 点击顶部工具栏 **"预览"** 按钮（手机图标）
2. 会生成一个二维码
3. **用手机微信扫描二维码**
4. 手机会提示 "打开小程序？"
5. 点击 **"打开"**
6. 小程序在真机上运行！

---

## ✅ 测试清单

### 基础功能测试

#### 1. 首页 (index)
- [ ] 页面正常显示
- [ ] "你还活着" 标题显示
- [ ] 倒计时数字正常
- [ ] "我还活着 ✅" 按钮可点击
- [ ] 点击后显示"签到成功"提示
- [ ] 连续签到天数更新

#### 2. 墓地页面 (graveyard)
- [ ] 底部 Tab 可切换
- [ ] 墓地列表显示
- [ ] 空状态提示正常
- [ ] 献花按钮可点击
- [ ] 留言功能正常

#### 3. 排行榜页面 (leaderboard)
- [ ] Tab 切换正常（全部/打工人/搞笑/梗文化）
- [ ] 排行榜数据加载
- [ ] 排名图标显示（🥇🥈🥉）

#### 4. 个人中心 (profile)
- [ ] 用户信息显示
- [ ] 统计数据正常
- [ ] 菜单列表显示
- [ ] 退出登录功能

#### 5. 模板选择 (template-select)
- [ ] 页面可打开
- [ ] 分类筛选正常
- [ ] 模板列表显示
- [ ] 预览功能正常
- [ ] 选择模板成功

#### 6. 联系人管理 (contacts)
- [ ] 联系人列表显示
- [ ] 添加联系人弹窗
- [ ] 搜索功能
- [ ] 邀请功能

---

### API 接口测试

在手机上测试以下功能，观察网络请求：

#### 登录接口
```bash
# 在开发者工具 Console 查看
POST /api/auth/wechat-login
```

#### 存活状态
```bash
GET /api/alive/status
```

#### 签到续命
```bash
POST /api/alive/checkin
```

#### 获取模板
```bash
GET /api/templates
```

---

## 🐛 常见问题解决

### Q1: 提示 "不在以下合法域名列表中"

**现象**: 真机提示域名未备案

**解决**:
1. 微信开发者工具 → 详情 → 本地设置
2. ✅ 勾选 "不校验合法域名"
3. 重新编译

### Q2: 扫码后提示 "不是体验成员"

**现象**: 无法打开小程序

**解决**:
1. 登录小程序后台 (mp.weixin.qq.com)
2. 成员管理 → 添加体验成员
3. 添加测试者的微信号
4. 重新扫码

### Q3: 接口请求失败 "request:fail"

**现象**: 网络请求错误

**检查**:
1. 后端服务是否运行：
   ```bash
   curl http://localhost:3000/health
   ```
2. 防火墙是否开放：
   ```bash
   sudo ufw allow 3000/tcp
   ```
3. 手机和电脑是否同一 WiFi
4. API 地址是否填写正确

**解决**: 使用内网穿透工具
```bash
# 安装 ngrok
npm install -g ngrok

# 启动
ngrok http 3000

# 复制生成的地址（如 https://abc123.ngrok.io）
# 修改 app.js 中的 apiBaseUrl
```

### Q4: 图片无法显示

**现象**: 头像显示空白

**解决**:
1. 使用 HTTPS 图片地址
2. 或在小程序后台配置 downloadFile 域名
3. 测试时使用默认头像

### Q5: 页面白屏

**可能原因**:
1. JavaScript 错误
2. 数据加载失败
3. 样式问题

**排查**:
1. 打开开发者工具 Console
2. 查看错误信息
3. 检查网络请求

---

## 📊 调试技巧

### 1. 开启调试模式

在 app.js 中添加：
```javascript
App({
  onLaunch() {
    console.log('还活着么 小程序启动');
    // 开启调试
    wx.setEnableDebug({
      enableDebug: true
    });
  }
});
```

### 2. 查看真机日志

1. 微信开发者工具 → 真机调试
2. 手机扫码
3. Console 会显示真机日志

### 3. 网络监控

1. 微信开发者工具 → 调试器
2. Network 标签
3. 查看所有网络请求

### 4. 性能分析

1. 微信开发者工具 → 性能面板
2. 查看页面加载时间
3. 分析性能瓶颈

---

## 🎯 测试报告模板

测试完成后，记录以下信息：

```markdown
# 真机测试报告

**测试日期**: 2026-03-20
**测试设备**: iPhone 14 Pro / 华为 Mate 50
**微信版本**: 8.0.x
**测试人员**: XXX

## 测试结果

### 基础功能
- [x] 首页 - 通过
- [ ] 墓地 - 发现问题：献花按钮点击无响应
- [x] 排行榜 - 通过
- [x] 个人中心 - 通过
- [x] 模板选择 - 通过
- [x] 联系人管理 - 通过

### 性能表现
- 首页加载：1.2s
- API 响应：平均 200ms
- 页面切换：流畅

### 发现的问题
1. 献花按钮点击无反馈
2. 排行榜数据加载慢

### 建议
1. 添加点击反馈动画
2. 优化排行榜接口
```

---

## 🔄 迭代测试流程

1. **修改代码**
2. **保存文件**（开发者工具自动编译）
3. **手机下拉刷新**小程序
4. **测试新功能**
5. **记录问题**
6. **重复 1-5**

---

## 📞 需要帮助？

### 查看日志
```bash
# 后端日志
tail -f /home/admin/.openclaw/workspace/projects/alive-check/src/backend/logs/combined.log
```

### 重启服务
```bash
# 后端
cd /home/admin/.openclaw/workspace/projects/alive-check/src/backend
npm run dev

# MongoDB
docker restart alive-check-mongo
```

### 查看文档
- 快速开始：`docs/TEMPLATE_QUICKSTART.md`
- 开发指南：`docs/DEVELOPMENT.md`
- API 文档：`src/routes/index.js`

---

**🎉 祝你测试顺利！**

*有问题随时查看文档或联系开发团队*
