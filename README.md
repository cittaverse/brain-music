# Brain Music MVP 🧠🎵

> 用科学设计的音乐训练你的大脑——可量化的认知训练系统

**定位**：Brain.fm 是播放器，Brain Music 是训练器

---

## 快速启动

### 方式 1：直接打开（推荐）
```bash
# 在浏览器中直接打开
open /home/node/.openclaw/workspace/brain-music/index.html
```

### 方式 2：本地服务器
```bash
# Python
cd /home/node/.openclaw/workspace/brain-music
python3 -m http.server 8080

# 或使用 Node
npx serve .
```

然后访问 http://localhost:8080

---

## MVP 功能清单

✅ **已实现**：
- [x] 训练目标选择（6 个卡片：专注/情绪/活力/创意/记忆/睡眠）
- [x] 外链播放（Spotify 歌单）
- [x] 感知打卡（6 题，滑块 + 单选）
- [x] 脑区热力图可视化（8 个脑区激活快照）
- [x] 本地存储（localStorage 保存历史）
- [x] 响应式设计（手机/桌面适配）

⏳ **Phase 2**：
- [ ] 用户系统（登录/注册）
- [ ] AI 训练计划（付费功能）
- [ ] 社交分享卡片
- [ ] 累计画像（≥5 次数据）
- [ ] 多平台歌单（QQ 音乐/Apple Music）

---

## 文件结构

```
brain-music/
├── index.html          # 单页应用入口
├── app.js              # 前端交互逻辑
├── brain-mapping.js    # 脑区映射算法（Node.js 版）
├── data/
│   └── db.json         # 训练目标 + 歌单配置
└── README.md           # 本文件
```

---

## 脑区映射算法

6 个感知问题 → 8 个脑区评分：

| 问题 | 主要影响脑区 |
|------|-------------|
| 身体反应 | 基底节、岛叶 |
| 情绪波动 | 杏仁核、伏隔核 |
| 记忆唤醒 | 海马体 |
| 思维状态 | 前额叶、默认网络 |
| 重复冲动 | 伏隔核 |
| 呼吸与注意 | 岛叶、前额叶 |

详细算法见 `brain-mapping.js`

---

## 部署到生产环境

### Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
cd /home/node/.openclaw/workspace/brain-music
vercel --prod
```

### Netlify
```bash
# 拖拽部署
# 将 brain-music 文件夹拖到 https://app.netlify.com/drop
```

### GitHub Pages
```bash
# 初始化 Git
cd /home/node/.openclaw/workspace/brain-music
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub 后启用 Pages
```

---

## 技术栈

- **前端**：原生 HTML/CSS/JavaScript（零构建依赖）
- **样式**：自定义 CSS 变量 + Flexbox/Grid
- **存储**：localStorage（MVP）→ Supabase/SQLite（生产）
- **部署**：任意静态托管服务

---

## 下一步迭代

1. **接入真实后端**（Supabase）
   - 用户认证
   - 数据持久化
   - 跨设备同步

2. **PWA 支持**
   - 离线可用
   - 添加到主屏幕
   - 推送通知

3. **数据可视化升级**
   - D3.js 热力图
   - 趋势折线图
   - 分享卡片生成

4. **商业化**
   - Stripe 支付集成
   - AI 训练计划生成
   - 订阅制（¥29/月）

---

## 团队

- **Core**：前端 UI + 可视化
- **Hulk**：脑区映射算法 + 数据模型

**交付时间**：2026-03-17 AM

---

## License

MIT © CittaVerse
