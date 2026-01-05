const { Solar, Lunar, LunarUtil } = require('lunar-javascript');

// 천간과 지지 데이터 정의
const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEMS_EN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCHES_EN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 오행별 색상 정의 (Tailwind CSS 기준 또는 Hex 코드)
 */
const ELEMENT_COLORS = {
  // WOOD: { name: '목', colorrgba(43, 184, 66, 1)9ff', bgClass: 'bg-green-400' }, // 초록
  WOOD: { name: '목', color: '#2db343ff', bgClass: 'bg-green-400' }, // 초록
  FIRE: { name: '화', color: '#e85555ff', bgClass: 'bg-red-400' }, // 빨강
  EARTH: { name: '토', color: '#df8825ff', bgClass: 'bg-yellow-300' }, // 황토색 (가독성 위해 등색/진한 노랑)
  METAL: { name: '금', color: '#9CA3AF', bgClass: 'bg-white' }, // 회색 (가독성 위해 변경)
  WATER: { name: '수', color: '#0e0e0eff', bgClass: 'bg-blue-500' }, // 파랑/검정
};

/**
 * 12지신 통합 데이터베이스
 */
const ZODIAC_DB = [
  { branchHj: '子', branchKr: '자', animalHj: '鼠', animalKr: '쥐' },
  { branchHj: '丑', branchKr: '축', animalHj: '牛', animalKr: '소' },
  { branchHj: '寅', branchKr: '인', animalHj: '虎', animalKr: '호랑이' },
  { branchHj: '卯', branchKr: '묘', animalHj: '兔', animalKr: '토끼' },
  { branchHj: '辰', branchKr: '진', animalHj: '龙', animalKr: '용' },
  { branchHj: '巳', branchKr: '사', animalHj: '蛇', animalKr: '뱀' },
  { branchHj: '午', branchKr: '오', animalHj: '马', animalKr: '말' },
  { branchHj: '未', branchKr: '미', animalHj: '羊', animalKr: '양' },
  { branchHj: '申', branchKr: '신', animalHj: '猴', animalKr: '원숭이' },
  { branchHj: '酉', branchKr: '유', animalHj: '鸡', animalKr: '닭' },
  { branchHj: '戌', branchKr: '술', animalHj: '狗', animalKr: '개' },
  { branchHj: '亥', branchKr: '해', animalHj: '猪', animalKr: '돼지' },
];

/**
 * 1. 천간/지지 기본 데이터 (오행 및 음양)
 * 음양: 1 (양/+), -1 (음/-)
 */
const GAN_INFO = {
  甲: { elem: 'WOOD', sang: 1 },
  乙: { elem: 'WOOD', sang: -1 },
  丙: { elem: 'FIRE', sang: 1 },
  丁: { elem: 'FIRE', sang: -1 },
  戊: { elem: 'EARTH', sang: 1 },
  己: { elem: 'EARTH', sang: -1 },
  庚: { elem: 'METAL', sang: 1 },
  辛: { elem: 'METAL', sang: -1 },
  壬: { elem: 'WATER', sang: 1 },
  癸: { elem: 'WATER', sang: -1 },
};

const JI_INFO = {
  寅: { elem: 'WOOD', sang: 1 },
  卯: { elem: 'WOOD', sang: -1 },
  巳: { elem: 'FIRE', sang: 1 },
  午: { elem: 'FIRE', sang: -1 }, // 실제 체용 변화 반영
  辰: { elem: 'EARTH', sang: 1 },
  戌: { elem: 'EARTH', sang: 1 },
  丑: { elem: 'EARTH', sang: -1 },
  未: { elem: 'EARTH', sang: -1 },
  申: { elem: 'METAL', sang: 1 },
  酉: { elem: 'METAL', sang: -1 },
  亥: { elem: 'WATER', sang: 1 },
  子: { elem: 'WATER', sang: -1 },
};

// 삼합 기준 지살 시작점
const SAM_HAP_START = {
  亥: '亥',
  卯: '亥',
  未: '亥', // 해묘미 그룹은 '해'부터 지살
  寅: '寅',
  午: '寅',
  戌: '寅', // 인오술 그룹은 '인'부터 지살
  巳: '巳',
  酉: '巳',
  丑: '巳', // 사유축 그룹은 '사'부터 지살
  申: '申',
  子: '申',
  辰: '申', // 신자진 그룹은 '신'부터 지살
};

// 12운성 순서
const WUNSUNG_ORDER = [
  '장생',
  '목욕',
  '관대',
  '건록',
  '제왕',
  '쇠',
  '병',
  '사',
  '묘',
  '절',
  '태',
  '양',
];

/**
 * 수정된 12신살 리스트 (표준 순서: ...겁-재-천)
 */
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
  '재살',
  '천살', // 재살이 10번, 천살이 11번
];

/**
 * 삼합의 시작 지지를 찾는 맵
 */
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

// 십신 계산 함수
const getSipsin = (ilganHanja: string, targetHanja: string, isJi = false) => {
  // if (ilganHanja === targetHanja && !isJi) return '일간';
  const me = GAN_INFO[ilganHanja as keyof typeof GAN_INFO];
  const target = isJi
    ? JI_INFO[targetHanja as keyof typeof JI_INFO]
    : GAN_INFO[targetHanja as keyof typeof GAN_INFO];
  if (!me || !target) return '';

  const order = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];
  const diff = (order.indexOf(target.elem) - order.indexOf(me.elem) + 5) % 5;
  const sameSang = me.sang === target.sang;

  if (diff === 0) return sameSang ? '비견' : '겁재';
  if (diff === 1) return sameSang ? '식신' : '상관';
  if (diff === 2) return sameSang ? '편재' : '정재';
  if (diff === 3) return sameSang ? '편관' : '정관';
  if (diff === 4) return sameSang ? '편인' : '정인';
  return '';
};

/**
 * 글자를 입력받아 오행 정보를 반환하는 함수
 */
const getElementInfo = (char: string) => {
  const map = {
    // 천간
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
    // 지지
    寅: 'WOOD',
    卯: 'WOOD',
    巳: 'FIRE',
    午: 'FIRE',
    辰: 'EARTH',
    戌: 'EARTH',
    丑: 'EARTH',
    未: 'EARTH',
    申: 'METAL',
    酉: 'METAL',
    亥: 'WATER',
    子: 'WATER',
  };

  const elementKey = map[char as keyof typeof map];
  return (
    ELEMENT_COLORS[elementKey as keyof typeof ELEMENT_COLORS] || {
      name: '',
      color: '#E2E8F0',
      bgClass: 'bg-slate-200',
    }
  );
};

/**
 * 지지(Branch) 정보를 바탕으로 동물 정보를 찾아주는 함수
 * @param {string} input - '卯', '묘', 또는 '기묘'와 같은 간지 전체
 */
const getZodiacInfo = (input: string) => {
  if (!input) return null;

  // 1. 입력값이 '경오', '庚午' 처럼 두 글자일 경우 마지막 글자(지지)만 추출
  const target = input.length === 2 ? input[1] : input;

  // 2. DB에서 한자 지지 또는 한글 지지로 검색
  const result = ZODIAC_DB.find((item) => item.branchHj === target || item.branchKr === target);

  if (!result) return null;

  return {
    ...result,
    fullDisplayHj: `${result.branchHj}(${result.animalHj})`, // 卯(兔)
    fullDisplayKr: `${result.branchKr}(${result.animalKr})`, // 묘(토끼)
  };
};

/**
 * 한자 간지(예: '庚午')를 한글(예: '경오')로 변환하는 유틸리티 함수
 */
const convertToKorean = (hanja: string) => {
  if (!hanja || hanja.length !== 2) return hanja;
  const ganHj = hanja[0];
  const zhiHj = hanja[1];

  const ganIdx = STEMS_EN.indexOf(ganHj);
  const zhiIdx = BRANCHES_EN.indexOf(zhiHj);

  return (STEMS[ganIdx] || ganHj) + (BRANCHES[zhiIdx] || zhiHj);
};

/**
 * 한 글자 한자(천간 또는 지지)를 한글로 변환
 */
const convertCharToKorean = (char: string) => {
  const stemIdx = STEMS_EN.indexOf(char);
  if (stemIdx !== -1) return STEMS[stemIdx];

  const branchIdx = BRANCHES_EN.indexOf(char);
  if (branchIdx !== -1) return BRANCHES[branchIdx];

  return char;
};

/**
 * 시간(HH, mm)을 받아 지지 인덱스 반환
 */
const getBranchIndex = (hour: number, minute: number) => {
  const totalMinutes = hour * 60 + minute;
  if (totalMinutes >= 1410 || totalMinutes < 90) return 0;
  return Math.floor((totalMinutes - 90) / 120) + 1;
};

/**
 * 시주(Hour Pillar) 계산 - 한글과 한자를 모두 반환하도록 수정
 */
export const calculateSidu = (dayStemHanja: string, hour: number, minute: number) => {
  const dayStemIdx = STEMS_EN.indexOf(dayStemHanja);
  if (dayStemIdx === -1) throw new Error('올바른 일간을 입력하세요.');

  const branchIdx = getBranchIndex(hour, minute);
  const startStemIdx = ((dayStemIdx % 5) * 2) % 10;
  const hourStemIdx = (startStemIdx + branchIdx) % 10;

  return {
    hanja: STEMS_EN[hourStemIdx] + BRANCHES_EN[branchIdx],
    korean: STEMS[hourStemIdx] + BRANCHES[branchIdx],
  };
};
/**
 * Solar 객체를 JS Date 객체로 변환하는 헬퍼 함수
 */
const solarToJSDate = (solar: any) => {
  return new Date(
    solar.getYear(),
    solar.getMonth() - 1, // JS Date는 월이 0부터 시작
    solar.getDay(),
    solar.getHour(),
    solar.getMinute(),
    solar.getSecond()
  );
};

const calculateDaewunSu = (solar: any, gender: string) => {
  const lunar = solar.getLunar();
  const yearGan = lunar.getYearGan(); // 태어난 해의 천간 (예: '庚')

  // 1. 양의 천간인지 확인
  const yangGans = ['甲', '丙', '戊', '庚', '壬'];
  const isYangYear = yangGans.includes(yearGan);

  // 2. 순행 여부 판별 (양남음녀는 순행)
  let isForward = false;
  if (gender === 'male') {
    isForward = isYangYear; // 남자는 양의 해일 때 순행
  } else if (gender === 'female') {
    isForward = !isYangYear; // 여자는 음의 해일 때 순행
  }

  // 3. 기준 절기 구하기
  const targetJie = isForward ? lunar.getNextJie() : lunar.getPrevJie();
  const targetSolar = targetJie.getSolar();

  // 4. 대운수 계산 (분 단위 차이 이용)
  const birthDate = solarToJSDate(solar);
  const jieDate = solarToJSDate(targetSolar);
  const diffMinutes = Math.abs(jieDate.getTime() - birthDate.getTime()) / (1000 * 60);

  let daewunSu = Math.floor(diffMinutes / 4320);
  if (diffMinutes % 4320 >= 2880) daewunSu += 1;
  if (daewunSu === 0) daewunSu = 1;

  // 결과 반환 (대운수와 방향 정보)
  return {
    daewunSu: daewunSu,
    isForward: isForward,
    directionText: isForward ? '순행' : '역행',
  };
};

/**
 * 천간과 지지를 받아 12운성을 반환하는 함수
 */
const get12Wunsung = (ganHj: string, jiHj: string) => {
  // 각 천간의 장생지 인덱스 (BRANCHES_EN 기준)
  const jangsaengMap = {
    甲: { start: '亥', direction: 1 },
    丙: { start: '寅', direction: 1 },
    戊: { start: '寅', direction: 1 },
    庚: { start: '巳', direction: 1 },
    壬: { start: '申', direction: 1 },
    乙: { start: '午', direction: -1 },
    丁: { start: '酉', direction: -1 },
    己: { start: '酉', direction: -1 },
    辛: { start: '子', direction: -1 },
    癸: { start: '卯', direction: -1 },
  };

  const info = jangsaengMap[ganHj as keyof typeof jangsaengMap];
  if (!info) return '';

  const startIndex = BRANCHES_EN.indexOf(info.start);
  const targetIndex = BRANCHES_EN.indexOf(jiHj);

  let diff;
  if (info.direction === 1) {
    // 양간: 순행 계산
    diff = (targetIndex - startIndex + 12) % 12;
  } else {
    // 음간: 역행 계산
    diff = (startIndex - targetIndex + 12) % 12;
  }

  return WUNSUNG_ORDER[diff];
};

/**
 * 대운수 및 방향 계산 함수
 */
const calculateDaewunInfo = (solar: any, gender: string) => {
  const lunar = solar.getLunar();
  const yearGan = lunar.getYearGan();
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearGan);

  // 순행 판별: 양남음녀(순), 음남양녀(역)
  const isForward = (gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear);

  const targetJie = isForward ? lunar.getNextJie() : lunar.getPrevJie();
  const targetSolar = targetJie.getSolar();

  const birthTime = solarToJSDate(solar).getTime();
  const jieTime = solarToJSDate(targetSolar).getTime();
  const diffMinutes = Math.abs(jieTime - birthTime) / (1000 * 60);

  let daewunSu = Math.floor(diffMinutes / 4320);
  if (diffMinutes % 4320 >= 2880) daewunSu += 1;

  return {
    daewunSu: daewunSu === 0 ? 1 : daewunSu,
    isForward: isForward,
  };
};

// 일간(庚)의 오행 그룹을 찾는 로직 추가
const GAN_ELEMENT_GROUP = {
  甲: '亥',
  乙: '亥', // 목(해묘미)
  丙: '寅',
  丁: '寅', // 화(인오술)
  戊: '寅',
  己: '寅', // 토(화와 같이 인오술로 보거나 앱마다 다름)
  庚: '巳',
  辛: '巳', // 금(사유축) -> '신(申)' 대운 시 망신살 발생
  壬: '申',
  癸: '申', // 수(신자진)
};

/**
 * 12신살 계산 함수
 * @param {string} standardJi - 기준 지지 (예: 년지 '戌')
 * @param {string} targetJi - 대조할 지지 (예: 대운 지지 '亥')
 */
const get12ShinSal = (standardJi: string, targetJi: string) => {
  const startJi = SAM_HAP_MAP[standardJi as keyof typeof SAM_HAP_MAP]; // 삼합의 시작점(지살) 추출
  if (!startJi) return '';

  const startIndex = BRANCHES_EN.indexOf(startJi); // '인'의 인덱스 (2)
  const targetIndex = BRANCHES_EN.indexOf(targetJi); // '해'의 인덱스 (11)

  // 시작점으로부터의 거리 계산 (12진법)
  const diff = (targetIndex - startIndex + 12) % 12;

  return SHIN_SAL_LIST[diff];
};

/**
 * [핵심] 대운 리스트 10단계 생성 함수
 */
const getDaewunList = (
  ilganHj: string,
  eightChar: any,
  siPillar: any,
  daewunSu: number,
  isForward: boolean
) => {
  const daewunList = [];
  const monthGanHj = eightChar.getMonth()[0];
  const yearJiHj = eightChar.getYear()[1];
  const monthJiHj = eightChar.getMonth()[1];
  const dayJiHj = eightChar.getDay()[1];

  console.log(eightChar.getTime());
  // const hourJiHj = eightChar.getHour()[1];

  console.log('eightChar.getMonth()[1]', siPillar.hanja[1]);
  console.log('ilganHj', ilganHj[0]);
  console.log('monthGanHj', monthGanHj);
  console.log('yearJiHj', yearJiHj);
  console.log('monthJiHj', monthJiHj);
  console.log('dayJiHj', dayJiHj);

  let currentGanIdx = STEMS_EN.indexOf(monthGanHj);
  let currentJiIdx = BRANCHES_EN.indexOf(monthJiHj);

  for (let i = 1; i <= 12; i++) {
    // 순행/역행에 따른 인덱스 증감
    if (isForward) {
      currentGanIdx = (currentGanIdx + 1) % 10;
      currentJiIdx = (currentJiIdx + 1) % 12;
    } else {
      currentGanIdx = (currentGanIdx - 1 + 10) % 10;
      currentJiIdx = (currentJiIdx - 1 + 12) % 12;
    }

    const targetGanHj = STEMS_EN[currentGanIdx];
    const targetJiHj = BRANCHES_EN[currentJiIdx];
    const age = daewunSu + (i - 1) * 10;

    daewunList.push({
      age: age,
      gan: {
        hanja: targetGanHj,
        korean: convertCharToKorean(targetGanHj),
        sipsin: getSipsin(ilganHj, targetGanHj, false),
        color: getElementInfo(targetGanHj).color,
        wunsung: get12Wunsung(ilganHj, targetGanHj), // 일간 기준으로 지지의 세기 계산
      },
      ji: {
        hanja: targetJiHj,
        korean: convertCharToKorean(targetJiHj),
        sipsin: getSipsin(ilganHj, targetJiHj, true),
        color: getElementInfo(targetJiHj).color,
        shinsal: [
          get12ShinSal(yearJiHj, targetJiHj),
          get12ShinSal(dayJiHj, targetJiHj),
          get12ShinSal(GAN_ELEMENT_GROUP[ilganHj[0] as keyof typeof GAN_ELEMENT_GROUP], targetJiHj),
        ], // 년지 기준 신살
        wunsung: get12Wunsung(ilganHj, targetJiHj), // 일간 기준으로 지지의 세기 계산
      },
    });
  }
  return daewunList;
};

/**
 * 현재 내가 속한 대운의 시작 연도를 찾는 함수
 */
const getCurrentDaewunStartYear = (birthYear: number, daewunSu: number) => {
  const currentYear = new Date().getFullYear(); // 2026년
  const currentAge = currentYear - birthYear + 1; // 한국 나이 계산

  // 현재 나이보다 작거나 같은 대운 시작 나이 계산
  // 예: 나이 39, 대운수 8 -> Math.floor((39-8)/10)*10 + 8 = 38세
  const startAge = Math.floor((currentAge - daewunSu) / 10) * 10 + daewunSu;

  // 해당 나이가 시작된 연도 계산
  // 예: 1988년생이 38세가 되는 해 -> 1988 + 38 - 1 = 2025년
  const startYear = birthYear + startAge - 1;

  return startYear;
};

/**
 * 특정 연도부터 10년치 세운 리스트를 구하는 함수
 * @param startYear 시작 연도
 * @param ilganHj 일간
 * @param sajuJiHjs 사주 지지 정보
 */
export const getYearList = (startYear: number, ilganHj: string, sajuJiHjs: any) => {
  const list = [];
  for (let i = 0; i < 10; i++) {
    const currentYear = startYear + i;
    list.push(getSewunDetail(currentYear, ilganHj, sajuJiHjs));
  }
  return list;
};

/**
 * 특정 연도의 세운 정보를 구하는 함수
 * @param {number} targetYear - 계산하려는 연도 (예: 2024)
 * @param {string} ilganHj - 내 사주의 일간 (기준)
 * @param {Object} sajuJiHjs - 내 사주의 지지들 (년지, 일지 등)
 */
const getSewunDetail = (targetYear: number, ilganHj: string, sajuJiHjs: any) => {
  // 1. 해당 연도의 중간 지점(6월 15일)으로 설정하여 안전하게 연주 추출
  // (입춘/설날 등 경계 문제 회피)
  const solar = Solar.fromYmd(targetYear, 6, 15);
  const lunar = solar.getLunar();

  // 2. EightChar(만세력)를 통해 입춘 기준 연주 획득
  const eightChar = lunar.getEightChar();
  const yearPillar = eightChar.getYear();
  const yearGanHj = yearPillar[0];
  const yearJiHj = yearPillar[1];

  return {
    year: targetYear,
    hanja: yearGanHj + yearJiHj,
    // 천간 정보
    gan: {
      hanja: yearGanHj,
      korean: convertCharToKorean(yearGanHj),
      sipsin: getSipsin(ilganHj, yearGanHj, false), // 일간 대비 십신
      color: getElementInfo(yearGanHj).color,
    },
    // 지지 정보
    ji: {
      hanja: yearJiHj,
      korean: convertCharToKorean(yearJiHj),
      sipsin: getSipsin(ilganHj, yearJiHj, true), // 일간 대비 십신
      color: getElementInfo(yearJiHj).color,
      wunsung: get12Wunsung(ilganHj, yearJiHj), // 일간 대비 12운성
      // 3줄 신살 (년지, 일지, 월지 기준)
      shinsals: [
        get12ShinSal(sajuJiHjs.yearJi, yearJiHj),
        get12ShinSal(sajuJiHjs.dayJi, yearJiHj),
        get12ShinSal(GAN_ELEMENT_GROUP[ilganHj[0] as keyof typeof GAN_ELEMENT_GROUP], yearJiHj),
      ],
    },
  };
};

/**
 * 특정 연도의 12개월 월운 리스트를 구하는 함수
 * @param {number} targetYear - 계산하려는 연도 (예: 2026)
 * @param {string} ilganHj - 내 사주의 일간
 * @param {Object} sajuJiHjs - 내 사주의 지지들 (연, 월, 일)
 */
export const getMonthList = (targetYear: number, ilganHj: string, sajuJiHjs: any) => {
  const wolwunList: any[] = [];

  // 12달을 시작하는 절기 이름 (입춘부터 소한까지) 및 매핑 키
  const JIES = [
    { name: '소한', key: '小寒' },
    { name: '입춘', key: '立春' },
    { name: '경칩', key: '惊蛰' },
    { name: '청명', key: '清明' },
    { name: '입하', key: '立夏' },
    { name: '망종', key: '芒种' },
    { name: '소서', key: '小暑' },
    { name: '입추', key: '立秋' },
    { name: '백로', key: '白露' },
    { name: '한로', key: '寒露' },
    { name: '입동', key: '立冬' },
    { name: '대설', key: '大雪' },
  ];

  // 1. 해당 연도의 절기 날짜 정보 가져오기
  const baseLunar = Lunar.fromYmd(targetYear, 1, 1);
  const jieQiTable = baseLunar.getJieQiTable();

  JIES.forEach((jie, index) => {
    const jieSolar = jieQiTable[jie.key];
    if (!jieSolar) return;

    // Solar 객체를 Lunar 객체로 변환
    const jieLunar = Lunar.fromSolar(jieSolar);

    const monthGanHj = jieLunar.getMonthGan();
    const monthJiHj = jieLunar.getMonthZhi();

    wolwunList.push({
      month: index + 1,
      jieName: jie.name,
      startDate: jieSolar.toYmd(),
      hanja: monthGanHj + monthJiHj,
      gan: {
        hanja: monthGanHj,
        korean: convertCharToKorean(monthGanHj),
        sipsin: getSipsin(ilganHj, monthGanHj, false),
        color: getElementInfo(monthGanHj).color,
      },
      ji: {
        hanja: monthJiHj,
        korean: convertCharToKorean(monthJiHj),
        sipsin: getSipsin(ilganHj, monthJiHj, true),
        color: getElementInfo(monthJiHj).color,
        wunsung: get12Wunsung(ilganHj, monthJiHj),
        shinsals: [
          get12ShinSal(sajuJiHjs.yearJi, monthJiHj),
          get12ShinSal(sajuJiHjs.dayJi, monthJiHj),
          get12ShinSal(GAN_ELEMENT_GROUP[ilganHj as keyof typeof GAN_ELEMENT_GROUP], monthJiHj),
        ],
      },
    });
  });

  return wolwunList;
};

/**
 * 지장간 데이터 (초기/중기/정기)
 */
const JIJANGAN_MAP = {
  子: ['壬', '', '癸'],
  丑: ['癸', '辛', '己'],
  寅: ['戊', '丙', '甲'],
  卯: ['甲', '', '乙'],
  辰: ['乙', '癸', '戊'],
  巳: ['戊', '庚', '丙'],
  午: ['丙', '己', '丁'],
  未: ['丁', '乙', '己'],
  申: ['戊', '壬', '庚'],
  酉: ['庚', '', '辛'],
  戌: ['辛', '丁', '戊'],
  亥: ['戊', '甲', '壬'],
};

/**
 * 각 기둥(Pillar)의 상세 정보를 생성하는 내부 함수
 */
const getPillarDetail = (
  ilganHanja: string,
  hanjaPillar: string,
  sajuJiHjs: any,
  isHour = false
) => {
  const ganHj = hanjaPillar[0];
  const jiHj = hanjaPillar[1];
  const krPillar = convertToKorean(hanjaPillar);

  // 지장간 포맷팅 (예: 무병갑)
  const jijanganHj = JIJANGAN_MAP[jiHj as keyof typeof JIJANGAN_MAP] || [];
  const jijanganKr = jijanganHj.map((h) => (h ? convertCharToKorean(h) : '')).join('');

  return {
    korean: krPillar,
    hanja: hanjaPillar,
    // 천간(위) 정보
    gan: {
      hanja: ganHj,
      korean: convertCharToKorean(ganHj),
      sipsin: getSipsin(ilganHanja, ganHj, false),
      color: getElementInfo(ganHj)?.color || '#fff',
    },
    // 지지(아래) 정보
    ji: {
      hanja: jiHj,
      korean: convertCharToKorean(jiHj),
      sipsin: getSipsin(ilganHanja, jiHj, true),
      color: getElementInfo(jiHj)?.color || '#fff',
      animal: getZodiacInfo(jiHj)?.animalKr || '',
      animalHj: getZodiacInfo(jiHj)?.animalHj || '',
      jijangan: jijanganKr,
      wunsung: get12Wunsung(ilganHanja, jiHj),
      // 년지 기준 신살 (일반적인 기준)
      shinsal: sajuJiHjs ? get12ShinSal(sajuJiHjs.yearJi, jiHj) : '',
    },
  };
};

// 신강/신약 계산 가중치
const STRENGTH_WEIGHTS = {
  monthJi: 30, // 월지 (등령)
  dayJi: 15, // 일지 (득지)
  hourJi: 15, // 시지 (득시)
  yearJi: 10,
  monthGan: 10,
  hourGan: 10,
  yearGan: 10,
};

const isSupporting = (meElem: string, targetElem: string) => {
  const order = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];
  const meIdx = order.indexOf(meElem);
  const targetIdx = order.indexOf(targetElem);
  const diff = (targetIdx - meIdx + 5) % 5;
  // 0: 비견/겁재 (동일), 4: 인성 (나를 생함) - 4 is -1 mod 5
  return diff === 0 || diff === 4;
};

export const calculateSajuStrength = (
  ilgan: string,
  yearPillar: string[], // [gan, ji]
  monthPillar: string[],
  dayPillar: string[],
  hourPillar: string[]
) => {
  const me = GAN_INFO[ilgan as keyof typeof GAN_INFO];
  if (!me) return null;

  let score = 0;
  let supportCount = 0; // 득세 판단용 (월지/일지/시지 제외한 세력)

  // 1. 월지 (등령 여부)
  const monthJiInfo = JI_INFO[monthPillar[1] as keyof typeof JI_INFO];
  const deukRyeong = isSupporting(me.elem, monthJiInfo.elem);
  if (deukRyeong) score += STRENGTH_WEIGHTS.monthJi;

  // 2. 일지 (득지 여부)
  const dayJiInfo = JI_INFO[dayPillar[1] as keyof typeof JI_INFO];
  const deukJi = isSupporting(me.elem, dayJiInfo.elem);
  if (deukJi) score += STRENGTH_WEIGHTS.dayJi;

  // 3. 시지 (득시 여부)
  const hourJiInfo = JI_INFO[hourPillar[1] as keyof typeof JI_INFO];
  const deukSi = isSupporting(me.elem, hourJiInfo.elem);
  if (deukSi) score += STRENGTH_WEIGHTS.hourJi;

  // 4. 나머지 세력 (득세 여부 판단)
  // 년주 (간/지)
  const yearGanInfo = GAN_INFO[yearPillar[0] as keyof typeof GAN_INFO];
  const yearJiInfo = JI_INFO[yearPillar[1] as keyof typeof JI_INFO];
  if (isSupporting(me.elem, yearGanInfo.elem)) {
    score += STRENGTH_WEIGHTS.yearGan;
    supportCount++;
  }
  if (isSupporting(me.elem, yearJiInfo.elem)) {
    score += STRENGTH_WEIGHTS.yearJi;
    supportCount++;
  }

  // 월간
  const monthGanInfo = GAN_INFO[monthPillar[0] as keyof typeof GAN_INFO];
  if (isSupporting(me.elem, monthGanInfo.elem)) {
    score += STRENGTH_WEIGHTS.monthGan;
    supportCount++;
  }

  // 시간
  const hourGanInfo = GAN_INFO[hourPillar[0] as keyof typeof GAN_INFO];
  if (isSupporting(me.elem, hourGanInfo.elem)) {
    score += STRENGTH_WEIGHTS.hourGan;
    supportCount++;
  }

  // 득세 기준: 주변 세력(년주 전체 + 월간 + 시간 = 총 4글자) 중 2개 이상이 내 편일 때
  const deukSe = supportCount >= 2;

  // 신강/신약 판정 및 분포 비율 (예시 데이터)
  let verdict = '';
  let ratio = 0;

  if (score < 20) {
    verdict = '극약';
    ratio = 3.2;
  } else if (score < 30) {
    verdict = '태약';
    ratio = 8.5;
  } else if (score < 40) {
    verdict = '신약';
    ratio = 16.1;
  } else if (score < 50) {
    verdict = '중화신약';
    ratio = 22.2;
  } else if (score < 60) {
    verdict = '중화신강';
    ratio = 22.2;
  } else if (score < 70) {
    verdict = '신강';
    ratio = 16.1;
  } else if (score < 80) {
    verdict = '태강';
    ratio = 8.5;
  } else {
    verdict = '극왕';
    ratio = 3.2;
  }

  return {
    score,
    verdict,
    ratio,
    flags: { deukRyeong, deukJi, deukSi, deukSe },
  };
};

export const calculateElementDistribution = (
  yearGan: string,
  yearJi: string,
  monthGan: string,
  monthJi: string,
  dayGan: string,
  dayJi: string,
  hourGan: string,
  hourJi: string
) => {
  const counts = {
    WOOD: 0,
    FIRE: 0,
    EARTH: 0,
    METAL: 0,
    WATER: 0,
  };

  const chars = [
    { char: yearGan, type: 'gan' },
    { char: yearJi, type: 'ji' },
    { char: monthGan, type: 'gan' },
    { char: monthJi, type: 'ji' },
    { char: dayGan, type: 'gan' },
    { char: dayJi, type: 'ji' },
    { char: hourGan, type: 'gan' },
    { char: hourJi, type: 'ji' },
  ];

  chars.forEach(({ char, type }) => {
    const info =
      type === 'gan'
        ? GAN_INFO[char as keyof typeof GAN_INFO]
        : JI_INFO[char as keyof typeof JI_INFO];
    if (info) {
      counts[info.elem as keyof typeof counts]++;
    }
  });

  const total = 8;
  const distribution: any = {};
  for (const [key, value] of Object.entries(counts)) {
    distribution[key] = {
      count: value,
      percent: (value / total) * 100,
    };
  }

  return distribution;
};

// 방위 한글 매핑
const DIRECTION_MAP: { [key: string]: string } = {
  East: '동',
  West: '서',
  South: '남',
  North: '북',
  Southeast: '동남',
  Northeast: '동북',
  Southwest: '서남',
  Northwest: '서북',
  正东: '정동',
  正西: '정서',
  正南: '정남',
  正北: '정북',
  东南: '동남',
  东北: '동북',
  西南: '서남',
  西北: '서북',
  中: '중앙',
};

const translateDirection = (dir: string) => {
  return DIRECTION_MAP[dir] || dir;
};

const getExtendedDetails = (lunar: any, eightChar: any) => {
  // 1. 납음 (NaYin)
  const nayin = {
    year: eightChar.getYearNaYin(),
    month: eightChar.getMonthNaYin(),
    day: eightChar.getDayNaYin(),
    hour: eightChar.getTimeNaYin(),
  };

  // 2. 28수 (Xiu)
  const xiu = lunar.getXiu() + '수';

  // 3. 팽조백기 (PengZu)
  const pengzu = {
    gan: lunar.getPengZuGan(),
    zhi: lunar.getPengZuZhi(),
  };

  // 4. 신살 방위 (Positions)
  const positions = {
    xi: translateDirection(lunar.getPositionXiDesc()), // 희신(기쁨)
    fu: translateDirection(lunar.getPositionFuDesc()), // 복신(행운)
    cai: translateDirection(lunar.getPositionCaiDesc()), // 재신(재물)
    yangGui: translateDirection(lunar.getPositionYangGuiDesc()), // 양귀인
    yinGui: translateDirection(lunar.getPositionYinGuiDesc()), // 음귀인
  };

  // 5. 충/살 (Chong/Sha)
  const chong = lunar.getDayChongDesc(); // 예: (甲子)鼠
  const sha = translateDirection(lunar.getDaySha()); // 예: 北

  return { nayin, xiu, pengzu, positions, chong, sha };
};

export const getMyEightSaju = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  gender: string
) => {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const ilganHanja = eightChar.getDayGan(); // 기준점 '庚'
  console.log('ilganHanja', ilganHanja);

  // 사주 지지 정보 미리 추출
  const sajuJiHjs = {
    yearJi: eightChar.getYear()[1],
    monthJi: eightChar.getMonth()[1],
    dayJi: eightChar.getDay()[1],
  };

  // 시주 계산
  // 1. 기본 시주 및 대운 기초 정보 계산
  const siPillar = calculateSidu(ilganHanja, hour, minute);
  const { daewunSu, isForward } = calculateDaewunInfo(solar, gender);

  // 2. 대운 리스트(10단계) 생성
  const daewunList = getDaewunList(ilganHanja, eightChar, siPillar, daewunSu, isForward);

  const startYear = getCurrentDaewunStartYear(year, daewunSu);
  const yearList = getYearList(startYear, ilganHanja, sajuJiHjs);
  const monthList = getMonthList(year, ilganHanja, sajuJiHjs);

  // 신강/신약 계산
  const strength = calculateSajuStrength(
    ilganHanja,
    [eightChar.getYear()[0], eightChar.getYear()[1]],
    [eightChar.getMonth()[0], eightChar.getMonth()[1]],
    [eightChar.getDay()[0], eightChar.getDay()[1]],
    [siPillar.hanja[0], siPillar.hanja[1]]
  );

  // 오행 분포 계산
  const distributions = calculateElementDistribution(
    eightChar.getYear()[0],
    eightChar.getYear()[1],
    eightChar.getMonth()[0],
    eightChar.getMonth()[1],
    eightChar.getDay()[0],
    eightChar.getDay()[1],
    siPillar.hanja[0],
    siPillar.hanja[1]
  );

  // 추가 상세 정보 (납음, 방위 등)
  const details = getExtendedDetails(lunar, eightChar);

  const result = {
    year: getPillarDetail(ilganHanja, eightChar.getYear(), sajuJiHjs),
    month: getPillarDetail(ilganHanja, eightChar.getMonth(), sajuJiHjs),
    day: getPillarDetail(ilganHanja, eightChar.getDay(), sajuJiHjs),
    hour: getPillarDetail(ilganHanja, siPillar.hanja, sajuJiHjs, true),
    meta: {
      ilgan: ilganHanja,
      lunar: `${lunar.getYear()}년 ${lunar.getMonth()}월 ${lunar.getDay()}일`,
      sajuJiHjs: sajuJiHjs,
    },
    strength, // 신강/신약 정보 추가
    distributions, // 오행 분포 추가
    details, // 상세 해석 정보 추가
    lifeList: {
      daewunSu: daewunSu,
      isForward: isForward,
      directionText: isForward ? '순행' : '역행',
      list: daewunList, // 10개 대운 배열
    },
    yearList,
    monthList,
  };

  console.log(result);
  return result;
};

// --- 사용 예시 ---
// const result = calculateSidu('갑', 8, 30); // 갑일 진시(08:30)
// console.log(`시주: ${result.combined}`); // 결과: 무진
