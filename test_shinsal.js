const SHIN_SAL_LIST = [
  '지살',
  '년살',
  '월살',
  '망신살',
  '장성살',
  '반안살',
  '역마살',
  '육해살',
  '화개살',
  '겁살',
  '천살',
  '재살',
];

const SAM_HAP_MAP = {
  寅: '寅',
  午: '寅',
  戌: '寅',
  申: '申',
  子: '申',
  辰: '申',
  巳: '巳',
  酉: '巳',
  丑: '巳',
  亥: '亥',
  卯: '亥',
  未: '亥',
};

const BRANCHES_EN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// get12ShinSal function from latte.ts
const get12ShinSal = (standardJi, targetJi) => {
  const startJi = SAM_HAP_MAP[standardJi]; // 삼합의 시작점(지살) 추출
  if (!startJi) return '';

  const startIndex = BRANCHES_EN.indexOf(startJi);
  const targetIndex = BRANCHES_EN.indexOf(targetJi);

  // 시작점으로부터의 거리 계산 (12진법)
  const diff = (targetIndex - startIndex + 12) % 12;

  return SHIN_SAL_LIST[diff];
};

// 1988(무진), YearJi = '辰' (Dragon), MonthJi = '未', DayJi = '午'
// Target Ji = '亥' (The input for checking)

const yearJi = '辰'; // Dragon
const monthJi = '未'; // Sheep
const dayJi = '午'; // Horse
const targetJi = '亥'; // Pig - This is the Ji of the Daewun we are checking

console.log('Year Ji (Jin):', yearJi);
console.log('Month Ji (Mi):', monthJi);
console.log('Day Ji (Wu):', dayJi);
console.log('Target Ji (Hai):', targetJi);

console.log('--- Calculation ---');
console.log('Year-based (Jin -> Hai):', get12ShinSal(yearJi, targetJi)); // Expected: 망신살?
console.log('Day-based (Wu -> Hai):', get12ShinSal(dayJi, targetJi)); // Expected: 겁살?
console.log('Month-based (Mi -> Hai):', get12ShinSal(monthJi, targetJi)); // Expected: 지살?
