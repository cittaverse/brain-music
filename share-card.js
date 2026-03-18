/**
 * Brain Music - 分享卡片生成
 * 使用 Canvas 绘制训练成果分享图
 */

/**
 * 生成分享卡片
 * @param {Object} options
 * @param {string} options.targetName - 训练目标名称
 * @param {string} options.targetId - 训练目标 ID
 * @param {Object} options.scores - 8 脑区评分对象
 * @param {number} options.totalDays - 累计训练天数
 * @returns {Promise<string>} 图片的 data URL
 */
function generateShareCard(options) {
  return new Promise((resolve) => {
    const { targetName, targetId, scores, totalDays } = options;
    
    const dpr = window.devicePixelRatio || 2;
    const width = 375;
    const height = 560;
    
    const canvas = document.createElement('canvas');
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // 背景渐变
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1a1a2e');
    bgGrad.addColorStop(0.5, '#16213e');
    bgGrad.addColorStop(1, '#0f3460');
    ctx.fillStyle = bgGrad;
    roundRect(ctx, 0, 0, width, height, 24);
    ctx.fill();
    
    // 装饰圆环
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width - 40, 60, 80, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(40, height - 80, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Logo 区域
    const logoY = 40;
    
    // Logo 圆形背景
    const logoGrad = ctx.createLinearGradient(width / 2 - 16, logoY - 4, width / 2 + 16, logoY + 28);
    logoGrad.addColorStop(0, '#8b5cf6');
    logoGrad.addColorStop(1, '#6366f1');
    ctx.fillStyle = logoGrad;
    ctx.beginPath();
    ctx.arc(width / 2 - 52, logoY + 12, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Logo 音波线条
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const baseY = logoY + 6 + i * 5;
      ctx.moveTo(width / 2 - 60, baseY);
      ctx.quadraticCurveTo(width / 2 - 52, baseY - 3, width / 2 - 44, baseY);
      ctx.stroke();
    }
    
    // Logo 文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Brain Music', width / 2 + 10, logoY + 18);
    
    // 分割线
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32, logoY + 40);
    ctx.lineTo(width - 32, logoY + 40);
    ctx.stroke();
    
    // 训练目标
    const targetY = logoY + 72;
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
    roundRect(ctx, 32, targetY - 8, width - 64, 40, 20);
    ctx.fill();
    
    ctx.fillStyle = '#c4b5fd';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('本次训练：' + targetName, width / 2, targetY + 18);
    
    // 脑区评分柱状图
    const chartY = targetY + 60;
    const chartHeight = 160;
    const regionNames = {
      prefrontal: '前额叶',
      amygdala: '杏仁核',
      hippocampus: '海马体',
      basal_ganglia: '基底节',
      nucleus_accumbens: '伏隔核',
      dmn: '默认网络',
      acc_insula: '岛叶',
      auditory_cortex: '听觉皮层'
    };
    
    const regions = Object.entries(scores);
    const barWidth = 28;
    const gap = (width - 64 - barWidth * regions.length) / (regions.length - 1);
    const startX = 32;
    const maxBarHeight = chartHeight - 40;
    
    // 图表标题
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('脑区激活评分', width / 2, chartY - 8);
    
    // 网格线
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = chartY + chartHeight - 30 - (i / 5) * maxBarHeight;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(width - 32, y);
      ctx.stroke();
    }
    
    regions.forEach(([region, score], i) => {
      const x = startX + i * (barWidth + gap);
      const barHeight = (score / 5) * maxBarHeight;
      const barY = chartY + chartHeight - 30 - barHeight;
      
      // 柱状图渐变
      const barGrad = ctx.createLinearGradient(x, barY, x, chartY + chartHeight - 30);
      const hue = 250 + (i * 15);
      barGrad.addColorStop(0, `hsla(${hue}, 80%, 65%, 0.9)`);
      barGrad.addColorStop(1, `hsla(${hue}, 80%, 45%, 0.6)`);
      ctx.fillStyle = barGrad;
      roundRect(ctx, x, barY, barWidth, barHeight, 4);
      ctx.fill();
      
      // 评分数字
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(score.toString(), x + barWidth / 2, barY - 6);
      
      // 脑区名称（竖排缩写）
      ctx.fillStyle = '#8b8b9a';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const shortName = (regionNames[region] || region).substring(0, 3);
      ctx.fillText(shortName, x + barWidth / 2, chartY + chartHeight - 12);
    });
    
    // 训练天数
    const daysY = chartY + chartHeight + 28;
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('我在 Brain Music 训练了 ' + totalDays + ' 天', width / 2, daysY);
    
    // 底部信息
    const footerY = height - 60;
    
    // 链接背景
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 32, footerY - 8, width - 64, 44, 12);
    ctx.fill();
    
    ctx.fillStyle = '#8b8b9a';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('扫码或访问开始你的脑力训练', width / 2, footerY + 10);
    
    ctx.fillStyle = '#c4b5fd';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('cittaverse.github.io/brain-music', width / 2, footerY + 28);
    
    resolve(canvas.toDataURL('image/png'));
  });
}

/**
 * 绘制圆角矩形
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * 显示分享卡片弹窗
 * @param {string} dataUrl - 图片的 data URL
 */
function showShareModal(dataUrl) {
  // 移除已有弹窗
  const existing = document.getElementById('shareModal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'shareModal';
  modal.className = 'share-modal';
  modal.innerHTML = `
    <div class="share-modal-backdrop"></div>
    <div class="share-modal-content">
      <div class="share-modal-header">
        <span class="share-modal-title">分享训练成果</span>
        <button class="share-modal-close" id="shareModalClose">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="share-modal-body">
        <img src="${dataUrl}" alt="训练成果卡片" class="share-card-image" />
        <p class="share-tip">长按图片保存到相册</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 动画入场
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  
  // 关闭事件
  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  };
  
  modal.querySelector('.share-modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('#shareModalClose').addEventListener('click', closeModal);
}

/**
 * 获取累计训练天数
 * @returns {number}
 */
function getTrainingDays() {
  const saved = localStorage.getItem('brainMusicCheckins');
  if (!saved) return 0;
  const checkins = JSON.parse(saved);
  const uniqueDays = new Set(checkins.map(c => new Date(c.date).toDateString()));
  return uniqueDays.size;
}
