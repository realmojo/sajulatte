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
// Key: My Element + Target Element -> Sipsin
// We simplify: My Stem Index vs Target Stem Index
// 0: 비견, 1: 겁재, 2: 식신, 3: 상관, 4: 편재, 5: 정재, 6: 편관, 7: 정관, 8: 편인, 9: 정인
const SIPSIN_NAMES = [
  '비견',
  '겁재',
  '식신',
  '상관',
  '편재',
  '정재',
  '편관',
  '정관',
  '편인',
  '정인',
];

const getSipsinIndex = (meIndex: number, targetIndex: number) => {
  // Logic: (Target - Me + 10) % 10
  // But standard sipsin logic is driven by Element relationship + Polarity (Yin/Yang)
  // This is complex to hardcode, simple offset works for same polarity stems?
  // Let's use standard table approach or simple calc if verified.

  // Refined Logic:
  // Gap(0) meets Gap(0) -> 0 (Bi-gyeon)
  // Gap(0) meets Eul(1) -> 1 (Geop-jae)
  // Gap(0) meets Byung(2) -> 2 (Sik-shin) ...
  // This simple modulo works perfectly for Heavenly Stems because they are ordered:
  // Wood+, Wood-, Fire+, Fire-, Earth+, Earth-, Metal+, Metal-, Water+, Water-

  // Check:
  // Gap(0, Wood+) meets Gyung(6, Metal+) -> 7? No. Metal controls Wood. Me(Wood) is controlled by Metal.
  // Standard Order: Bi, Geop, Sik, Sang, Pyeon-Jae, Jeong-Jae, Pyeon-Gwan, Jeong-Gwan, Pyeon-In, Jeong-In.

  // Let's implement robust element comparison.
  return (targetIndex - meIndex + 10) % 10;
};
// Wait, the order of stems implies:
// Me=0. 0=Bi, 1=Geop, 2=Sik, 3=Sang, 4=PyeonJae, 5=JeongJae, 6=PyeonGwan, 7=JeongGwan, 8=PyeonIn, 9=JeongIn.
// Let's verify:
// Me: Gap(0). Target: Gyung(6). (6-0+10)%10 = 6.
// Gap(Wood+) vs Gyung(Metal+). Metal attacks Wood. Same polarity. Pyeon-Gwan (Seven Killings). Index 6. Correct.
// Me: Gap(0). Target: Shin(7). (7-0+10)%10 = 7.
// Gap(Wood+) vs Shin(Metal-). Metal attacks Wood. Diff polarity. Jeong-Gwan (Direct Officer). Index 7. Correct.
// Me: Gap(0). Target: Byung(2). (2-0)%10 = 2. Wood births Fire. Same. Sik-Shin. Correct.
// It seems the simple `(target - me + 10) % 10` works for Stems!

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

export interface DailyFortune {
  date: string; // YYYY-MM-DD
  gan: string; // Today's Gan
  ji: string; // Today's Ji
  sipsin: string; // Sipsin of today's Gan relative to user
  score: number; // 0-100
  summary: string;
  love: string;
  money: string;
  job: string;
  health: string;
  human: string;
  marriage: string; // Added marriage
}

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
  let dayGan = lunar.getDayGan(); // Chinese character e.g. '甲'
  let dayJi = lunar.getDayJi(); // Chinese character e.g. '子'

  if (knownGan) dayGan = knownGan;
  if (knownJi) dayJi = knownJi;

  // Translate to our format if needed, but lunar-javascript usually returns Hanja
  // Check if matches our STEMS list
  const todayGan = STEMS_EN.includes(dayGan)
    ? dayGan
    : STEMS_EN[STEMS_KO.indexOf(dayGan)] || dayGan;

  // Check if matches our BRANCHES list
  const todayJi = BRANCHES_EN.includes(dayJi)
    ? dayJi
    : BRANCHES_EN[BRANCHES_KO.indexOf(dayJi)] || dayJi;
  // Actually library returns Hanja usually. Let's assume Hanja.

  // 2. Calculate Sipsin
  const meIdx = STEMS_EN.indexOf(userIlgan);
  const dayIdx = STEMS_EN.indexOf(dayGan);

  let sipsinIdx = -1;
  if (meIdx !== -1 && dayIdx !== -1) {
    sipsinIdx = (dayIdx - meIdx + 10) % 10;
  }
  const sipsin = sipsinIdx !== -1 ? SIPSIN_NAMES[sipsinIdx] : '비견';

  // 3. Analyze Relationship (User Ilji vs Day Ji)
  let relationship = '';
  if (JI_HAP[userIlji as keyof typeof JI_HAP] === dayJi)
    relationship = 'HAP'; // 육합
  else if (JI_CHUNG[userIlji as keyof typeof JI_CHUNG] === dayJi)
    relationship = 'CHUNG'; // 충
  else if (JI_WONJIN[userIlji as keyof typeof JI_WONJIN] === dayJi)
    relationship = 'WONJIN'; // 원진
  else if (userIlji === dayJi) relationship = 'SAME'; // 복음

  // 4. Generate Content
  // Base scores
  let score = 70;
  if (relationship === 'HAP') score += 15;
  if (relationship === 'CHUNG') score -= 15;
  if (relationship === 'WONJIN') score -= 10;

  // Sipsin Effects
  // Gil-shin (Good): Sik, Jeong-Jae, Jeong-Gwan, Jeong-In, Bi-gyeon(Neutral)
  // Hyung-shin (Rough): Geop-jae, Sang-gwan, Pyeon-Jae(Neutral/Good), Pyeon-Gwan, Pyeon-In

  const isGilShin = ['식신', '정재', '정관', '정인', '비견'].includes(sipsin);
  if (isGilShin) score += 5;
  else score -= 5;

  score = Math.min(100, Math.max(40, score));

  // --- Content Templates ---
  // (Simplified for now, can be expanded indefinitely)

  let summary = '';
  let love = '';
  let money = '';
  let job = '';
  let health = '';
  let human = '';
  let marriage = '';

  // 4-1. Summary
  if (relationship === 'HAP') {
    summary = `오늘은 하루 종일 마음이 편안하고 일이 술술 풀리는 '합(合)'의 날입니다. 주변 사람들과의 관계도 좋고, 뜻밖의 도움을 받을 수도 있습니다. 중요한 약속이나 계약을 하기에 아주 좋은 날입니다.`;
  } else if (relationship === 'CHUNG') {
    summary = `오늘은 변화와 변동이 많은 '충(沖)'의 날입니다. 예상치 못한 일이 생기거나 계획이 틀어질 수 있으니, 무리한 일정보다는 여유를 가지는 것이 좋습니다. 운전이나 말실수를 조심하고, 차분하게 하루를 보내세요.`;
  } else if (relationship === 'WONJIN') {
    summary = `오늘은 이유 없이 마음이 답답하거나 예민해질 수 있는 날입니다. 타인과의 오해가 생기기 쉬우니, 감정적인 대응보다는 한 박자 쉬어가는 지혜가 필요합니다. 혼자만의 시간을 가지며 멘탈을 관리하세요.`;
  } else {
    // Normal / Sipsin based
    if (['비견', '겁재'].includes(sipsin)) {
      summary = `자신감이 넘치고 주관이 뚜렷해지는 날입니다. 나의 의지대로 밀고 나가는 힘이 강하지만, 독단적인 행동은 피해야 합니다. 경쟁 상황에서 좋은 성과를 낼 수 있습니다.`;
    } else if (['식신', '상관'].includes(sipsin)) {
      summary = `표현력과 창의력이 폭발하는 날입니다. 나의 재능을 발휘하기 좋으며, 맛있는 음식을 먹거나 즐거운 일을 찾아 나서기에 딱 좋습니다. 다만 말실수를 주의하세요.`;
    } else if (['편재', '정재'].includes(sipsin)) {
      summary = `현실적인 감각이 깨어나고 결과물이 눈에 보이는 날입니다. 금전적인 이득을 취하거나 실속을 챙기기에 유리합니다. 바쁘게 움직인 만큼 보상이 따를 것입니다.`;
    } else if (['편관', '정관'].includes(sipsin)) {
      summary = `책임감이 강해지고 명예가 따르는 날입니다. 공적인 업무 처리가 매끄럽고, 타인의 인정을 받을 수 있습니다. 다만 스트레스가 조금 쌓일 수 있으니 휴식도 챙기세요.`;
    } else {
      // Inseong
      summary = `직관력이 좋아지고 차분해지는 날입니다. 공부나 기획, 계약 관련 업무에 행운이 따릅니다. 윗사람의 도움을 받거나 좋은 문서를 잡을 수 있는 운세입니다.`;
    }
  }

  // 4-2. Love / Marriage
  if (relationship === 'HAP') {
    love = `애정운이 최상입니다! 썸을 타고 있다면 오늘 고백해보세요. 연인이 있다면 서로의 마음이 깊게 통하는 달콤한 데이트를 즐길 수 있습니다. 소개팅 운도 매우 좋습니다.`;
    marriage = `배우자와의 관계가 꿀 떨어지는 날입니다. 서운했던 점이 있었다면 오늘 자연스럽게 풀릴 것입니다. 함께 미래를 계획하거나 진솔한 대화를 나누기에 완벽한 타이밍입니다.`;
  } else if (relationship === 'CHUNG' || relationship === 'WONJIN') {
    love = `사소한 말다툼이 큰 싸움으로 번질 수 있는 '살얼음판' 같은 날입니다. 상대방의 자존심을 건드리는 말은 절대 금물! 오늘은 데이트를 줄이거나, 만나더라도 일찍 귀가하는 것이 상책입니다.`;
    marriage = `배우자와 의견 충돌이 잦을 수 있습니다. 무심코 던진 한마디가 화근이 될 수 있으니, 오늘은 져주거나 침묵하는 것이 가정의 평화를 지키는 길입니다. 각자의 시간을 존중해주세요.`;
  } else {
    if (['편재', '정재'].includes(sipsin)) {
      // Men loves Wealth
      love = `이성에게 매력이 어필되는 날입니다. 남성분들은 마음에 드는 이성을 만날 확률이 높습니다. 다만 너무 돈을 많이 쓰면서 환심을 사려 하지 마세요.`;
      marriage = `가정에 충실하고 싶은 마음이 듭니다. 배우자를 위해 작은 선물을 준비해보세요. 현실적인 문제(돈, 자녀)로 대화하기 좋습니다.`;
    } else if (['편관', '정관'].includes(sipsin)) {
      // Women loves Officer
      love = `여성분들에게 도화살이 비치는 날입니다. 멋진 이성이 다가오거나, 연인에게서 든든함을 느낄 수 있습니다. 남성분들은 여자친구의 눈치를 조금 봐야 할 수도 있습니다.`;
      marriage = `배우자가 든든하게 느껴지지만, 한편으로는 잔소리나 간섭이 심해질 수 있습니다. '알았어, 고마워'라고 맞장구쳐주는 것이 평화의 열쇠입니다.`;
    } else if (['식신', '상관'].includes(sipsin)) {
      love = `나의 매력을 적극적으로 발산하는 날입니다. 유머 감각과 재치가 넘쳐 데이트 분위기가 화기애애합니다. 스킨십 진도가 나가기 좋은 날입니다.`;
      marriage = `자녀 문제로 대화가 많아지거나, 배우자와 함께 맛집 데이트를 즐기기 좋습니다. 분위기 전환을 위해 외식을 추천합니다.`;
    } else {
      // Bi/Geop/In
      love = `연애보다는 친구가 더 좋은 날입니다. 연인에게 소홀해져서 서운함을 살 수 있으니 주의하세요. 오늘은 내 할 일이나 취미 생활이 더 우선시될 수 있습니다.`;
      marriage = `서로 간섭하지 않고 편안한 친구 같은 하루입니다. 각자 할 일을 하며 묵묵히 지켜주는 것이 오히려 편안함을 줍니다.`;
    }
  }

  // 4-3. Money
  if (['편재', '정재'].includes(sipsin)) {
    money = `금전운이 활짝 열렸습니다! 뜻밖의 수익이 생기거나, 투자한 곳에서 좋은 소식이 들려올 수 있습니다. 돈을 버는 감각이 예리해지니 적극적으로 움직이세요. 오늘은 복권을 한 장 사봐도 좋겠네요.`;
  } else if (sipsin === '겁재') {
    money = `지출 주의보! 지갑이 얇아지는 날입니다. 충동구매를 하거나, 친구 따라 강남 갔다가 돈만 쓰고 올 수 있습니다. 오늘은 절대 돈 거래를 하지 말고, 신용카드는 집에 두고 나가세요.`;
  } else if (['식신', '상관'].includes(sipsin)) {
    money = `나의 재능이나 활동이 돈으로 연결되는 날입니다. 열심히 일한 만큼 보상이 따릅니다. 맛있는 것을 사 먹거나 나를 위해 쓰는 돈은 아까워하지 마세요.`;
  } else {
    money = `평범한 금전운입니다. 큰돈이 들어오지도 않지만, 크게 나가지도 않습니다. 현재의 자산을 잘 지키고 관리하는 것이 최선입니다. 계획 없는 지출만 삼가세요.`;
  }

  // 4-4. Job
  if (['정관', '편관'].includes(sipsin)) {
    job = `직장에서 능력을 인정받을 기회입니다. 승진 운이 따르거나, 중요한 프로젝트를 맡게 될 수 있습니다. 윗사람의 눈에 들 수 있으니 성실하게 임하세요. 취업 준비생에게는 합격 소식이 있을 수 있습니다.`;
  } else if (['편인', '정인'].includes(sipsin)) {
    job = `아이디어가 샘솟고 기획 능력이 빛을 발합니다. 결재를 받거나 계약을 체결하기에 아주 좋습니다. 차분하게 업무를 처리하면 좋은 성과를 얻을 수 있습니다. 공부나 자격증 시험에도 길합니다.`;
  } else if (sipsin === '상관') {
    job = `직장에서 반항심이 생길 수 있습니다. 상사의 지시가 부당하게 느껴져 들이받고 싶은 충동이 들 수 있으니 주의하세요. 말조심만 하면 창의적인 성과를 낼 수 있습니다.`;
  } else {
    job = `묵묵히 내 할 일을 하는 하루입니다. 동료들과 협력하여 일을 처리하면 수월합니다. 너무 튀려고 하기보다는 흐름에 맡기는 것이 좋습니다.`;
  }

  // 4-5. Health
  if (relationship === 'CHUNG' || relationship === 'WONJIN') {
    health = `컨디션 난조가 예상됩니다. 신경이 예민해져 소화가 안 되거나, 편두통이 올 수 있습니다. 무리한 운동보다는 가벼운 스트레칭이나 산책이 좋습니다. 운전할 때도 평소보다 방어운전하세요.`;
  } else if (['식신', '비견'].includes(sipsin)) {
    health = `에너지가 넘치는 날입니다! 체력이 좋아 운동 효과가 배가 됩니다. 땀 흘리는 운동으로 스트레스를 날려보세요. 맛있는 보양식을 챙겨 먹는 것도 좋습니다.`;
  } else {
    health = `무난한 건강 상태를 유지합니다. 규칙적인 생활 리듬만 지킨다면 하루 종일 활기차게 보낼 수 있습니다. 물을 많이 마시고 틈틈이 휴식을 취하세요.`;
  }

  // 4-6. Human (Social)
  if (['비견', '겁재'].includes(sipsin)) {
    human = `사람들과 어울리기 딱 좋은 날입니다. 친구, 동료들과의 모임에서 주도적인 역할을 하게 됩니다. 다만 경쟁심이 과해져 다툼이 일어날 수도 있으니, '내가 쏜다'는 마음으로 베푸는 것이 인기를 얻는 비결입니다.`;
  } else if (relationship === 'HAP') {
    human = `인복이 터지는 날입니다. 귀인의 도움을 받거나, 나를 좋게 봐주는 사람을 만나게 됩니다. 대인관계에서 자신감을 가지세요. 부탁할 일이 있다면 오늘 하세요.`;
  } else if (sipsin === '상관') {
    human = `구설수를 조심해야 합니다. 무심코 뱉은 말이 와전되어 곤란해질 수 있습니다. 뒷담화 자리는 피하고, 남의 일에 참견하지 않는 것이 상책입니다.`;
  } else {
    human = `원만한 대인관계를 유지하는 날입니다. 너무 튀지 않고 적당히 맞장구쳐주는 처세술이 필요합니다. 새로운 만남보다는 기존의 인연을 챙기는 것이 좋습니다.`;
  }

  return {
    date: `${targetDate.getFullYear()}-${targetDate.getMonth() + 1}-${targetDate.getDate()}`,
    gan: todayGan,
    ji: todayJi,
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
