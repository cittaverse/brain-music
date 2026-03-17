# 🚀 Brain Music MVP 部署说明

## 方式 1：Netlify Drop（推荐，30 秒）

1. 打开 https://app.netlify.com/drop
2. 拖拽 `brain-music` 文件夹（不是压缩包）
3. 等待上传（约 30 秒）
4. 获得公开链接：`brain-music-xxx.netlify.app`

## 方式 2：Vercel（2 分钟）

1. 打开 https://vercel.com/new
2. 登录 GitHub
3. Import Git Repository 或 Deploy from URL
4. 点击 Deploy
5. 获得链接：`brain-music-xxx.vercel.app`

## 本地测试

```bash
cd brain-music
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 部署后检查

- [ ] 页面加载正常
- [ ] 6 个训练目标卡片可点击
- [ ] Spotify 外链可打开
- [ ] 打卡流程完整（6 题）
- [ ] 脑区热力图显示正常
- [ ] 刷新后数据保留
- [ ] 手机端响应式正常

## 发布文案（可直接用）

**朋友圈/微博**：
```
🧠 Brain Music MVP 上线！

不是播放器，是训练器。

6 个训练目标 → Spotify 播放 → 6 题感知打卡 → 8 脑区热力图

30 秒测试你的音乐认知能力 👉 [链接]

#BrainMusic #音乐治疗 #认知训练
```

**邮件标题**：
```
Brain Music MVP 上线 - 30 秒测试你的音乐认知能力
```

---

**准备就绪，随时发布！**
