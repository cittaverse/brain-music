/**
 * Brain Music - 前端应用逻辑
 */

// 打卡问题定义
const CHECKIN_QUESTIONS = [
  {
    id: 'body_movement',
    text: '听的时候身体有自动动起来吗？',
    type: 'slider',
    labels: ['完全静止', '轻微摆动', '忍不住律动']
  },
  {
    id: 'emotional_response',
    text: '有没有起鸡皮疙瘩、心跳变化或想哭的感觉？',
    type: 'slider',
    labels: ['无感觉', '有些触动', '强烈波动']
  },
  {
    id: 'memory_recall',
    text: '脑中有浮现具体的画面或回忆吗？',
    type: 'slider',
    labels: ['没有', '模糊画面', '清晰回忆']
  },
  {
    id: 'thought_pattern',
    text: '听完后思路更清晰，还是更发散？',
    type: 'radio',
    options: [
      { value: 'focused', label: '更清晰聚焦' },
      { value: 'neutral', label: '没什么变化' },
      { value: 'divergent', label: '更发散跳跃' }
    ]
  },
  {
    id: 'replay_urge',
    text: '想再听一遍吗？',
    type: 'slider',
    labels: ['不想', '无所谓', '很想']
  },
  {
    id: 'breath_attention',
    text: '呼吸和注意力有变化吗？',
    type: 'radio',
    options: [
      { value: 'deeper', label: '呼吸更深，注意稳定' },
      { value: 'neutral', label: '没什么变化' },
      { value: 'faster', label: '呼吸变快，注意分散' }
    ]
  }
];

// 应用状态
let state = {
  currentView: 'targets',
  selectedTarget: null,
  currentQuestion: 0,
  answers: {},
  checkinHistory: [],
  trainingTimer: null,
  trainingStartTime: null,
  trainingDuration: 0
};

// 加载数据
let db = { targets: [], playlists: [] };

async function loadDB() {
  try {
    const response = await fetch('data/db.json');
    db = await response.json();
    
    // 从 localStorage 加载历史
    const saved = localStorage.getItem('brainMusicCheckins');
    if (saved) {
      state.checkinHistory = JSON.parse(saved);
    }
    
    renderTargets();
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// 渲染目标卡片
function renderTargets() {
  const grid = document.getElementById('targetGrid');
  grid.innerHTML = db.targets.map(target => {
    const iconSvg = getTargetIcon(target.target_id);
    return `
      <div class="target-card" data-target="${target.target_id}">
        <div class="target-icon">${iconSvg}</div>
        <div class="target-name">${target.name}</div>
        <div class="target-desc">${target.description}</div>
        <div class="target-duration">${target.recommended_duration}分钟</div>
      </div>
    `;
  }).join('');
  
  // 绑定点击事件
  grid.querySelectorAll('.target-card').forEach(card => {
    card.addEventListener('click', () => selectTarget(card.dataset.target));
  });
}

// 选择目标
function selectTarget(targetId) {
  state.selectedTarget = db.targets.find(t => t.target_id === targetId);
  const playlist = db.playlists.find(p => p.playlist_id === state.selectedTarget.playlist_id);
  
  // 更新播放页面 - 使用 SVG 图标
  const iconSvg = getTargetIcon(state.selectedTarget.target_id);
  document.getElementById('playerTitle').textContent = state.selectedTarget.name;
  
  // 替换播放器图标容器
  const playerIcon = document.querySelector('.player-icon');
  if (playerIcon) {
    playerIcon.innerHTML = iconSvg;
    playerIcon.style.background = 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))';
    playerIcon.style.borderRadius = '50%';
    playerIcon.style.width = '64px';
    playerIcon.style.height = '64px';
    playerIcon.style.margin = '0 auto 20px';
    playerIcon.style.display = 'flex';
    playerIcon.style.alignItems = 'center';
    playerIcon.style.justifyContent = 'center';
    playerIcon.style.padding = '14px';
  }
  
  // 替换播放按钮为内嵌播放器
  const playerContainer = document.getElementById('playerContainer');
  if (playerContainer) {
    playerContainer.innerHTML = `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 12px;">
        <iframe 
          src="${playlist.embed_url}" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;
  }
  
  // 初始化训练进度
  const duration = state.selectedTarget.recommended_duration || 25;
  state.trainingDuration = duration * 60; // 转换为秒
  state.trainingStartTime = Date.now();
  
  // 更新进度显示
  const progressText = document.getElementById('progressText');
  const countdown = document.getElementById('countdown');
  const progressFill = document.getElementById('progressFill');
  const finishBtn = document.getElementById('finishBtn');
  
  if (progressText && countdown && progressFill && finishBtn) {
    progressText.style.display = 'block';
    countdown.textContent = formatTime(state.trainingDuration);
    progressFill.style.width = '0%';
    finishBtn.disabled = true;
  }
  
  // 插入训练引导文案容器
  let guideContainer = document.querySelector('.training-guide');
  if (!guideContainer) {
    guideContainer = document.createElement('div');
    guideContainer.className = 'training-guide fade-in';
    guideContainer.innerHTML = '<div class="training-guide-text"></div>';
    const trainingProgress = document.getElementById('trainingProgress');
    if (trainingProgress) {
      trainingProgress.parentNode.insertBefore(guideContainer, trainingProgress);
    }
  }
  
  // 显示第一条引导文案
  let guideIndex = 0;
  const guideTextEl = guideContainer.querySelector('.training-guide-text');
  if (guideTextEl) {
    guideTextEl.textContent = getGuideByIndex(state.selectedTarget.target_id, guideIndex);
  }
  guideContainer.classList.remove('fade-out');
  guideContainer.classList.add('fade-in');
  
  // 启动倒计时
  if (state.trainingTimer) {
    clearInterval(state.trainingTimer);
  }
  
  let lastGuideSwitch = 0;
  
  state.trainingTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.trainingStartTime) / 1000);
    const remaining = Math.max(0, state.trainingDuration - elapsed);
    const progress = (elapsed / state.trainingDuration) * 100;
    
    // 更新倒计时显示
    if (countdown) {
      countdown.textContent = formatTime(remaining);
    }
    
    // 更新进度条
    if (progressFill) {
      progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
    
    // 每 30 秒切换引导文案
    const currentGuideSlot = Math.floor(elapsed / 30);
    if (currentGuideSlot > lastGuideSwitch) {
      lastGuideSwitch = currentGuideSlot;
      guideIndex++;
      // 淡出 → 切换 → 淡入
      if (guideContainer && guideTextEl) {
        guideContainer.classList.remove('fade-in');
        guideContainer.classList.add('fade-out');
        setTimeout(() => {
          guideTextEl.textContent = getGuideByIndex(state.selectedTarget.target_id, guideIndex);
          guideContainer.classList.remove('fade-out');
          guideContainer.classList.add('fade-in');
        }, 500);
      }
    }
    
    // 解锁按钮（训练完成 50% 后）
    const unlockThreshold = state.trainingDuration * 0.5;
    if (finishBtn && elapsed >= unlockThreshold) {
      finishBtn.disabled = false;
      if (progressText) {
        progressText.innerHTML = '<span style="color: var(--primary);">✓ 可以完成训练</span>';
      }
    }
    
    // 训练结束
    if (remaining <= 0) {
      clearInterval(state.trainingTimer);
      if (finishBtn) {
        finishBtn.disabled = false;
      }
      if (progressText) {
        progressText.innerHTML = '<span style="color: var(--primary);">✓ 训练完成！</span>';
      }
    }
  }, 1000);
  
  switchView('player');
}

// 格式化时间（秒 → MM:SS）
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 切换视图
function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewName}`).classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });
  
  state.currentView = viewName;
  
  if (viewName === 'checkin') {
    renderCheckinForm();
  } else if (viewName === 'result') {
    renderResult();
  } else if (viewName === 'profile') {
    renderProfile();
  }
}

// 渲染打卡表单
function renderCheckinForm() {
  state.currentQuestion = 0;
  state.answers = {};
  
  const form = document.getElementById('checkinForm');
  const dots = document.getElementById('progressDots');
  
  dots.innerHTML = CHECKIN_QUESTIONS.map((_, i) => 
    `<div class="dot ${i === 0 ? 'active' : ''}"></div>`
  ).join('');
  
  renderQuestion(0);
}

function renderQuestion(index) {
  const form = document.getElementById('checkinForm');
  const question = CHECKIN_QUESTIONS[index];
  
  // 更新进度点
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  
  if (question.type === 'slider') {
    form.innerHTML = `
      <div class="checkin-question">
        <div class="question-text">${index + 1}. ${question.text}</div>
        <div class="slider-container">
          <input type="range" class="slider" min="1" max="3" value="2" 
                 data-question="${question.id}">
        </div>
        <div class="slider-labels">
          <span>${question.labels[0]}</span>
          <span>${question.labels[1]}</span>
          <span>${question.labels[2]}</span>
        </div>
      </div>
    `;
  } else {
    form.innerHTML = `
      <div class="checkin-question">
        <div class="question-text">${index + 1}. ${question.text}</div>
        <div class="radio-options">
          ${question.options.map(opt => `
            <label class="radio-option">
              <input type="radio" name="${question.id}" value="${opt.value}">
              <span>${opt.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // 绑定输入事件
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', (e) => {
      state.answers[question.id] = e.target.type === 'radio' 
        ? e.target.value 
        : parseInt(e.target.value);
    });
    // 默认值
    if (input.type === 'range') {
      state.answers[question.id] = 2;
    }
  });
}

// 提交打卡
function submitCheckin() {
  const elapsed = state.trainingStartTime
    ? Math.floor((Date.now() - state.trainingStartTime) / 1000)
    : (state.selectedTarget ? state.selectedTarget.recommended_duration * 60 : 0);
  
  const checkin = {
    id: Date.now(),
    date: new Date().toISOString(),
    targetId: state.selectedTarget.target_id,
    targetName: state.selectedTarget.name,
    durationSeconds: elapsed,
    answers: { ...state.answers }
  };
  
  state.checkinHistory.push(checkin);
  localStorage.setItem('brainMusicCheckins', JSON.stringify(state.checkinHistory));
  
  switchView('result');
}

// 渲染结果
function renderResult() {
  const regionList = document.getElementById('regionList');
  
  // 计算脑区评分
  const scores = calculateBrainScores(state.answers);
  
  // 渲染脑区列表
  const regionNames = {
    prefrontal: { name: '前额叶', function: '专注力与决策' },
    amygdala: { name: '杏仁核', function: '情绪处理' },
    hippocampus: { name: '海马体', function: '记忆编码' },
    basal_ganglia: { name: '基底节', function: '运动与节奏' },
    nucleus_accumbens: { name: '伏隔核', function: '奖赏与愉悦' },
    dmn: { name: '默认网络', function: '内省与创意' },
    acc_insula: { name: '岛叶', function: '身体感知' },
    auditory_cortex: { name: '听觉皮层', function: '声音处理' }
  };
  
  regionList.innerHTML = Object.entries(scores).map(([region, score]) => {
    const info = regionNames[region];
    const percentage = (score / 5) * 100;
    return `
      <div class="region-item">
        <div class="region-info">
          <div class="region-name">${info.name}</div>
          <div class="region-function">${info.function}</div>
        </div>
        <div class="region-score">
          <div class="score-bar">
            <div class="score-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="score-value">${score}</div>
        </div>
      </div>
    `;
  }).join('');
  
  // 更新脑图激活状态
  document.querySelectorAll('.brain-region').forEach(el => {
    const region = el.id.replace('region-', '');
    const score = scores[region] || 0;
    el.classList.toggle('active', score >= 3);
  });
}

// 脑区评分计算（简化版，与后端算法一致）
function calculateBrainScores(answers) {
  const scores = {
    prefrontal: 0,
    amygdala: 0,
    hippocampus: 0,
    basal_ganglia: 0,
    nucleus_accumbens: 0,
    dmn: 0,
    acc_insula: 0,
    auditory_cortex: 0
  };
  
  // Q1: 身体反应 → 基底节、岛叶
  if (answers.body_movement) {
    scores.basal_ganglia += answers.body_movement * 0.8;
    scores.acc_insula += answers.body_movement * 0.6;
  }
  
  // Q2: 情绪波动 → 杏仁核、伏隔核
  if (answers.emotional_response) {
    scores.amygdala += answers.emotional_response * 0.9;
    scores.nucleus_accumbens += answers.emotional_response * 0.7;
  }
  
  // Q3: 记忆唤醒 → 海马体
  if (answers.memory_recall) {
    scores.hippocampus += answers.memory_recall * 0.9;
  }
  
  // Q4: 思维状态 → 前额叶、默认网络
  if (answers.thought_pattern) {
    const patternScore = answers.thought_pattern === 'focused' ? 3 : 
                         answers.thought_pattern === 'divergent' ? 2.5 : 1.5;
    scores.prefrontal += patternScore * 0.8;
    scores.dmn += patternScore * 0.6;
  }
  
  // Q5: 重复冲动 → 伏隔核
  if (answers.replay_urge) {
    scores.nucleus_accumbens += answers.replay_urge * 0.8;
  }
  
  // Q6: 呼吸与注意 → 岛叶、前额叶
  if (answers.breath_attention) {
    const breathScore = answers.breath_attention === 'deeper' ? 3 : 
                        answers.breath_attention === 'faster' ? 1 : 1.5;
    scores.acc_insula += breathScore * 0.7;
    scores.prefrontal += breathScore * 0.6;
  }
  
  // 归一化到 0-5
  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(5, Math.round(scores[key]));
  });
  
  return scores;
}

// 事件绑定
document.getElementById('finishBtn').addEventListener('click', () => {
  switchView('checkin');
});

document.getElementById('submitCheckin').addEventListener('click', () => {
  // 如果有多个问题，需要分页逻辑，这里简化为一次性提交
  submitCheckin();
});

document.getElementById('newSessionBtn').addEventListener('click', () => {
  state.selectedTarget = null;
  switchView('targets');
});

// 导航点击
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const view = item.dataset.view;
    if (view === 'profile') {
      switchView('profile');
    } else if (view === 'result') {
      // 如果有历史数据，显示历史结果
      if (state.checkinHistory.length > 0) {
        state.answers = state.checkinHistory[state.checkinHistory.length - 1].answers;
      }
      switchView('result');
    } else {
      switchView('targets');
    }
  });
});

// 分享按钮
document.getElementById('shareBtn').addEventListener('click', () => {
  const scores = calculateBrainScores(state.answers);
  const totalDays = getTrainingDays();
  const targetName = state.selectedTarget ? state.selectedTarget.name : '脑力训练';
  const targetId = state.selectedTarget ? state.selectedTarget.target_id : 'focus';
  
  generateShareCard({
    targetName: targetName,
    targetId: targetId,
    scores: scores,
    totalDays: totalDays
  }).then(dataUrl => {
    showShareModal(dataUrl);
  });
});

// ========== 累计训练画像渲染 ==========
function renderProfile() {
  const checkins = state.checkinHistory;
  
  // 无数据时显示空状态
  if (checkins.length === 0) {
    const profileView = document.getElementById('view-profile');
    profileView.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="empty-state-text">还没有训练记录</div>
          <div class="empty-state-hint">完成第一次训练后，这里会显示你的训练画像</div>
        </div>
      </div>
    `;
    return;
  }
  
  // 确保 profile 视图结构存在（恢复可能被 empty state 覆盖的结构）
  const profileView = document.getElementById('view-profile');
  if (!profileView.querySelector('.profile-stats')) {
    profileView.innerHTML = `
      <div class="card profile-section">
        <div class="profile-section-title">训练概览</div>
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-value" id="profileTotalDays">0</div>
            <div class="stat-label">训练天数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="profileTotalMinutes">0</div>
            <div class="stat-label">总时长(分)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="profileTotalSessions">0</div>
            <div class="stat-label">训练次数</div>
          </div>
        </div>
      </div>
      <div class="card profile-section">
        <div class="profile-section-title">训练目标分布</div>
        <div class="target-stats-list" id="profileTargetStats"></div>
      </div>
      <div class="card profile-section">
        <div class="profile-section-title">脑区累计评分</div>
        <div id="profileActiveRegion"></div>
        <div class="brain-chart-container">
          <div class="brain-chart" id="profileBrainChart"></div>
        </div>
      </div>
    `;
  }
  
  // 1. 累计训练天数
  const uniqueDays = new Set(checkins.map(c => new Date(c.date).toDateString()));
  const totalDays = uniqueDays.size;
  
  // 2. 累计训练时长（分钟）
  let totalSeconds = 0;
  checkins.forEach(c => {
    if (c.durationSeconds) {
      totalSeconds += c.durationSeconds;
    } else {
      // 兼容旧数据：用目标推荐时长估算
      const target = db.targets.find(t => t.target_id === c.targetId);
      totalSeconds += (target ? target.recommended_duration : 15) * 60;
    }
  });
  const totalMinutes = Math.round(totalSeconds / 60);
  
  // 3. 训练次数
  const totalSessions = checkins.length;
  
  // 更新数字
  const daysEl = document.getElementById('profileTotalDays');
  const minsEl = document.getElementById('profileTotalMinutes');
  const sessEl = document.getElementById('profileTotalSessions');
  if (daysEl) daysEl.textContent = totalDays;
  if (minsEl) minsEl.textContent = totalMinutes;
  if (sessEl) sessEl.textContent = totalSessions;
  
  // 4. 每个训练目标的完成次数
  const targetCounts = {};
  checkins.forEach(c => {
    const tid = c.targetId;
    targetCounts[tid] = (targetCounts[tid] || 0) + 1;
  });
  
  const targetStatsEl = document.getElementById('profileTargetStats');
  if (targetStatsEl) {
    targetStatsEl.innerHTML = Object.entries(targetCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tid, count]) => {
        const target = db.targets.find(t => t.target_id === tid);
        const name = target ? target.name : tid;
        return `<div class="target-stat-chip">${name} <span class="chip-count">${count}次</span></div>`;
      }).join('');
  }
  
  // 5. 脑区累计平均评分
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
  
  const regionTotals = {};
  Object.keys(regionNames).forEach(r => { regionTotals[r] = 0; });
  
  checkins.forEach(c => {
    const scores = calculateBrainScores(c.answers);
    Object.entries(scores).forEach(([region, score]) => {
      regionTotals[region] += score;
    });
  });
  
  const regionAvgs = {};
  Object.keys(regionTotals).forEach(r => {
    regionAvgs[r] = Math.round((regionTotals[r] / checkins.length) * 10) / 10;
  });
  
  // 找最活跃脑区
  let maxRegion = '';
  let maxScore = 0;
  Object.entries(regionAvgs).forEach(([r, s]) => {
    if (s > maxScore) {
      maxScore = s;
      maxRegion = r;
    }
  });
  
  const activeRegionEl = document.getElementById('profileActiveRegion');
  if (activeRegionEl && maxRegion) {
    activeRegionEl.innerHTML = `
      <div class="active-region-tag">
        <svg viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        最活跃脑区：${regionNames[maxRegion]}（均分 ${maxScore}）
      </div>
    `;
  }
  
  // 6. 柱状图
  const chartEl = document.getElementById('profileBrainChart');
  if (chartEl) {
    const maxVal = Math.max(...Object.values(regionAvgs), 1);
    chartEl.innerHTML = Object.entries(regionAvgs).map(([region, avg]) => {
      const barHeight = Math.max(2, (avg / 5) * 100);
      const shortName = regionNames[region].substring(0, 3);
      return `
        <div class="brain-chart-bar">
          <div class="brain-chart-bar-value">${avg}</div>
          <div class="brain-chart-bar-fill" style="height: ${barHeight}px;"></div>
          <div class="brain-chart-bar-label">${shortName}</div>
        </div>
      `;
    }).join('');
  }
}

// 初始化由 HTML 中的 loadDB() 调用触发
