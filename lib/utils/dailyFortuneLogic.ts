import { Solar } from 'lunar-javascript';

// --- Constants ---
const STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEMS_EN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCHES_EN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 오행 (Wood, Fire, Earth, Metal, Water)
const ELEMENTS: Record<string, string> = {
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
  子: 'WATER',
  丑: 'EARTH',
  寅: 'WOOD',
  卯: 'WOOD',
  辰: 'EARTH',
  巳: 'FIRE',
  午: 'FIRE',
  未: 'EARTH',
  申: 'METAL',
  酉: 'METAL',
  戌: 'EARTH',
  亥: 'WATER',
};

// 십성 (Ten Gods) Mapping
const SIPSIN_NAMES = [
  '비견', // 0
  '겁재', // 1
  '식신', // 2
  '상관', // 3
  '편재', // 4
  '정재', // 5
  '편관', // 6
  '정관', // 7
  '편인', // 8
  '정인', // 9
];

// 지지(Ji) Relationships
const JI_HAP = {
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

const JI_CHUNG = {
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

const JI_WONJIN = {
  子: '未',
  丑: '午',
  寅: '酉',
  卯: '申',
  辰: '亥',
  巳: '戌',
  午: '丑',
  未: '子',
  申: '卯',
  酉: '寅',
  戌: '巳',
  亥: '辰',
};

// 형(刑) - Punishment (Partial list for mental/emotional stress)
// 인사신, 축술미, 자형(진진, 오오, 유유, 해해), 자묘
const JI_HYEONG_SET = new Set([
  '寅巳',
  '巳申',
  '申寅', // In-Sa-Shin
  '丑戌',
  '戌未',
  '未丑', // Chuk-Sul-Mi
  '子卯', // Ja-Myo
  '辰辰',
  '午午',
  '酉酉',
  '亥亥', // Ja-Hyeong
]);

const JI_PA = {
  子: '酉',
  酉: '子',
  丑: '辰',
  辰: '丑',
  寅: '亥',
  亥: '寅', // Hap & Pa
  卯: '午',
  午: '卯',
  巳: '申',
  申: '巳', // Hap & Pa
  未: '戌',
  戌: '未',
};

// --- Text Databases (Rich Content) ---
const TEXT_DB = {
  summary: {
    HAP: [
      "오늘은 '육합(六合)'이 들어와 나와 세상이 다정하게 손을 잡는 날입니다. 막혔던 일이 마법처럼 풀리고, 누군가 먼저 손을 내밀어 줄 것입니다. 이런 날에는 집에만 있기 아깝습니다.",
      "마음이 호수처럼 잔잔하고 평화로워지는 '합(合)'의 날입니다. 무엇을 하든 순조롭고, 기대 이상의 성과를 얻을 수 있습니다. 중요한 결정을 내리거나 타인과 협력하기에 최고의 타이밍입니다.",
      '하늘과 땅이 나를 돕는 기분 좋은 하루입니다. 오해가 풀리고 화해의 무드가 조성되니, 껄끄러웠던 관계를 회복하거나 새로운 인연을 시작하기에 더없이 좋은 날입니다.',
    ],
    CHUNG: [
      "오늘은 '충(沖)'의 기운으로 인해 변화와 변동이 심한 롤러코스터 같은 날입니다. 예상치 못한 돌발 상황에 당황할 수 있으니, 계획을 융통성 있게 수정할 준비를 하세요. 움직임이 많은 것이 오히려 득이 될 수도 있습니다.",
      '기존의 틀이 깨지고 새로운 국면을 맞이하는 날입니다. 변화가 두렵겠지만, 오히려 묵은 것을 정리하고 새출발하는 기회로 삼으세요. 다만 교통안전과 언행에는 각별한 주의가 필요합니다.',
      '부딪히고 깨지는 소리가 들리는 듯한 하루입니다. 의욕이 앞서 다툼이 생기거나 실수를 할 수 있습니다. 오늘은 잠시 멈춰 서서 숨을 고르고, 한 박자 늦게 반응하는 것이 지혜입니다.',
    ],
    WONJIN: [
      "이유 없이 마음이 울적하거나 상대방이 미워 보이는 '원진(怨嗔)'의 날입니다. 감정 기복이 심해질 수 있으니 오늘만큼은 감정적인 결정을 미루세요. 혼자만의 시간을 가지며 내면을 돌보는 것이 상책입니다.",
      '괜한 오해로 사이가 서먹해질 수 있는 예민한 날입니다. 작은 말실수가 가시가 되어 돌아올 수 있으니 침묵이 금입니다. 좋아하는 음악을 듣거나 산책을 하며 멘탈을 관리하세요.',
    ],
    HYEONG: [
      "뭔가 꽉 막힌 듯 답답하고 조정이 필요한 '형(刑)'살이 들어온 날입니다. 내 뜻대로 일이 진행되지 않아 스트레스를 받을 수 있습니다. 억지로 밀어붙이기보다는 잠시 물러나 상황을 관조하는 여유가 필요합니다.",
      '수술이나 시술, 혹은 무언가를 뜯어고치기에 좋은 날입니다. 하지만 인간관계에서는 자존심 대립으로 상처를 주고받을 수 있으니 양보하는 미덕이 필요합니다.',
    ],
    NORMAL_GOOD: [
      '맑게 갠 하늘처럼 상쾌하고 기운찬 하루입니다. 당신의 긍정적인 에너지가 주변 사람들까지 밝게 만듭니다. 오늘 당신이 흘린 땀방울은 반드시 달콤한 열매가 되어 돌아올 것입니다.',
      '순풍에 돛을 단 배처럼 매사가 순조로운 날입니다. 특별한 행운은 없더라도 평범함 속에서 소소한 행복을 찾을 수 있습니다. 오늘 당신의 미소는 최고의 무기입니다.',
    ],
    NORMAL_SOSO: [
      '특별한 일 없이 무난하게 흘러가는 하루입니다. 지루하게 느껴질 수도 있지만, 평온함이야말로 가장 큰 축복입니다. 일상의 소중함을 느끼며 차분하게 오늘 할 일을 마무리하세요.',
      '조금은 느리게 걷고 싶은 날입니다. 급하게 서두르면 체하니 천천히 여유를 즐기세요. 오늘은 나를 위한 작은 휴식과 보상이 필요한 하루입니다.',
    ],
  },
  love: {
    MEN: [
      '이성운이 활짝 열렸습니다! 마음에 드는 사람에게 용기 내어 다가가 보세요. 당신의 유머와 재치가 빛을 발하는 날입니다.',
      '오늘은 당신이 주인공입니다. 썸 타는 관계라면 확실한 시그널을 보내도 좋습니다. 다만, 너무 가벼워 보이지 않도록 진심을 담아 표현하세요.',
    ],
    WOMEN: [
      '도화살이 비치니 어디서든 시선을 받는 날입니다. 평소보다 조금 더 멋을 부려봐도 좋습니다. 뜻밖의 설렘이 찾아올 수 있어요.',
      '사랑받고 싶은 욕구가 커지는 날입니다. 연인에게 애교를 부려보거나 솔직한 마음을 표현해보세요. 자존심보다는 솔직함이 사랑을 얻는 열쇠입니다.',
    ],
    COUPLE_BAD: [
      "사소한 다툼이 이별까지 갈 수 있는 위태로운 날입니다. 자존심 싸움은 절대 금물! 오늘만큼은 '무조건 네 말이 맞다'고 해주세요.",
      '상대방의 단점이 유독 커 보이는 날입니다. 잔소리가 늘어날 수 있으니 입을 굳게 다무는 것이 평화를 지키는 길입니다.',
    ],
    SINGLE_GOOD: [
      '새로운 인연이 다가오는 날입니다. 소개팅 제의가 들어오면 거절하지 마세요. 의외의 장소에서 운명의 상대를 만날 수도 있습니다.',
      '자신감이 넘쳐 매력이 철철 흐르는 날입니다. 오늘 당신을 마주친 누군가는 당신에게 반했을지도 모릅니다. 적극적으로 밖으로 나가세요!',
    ],
  },
  money: {
    GOOD: [
      '금전운 대폭발! 지갑이 두둑해지는 날입니다. 생각지도 못한 공돈이 생기거나 투자 수익이 날 수 있습니다. 복권 한 장의 행운을 노려봐도 좋겠네요.',
      '돈 냄새를 잘 맡는 하루입니다. 사업적인 아이디어가 번뜩이고, 거래나 계약이 당신에게 유리하게 흘러갑니다. 오늘은 적극적으로 이득을 취하세요.',
    ],
    BAD: [
      '지갑 구멍 주의보! 나도 모르게 줄 줄 새는 돈을 조심하세요. 충동구매 욕구가 폭발할 수 있으니 쇼핑 앱은 쳐다보지도 마세요.',
      '돈 거래는 절대 금물입니다. 빌려준 돈을 받기 힘들고, 투자 실수를 할 수 있는 날입니다. 오늘은 현상 유지만 해도 성공입니다.',
    ],
    NORMAL: [
      '들어온 만큼 나가는 평범한 금전운입니다. 계획적인 소비가 필요합니다. 큰 욕심만 부리지 않는다면 무탈하게 지나갈 것입니다.',
      '작은 돈을 아끼려다 큰돈을 쓸 수 있으니 너무 인색하게 굴지 마세요. 나를 위한 맛있는 식사 한 끼 정도는 괜찮습니다.',
    ],
  },
  job: {
    PROMOTION: [
      '직장에서 승승장구하는 날입니다. 상사에게 칭찬받거나 능력을 인정받을 기회가 옵니다. 승진이나 합격 소식도 기대해볼 만합니다.',
      '리더십이 빛나는 하루입니다. 프로젝트를 주도적으로 이끌면 좋은 성과가 따릅니다. 당신의 의견이 적극적으로 반영될 것입니다.',
    ],
    CREATIVE: [
      '창의적인 아이디어가 샘솟는 날입니다. 기획, 디자인, 예술 분야라면 대박을 터뜨릴 수 있습니다. 남들과 다른 시각으로 접근해보세요.',
      '천재적인 감각이 깨어나는 날! 막혔던 문제가 기발한 방법으로 해결됩니다. 오늘은 당신의 직관을 믿고 밀어붙이세요.',
    ],
    STRESS: [
      '업무 스트레스가 머리 끝까지 차오를 수 있습니다. 상사와의 마찰이나 동료와의 불화가 예상되니, 오늘은 최대한 눈에 띄지 않게 조용히 지내세요.',
      "일이 손에 잡히지 않고 실수 연발일 수 있습니다. 중요한 결정은 내일로 미루고, 기본적인 업무 처리에만 집중하세요. 퇴근 후 '치맥'이 약입니다.",
    ],
  },
};

export interface DailyFortune {
  date: string; // YYYY-MM-DD
  gan: string; // Today's Gan
  ji: string; // Today's Ji
  sipsin: string; // Sipsin
  score: number; // 0-100
  summary: string;
  love: string;
  money: string;
  job: string;
  health: string;
  human: string;
  marriage: string;
}

/**
 * Get random text helper
 */
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getDailyFortune = (
  userIlgan: string,
  userIlji: string,
  targetDate: Date = new Date(),
  knownGan?: string,
  knownJi?: string
): DailyFortune => {
  // 1. Get Today's Gan/Ji
  const solar = Solar.fromYmd(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    targetDate.getDate()
  );
  const lunar = solar.getLunar();
  let dayGan = knownGan || lunar.getDayGan();
  let dayJi = knownJi || lunar.getDayJi();

  // Normalize Gan/Ji if needed (assuming input might be Korean for some reason, usually Hanja)
  if (STEMS_KO.includes(dayGan)) dayGan = STEMS_EN[STEMS_KO.indexOf(dayGan)];
  if (BRANCHES_KO.includes(dayJi)) dayJi = BRANCHES_EN[BRANCHES_KO.indexOf(dayJi)];

  // 2. Calculate Sipsin
  const meIdx = STEMS_EN.indexOf(userIlgan);
  const dayIdx = STEMS_EN.indexOf(dayGan);
  let sipsinIdx = -1;
  if (meIdx !== -1 && dayIdx !== -1) {
    sipsinIdx = (dayIdx - meIdx + 10) % 10;
  }
  const sipsin = sipsinIdx !== -1 ? SIPSIN_NAMES[sipsinIdx] : '비견';

  // 3. Analyze Relationship (User Ilji vs Day Ji)
  let relation = 'NORMAL';
  if (JI_HAP[userIlji as keyof typeof JI_HAP] === dayJi)
    relation = 'HAP'; // 육합
  else if (JI_CHUNG[userIlji as keyof typeof JI_CHUNG] === dayJi)
    relation = 'CHUNG'; // 충
  else if (JI_WONJIN[userIlji as keyof typeof JI_WONJIN] === dayJi)
    relation = 'WONJIN'; // 원진
  else if (JI_PA[userIlji as keyof typeof JI_PA] === dayJi)
    relation = 'PA'; // 파
  else if (JI_HYEONG_SET.has(userIlji + dayJi))
    relation = 'HYEONG'; // 형
  else if (userIlji === dayJi) relation = 'SAME'; // 복음 (Bogeum)

  // 4. Score Calculation
  let baseScore = 70;

  // Relationship modifiers
  if (relation === 'HAP') baseScore += 20;
  if (relation === 'CHUNG') baseScore -= 15;
  if (relation === 'WONJIN') baseScore -= 10;
  if (relation === 'HYEONG') baseScore -= 10;
  if (relation === 'PA') baseScore -= 5;
  if (relation === 'SAME') baseScore -= 5; // 복음 is usually stressful

  // Sipsin modifiers (Gilshin vs Hyungshin)
  // Gil: Sik(2), JeongJae(5), JeongGwan(7), JeongIn(9), Bi(0)
  // Hyung: Geop(1), Sang(3), PyeonJae(4), PyeonGwan(6), PyeonIn(8)
  const isGilHelpful = [0, 2, 5, 7, 9].includes(sipsinIdx);
  if (isGilHelpful) baseScore += 10;
  else baseScore -= 5;

  // Special cases:
  // PyeonGwan (Seven Killings) + CHUNG = Very stressful (-10)
  if (sipsinIdx === 6 && relation === 'CHUNG') baseScore -= 10;
  // Sikshin (Eating God) + HAP = Very Good (+10)
  if (sipsinIdx === 2 && relation === 'HAP') baseScore += 10;

  // Clamp Score
  const score = Math.min(99, Math.max(30, baseScore + Math.floor(Math.random() * 5))); // Add slight variance

  // 5. Generate Content based on logic
  let summary = '';
  let love = '';
  let money = '';
  let job = '';
  let health = '';
  let human = '';
  let marriage = '';

  // 5-1. Summary
  if (relation === 'HAP') summary = pick(TEXT_DB.summary.HAP);
  else if (relation === 'CHUNG') summary = pick(TEXT_DB.summary.CHUNG);
  else if (relation === 'WONJIN') summary = pick(TEXT_DB.summary.WONJIN);
  else if (relation === 'HYEONG') summary = pick(TEXT_DB.summary.HYEONG);
  else if (score >= 80) summary = pick(TEXT_DB.summary.NORMAL_GOOD);
  else summary = pick(TEXT_DB.summary.NORMAL_SOSO);

  // Add Sipsin nuances to summary
  /* You can append specific advice based on Sipsin here if needed */

  // 5-2. Love / Marriage
  // Men: Element controls (Wealth/Jae) -> 4, 5
  // Women: Element that controls me (Officer/Gwan) -> 6, 7
  // General appeal: Peach Blossom (Do-hwa) logic is complex, simplify with Sipsin
  // Sik/Sang (Output) also good for expression/love (2, 3)

  const isManWealthDay = [4, 5].includes(sipsinIdx); // Jae-seong
  const isWomanOfficerDay = [6, 7].includes(sipsinIdx); // Gwan-seong
  const isOutputDay = [2, 3].includes(sipsinIdx); // Sik-Sang

  if (relation === 'CHUNG' || relation === 'WONJIN') {
    love = pick(TEXT_DB.love.COUPLE_BAD);
    marriage = pick(TEXT_DB.love.COUPLE_BAD);
  } else if (relation === 'HAP') {
    love = pick(TEXT_DB.love.SINGLE_GOOD);
    marriage = `배우자와의 사이가 꿀처럼 달콤합니다. 함께 있는 것만으로도 행복을 느끼는 하루입니다.`;
  } else {
    // Normal days logic
    if (isManWealthDay) {
      love = `(남성 유리) ${pick(TEXT_DB.love.MEN)}`;
      marriage = `아내에 대한 사랑이 깊어지는 날입니다. 작은 선물이나 따뜻한 말 한마디로 점수를 따보세요.`;
    } else if (isWomanOfficerDay) {
      love = `(여성 유리) ${pick(TEXT_DB.love.WOMEN)}`;
      marriage = `남편이 든든하게 느껴지는 날입니다. 남편의 기를 살려주면 집안에 웃음꽃이 핍니다.`;
    } else if (isOutputDay) {
      love = `당신의 매력이 화수분처럼 터지는 날입니다. 즐겁고 유쾌한 에너지로 이성을 사로잡으세요.`;
      marriage = `자녀와 함께하거나 가족끼리 즐거운 외식을 하기에 딱 좋은 날입니다. 분위기 메이커가 되어보세요.`;
    } else {
      love = `무난한 애정운입니다. 특별한 이벤트보다는 편안한 대화가 오가는 친구 같은 데이트가 좋습니다.`;
      marriage = `서로의 생활을 존중해주는 것이 편안합니다. 각자의 취미 생활을 즐기는 것도 방법입니다.`;
    }
  }

  // 5-3. Money
  // Wealth Days (4, 5) or Eating God (2 - Source of Wealth)
  if ([2, 4, 5].includes(sipsinIdx) && relation !== 'CHUNG') {
    money = pick(TEXT_DB.money.GOOD);
  } else if (sipsinIdx === 1 || relation === 'CHUNG') {
    // Rob Wealth (1) or Clash
    money = pick(TEXT_DB.money.BAD);
  } else {
    money = pick(TEXT_DB.money.NORMAL);
  }

  // 5-4. Job
  // Officer (7), 7Killings (6), Seal (8, 9)
  if ([6, 7].includes(sipsinIdx)) {
    job = pick(TEXT_DB.job.PROMOTION);
  } else if ([8, 9, 2].includes(sipsinIdx)) {
    // Input or Output -> Creative/Planning
    job = pick(TEXT_DB.job.CREATIVE);
  } else if (relation === 'CHUNG' || relation === 'HYEONG' || sipsinIdx === 3) {
    // Clash, Punishment, or Hurting Officer (3 - rebellion)
    job = pick(TEXT_DB.job.STRESS);
  } else {
    job = `순조롭게 업무가 진행됩니다. 동료들과 협력하여 무난한 하루를 보낼 수 있습니다.`;
  }

  // 5-5. Health
  if (relation === 'CHUNG' || relation === 'HYEONG') {
    health = `신경성 스트레스로 인한 두통이나 소화불량을 조심하세요. 오늘은 무리한 운동보다 명상이나 스트레칭이 좋습니다.`;
  } else if ([2, 0].includes(sipsinIdx)) {
    health = `컨디션이 최상입니다! 가만히 있으면 오히려 몸이 찌뿌둥하니 땀 흘리는 운동으로 에너지를 발산하세요.`;
  } else {
    health = `건강 관리에 적신호는 없지만, 일교차나 감기 정도는 주의하는 것이 좋습니다. 따뜻한 물을 많이 마시세요.`;
  }

  // 5-6. Human
  if (sipsinIdx === 1 || relation === 'WONJIN') {
    human = `인간관계에서 피로감을 느낄 수 있습니다. 믿었던 도끼에 발등 찍히지 않도록 오늘은 속마음을 너무 드러내지 마세요.`;
  } else if (relation === 'HAP' || sipsinIdx === 0) {
    human = `사람이 재산인 날입니다. 모임이나 약속이 있다면 빠지지 말고 나가세요. 좋은 귀인을 만날 수 있습니다.`;
  } else {
    human = `원만한 대인관계를 유지합니다. 적당한 거리를 두는 것이 서로에게 편안함을 줍니다.`;
  }

  return {
    date: `${targetDate.getFullYear()}-${targetDate.getMonth() + 1}-${targetDate.getDate()}`,
    gan: dayGan,
    ji: dayJi,
    sipsin,
    score,
    summary,
    love,
    money,
    job,
    health,
    human,
    marriage,
  };
};
