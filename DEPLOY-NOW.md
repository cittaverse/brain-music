# 🚀 Brain Music MVP 部署指南

> **立即部署，明早发布！**

---

## 方式 1：Netlify Drop（最快，30 秒，无需登录）

### 步骤

1. **打开** https://app.netlify.com/drop

2. **拖拽文件夹**
   ```
   /home/node/.openclaw/workspace/brain-music-core-backup-20260316-1850/
   ```
   
   或者直接拖拽这个文件夹里的所有文件

3. **等待上传**（约 30 秒）

4. **获得公开链接**
   - 格式：`brain-music-xxx.netlify.app`
   - 示例：`https://brain-music-abc123.netlify.app`

5. **复制链接，分享给用户测试**

---

## 方式 2：Vercel 网页部署（2 分钟）

### 步骤

1. **打开** https://vercel.com/new

2. **登录 GitHub**
   - 点击 "Continue with GitHub"
   - 授权 Vercel 访问

3. **Import 项目**
   - 点击 "Import Git Repository"
   - 或选择 "Deploy from URL"
   - 上传 `/home/node/.openclaw/workspace/brain-music-core-backup-20260316-1850/` 文件夹

4. **点击 Deploy**

5. **获得公开链接**
   - 格式：`brain-music-xxx.vercel.app`

---

## 本地测试

```bash
cd /home/node/.openclaw/workspace/brain-music-core-backup-20260316-1850
python3 -m http.server 8080
# 访问 http://localhost:8080
```

---

## 部署后检查清单

```
□ 打开公开链接，页面加载正常
□ 选择训练目标（6 个卡片）
□ 点击播放（Spotify 外链可打开）
□ 点击"完成训练，进入打卡"
□ 回答 6 个问题
□ 查看脑区热力图（8 脑区 + 评分）
□ 刷新页面，数据保留（localStorage）
□ 手机浏览器测试响应式
□ 分享链接给用户测试
```

---

## 功能清单

- ✅ 6 训练目标（专注/情绪/创意/能量/睡眠/记忆）
- ✅ Spotify 外链播放
- ✅ 6 题感知打卡
- ✅ 8 脑区热力图
- ✅ localStorage 持久化
- ✅ 响应式设计（手机/桌面）

---

## 常见问题

**Q: Netlify Drop 拖拽后没反应？**
A: 确保拖拽的是文件夹，不是单个文件。或者压缩成 zip 后上传。

**Q: 页面空白？**
A: 打开浏览器控制台（F12）查看错误，通常是文件路径问题。

**Q: 如何自定义域名？**
A: Netlify → Domain Settings → Add custom domain

---

## 联系支持

**Core + Hulk 随时待命**

有问题随时在 Discord 找我们。

---

**🎉 Brain Music MVP 就绪，立即部署！**

**License**: MIT © CittaVerse
