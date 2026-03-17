/**
 * Brain Music - 目标图标映射（SVG）
 */

const TARGET_ICONS = {
  focus: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="6" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
      <line x1="12" y1="2" x2="12" y2="4" stroke="white" stroke-width="2"/>
      <line x1="12" y1="20" x2="12" y2="22" stroke="white" stroke-width="2"/>
      <line x1="2" y1="12" x2="4" y2="12" stroke="white" stroke-width="2"/>
      <line x1="20" y1="12" x2="22" y2="12" stroke="white" stroke-width="2"/>
    </svg>
  `,
  calm: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12C2 12 5 8 9 8C13 8 13 12 17 12C21 12 22 8 22 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M2 16C2 16 5 12 9 12C13 12 13 16 17 16C21 16 22 12 22 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M2 20C2 20 5 16 9 16C13 16 13 20 17 20C21 20 22 16 22 16" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  energy: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,
  creative: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L6 21L3 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 3L8 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 3L16 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="15" r="3" fill="white"/>
    </svg>
  `,
  memory: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="white" stroke-width="2" fill="none"/>
      <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  sleep: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="white" stroke-width="2" fill="none"/>
    </svg>
  `
};

// 导出函数
function getTargetIcon(targetId) {
  return TARGET_ICONS[targetId] || TARGET_ICONS.focus;
}
