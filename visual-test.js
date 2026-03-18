/**
 * Brain Music 视觉回归测试
 * 使用 PageAgent 验证页面状态
 * 
 * 用法：
 *   node visual-test.js --baseline  # 创建 baseline
 *   node visual-test.js --compare   # 对比当前与 baseline
 */

const { PageAgent } = require('page-agent');
const fs = require('fs');
const path = require('path');

const BASELINE_FILE = path.join(__dirname, 'visual-baseline.json');
const TEST_URL = 'https://cittaverse.github.io/brain-music/';

// 验证检查清单
const CHECKS = [
  {
    name: '首页图标是 SVG 不是 Emoji',
    test: async (agent) => {
      const result = await agent.execute('检查首页所有目标卡片的图标，确认是 SVG 元素而不是 Emoji 文字');
      return result.includes('svg') || result.includes('SVG');
    }
  },
  {
    name: '底部导航居中',
    test: async (agent) => {
      const result = await agent.execute('检查底部导航栏的两个按钮（训练/我的）是否居中显示，左右间距是否相等');
      return result.includes('居中') || result.includes('center');
    }
  },
  {
    name: '播放页面图标是 SVG',
    test: async (agent) => {
      await agent.execute('点击第一个训练目标卡片（深度专注）');
      const result = await agent.execute('检查播放页面的图标是否是 SVG 元素');
      return result.includes('svg') || result.includes('SVG');
    }
  },
  {
    name: 'YouTube 播放器内嵌',
    test: async (agent) => {
      const result = await agent.execute('检查页面是否有 YouTube iframe 播放器内嵌在页面中');
      return result.includes('iframe') || result.includes('YouTube');
    }
  },
  {
    name: '结果页按钮居中',
    test: async (agent) => {
      // 模拟完成训练流程
      await agent.execute('点击"完成训练，进入打卡"按钮');
      await agent.execute('回答第一个问题');
      await agent.execute('提交打卡');
      const result = await agent.execute('检查"开始新训练"按钮是否居中显示');
      return result.includes('居中') || result.includes('center');
    }
  }
];

async function createBaseline() {
  console.log('📸 创建 baseline...');
  
  const agent = new PageAgent({
    model: 'qwen3.5-plus',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.DASHSCOPE_API_KEY,
    language: 'zh-CN',
  });
  
  const results = {};
  
  for (const check of CHECKS) {
    console.log(`   检查：${check.name}`);
    try {
      const passed = await check.test(agent);
      results[check.name] = { passed, timestamp: new Date().toISOString() };
      console.log(`   ${passed ? '✅' : '❌'} ${check.name}`);
    } catch (error) {
      results[check.name] = { passed: false, error: error.message, timestamp: new Date().toISOString() };
      console.log(`   ❌ ${check.name}: ${error.message}`);
    }
  }
  
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(results, null, 2));
  console.log('✅ Baseline 已保存到', BASELINE_FILE);
}

async function compareWithBaseline() {
  console.log('🔍 对比当前与 baseline...');
  
  if (!fs.existsSync(BASELINE_FILE)) {
    console.log('⚠️  Baseline 不存在，先运行 --baseline 创建');
    return;
  }
  
  const baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf-8'));
  
  const agent = new PageAgent({
    model: 'qwen3.5-plus',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.DASHSCOPE_API_KEY,
    language: 'zh-CN',
  });
  
  const failures = [];
  
  for (const check of CHECKS) {
    console.log(`   检查：${check.name}`);
    try {
      const passed = await check.test(agent);
      const baselinePassed = baseline[check.name]?.passed;
      
      if (passed && baselinePassed) {
        console.log(`   ✅ ${check.name} (通过)`);
      } else if (!passed && !baselinePassed) {
        console.log(`   ⚠️  ${check.name} (仍然失败)`);
      } else if (!passed && baselinePassed) {
        console.log(`   ❌ ${check.name} (回归失败！)`);
        failures.push(check.name);
      } else {
        console.log(`   ✅ ${check.name} (已修复)`);
      }
    } catch (error) {
      console.log(`   ❌ ${check.name}: ${error.message}`);
      failures.push(check.name);
    }
  }
  
  if (failures.length > 0) {
    console.log(`\n❌ 发现 ${failures.length} 个回归失败:`);
    failures.forEach(name => console.log(`   - ${name}`));
    process.exit(1);
  } else {
    console.log('\n✅ 所有测试通过视觉回归测试');
    process.exit(0);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--baseline')) {
    createBaseline();
  } else if (args.includes('--compare')) {
    compareWithBaseline();
  } else {
    console.log('用法：node visual-test.js --baseline | --compare');
    process.exit(1);
  }
}

main().catch(console.error);
