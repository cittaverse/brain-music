# Brain Music MVP 🚀 启动指南

> **交付时间**: 2026-03-17 AM  
> **状态**: ✅ 已完成，可立即部署

---

## 一、快速启动（3 种方式）

### 方式 1：直接打开（最快，推荐）

**Mac**:
```bash
open /home/node/.openclaw/workspace/brain-music/index.html
```

**Windows**: 双击 `index.html` 文件

**Linux**:
```bash
xdg-open /home/node/.openclaw/workspace/brain-music/index.html
```

---

### 方式 2：本地服务器

```bash
cd /home/node/.openclaw/workspace/brain-music
python3 -m http.server 8080
```

然后访问：**http://localhost:8080**

---

### 方式 3：部署到 Vercel（公开链接）

```bash
cd /home/node/.openclaw/workspace/brain-music
./deploy.sh
```

或手动：
```bash
npm install -g vercel
vercel --prod
```

---

## 二、产品功能清单

| 模块 | 状态 | 说明 |
|------|------|------|
| 🎯 训练目标选择 | ✅ | 6 个卡片（专注/情绪/活力/创意/记忆/睡眠） |
| 🎵 智能歌单 | ✅ | 外链 Spotify 播放（预设 6 个歌单） |
| 📝 感知打卡 | ✅ | 6 维度 30 秒快速表单 |
| 🧠 脑区热力图 | ✅ | 8 脑区激活快照 + 评分条 |
| 💾 本地存储 | ✅ | localStorage 持久化历史数据 |
| 📱 响应式设计 | ✅ | 手机/平板/桌面自适应 |

---

## 三、用户测试流程

**完整流程**（约 3 分钟）：

1. **选择目标** → 点击任意训练目标卡片
2. **播放音乐** → 点击"在 Spotify 播放"按钮
3. **完成打卡** → 点击"完成训练，进入打卡"
4. **回答问题** → 滑动/选择 6 个感知问题
5. **查看结果** → 生成脑区激活热力图
6. **查看历史** → 点击底部导航"我的"查看上次结果

---

## 四、技术架构

```
brain-music/
├── index.html          # 单页应用入口（10KB）
├── app.js              # 前端交互逻辑（10KB）
├── brain-mapping.js    # 脑区映射算法（5KB）
├── data/db.json        # 训练目标 + 歌单配置
├── deploy.sh           # 部署脚本
├── LAUNCH.md           # 本文件
└── README.md           # 详细文档
```

**技术栈**: 原生 HTML/CSS/JavaScript（零构建依赖）

---

## 五、脑区映射算法

**6 个打卡问题 → 8 个脑区评分**：

| 问题 | 主要影响脑区 | 权重 |
|------|-------------|------|
| 身体反应 | 基底节、岛叶 | 0.8, 0.6 |
| 情绪波动 | 杏仁核、伏隔核 | 0.9, 0.7 |
| 记忆唤醒 | 海马体 | 0.9 |
| 思维状态 | 前额叶、默认网络 | 0.8, 0.6 |
| 重复冲动 | 伏隔核 | 0.8 |
| 呼吸与注意 | 岛叶、前额叶 | 0.7, 0.6 |

**评分范围**: 0-5 分（归一化后）

---

## 六、部署选项

| 平台 | 命令 | 时间 | 链接示例 |
|------|------|------|---------|
| **Vercel** | `vercel --prod` | 1 分钟 | `brain-music-xxx.vercel.app` |
| **Netlify** | 拖拽到 netlify.com/drop | 30 秒 | `brain-music-xxx.netlify.app` |
| **GitHub Pages** | 推送后启用 Pages | 2 分钟 | `username.github.io/brain-music` |

**推荐**: Vercel（最快，自动 HTTPS，全球 CDN）

---

## 七、Phase 2 规划

**MVP 之后可迭代**：

- [ ] 用户系统（登录/注册）
- [ ] 多平台歌单（QQ 音乐/Apple Music）
- [ ] 社交分享卡片（生成脑区画像图）
- [ ] AI 训练计划（付费功能）
- [ ] 累计画像（需≥5 次打卡数据）
- [ ] 数据同步（Supabase/SQLite 后端）

---

## 八、常见问题

**Q: 为什么播放的是外链？**  
A: MVP 阶段避免音乐版权问题，使用 Spotify 公开歌单。Phase 2 可接入官方 API。

**Q: 打卡数据存在哪里？**  
A: 浏览器 localStorage，清除缓存会丢失。Phase 2 会接入后端数据库。

**Q: 脑区评分准确吗？**  
A: MVP 使用简化映射算法，用于演示产品概念。正式版本需神经科学专家校准。

---

## 九、团队

- **Core**: 前端 UI + 可视化 + 本地存储
- **Hulk**: 数据模型 + 脑区算法 + Next.js 版本

**交付日期**: 2026-03-17

---

## 十、下一步行动

**V，现在可以**：

1. ✅ **立即测试** → 打开 `index.html`
2. ✅ **部署上线** → 运行 `./deploy.sh`
3. ✅ **收集反馈** → 分享给目标用户测试

**有任何问题，随时在 Discord 找我们。**

---

**License**: MIT © CittaVerse
