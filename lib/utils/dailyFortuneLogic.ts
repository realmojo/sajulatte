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
      '서로의 마음이 통하는 날입니다. 혼자 고민하던 일도 주변의 도움으로 손쉽게 해결될 수 있습니다. 귀인이 문을 두드리는 날이니 마음을 열고 맞이하세요.',
      '안정감이 돋보이는 하루입니다. 복잡했던 머릿속이 정리되고, 내가 가야 할 길이 명확하게 보입니다. 평온함 속에서 큰 성취를 이룰 수 있는 날입니다.',
    ],
    CHUNG: [
      "오늘은 '충(沖)'의 기운으로 인해 변화와 변동이 심한 롤러코스터 같은 날입니다. 예상치 못한 돌발 상황에 당황할 수 있으니, 계획을 융통성 있게 수정할 준비를 하세요. 움직임이 많은 것이 오히려 득이 될 수도 있습니다.",
      '기존의 틀이 깨지고 새로운 국면을 맞이하는 날입니다. 변화가 두렵겠지만, 오히려 묵은 것을 정리하고 새출발하는 기회로 삼으세요. 다만 교통안전과 언행에는 각별한 주의가 필요합니다.',
      '부딪히고 깨지는 소리가 들리는 듯한 하루입니다. 의욕이 앞서 다툼이 생기거나 실수를 할 수 있습니다. 오늘은 잠시 멈춰 서서 숨을 고르고, 한 박자 늦게 반응하는 것이 지혜입니다.',
      '예정에 없던 이동이나 출장이 생길 수 있습니다. 바쁘게 움직이는 만큼 소득도 있겠지만, 체력 관리에 유의하세요. 급할수록 돌아가는 여유가 필요합니다.',
      '감정의 파도가 높은 날입니다. 욱하는 마음을 다스리지 못하면 후회할 일이 생길 수 있습니다. 오늘은 나 자신과의 싸움에서 이겨야 하는 날입니다.',
    ],
    WONJIN: [
      "이유 없이 마음이 울적하거나 상대방이 미워 보이는 '원진(怨嗔)'의 날입니다. 감정 기복이 심해질 수 있으니 오늘만큼은 감정적인 결정을 미루세요. 혼자만의 시간을 가지며 내면을 돌보는 것이 상책입니다.",
      '괜한 오해로 사이가 서먹해질 수 있는 예민한 날입니다. 작은 말실수가 가시가 되어 돌아올 수 있으니 침묵이 금입니다. 좋아하는 음악을 듣거나 산책을 하며 멘탈을 관리하세요.',
      '눈에 씌었던 콩깍지가 벗겨지며 단점이 크게 보이는 날입니다. 하지만 그것은 일시적인 기분 탓일 수 있습니다. 섣불리 판단하지 말고 하루만 지나가기를 기다려보세요.',
      '잘해주고도 욕먹을 수 있는 억울한 날입니다. 남을 탓하기 전에 내 태도에 오해의 소지는 없었는지 돌아보세요. 오늘은 조용히 자숙하는 것이 좋습니다.',
    ],
    HYEONG: [
      "뭔가 꽉 막힌 듯 답답하고 조정이 필요한 '형(刑)'살이 들어온 날입니다. 내 뜻대로 일이 진행되지 않아 스트레스를 받을 수 있습니다. 억지로 밀어붙이기보다는 잠시 물러나 상황을 관조하는 여유가 필요합니다.",
      '수술이나 시술, 혹은 무언가를 뜯어고치기에 좋은 날입니다. 하지만 인간관계에서는 자존심 대립으로 상처를 주고받을 수 있으니 양보하는 미덕이 필요합니다.',
      '규칙이나 법을 어기면 탈이 나기 쉽습니다. 오늘은 준법정신을 철저히 지키고, 사소한 약속이라도 소홀히 하지 마세요. 정직이 최선의 방책입니다.',
      '무언가를 잘라내고 다듬어야 하는 날입니다. 불필요한 인간관계나 나쁜 습관을 정리하기에는 오히려 좋은 기회일 수 있습니다.',
    ],
    NORMAL_GOOD: [
      '맑게 갠 하늘처럼 상쾌하고 기운찬 하루입니다. 당신의 긍정적인 에너지가 주변 사람들까지 밝게 만듭니다. 오늘 당신이 흘린 땀방울은 반드시 달콤한 열매가 되어 돌아올 것입니다.',
      '순풍에 돛을 단 배처럼 매사가 순조로운 날입니다. 특별한 행운은 없더라도 평범함 속에서 소소한 행복을 찾을 수 있습니다. 오늘 당신의 미소는 최고의 무기입니다.',
      '컨디션이 아주 좋습니다. 미뤄왔던 일을 시작하기에 좋은 날입니다. 당신의 능력을 마음껏 펼쳐보세요.',
      '기분 좋은 소식이 들려올 수 있습니다. 친구나 지인과의 만남에서 뜻밖의 즐거움을 얻을 수 있는 하루입니다.',
    ],
    NORMAL_SOSO: [
      '특별한 일 없이 무난하게 흘러가는 하루입니다. 지루하게 느껴질 수도 있지만, 평온함이야말로 가장 큰 축복입니다. 일상의 소중함을 느끼며 차분하게 오늘 할 일을 마무리하세요.',
      '조금은 느리게 걷고 싶은 날입니다. 급하게 서두르면 체하니 천천히 여유를 즐기세요. 오늘은 나를 위한 작은 휴식과 보상이 필요한 하루입니다.',
      '평범한 하루 속에 작은 기쁨이 숨어 있습니다. 길가의 꽃이나 맛있는 커피 한 잔에서 행복을 찾아보세요.',
      '오늘은 무리하지 말고 현상 유지에 힘쓰세요. 내실을 다지는 시간이 내일의 도약을 위한 거름이 됩니다.',
    ],
  },
  love: {
    MEN: [
      '이성운이 활짝 열렸습니다! 마음에 드는 사람에게 용기 내어 다가가 보세요. 당신의 유머와 재치가 빛을 발하는 날입니다.',
      '오늘은 당신이 주인공입니다. 썸 타는 관계라면 확실한 시그널을 보내도 좋습니다. 다만, 너무 가벼워 보이지 않도록 진심을 담아 표현하세요.',
      '자신감이 최고의 무기입니다. 평소보다 당당한 모습이 이성에게 매력적으로 다가갑니다. 주저하지 말고 대시하세요.',
      '남자의 향기가 물씬 풍기는 날입니다. 무심한 듯 챙겨주는 츤데레 매력으로 상대의 마음을 흔들어보세요.',
      '당신의 능력을 보여줄 기회가 생깁니다. 일하는 남자의 섹시함이 이성에게 강하게 어필될 것입니다.',
      '스타일 변신을 시도해보세요. 깔끔한 셔츠나 헤어스타일 변화가 예상치 못한 행운을 불러옵니다.',
      '모임이나 회식 자리에서 주목받을 수 있는 날입니다. 적극적으로 대화에 참여하여 매력을 발산하세요.',
      '운동으로 다져진 건강미가 돋보이는 날입니다. 자기 관리에 힘쓰는 모습이 이성에게 호감을 줍니다.',
      '예상치 못한 곳에서 인연이 시작될 수 있습니다. 평소에 가지 않던 길이나 장소에 들러보는 것도 좋습니다.',
      '오늘은 리더십을 보여줘야 할 때입니다. 결단력 있는 모습이 상대방에게 깊은 인상을 남깁니다.',
      '친구의 소개나 주선으로 좋은 만남이 이어질 수 있습니다. 거절하지 말고 일단 나가보세요.',
      '당신의 목소리가 매력 포인트가 되는 날입니다. 차분하고 낮은 톤으로 대화를 이끌어보세요.',
      '사소한 배려가 큰 감동을 줍니다. 무거운 짐을 들어주거나 문을 잡아주는 매너를 잊지 마세요.',
      '옛 연인의 소식이 들려올 수도 있습니다. 마음이 흔들릴 수 있지만, 현재에 집중하는 것이 좋습니다.',
      '솔직함이 최고의 전략입니다. 돌려 말하기보다는 당신의 감정을 직설적으로 표현하는 것이 효과적입니다.',
    ],
    WOMEN: [
      '도화살이 비치니 어디서든 시선을 받는 날입니다. 평소보다 조금 더 멋을 부려봐도 좋습니다. 뜻밖의 설렘이 찾아올 수 있어요.',
      '사랑받고 싶은 욕구가 커지는 날입니다. 연인에게 애교를 부려보거나 솔직한 마음을 표현해보세요. 자존심보다는 솔직함이 사랑을 얻는 열쇠입니다.',
      '여우 같은 매력이 폭발하는 날입니다. 눈빛 하나로 상대를 제압할 수 있으니, 매력을 마음껏 발산해보세요.',
      '보호 본능을 자극하는 것이 유리합니다. 오늘은 조금 연약한 척 기대보는 것도 좋은 전략입니다.',
      '우아하고 지적인 매력이 돋보이는 날입니다. 가벼운 만남보다는 진지한 대화가 오가는 자리에서 당신의 진가가 드러납니다.',
      '당신의 미소가 누군가의 하루를 밝혀주는 날입니다. 밝은 표정으로 주변을 대해보세요.',
      '화사한 옷차림이나 액세서리가 행운을 가져다줍니다. 핑크나 레드 계열의 포인트를 주어보세요.',
      '직감을 믿으세요. 왠지 모르게 끌리는 사람이 있다면 그 사람이 바로 운명의 상대일 수 있습니다.',
      '가만히 있어도 이성들이 다가오는 날입니다. 너무 도도하게 굴기보다는 친절하게 받아주세요.',
      '예술적인 감성이 풍부해지는 날입니다. 전시회나 공연 관람 데이트를 제안해보는 것은 어떨까요?',
      '향기에 신경 써보세요. 은은하게 퍼지는 향수가 당신의 매력을 한층 더 업그레이드시켜 줄 것입니다.',
      '오랜 친구에게서 묘한 감정을 느낄 수 있습니다. 사랑은 의외로 가까운 곳에 있을지도 모릅니다.',
      '자신의 의견을 분명하게 표현하는 당당함이 오히려 매력적으로 보일 수 있는 날입니다.',
      '우연히 마주친 낯선 사람에게서 설렘을 느낄 수 있습니다. 찰나의 순간을 놓치지 마세요.',
      '자신을 위한 투자가 곧 연애운 상승으로 이어집니다. 마사지나 쇼핑으로 기분 전환을 해보세요.',
    ],
    COUPLE_BAD: [
      "사소한 다툼이 이별까지 갈 수 있는 위태로운 날입니다. 자존심 싸움은 절대 금물! 오늘만큼은 '무조건 네 말이 맞다'고 해주세요.",
      '상대방의 단점이 유독 커 보이는 날입니다. 잔소리가 늘어날 수 있으니 입을 굳게 다무는 것이 평화를 지키는 길입니다.',
      '의심이 싹트기 쉬운 날입니다. 혼자 소설 쓰지 말고, 솔직하게 물어보고 대화로 푸는 것이 현명합니다.',
      '권태기가 느껴질 수 있습니다. 하지만 이는 일시적인 감정일 뿐, 섣불리 이별을 생각하지 마세요.',
      '나의 예민함이 상대에게 상처를 줄 수 있습니다. 오늘은 데이트를 줄이고 각자의 시간을 갖는 것이 오히려 관계에 도움이 됩니다.',
      '다른 이성과 비교하지 마세요. 비교하는 순간 관계에 금이 가기 시작합니다. 당신의 연인에게만 집중하세요.',
      '약속 시간에 늦거나 약속을 잊어버려 다툼이 생길 수 있습니다. 일정을 꼼꼼히 체크하세요.',
      '금전 문제로 예민해질 수 있습니다. 데이트 비용 문제는 솔직하고 현명하게 상의하는 것이 좋습니다.',
      '상대방의 사생활을 존중해주세요. 휴대폰을 몰래 보거나 지나친 간섭은 금물입니다.',
      '질투심이 화를 부를 수 있습니다. 상대방을 믿고 여유로운 태도를 보이는 것이 매력적입니다.',
      '피곤함에 짜증이 늘어날 수 있습니다. 컨디션 조절을 잘하고, 힘들면 솔직하게 말하고 휴식을 취하세요.',
      '제3자의 말에 휘둘리지 마세요. 둘 사이의 일은 둘이서 해결해야 합니다.',
      '과거의 실수를 들추지 마세요. 이미 지나간 일로 현재의 행복을 망치지 마세요.',
      '오늘은 어떤 말을 해도 오해가 생기기 쉽습니다. 중요한 이야기나 결정은 내일로 미루는 것이 좋습니다.',
      '상대방이 위로를 바랄 때 충고하려 들지 마세요. 그냥 묵묵히 들어주고 공감해주는 것이 필요합니다.',
    ],
    SINGLE_GOOD: [
      '새로운 인연이 다가오는 날입니다. 소개팅 제의가 들어오면 거절하지 마세요. 의외의 장소에서 운명의 상대를 만날 수도 있습니다.',
      '자신감이 넘쳐 매력이 철철 흐르는 날입니다. 오늘 당신을 마주친 누군가는 당신에게 반했을지도 모릅니다. 적극적으로 밖으로 나가세요!',
      '오랜 친구가 이성으로 느껴질 수 있는 날입니다. 등잔 밑이 어두우니 주변을 한번 돌아보세요.',
      '우연한 마주침이 인연이 될 수 있습니다. 서점, 카페, 혹은 출근길에서도 로맨스의 불씨는 피어날 수 있습니다.',
      '과거의 인연에게서 연락이 올 수도 있습니다. 흔들리지 말고 현재 당신의 감정에 충실하세요. 새로운 출발이 당신을 기다립니다.',
      '취미 활동 모임이나 동호회에 나가보세요. 공통의 관심사를 가진 사람과 급속도로 가까워질 수 있습니다.',
      'SNS나 온라인 공간에서도 좋은 인연을 만날 수 있습니다. 프로필 사진을 업데이트해보는 건 어때요?',
      '여행지에서 로맨틱한 만남이 기다리고 있습니다. 가까운 교외로라도 혼자 떠나보세요.',
      '이상형에 가까운 사람을 발견하게 됩니다. 놓치기 싫다면 용기 내어 말을 걸어보세요.',
      '주변 사람들의 도움으로 멋진 이성을 소개받을 수 있습니다. 평소에 베푼 덕이 돌아오는 날입니다.',
      '오늘은 왠지 모르게 예감이 좋은 날입니다. 당신의 직감을 믿고 움직이면 행운이 따를 것입니다.',
      '뜻밖의 장소에서 옛사랑과 조우할 수 있습니다. 당황하지 말고 자연스럽게 대처하세요.',
      '연하의 이성이 적극적으로 대시해 올 수 있습니다. 나이 차이에 연연하지 말고 마음을 열어보세요.',
      '일과 사랑을 동시에 잡을 수 있는 날입니다. 직장이나 학교에서 썸의 기운이 감지됩니다.',
      '당신의 솔직하고 털털한 모습에 반하는 사람이 생깁니다. 꾸미지 않은 있는 그대로의 모습을 보여주세요.',
    ],
    NORMAL: [
      '무난한 애정운입니다. 특별한 이벤트보다는 편안한 대화가 오가는 친구 같은 데이트가 좋습니다.',
      '뜨겁지는 않지만 은은한 온기가 느껴지는 날입니다. 일상적인 데이트 속에서 소소한 행복을 찾아보세요.',
      '오늘은 사랑보다는 우정이 더 빛나는 날입니다. 연인과도 친구처럼 편하게 지내는 것이 좋습니다.',
      '무리한 기대는 실망을 부릅니다. 있는 그대로의 상대를 존중하고 받아들이는 마음이 필요합니다.',
      '혼자만의 시간을 즐기는 것도 나쁘지 않습니다. 나를 가꾸고 사랑하는 시간이 훗날 더 좋은 연애를 만듭니다.',
      '작은 선물이 관계에 활력을 불어넣을 수 있습니다. 거창한 것이 아니어도 좋습니다.',
      '함께 맛있는 음식을 먹으러 가세요. 식도락 데이트가 두 사람의 사이를 더욱 가깝게 만듭니다.',
      '영화나 드라마를 보며 감성을 충전하세요. 연애 세포를 깨우는 데 도움이 됩니다.',
      '너무 조급해하지 마세요. 인연은 자연스럽게 찾아오는 법입니다.',
      '주변 커플들을 부러워하지 마세요. 당신에게도 곧 봄날이 찾아올 것입니다.',
      '연인과의 관계를 재점검하기 좋은 날입니다. 서로의 미래에 대해 진지하게 이야기해보세요.',
      '반복되는 데이트 코스에 변화를 줘보세요. 새로운 장소가 새로운 기분을 가져다줍니다.',
      '상대방의 취미를 함께 공유해보세요. 서로를 이해하는 폭이 넓어질 것입니다.',
      '감정 표현에 인색하지 마세요. "고맙다", "미안하다"는 말 한마디가 관계를 부드럽게 합니다.',
      '오늘은 흐르는 물처럼 자연스럽게 보내세요. 억지로 무언가를 하려 하지 않는 것이 좋습니다.',
    ],
  },
  marriage: {
    GOOD: [
      '배우자와의 사이가 꿀처럼 달콤합니다. 함께 있는 것만으로도 행복을 느끼는 하루입니다.',
      '아내(남편)가 예뻐(멋져) 보이는 날입니다. 오늘은 당신이 먼저 로맨틱한 분위기를 만들어보세요.',
      '집안에 웃음꽃이 피는 날입니다. 자녀나 배우자와 함께하는 저녁 식사가 최고의 행복이 될 것입니다.',
      '서로에 대한 고마움이 커지는 날입니다. "사랑해", "고마워"라는 말 한마디가 관계를 더욱 단단하게 만듭니다.',
    ],
    BAD: [
      '배우자와 의견 충돌이 예상됩니다. 잔소리는 싸움의 불씨가 되니, 오늘은 한 귀로 듣고 한 귀로 흘리세요.',
      '집안 분위기가 냉랭할 수 있습니다. 굳이 잘잘못을 따지지 말고, 당신이 먼저 따뜻한 차 한 잔을 건네보세요.',
      '사소한 오해로 서운함이 폭발할 수 있습니다. 대화가 통하지 않는다면 잠시 자리를 피하는 것도 방법입니다.',
      '배우자의 건강이나 기분에 신경 써야 하는 날입니다. 당신의 세심한 배려가 필요합니다.',
    ],
    NORMAL: [
      '서로의 생활을 존중해주는 것이 편안합니다. 각자의 취미 생활을 즐기는 것도 방법입니다.',
      '평온한 결혼 생활이 이어집니다. 특별한 일은 없지만, 그것이 바로 가정의 행복입니다.',
      '함께 장을 보거나 산책을 하며 소소한 일상을 공유하기에 좋은 날입니다.',
      '가계부나 집안일 문제로 대화할 일이 생깁니다. 감정보다는 이성적으로 상의하세요.',
    ],
  },
  money: {
    GOOD: [
      '금전운 대폭발! 지갑이 두둑해지는 날입니다. 생각지도 못한 공돈이 생기거나 투자 수익이 날 수 있습니다. 복권 한 장의 행운을 노려봐도 좋겠네요.',
      '돈 냄새를 잘 맡는 하루입니다. 사업적인 아이디어가 번뜩이고, 거래나 계약이 당신에게 유리하게 흘러갑니다. 오늘은 적극적으로 이득을 취하세요.',
      '뿌린 대로 거두는 날입니다. 그동안의 노력이 보상으로 돌아옵니다. 성과급이나 보너스를 기대해봐도 좋습니다.',
      '횡재수가 비치는 날입니다. 경품 당첨이나 뜻밖의 용돈을 받을 수 있으니 기분 좋은 상상을 해보세요.',
      '투자에 대한 안목이 높아지는 날입니다. 괜찮은 정보가 들어온다면 꼼꼼히 검토해보세요.',
    ],
    BAD: [
      '지갑 구멍 주의보! 나도 모르게 줄 줄 새는 돈을 조심하세요. 충동구매 욕구가 폭발할 수 있으니 쇼핑 앱은 쳐다보지도 마세요.',
      '돈 거래는 절대 금물입니다. 빌려준 돈을 받기 힘들고, 투자 실수를 할 수 있는 날입니다. 오늘은 현상 유지만 해도 성공입니다.',
      '예상치 못한 지출이 생길 수 있습니다. 경조사비나 수리비 등 나갈 돈이 생기니 미리 대비하세요.',
      '사기나 달콤한 유혹에 넘어가기 쉬운 날입니다. "확실하다"는 말일수록 의심하고 또 의심하세요.',
      '분실이나 도난의 위험이 있습니다. 지갑과 귀중품 관리에 각별히 신경 쓰세요.',
    ],
    NORMAL: [
      '들어온 만큼 나가는 평범한 금전운입니다. 계획적인 소비가 필요합니다. 큰 욕심만 부리지 않는다면 무탈하게 지나갈 것입니다.',
      '작은 돈을 아끼려다 큰돈을 쓸 수 있으니 너무 인색하게 굴지 마세요. 나를 위한 맛있는 식사 한 끼 정도는 괜찮습니다.',
      '금전 흐름이 원활합니다. 사고 싶었던 물건이 있다면 꼼꼼히 비교해보고 구매하기에 나쁘지 않은 날입니다.',
      '돈 문제로 고민하고 있다면, 오늘은 해결책을 찾기 어렵습니다. 잠시 잊고 본업에 충실하는 것이 낫습니다.',
      '저축이나 적금 가입 등 미래를 위한 투자를 하기에 좋은 날입니다. 작은 시작이 큰 부를 만듭니다.',
    ],
  },
  job: {
    PROMOTION: [
      '직장에서 승승장구하는 날입니다. 상사에게 칭찬받거나 능력을 인정받을 기회가 옵니다. 승진이나 합격 소식도 기대해볼 만합니다.',
      '리더십이 빛나는 하루입니다. 프로젝트를 주도적으로 이끌면 좋은 성과가 따릅니다. 당신의 의견이 적극적으로 반영될 것입니다.',
      '경쟁자보다 앞서 나갈 수 있는 기운입니다. 자신감을 가지고 도전하세요. 승리는 당신의 것입니다.',
      '명예운이 따르는 날입니다. 중요한 직책을 맡거나, 당신의 이름이 널리 알려질 수 있습니다.',
      '귀인의 도움으로 난관을 돌파합니다. 윗사람이나 선배의 조언을 귀담아들으세요.',
    ],
    CREATIVE: [
      '창의적인 아이디어가 샘솟는 날입니다. 기획, 디자인, 예술 분야라면 대박을 터뜨릴 수 있습니다. 남들과 다른 시각으로 접근해보세요.',
      '천재적인 감각이 깨어나는 날! 막혔던 문제가 기발한 방법으로 해결됩니다. 오늘은 당신의 직관을 믿고 밀어붙이세요.',
      '학구열이 불타는 날입니다. 새로운 지식을 습득하거나 자격증 공부를 하기에 최적의 시기입니다.',
      '감수성이 풍부해지는 날입니다. 글로 생각을 표현하거나 무언가를 만드는 일에서 큰 기쁨을 맛볼 수 있습니다.',
      '혼자 집중해서 하는 업무 효율이 극대화됩니다. 복잡한 문제를 깊이 파고들어 해결책을 찾아내세요.',
    ],
    STRESS: [
      '업무 스트레스가 머리 끝까지 차오를 수 있습니다. 상사와의 마찰이나 동료와의 불화가 예상되니, 오늘은 최대한 눈에 띄지 않게 조용히 지내세요.',
      "일이 손에 잡히지 않고 실수 연발일 수 있습니다. 중요한 결정은 내일로 미루고, 기본적인 업무 처리에만 집중하세요. 퇴근 후 '치맥'이 약입니다.",
      '과로로 인한 피로가 누적될 수 있습니다. 오늘만큼은 "No"라고 말할 줄 아는 용기가 필요합니다. 건강이 최우선입니다.',
      '구설수에 오를 수 있습니다. 직장 내 뒷담화 자리는 피하고, 말조심하는 것이 상책입니다.',
      '노력에 비해 성과가 미미하여 허탈할 수 있습니다. 하지만 오늘의 고생이 헛된 것은 아닙니다. 때를 기다리세요.',
    ],
    NORMAL: [
      '순조롭게 업무가 진행됩니다. 동료들과 협력하여 무난한 하루를 보낼 수 있습니다.',
      '반복되는 일상이 지루할 수 있지만, 안정감이 있는 하루입니다. 밀린 서류 정리를 하기에 좋습니다.',
      '작은 성취감을 느낄 수 있는 날입니다. 거창한 목표보다는 오늘 끝낼 수 있는 작은 일들부터 처리하세요.',
      '일과 휴식의 균형이 필요합니다. 점심시간에는 잠시 산책을 하며 머리를 식히세요.',
      '새로운 프로젝트 제안이 들어올 수 있지만, 신중하게 검토해야 합니다. 돌다리도 두드려보고 건너세요.',
    ],
  },
  health: {
    GOOD: [
      '컨디션이 최상입니다! 몸이 깃털처럼 가볍고 에너지가 넘칩니다. 가만히 있으면 오히려 몸이 찌뿌둥하니 땀 흘리는 운동으로 에너지를 발산하세요.',
      '면역력이 좋아지는 날입니다. 평소 앓던 잔병치레가 사라지고 활력을 되찾습니다. 새로운 운동을 시작하기에 딱 좋은 날입니다.',
      '다이어트 효과가 좋은 날입니다. 오늘 흘린 땀은 배신하지 않습니다. 식단 조절도 수월하게 해낼 수 있습니다.',
      '피부 혈색이 좋아져 예뻐 보인다는 말을 듣게 됩니다. 몸과 마음의 건강 밸런스가 완벽한 하루입니다.',
      '숙면을 취하고 개운하게 일어날 수 있는 날입니다. 하루 종일 맑은 정신으로 집중력을 발휘할 수 있습니다.',
    ],
    BAD: [
      '신경성 스트레스로 인한 두통이나 소화불량을 조심하세요. 오늘은 무리한 운동보다 명상이나 스트레칭, 족욕이 좋습니다.',
      '몸살 기운이 있거나 체력이 급격히 떨어질 수 있습니다. 무리한 스케줄은 피하고 일찍 귀가하여 휴식을 취하세요.',
      '낙상이나 부상의 위험이 있습니다. 계단을 오르내리거나 운전할 때 평소보다 주의를 기울이세요.',
      '만성 피로가 몰려오는 날입니다. 커피보다는 따뜻한 차나 물을 많이 마시고, 중간중간 눈을 붙이세요.',
      '음식으로 인한 탈이 날 수 있습니다. 유통기한을 잘 확인하고, 자극적인 음식이나 과식은 절대 금물입니다.',
    ],
    NORMAL: [
      '건강 관리에 적신호는 없지만, 일교차나 감기 정도는 주의하는 것이 좋습니다. 따뜻한 옷차림을 하세요.',
      '평범한 컨디션입니다. 특별히 아픈 곳은 없지만, 그렇다고 에너지가 넘치지도 않습니다. 적당한 활동이 좋습니다.',
      '규칙적인 생활이 보약입니다. 정해진 시간에 식사하고 잠자리에 드는 것만으로도 건강을 지킬 수 있습니다.',
      '가벼운 산책이 기분 전환에 도움이 됩니다. 햇볕을 쬐며 비타민 D를 충전하세요.',
      '눈 건강에 신경 써야 합니다. 스마트폰 사용을 줄이고 먼 산을 바라보며 눈의 피로를 풀어주세요.',
    ],
  },
  human: {
    GOOD: [
      '사람이 재산인 날입니다. 모임이나 약속이 있다면 빠지지 말고 나가세요. 당신에게 도움을 줄 귀인을 만날 수 있습니다.',
      '대인관계의 폭이 넓어지는 날입니다. 새로운 사람들과도 금방 친해지고, 좋은 인맥을 쌓을 수 있습니다.',
      '인기가 많아져 찾는 사람이 많습니다. 당신의 매력과 친화력이 빛을 발하여 주변의 호감을 얻습니다.',
      '오해했던 사람과 화해하기 좋은 날입니다. 먼저 손을 내밀면 상대방도 기쁘게 받아줄 것입니다.',
      '친구들과의 수다가 힐링이 되는 날입니다. 마음속 이야기를 털어놓으며 스트레스를 날려버리세요.',
    ],
    BAD: [
      '인간관계에서 피로감을 느낄 수 있습니다. 믿었던 도끼에 발등 찍히지 않도록 오늘은 속마음을 너무 드러내지 마세요.',
      '구설수에 오르기 쉬운 날입니다. 남의 뒷담화에 동조하지 말고, 말을 아끼는 것이 상책입니다.',
      '약속이 취소되거나 상대방에게 실망할 일이 생길 수 있습니다. 너무 큰 기대는 하지 않는 것이 마음 편합니다.',
      '쓸데없는 시비나 다툼에 휘말릴 수 있습니다. "참을 인(忍) 세 번이면 살인도 면한다"는 말을 기억하세요.',
      '거절을 못 해서 곤란해질 수 있습니다. 싫은 부탁은 단호하게 거절하는 용기가 필요합니다.',
    ],
    NORMAL: [
      '원만한 대인관계를 유지합니다. 적당한 거리를 두는 것이 서로에게 편안함을 줍니다.',
      '오랜만에 연락 온 지인과 반갑게 안부를 주고받을 수 있는 날입니다.',
      '특별한 사건 사고 없이 무난한 관계가 이어집니다. 평소 소홀했던 사람들에게 안부 문자 하나 보내보세요.',
      '사람 만나는 것이 귀찮을 수 있습니다. 억지로 만나기보다 혼자만의 시간을 즐기는 것도 나쁘지 않습니다.',
      '비즈니스 관계에서는 공과 사를 명확히 구분하는 것이 좋습니다.',
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
/**
 * Get deterministic text helper based on date seed
 */
const seededPick = (arr: string[], dateSeed: string) => {
  if (!arr || arr.length === 0) return '';
  let hash = 0;
  for (let i = 0; i < dateSeed.length; i++) {
    hash = (hash << 5) - hash + dateSeed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % arr.length;
  return arr[index];
};

export const getDailyFortune = (
  userIlgan: string,
  userIlji: string,
  targetDate: Date = new Date(),
  knownGan?: string,
  knownJi?: string
): DailyFortune => {
  // Date string for seeding (YYYY-MM-DD) - ZERO PADDED for consistency
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

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

  // Clamp Score - Use seed for consistency
  // Use a slightly different seed for score random variance
  let scoreHash = 0;
  const scoreSeed = dateString + '_score';
  for (let i = 0; i < scoreSeed.length; i++) {
    scoreHash = (scoreHash << 5) - scoreHash + scoreSeed.charCodeAt(i);
    scoreHash |= 0;
  }
  const randomVariance = Math.abs(scoreHash) % 6; // 0 to 5
  const score = Math.min(99, Math.max(30, baseScore + randomVariance));

  // 5. Generate Content based on logic
  let summary = '';
  let love = '';
  let money = '';
  let job = '';
  let health = '';
  let human = '';
  let marriage = '';

  // Helper to pick based on category for more variance between categories on same day
  const pick = (arr: string[], category: string) => seededPick(arr, dateString + '_' + category);

  // 5-1. Summary
  if (relation === 'HAP') summary = pick(TEXT_DB.summary.HAP, 'summary');
  else if (relation === 'CHUNG') summary = pick(TEXT_DB.summary.CHUNG, 'summary');
  else if (relation === 'WONJIN') summary = pick(TEXT_DB.summary.WONJIN, 'summary');
  else if (relation === 'HYEONG') summary = pick(TEXT_DB.summary.HYEONG, 'summary');
  else if (score >= 80) summary = pick(TEXT_DB.summary.NORMAL_GOOD, 'summary');
  else summary = pick(TEXT_DB.summary.NORMAL_SOSO, 'summary');

  // 5-2. Love / Marriage
  const isManWealthDay = [4, 5].includes(sipsinIdx); // Jae-seong
  const isWomanOfficerDay = [6, 7].includes(sipsinIdx); // Gwan-seong
  const isOutputDay = [2, 3].includes(sipsinIdx); // Sik-Sang

  if (relation === 'CHUNG' || relation === 'WONJIN') {
    love = pick(TEXT_DB.love.COUPLE_BAD, 'love');
    marriage = pick(TEXT_DB.marriage.BAD, 'marriage');
  } else if (relation === 'HAP') {
    love = pick(TEXT_DB.love.SINGLE_GOOD, 'love');
    marriage = pick(TEXT_DB.marriage.GOOD, 'marriage');
  } else {
    // Normal days logic
    if (isManWealthDay) {
      love = `(남성 유리) ${pick(TEXT_DB.love.MEN, 'love')}`;
      marriage = `(재성운) ${pick(TEXT_DB.marriage.GOOD, 'marriage')}`;
    } else if (isWomanOfficerDay) {
      love = `(여성 유리) ${pick(TEXT_DB.love.WOMEN, 'love')}`;
      marriage = `(관성운) ${pick(TEXT_DB.marriage.GOOD, 'marriage')}`;
    } else if (isOutputDay) {
      love = `(식상운) ${pick(TEXT_DB.love.WOMEN, 'love')}`;
      marriage = pick(TEXT_DB.marriage.NORMAL, 'marriage');
    } else {
      love = pick(TEXT_DB.love.NORMAL, 'love');
      marriage = pick(TEXT_DB.marriage.NORMAL, 'marriage');
    }
  }

  // 5-3. Money
  // Wealth Days (4, 5) or Eating God (2 - Source of Wealth)
  if ([2, 4, 5].includes(sipsinIdx) && relation !== 'CHUNG') {
    money = pick(TEXT_DB.money.GOOD, 'money');
  } else if (sipsinIdx === 1 || relation === 'CHUNG') {
    // Rob Wealth (1) or Clash
    money = pick(TEXT_DB.money.BAD, 'money');
  } else {
    money = pick(TEXT_DB.money.NORMAL, 'money');
  }

  // 5-4. Job
  // Officer (7), 7Killings (6), Seal (8, 9)
  if ([6, 7].includes(sipsinIdx)) {
    job = pick(TEXT_DB.job.PROMOTION, 'job');
  } else if ([8, 9, 2].includes(sipsinIdx)) {
    // Input or Output -> Creative/Planning
    job = pick(TEXT_DB.job.CREATIVE, 'job');
  } else if (relation === 'CHUNG' || relation === 'HYEONG' || sipsinIdx === 3) {
    // Clash, Punishment, or Hurting Officer (3 - rebellion)
    job = pick(TEXT_DB.job.STRESS, 'job');
  } else {
    job = pick(TEXT_DB.job.NORMAL, 'job');
  }

  // 5-5. Health - Logic Update
  if (relation === 'CHUNG' || relation === 'HYEONG') {
    health = pick(TEXT_DB.health.BAD, 'health');
  } else if ([2, 0].includes(sipsinIdx) && relation !== 'WONJIN') {
    // Sikshin or Bijeon + not wonjin
    health = pick(TEXT_DB.health.GOOD, 'health');
  } else {
    health = pick(TEXT_DB.health.NORMAL, 'health');
  }

  // 5-6. Human - Logic Update
  if (sipsinIdx === 1 || relation === 'WONJIN' || relation === 'PA') {
    human = pick(TEXT_DB.human.BAD, 'human');
  } else if (relation === 'HAP' || sipsinIdx === 0) {
    human = pick(TEXT_DB.human.GOOD, 'human');
  } else {
    human = pick(TEXT_DB.human.NORMAL, 'human');
  }

  return {
    date: dateString,
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
