#!/bin/bash
# Brain Music 部署脚本

echo "🧠 Brain Music 部署脚本"
echo "======================"

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  未检测到 Vercel CLI，正在安装..."
    npm install -g vercel
fi

# 进入项目目录
cd "$(dirname "$0")"

echo ""
echo "📦 开始部署到 Vercel..."
echo ""

# 部署到生产环境
vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "📱 打开方式："
echo "   1. 查看上方输出的 Vercel 链接"
echo "   2. 或在浏览器中直接打开 index.html"
echo ""
