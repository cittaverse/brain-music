/**
 * Brain Music - 脑区映射算法
 * 6 个感知问题 → 8 个脑区评分计算
 */

// 脑区定义
const BRAIN_REGIONS = {
  prefrontal: { name: '前额叶', function: '专注力与决策' },
  amygdala: { name: '杏仁核', function: '情绪处理' },
  hippocampus: { name: '海马体', function: '记忆编码' },
  basal_ganglia: { name: '基底节', function: '运动与节奏' },
  nucleus_accumbens: { name: '伏隔核', function: '奖赏与愉悦' },
  dmn: { name: '默认网络', function: '内省与创意' },
  acc_insula: { name: '岛叶', function: '身体感知' },
  auditory_cortex: { name: '听觉皮层', function: '声音处理' }
};

// 问题到脑区的映射权重
const QUESTION_REGION_MAP = {
  // Q1: 身体反应 → 基底节、岛叶
  body_movement: {
    basal_ganglia: 0.8,
    acc_insula: 0.6
  },
  // Q2: 情绪波动 → 杏仁核、伏隔核
  emotional_response: {
    amygdala: 0.9,
    nucleus_accumbens: 0.7
  },
  // Q3: 记忆唤醒 → 海马体
  memory_recall: {
    hippocampus: 0.9
  },
  // Q4: 思维状态 → 前额叶、默认网络
  thought_pattern: {
    prefrontal: 0.8,
    dmn: 0.6
  },
  // Q5: 重复冲动 → 伏隔核
  replay_urge: {
    nucleus_accumbens: 0.8
  },
  // Q6: 呼吸与注意 → 岛叶、前额叶
  breath_attention: {
    acc_insula: 0.7,
    prefrontal: 0.6
  }
};

/**
 * 将打卡答案转换为脑区评分
 * @param {Object} answers - 6 个问题的答案
 * @returns {Object} 8 个脑区的评分 (0-5)
 */
function calculateBrainScores(answers) {
  const scores = {};
  
  // 初始化所有脑区为 0
  Object.keys(BRAIN_REGIONS).forEach(region => {
    scores[region] = 0;
  });
  
  // 遍历每个问题的答案
  Object.entries(answers).forEach(([question, answer]) => {
    if (answer === null || answer === undefined) return; // 跳过未回答的问题
    
    const regionWeights = QUESTION_REGION_MAP[question];
    if (!regionWeights) return;
    
    // 将答案标准化为 0-1 范围
    let normalizedAnswer;
    if (typeof answer === 'number') {
      normalizedAnswer = answer / 3; // 假设是 1-3 的滑块
    } else if (typeof answer === 'string') {
      // 分类答案映射
      const categoryMap = {
        focused: 1,
        neutral: 0.5,
        divergent: 0.8,
        deeper: 1,
        faster: 0.3
      };
      normalizedAnswer = categoryMap[answer] ?? 0.5;
    } else {
      normalizedAnswer = 0.5;
    }
    
    // 累加到相关脑区
    Object.entries(regionWeights).forEach(([region, weight]) => {
      scores[region] += normalizedAnswer * weight;
    });
  });
  
  // 归一化到 0-5 范围
  Object.keys(scores).forEach(region => {
    scores[region] = Math.min(5, Math.round(scores[region] * 2));
  });
  
  return scores;
}

/**
 * 生成脑区热力图数据
 * @param {Array} checkinRecords - 打卡记录数组
 * @returns {Array} 脑区评分历史
 */
function generateBrainHeatmap(checkinRecords) {
  if (checkinRecords.length === 0) {
    return Object.keys(BRAIN_REGIONS).map(region => ({
      region,
      ...BRAIN_REGIONS[region],
      score: 0,
      trend: 'stable'
    }));
  }
  
  // 计算平均评分
  const avgScores = {};
  Object.keys(BRAIN_REGIONS).forEach(region => {
    avgScores[region] = 0;
  });
  
  checkinRecords.forEach(record => {
    const scores = calculateBrainScores(record.answers);
    Object.entries(scores).forEach(([region, score]) => {
      avgScores[region] += score;
    });
  });
  
  Object.keys(avgScores).forEach(region => {
    avgScores[region] = Math.round(avgScores[region] / checkinRecords.length);
  });
  
  // 计算趋势（简单实现：比较最近 3 次和之前）
  const recentCount = Math.min(3, checkinRecords.length);
  const recentScores = {};
  const previousScores = {};
  
  Object.keys(BRAIN_REGIONS).forEach(region => {
    recentScores[region] = 0;
    previousScores[region] = 0;
  });
  
  checkinRecords.slice(-recentCount).forEach(record => {
    const scores = calculateBrainScores(record.answers);
    Object.entries(scores).forEach(([region, score]) => {
      recentScores[region] += score;
    });
  });
  
  if (checkinRecords.length > recentCount) {
    checkinRecords.slice(0, -recentCount).forEach(record => {
      const scores = calculateBrainScores(record.answers);
      Object.entries(scores).forEach(([region, score]) => {
        previousScores[region] += score;
      });
    });
  }
  
  return Object.keys(BRAIN_REGIONS).map(region => {
    const recentAvg = recentScores[region] / recentCount;
    const previousAvg = checkinRecords.length > recentCount 
      ? previousScores[region] / (checkinRecords.length - recentCount)
      : recentAvg;
    
    let trend = 'stable';
    if (recentAvg > previousAvg + 0.5) trend = 'up';
    if (recentAvg < previousAvg - 0.5) trend = 'down';
    
    return {
      region,
      ...BRAIN_REGIONS[region],
      score: avgScores[region],
      trend
    };
  });
}

module.exports = {
  BRAIN_REGIONS,
  calculateBrainScores,
  generateBrainHeatmap
};
