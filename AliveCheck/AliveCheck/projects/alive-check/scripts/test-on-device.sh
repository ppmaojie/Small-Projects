#!/bin/bash

# 还活着么 - 真机测试快速启动脚本

echo "🚀 还活着么 - 真机测试环境准备"
echo "================================"

# 1. 检查 MongoDB
echo ""
echo "📦 检查 MongoDB..."
if docker ps | grep -q alive-check-mongo; then
    echo "✅ MongoDB 已运行"
else
    echo "⚠️  MongoDB 未运行，正在启动..."
    docker run -d -p 27017:27017 --name alive-check-mongo mongo:latest
    sleep 3
    echo "✅ MongoDB 已启动"
fi

# 2. 检查后端服务
echo ""
echo "🔧 检查后端服务..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 后端服务已运行"
else
    echo "⚠️  后端服务未运行，正在启动..."
    cd /home/admin/.openclaw/workspace/projects/alive-check/src/backend
    
    # 检查 node_modules
    if [ ! -d "node_modules" ]; then
        echo "📦 安装依赖..."
        npm install
    fi
    
    # 检查 .env
    if [ ! -f ".env" ]; then
        echo "⚙️  创建 .env 文件..."
        cp .env.example .env
    fi
    
    # 启动服务
    echo "🚀 启动后端服务..."
    npm run dev &
    sleep 5
    
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ 后端服务已启动"
    else
        echo "❌ 后端服务启动失败，请检查日志"
        exit 1
    fi
fi

# 3. 获取本机 IP
echo ""
echo "🌐 获取本机 IP 地址..."
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "本机 IP: $LOCAL_IP"

# 4. 显示测试信息
echo ""
echo "================================"
echo "✅ 测试环境准备完成！"
echo "================================"
echo ""
echo "📱 真机测试步骤："
echo ""
echo "1. 打开微信开发者工具"
echo "2. 导入项目："
echo "   /home/admin/.openclaw/workspace/projects/alive-check/src/frontend"
echo ""
echo "3. 修改 app.js 中的 apiBaseUrl 为："
echo "   apiBaseUrl: 'http://$LOCAL_IP:3000'"
echo ""
echo "4. 点击 '编译' 按钮"
echo ""
echo "5. 点击 '预览' 按钮，手机微信扫码"
echo ""
echo "6. 在真机上测试功能"
echo ""
echo "================================"
echo "🔗 API 测试地址："
echo "   http://localhost:3000/health"
echo "   http://localhost:3000/api/templates"
echo "================================"
echo ""
echo "💡 提示：如果手机无法访问，请使用内网穿透工具"
echo "   安装：npm install -g ngrok"
echo "   启动：ngrok http 3000"
echo ""
