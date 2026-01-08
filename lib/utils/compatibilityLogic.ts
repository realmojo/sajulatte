import { getElementInfo } from './latte';

// Interfaces
export interface ElementData {
  element: string; // WOOD, FIRE...
  label: string;
  color: string;
  meScore: number;
  youScore: number;
}

export interface CompatibilityResult {
  score: number;
  verdict: string;
  keywords: string[];
  description: string;
  elementAnalysis?: string;
  graphData: ElementData[];
  animals?: {
    me: { year: string; day: string };
    you: { year: string; day: string };
  };
  zodiacCompatibility?: string;
  dateAdvice: {
    title: string;
    content: string;
    luckyColor: string;
    luckyPlace: string;
  };
}

// Constants
export const ELEMENT_LABELS: Record<string, string> = {
  WOOD: '목',
  FIRE: '화',
  EARTH: '토',
  METAL: '금',
  WATER: '수',
};

export const ANIMAL_EMOJIS: Record<string, string> = {
  쥐: '🐭',
  소: '🐮',
  호랑이: '🐯',
  토끼: '🐰',
  용: '🐲',
  뱀: '🐍',
  말: '🐴',
  양: '🐑',
  원숭이: '🐵',
  닭: '🐔',
  개: '🐶',
  돼지: '🐷',
};

// --- Advanced Saju Logic Maps ---

// 1. 천간 합 (Good) - 정신적 교감, 강한 끌림 (+20)
const GAN_HAP: Record<string, string> = {
  甲: '己',
  己: '甲',
  乙: '庚',
  庚: '乙',
  丙: '辛',
  辛: '丙',
  丁: '壬',
  壬: '丁',
  戊: '癸',
  癸: '戊',
};

// 2. 천간 충 (Bad) - 가치관 충돌, 스트레스 (-10)
const GAN_CHUNG: Record<string, string[]> = {
  甲: ['庚', '戊'],
  乙: ['辛', '己'],
  丙: ['壬', '庚'],
  丁: ['癸', '辛'],
  戊: ['甲', '壬'],
  己: ['乙', '癸'],
  庚: ['丙', '甲'],
  辛: ['丁', '乙'],
  壬: ['戊', '丙'],
  癸: ['己', '丁'],
};

// 3. 지지 육합 (Good) - 속궁합, 안정감, 결속력 (+20)
const JI_YUK_HAP: Record<string, string> = {
  子: '丑',
  丑: '子',
  寅: '亥',
  亥: '寅',
  卯: '戌',
  戌: '卯',
  辰: '酉',
  酉: '辰',
  巳: '申',
  申: '巳',
  午: '未',
  未: '午',
};

// 4. 지지 충 (Dynamic) - 강한 끌림 but 잦은 다툼, 변화 (-10 ~ -15)
const JI_CHUNG: Record<string, string> = {
  子: '午',
  午: '子',
  丑: '未',
  未: '丑',
  寅: '申',
  申: '寅',
  卯: '酉',
  酉: '卯',
  辰: '戌',
  戌: '辰',
  巳: '亥',
  亥: '巳',
};

// 5. 지지 원진 (Tricky) - 애증, 이유 없는 미움 (-10)
const JI_WONJIN: Record<string, string> = {
  子: '未',
  未: '子',
  丑: '午',
  午: '丑',
  寅: '酉',
  酉: '寅',
  卯: '申',
  申: '卯',
  辰: '亥',
  亥: '辰',
  巳: '戌',
  戌: '巳',
};

// 6. 계절 (월지) 조후
const SEASON_GROUP = {
  SPRING: ['寅', '卯', '辰'],
  SUMMER: ['巳', '午', '未'],
  AUTUMN: ['申', '酉', '戌'],
  WINTER: ['亥', '子', '丑'],
};

const getSeason = (ji: string) => {
  if (SEASON_GROUP.SPRING.includes(ji)) return 'SPRING';
  if (SEASON_GROUP.SUMMER.includes(ji)) return 'SUMMER';
  if (SEASON_GROUP.AUTUMN.includes(ji)) return 'AUTUMN';
  if (SEASON_GROUP.WINTER.includes(ji)) return 'WINTER';
  return '';
};

// 7. 지지 삼합 (Good) - 사회적 합, 강력한 결속 (+15)
const JI_SAM_HAP_GROUPS = [
  ['寅', '午', '戌'], // 화국
  ['巳', '酉', '丑'], // 금국
  ['申', '子', '辰'], // 수국
  ['亥', '卯', '未'], // 목국
];

const checkSamHap = (ji1: string, ji2: string) => {
  return JI_SAM_HAP_GROUPS.some((group) => group.includes(ji1) && group.includes(ji2));
};

// 8. 천간 오행 매핑
const GAN_ELEMENTS: Record<string, string> = {
  甲: 'WOOD',
  乙: 'WOOD',
  丙: 'FIRE',
  丁: 'FIRE',
  戊: 'EARTH',
  己: 'EARTH',
  庚: 'METAL',
  辛: 'METAL',
  壬: 'WATER',
  癸: 'WATER',
};

const SANGSAENG_MAP: Record<string, string> = {
  WOOD: 'FIRE',
  FIRE: 'EARTH',
  EARTH: 'METAL',
  METAL: 'WATER',
  WATER: 'WOOD',
};

// Advanced Compatibility Calculation
export const calculateRealCompatibility = (meSaju: any, youSaju: any): CompatibilityResult => {
  const keywords: string[] = [];
  let score = 50; // 기본 점수

  // 동물 정보 (Year: 띠, Day: 배우자궁/성격)
  const animals = {
    me: { year: meSaju.year.ji.animal, day: meSaju.day.ji.animal },
    you: { year: youSaju.year.ji.animal, day: youSaju.day.ji.animal },
  };

  // --- 1. 데이터 추출 ---
  const meGan = meSaju.meta.ilgan; // 일간 (나의 본원)
  const youGan = youSaju.meta.ilgan; // 상대 일간
  const meJi = meSaju.day.ji.hanja; // 일지 (배우자 궁)
  const youJi = youSaju.day.ji.hanja;
  const meMonth = meSaju.month.ji.hanja; // 월지 (계절/사회궁)
  const youMonth = youSaju.month.ji.hanja;

  // --- 2. 일간(성격/정신) 궁합 (Max +/- 20) ---
  let ganScore = 0;
  // (1) 합/충 체크
  if (GAN_HAP[meGan] === youGan) {
    ganScore += 20;
    keywords.push('천생연분');
    keywords.push('정신적교감');
  } else if (GAN_CHUNG[meGan]?.includes(youGan)) {
    ganScore -= 10;
    keywords.push('티격태격');
  } else {
    // (2) 상생/상극 체크
    const meEl = GAN_ELEMENTS[meGan];
    const youEl = GAN_ELEMENTS[youGan];

    if (SANGSAENG_MAP[meEl] === youEl) {
      ganScore += 10; // 내가 생해줌 (헌신)
      keywords.push('아낌없이주는나무');
    } else if (SANGSAENG_MAP[youEl] === meEl) {
      ganScore += 10; // 생을 받음 (사랑)
      keywords.push('사랑받는관계');
    } else if (meEl === youEl) {
      ganScore += 5; // 친구 같은 (비견)
      keywords.push('친구같은사이');
    } else {
      // 상극 (극하거나 극 당함) - 긴장감
      ganScore -= 5;
      keywords.push('밀당의고수');
    }
  }
  score += ganScore;

  // --- 3. 일지(속궁합/현실) 궁합 (Max +/- 20) ---
  let jiScore = 0;
  if (JI_YUK_HAP[meJi] === youJi) {
    jiScore += 20;
    keywords.push('찰떡궁합');
    keywords.push('안정적관계');
  } else if (checkSamHap(meJi, youJi)) {
    jiScore += 15; // 삼합 (강력한 결속)
    keywords.push('운명적만남');
    keywords.push('떼려야뗄수없는');
  } else if (JI_CHUNG[meJi] === youJi) {
    jiScore -= 15;
    keywords.push('강렬한끌림'); // 충은 강한 끌림이기도 함 (자극적)
    keywords.push('잦은다툼');
  } else if (JI_WONJIN[meJi] === youJi) {
    jiScore -= 10;
    keywords.push('애증의관계');
  } else if (meJi === youJi) {
    jiScore += 5; // 같은 글자
    keywords.push('닮은꼴');
  } else {
    // 무난함
    jiScore += 5;
  }
  score += jiScore;

  // --- 4. 오행 밸런스 (상호 보완) (Max + 20) ---
  const elements = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];

  const extractCounts = (saju: any) => {
    const dist = saju.distributions;
    const result: Record<string, number> = {};
    elements.forEach((el) => {
      // safe extraction
      result[el] = dist[el]?.count || 0;
    });
    return result;
  };

  const meDist = extractCounts(meSaju);
  const youDist = extractCounts(youSaju);

  const getWeakest = (dist: any) => elements.reduce((a, b) => (dist[a] < dist[b] ? a : b));
  const getStrongest = (dist: any) => elements.reduce((a, b) => (dist[a] > dist[b] ? a : b));

  const meWeak = getWeakest(meDist);
  const meStrong = getStrongest(meDist);
  const youWeak = getWeakest(youDist);
  const youStrong = getStrongest(youDist);

  let balanceScore = 0;
  // (1) 상호 보완 (내 약점을 상대가 가짐?)
  if ((meDist[meWeak] || 0) === 0 && (youDist[meWeak] || 0) >= 2) {
    balanceScore += 10;
    keywords.push('나의구원투수');
  }
  if ((youDist[youWeak] || 0) === 0 && (meDist[youWeak] || 0) >= 2) {
    balanceScore += 10;
    if (!keywords.includes('#나의구원투수')) {
      keywords.push('서로에게힘이되는');
    }
  }
  // (2) 과다 충돌 (둘 다 특정 오행이 3개 이상 과다)
  let excessClash = false;
  elements.forEach((el) => {
    if ((meDist[el] || 0) >= 3 && (youDist[el] || 0) >= 3) {
      excessClash = true;
    }
  });
  if (excessClash) {
    balanceScore -= 10;
    keywords.push('자존심대결');
  }

  // (3) 조후(계절) 밸런스 (Max + 10) ---
  const meSeason = getSeason(meMonth);
  const youSeason = getSeason(youMonth);

  let seasonScore = 0;
  if (
    (meSeason === 'SUMMER' && youSeason === 'WINTER') ||
    (meSeason === 'WINTER' && youSeason === 'SUMMER')
  ) {
    seasonScore += 10;
    keywords.push('환상의온도차');
  } else if (meSeason === youSeason) {
    seasonScore += 5;
    keywords.push('친구같은연인');
  }
  score += balanceScore + seasonScore;

  // --- 점수 보정 (Clamp 30 ~ 99) ---
  score = Math.min(99, Math.max(30, score));

  // --- Verdict & Description ---
  let verdict = '';
  if (score >= 90) verdict = '천생연분';
  else if (score >= 80) verdict = '최상의 궁합';
  else if (score >= 70) verdict = '좋은 인연';
  else if (score >= 55) verdict = '무난한 사이';
  else verdict = '노력이 필요해요';

  // 상세 설명 생성 로직
  let description = '';
  if (score >= 85) {
    description =
      '두 분은 서로의 영혼을 채워주는 천생연분입니다. 대화가 잘 통하고 가치관이 비슷하여 함께할수록 시너지가 나는 최고의 파트너입니다.';
  } else if (score >= 70) {
    description =
      '서로 다른 점도 있지만, 그것이 오히려 매력으로 작용하는 좋은 궁합입니다. 서로 존중하며 맞춰간다면 오랫동안 행복할 수 있습니다.';
  } else if (ganScore < 0 || jiScore < 0) {
    description =
      '강한 끌림이 있지만 그만큼 갈등의 요소도 숨어있습니다. 사소한 자존심 싸움을 피하고 서로의 다름을 인정하는 것이 중요합니다.';
  } else {
    description =
      '성향과 가치관의 차이가 뚜렷합니다. 나의 방식만 고집하기보다는 상대방의 입장에서 한 번 더 생각하는 배려심이 관계의 열쇠입니다.';
  }

  // Graph Data (Count based chart)
  const graphData = elements.map((el) => ({
    element: el,
    label: ELEMENT_LABELS[el],
    color: getElementInfo(
      el === 'WOOD'
        ? '甲'
        : el === 'FIRE'
          ? '丙'
          : el === 'EARTH'
            ? '戊'
            : el === 'METAL'
              ? '庚'
              : '壬'
    ).color,
    meScore: meDist[el] || 0,
    youScore: youDist[el] || 0,
  }));

  // Date Advice
  const today = new Date();
  const advIdx = (today.getDate() + score) % 3;
  let dateAdvice;
  if (advIdx === 0) {
    dateAdvice = {
      title: '차분한 힐링 데이트',
      content: '조용한 분위기에서 서로의 이야기에 귀 기울여보세요.',
      luckyColor: '#3b82f6',
      luckyPlace: '조용한 카페, 산책로',
    };
  } else if (advIdx === 1) {
    dateAdvice = {
      title: '에너지 넘치는 액티비티',
      content: '함께 땀 흘리며 스트레스를 날려버리는 데이트가 좋습니다.',
      luckyColor: '#ef4444',
      luckyPlace: '테마파크, 볼링장',
    };
  } else {
    dateAdvice = {
      title: '감성 충전 문화생활',
      content: '영화나 전시회를 보며 새로운 영감을 나누어보세요.',
      luckyColor: '#f59e0b',
      luckyPlace: '영화관, 미술관',
    };
  }

  // Element Analysis Logic (Enhanced)
  const analysisParts = [];

  // 1. Missing Element Complement (가장 중요)
  const myLack = elements.filter((el) => (meDist[el] || 0) === 0);
  const youHave = elements.filter((el) => (youDist[el] || 0) > 0);
  const filledElements = myLack.filter((el) => youHave.includes(el));

  if (filledElements.length > 0) {
    const filledNames = filledElements.map((el) => ELEMENT_LABELS[el]).join(', ');
    analysisParts.push(
      `상대방은 나에게 없는 ${filledNames} 기운을 가지고 있어 나의 부족한 점을 채워줍니다.`
    );
  }

  // 2. Dominant Element Interaction (Sangsaeng/Sanggeuk)
  if (SANGSAENG_MAP[meStrong] === youStrong) {
    analysisParts.push(
      `나의 ${ELEMENT_LABELS[meStrong]} 기운이 상대방의 ${ELEMENT_LABELS[youStrong]} 기운을 생해주는 구조로, 내가 상대를 많이 아껴주고 배려하는 관계입니다.`
    );
  } else if (SANGSAENG_MAP[youStrong] === meStrong) {
    analysisParts.push(
      `상대방의 ${ELEMENT_LABELS[youStrong]} 기운이 나의 ${ELEMENT_LABELS[meStrong]} 기운을 도와주는 구조로, 상대방으로부터 많은 지지와 사랑을 받을 수 있습니다.`
    );
  } else if (meStrong === youStrong) {
    analysisParts.push(
      `두 분 모두 ${ELEMENT_LABELS[meStrong]} 기운이 강하여 성격이나 가치관이 잘 통합니다. 다만, 서로 고집을 부릴 때는 한 발 물러서는 지혜가 필요합니다.`
    );
  } else {
    analysisParts.push(
      `서로 다른 매력을 가진 오행이 만나 새로운 시너지를 냅니다. 서로의 차이를 인정할 때 더욱 발전하는 관계입니다.`
    );
  }

  // 3. Excess Warning (Too much of same element)
  if ((meDist[meStrong] || 0) + (youDist[youStrong] || 0) > 6 && meStrong === youStrong) {
    analysisParts.push(
      `두 분 모두 ${ELEMENT_LABELS[meStrong]} 기운이 너무 강해 부딪칠 수 있으니 주의가 필요합니다.`
    );
  }

  let elementAnalysis = analysisParts.join(' ');

  // --- 5. 띠 궁합 상세 분석 (Year Ji) ---
  const meYearJi = meSaju.year.ji.hanja;
  const youYearJi = youSaju.year.ji.hanja;
  let zodiacCompatibility = '';

  if (JI_YUK_HAP[meYearJi] === youYearJi) {
    zodiacCompatibility = `두 분의 띠는 '육합'의 관계로, 서로를 지지해주고 감싸주는 훌륭한 짝입니다. 숨겨진 내면까지 잘 통하는 사이입니다.`;
  } else if (checkSamHap(meYearJi, youYearJi)) {
    zodiacCompatibility = `두 분의 띠는 '삼합'의 관계로, 함께하면 더 큰 시너지를 내는 발전적인 사이입니다. 사회적으로나 가정적으로나 큰 힘이 됩니다.`;
  } else if (JI_CHUNG[meYearJi] === youYearJi) {
    zodiacCompatibility = `두 분의 띠는 '상충'의 기운이 있어, 가치관이나 성격 차이로 다툼이 일어날 수 있습니다. 서로의 다름을 인정하고 배려하는 노력이 필요합니다.`;
  } else if (JI_WONJIN[meYearJi] === youYearJi) {
    zodiacCompatibility = `두 분의 띠는 '원진'살이 있어, 가끔 이유 없이 미워지거나 오해가 생길 수 있습니다. 솔직한 대화로 오해를 푸는 것이 중요합니다.`;
  } else if (meYearJi === youYearJi) {
    zodiacCompatibility = `두 분은 같은 띠를 가진 동갑내기(혹은 12살 차이)로, 친구처럼 편안하고 서로를 잘 이해할 수 있는 관계입니다.`;
  } else {
    zodiacCompatibility = `두 분의 띠는 특별히 부딪힘 없이 무난하게 어우러지는 관계입니다. 서로 노력하기에 따라 좋은 인연으로 발전할 수 있습니다.`;
  }

  return {
    score,
    verdict,
    keywords: [...new Set(keywords)].slice(0, 4),
    description,
    elementAnalysis,
    graphData,
    dateAdvice,
    animals, // ADDED ANIMALS
    zodiacCompatibility, // ADDED ZODIAC DESC
  };
};
