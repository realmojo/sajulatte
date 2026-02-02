import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebSEO } from '@/components/ui/WebSEO';

// Blog articles content
const blogContent: Record<string, any> = {
  'what-is-saju': {
    title: '사주명리학이란 무엇인가: 천년의 지혜를 현대에',
    description:
      '사주명리학의 역사와 기본 원리, 그리고 현대인의 삶에서 어떻게 활용할 수 있는지 상세히 알아봅니다.',
    category: '기초 지식',
    readTime: '8분',
    date: '2026-01-15',
    content: [
      {
        type: 'heading',
        text: '사주명리학의 기원',
      },
      {
        type: 'paragraph',
        text: '사주명리학(四柱命理學)은 중국 당나라 시대의 이허중(李虛中)에 의해 시작되어, 송나라의 서자평(徐子平)에 의해 체계화된 동양의 전통 철학입니다. 약 1,200년이 넘는 역사를 가지고 있으며, 한국, 중국, 일본 등 동아시아 문화권에서 널리 연구되고 활용되어 왔습니다.',
      },
      {
        type: 'heading',
        text: '사주란 무엇인가',
      },
      {
        type: 'paragraph',
        text: '사주(四柱)는 글자 그대로 "네 개의 기둥"을 의미합니다. 이는 태어난 해(年柱), 월(月柱), 일(日柱), 시(時柱)를 나타내며, 각 기둥은 천간(天干)과 지지(地支)로 구성되어 총 8개의 글자로 이루어집니다. 이를 팔자(八字)라고도 부릅니다.',
      },
      {
        type: 'list',
        items: [
          '년주(年柱): 조상과 초년운을 나타냄',
          '월주(月柱): 부모와 청년운을 나타냄',
          '일주(日柱): 본인과 배우자를 나타냄 (가장 중요)',
          '시주(時柱): 자녀와 말년운을 나타냄',
        ],
      },
      {
        type: 'heading',
        text: '오행과 음양의 원리',
      },
      {
        type: 'paragraph',
        text: '사주명리학은 음양오행(陰陽五行) 사상을 기반으로 합니다. 우주 만물은 목(木), 화(火), 토(土), 금(金), 수(水)의 다섯 가지 기본 요소로 이루어져 있으며, 각 요소는 음(陰)과 양(陽)의 속성을 가집니다. 이들 요소 간의 상생(相生)과 상극(相剋) 관계를 통해 운명의 흐름을 파악합니다.',
      },
      {
        type: 'heading',
        text: '현대 사회에서의 활용',
      },
      {
        type: 'paragraph',
        text: '오늘날 사주명리학은 단순한 점술이 아닌, 자기 이해와 인생 설계의 도구로 활용됩니다. 자신의 타고난 성향과 재능을 파악하여 적성에 맞는 직업을 선택하거나, 대인관계에서의 강점과 약점을 이해하는 데 도움을 줍니다.',
      },
      {
        type: 'list',
        items: [
          '직업 선택과 경력 개발',
          '대인관계 및 궁합 분석',
          '건강 관리와 예방',
          '중요한 결정 시기 파악',
          '자녀 교육 방향 설정',
        ],
      },
      {
        type: 'heading',
        text: '과학적 관점과 한계',
      },
      {
        type: 'paragraph',
        text: '사주명리학은 통계적 경험과 철학적 사유를 바탕으로 한 학문이지만, 현대 과학적 검증을 완전히 통과한 것은 아닙니다. 따라서 절대적인 예언으로 받아들이기보다는, 자기 성찰과 의사결정을 위한 하나의 참고 자료로 활용하는 것이 바람직합니다. 운명은 타고난 것과 노력으로 만들어가는 것이 조화를 이룰 때 가장 아름답게 펼쳐집니다.',
      },
    ],
  },
  'ten-heavenly-stems': {
    title: '천간(天干) 완벽 가이드: 열 가지 하늘의 기운',
    description: '갑(甲)부터 계(癸)까지, 십천간의 의미와 특성을 깊이 있게 탐구합니다.',
    category: '기초 지식',
    readTime: '12분',
    date: '2026-01-18',
    content: [
      {
        type: 'heading',
        text: '천간이란',
      },
      {
        type: 'paragraph',
        text: '천간(天干)은 하늘의 기운을 나타내는 10개의 기호로, 갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸)로 구성됩니다. 각 천간은 오행과 음양의 속성을 가지며, 사주에서 개인의 성격과 재능을 나타냅니다.',
      },
      {
        type: 'heading',
        text: '목(木) - 갑목과 을목',
      },
      {
        type: 'paragraph',
        text: '갑목(甲木)은 양목으로 큰 나무, 즉 소나무나 떡갈나무와 같은 교목을 상징합니다. 곧고 강직하며 리더십이 있고 정의감이 강한 특성을 가집니다. 을목(乙木)은 음목으로 화초나 넝쿨과 같은 유연한 식물을 나타냅니다. 부드럽고 적응력이 뛰어나며 예술적 감성이 풍부합니다.',
      },
      {
        type: 'heading',
        text: '화(火) - 병화와 정화',
      },
      {
        type: 'paragraph',
        text: '병화(丙火)는 양화로 태양의 불을 의미합니다. 밝고 활달하며 외향적이고 열정적인 성격을 가집니다. 정화(丁火)는 음화로 촛불이나 등잔불과 같은 작은 불을 상징합니다. 섬세하고 따뜻하며 봉사정신이 강합니다.',
      },
      {
        type: 'heading',
        text: '토(土) - 무토와 기토',
      },
      {
        type: 'paragraph',
        text: '무토(戊土)는 양토로 산이나 높은 언덕을 나타냅니다. 안정적이고 믿음직하며 포용력이 큽니다. 기토(己土)는 음토로 전답이나 정원의 흙을 의미합니다. 온화하고 배려심이 깊으며 실용적입니다.',
      },
      {
        type: 'heading',
        text: '금(金) - 경금과 신금',
      },
      {
        type: 'paragraph',
        text: '경금(庚金)은 양금으로 도끼나 칼과 같은 쇠붙이를 상징합니다. 강하고 결단력이 있으며 원칙을 중시합니다. 신금(辛金)은 음금으로 보석이나 귀금속을 나타냅니다. 세련되고 고상하며 미적 감각이 뛰어납니다.',
      },
      {
        type: 'heading',
        text: '수(水) - 임수와 계수',
      },
      {
        type: 'paragraph',
        text: '임수(壬水)는 양수로 바다나 큰 강을 의미합니다. 지혜롭고 유연하며 포용력이 있습니다. 계수(癸水)는 음수로 이슬이나 작은 샘물을 상징합니다. 순수하고 깨끗하며 직관력이 뛰어납니다.',
      },
      {
        type: 'heading',
        text: '천간의 실전 활용',
      },
      {
        type: 'paragraph',
        text: '일간(日干)의 천간은 나 자신을 나타내는 가장 중요한 요소입니다. 일간을 통해 타고난 성격, 적성, 강점과 약점을 파악할 수 있습니다. 또한 다른 천간과의 조합을 통해 대인관계, 직업 운, 재물 운 등을 종합적으로 분석할 수 있습니다.',
      },
    ],
  },
  'twelve-earthly-branches': {
    title: '지지(地支) 이해하기: 열두 가지 땅의 에너지',
    description: '자(子)부터 해(亥)까지, 십이지지의 특성과 상호작용을 자세히 설명합니다.',
    category: '기초 지식',
    readTime: '10분',
    date: '2026-01-20',
    content: [
      {
        type: 'heading',
        text: '지지란 무엇인가',
      },
      {
        type: 'paragraph',
        text: '지지(地支)는 땅의 기운을 나타내는 12개의 기호로, 자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥)로 구성됩니다. 지지는 12띠와도 관련이 있으며, 계절과 시간의 흐름을 나타냅니다.',
      },
      {
        type: 'heading',
        text: '사계절과 지지',
      },
      {
        type: 'paragraph',
        text: '지지는 1년의 12개월과 하루의 12시진을 나타냅니다. 인묘진(寅卯辰)은 봄, 사오미(巳午未)는 여름, 신유술(申酉戌)은 가을, 해자축(亥子丑)은 겨울을 상징합니다. 각 계절의 특성이 지지의 성격에 반영되어 있습니다.',
      },
      {
        type: 'list',
        items: [
          '봄(木): 인묘진 - 생동감, 성장, 시작',
          '여름(火): 사오미 - 열정, 확장, 성숙',
          '가을(金): 신유술 - 수확, 결실, 정리',
          '겨울(水): 해자축 - 저장, 휴식, 준비',
        ],
      },
      {
        type: 'heading',
        text: '12지의 개별 특성',
      },
      {
        type: 'paragraph',
        text: '자(子)는 쥐띠로 지혜와 영리함을 상징합니다. 축(丑)은 소띠로 근면과 인내를 나타냅니다. 인(寅)은 호랑이띠로 용맹과 리더십을 의미합니다. 묘(卯)는 토끼띠로 온화함과 섬세함을 상징합니다. 진(辰)은 용띠로 권위와 카리스마를 나타냅니다. 사(巳)는 뱀띠로 지혜와 신비를 의미합니다.',
      },
      {
        type: 'paragraph',
        text: '오(午)는 말띠로 활동성과 자유를 상징합니다. 미(未)는 양띠로 온순함과 예술성을 나타냅니다. 신(申)은 원숭이띠로 영리함과 재치를 의미합니다. 유(酉)는 닭띠로 정확성과 성실함을 상징합니다. 술(戌)은 개띠로 충성심과 의리를 나타냅니다. 해(亥)는 돼지띠로 복과 풍요를 의미합니다.',
      },
      {
        type: 'heading',
        text: '지지의 형충회합',
      },
      {
        type: 'paragraph',
        text: '지지는 서로 충(沖), 형(刑), 파(破), 해(害)의 나쁜 관계와 삼합(三合), 육합(六合), 방합(方合)의 좋은 관계를 형성합니다. 이러한 관계는 사주 분석에서 매우 중요하며, 운세의 길흉을 판단하는 핵심 요소입니다.',
      },
      {
        type: 'list',
        items: [
          '삼합: 인오술(화), 신자진(수), 사유축(금), 해묘미(목)',
          '육합: 자축, 인해, 묘술, 진유, 사신, 오미',
          '충: 자오, 축미, 인신, 묘유, 진술, 사해',
        ],
      },
      {
        type: 'heading',
        text: '실전에서의 활용',
      },
      {
        type: 'paragraph',
        text: '지지는 천간과 함께 사주의 근간을 이룹니다. 특히 월지(月支)는 계절을 나타내어 전체 사주의 온도를 결정하고, 일지(日支)는 배우자궁으로 결혼운을 본다는 점에서 매우 중요합니다. 지지의 형충회합을 통해 인생의 주요 변화 시기와 대인관계의 흐름을 파악할 수 있습니다.',
      },
    ],
  },
  'five-elements-basics': {
    title: '오행(五行)의 원리: 목화토금수의 순환',
    description: '오행의 상생상극 관계와 일상생활에서의 활용법을 알아봅니다.',
    category: '기초 지식',
    readTime: '9분',
    date: '2026-01-22',
    content: [
      {
        type: 'heading',
        text: '오행이란',
      },
      {
        type: 'paragraph',
        text: '오행(五行)은 우주 만물을 구성하는 다섯 가지 기본 요소인 목(木), 화(火), 토(土), 금(金), 수(水)를 말합니다. 고대 중국 철학에서 비롯된 이 개념은 자연의 순환과 변화를 설명하는 핵심 원리로, 사주명리학의 이론적 토대를 이룹니다.',
      },
      {
        type: 'heading',
        text: '목(木) - 나무의 기운',
      },
      {
        type: 'paragraph',
        text: '목은 봄, 동쪽, 청색을 상징하며 생장과 발전의 에너지를 나타냅니다. 인자하고 온화하며 성장 지향적인 특성을 가집니다. 직업으로는 교육, 출판, 섬유업 등이 해당됩니다. 목이 과하면 고집이 세고, 부족하면 추진력이 약할 수 있습니다.',
      },
      {
        type: 'heading',
        text: '화(火) - 불의 기운',
      },
      {
        type: 'paragraph',
        text: '화는 여름, 남쪽, 적색을 상징하며 열정과 확장의 에너지를 나타냅니다. 활발하고 외향적이며 표현력이 뛰어난 특성을 가집니다. 직업으로는 예술, 방송, 요식업 등이 해당됩니다. 화가 과하면 조급하고, 부족하면 소극적일 수 있습니다.',
      },
      {
        type: 'heading',
        text: '토(土) - 흙의 기운',
      },
      {
        type: 'paragraph',
        text: '토는 환절기, 중앙, 황색을 상징하며 안정과 중재의 에너지를 나타냅니다. 성실하고 믿음직하며 포용력이 있는 특성을 가집니다. 직업으로는 부동산, 건축, 농업 등이 해당됩니다. 토가 과하면 둔하고, 부족하면 불안정할 수 있습니다.',
      },
      {
        type: 'heading',
        text: '금(金) - 쇠의 기운',
      },
      {
        type: 'paragraph',
        text: '금은 가을, 서쪽, 백색을 상징하며 수렴과 의리의 에너지를 나타냅니다. 강직하고 원칙적이며 실행력이 뛰어난 특성을 가집니다. 직업으로는 금융, 법조, 군인 등이 해당됩니다. 금이 과하면 냉정하고, 부족하면 우유부단할 수 있습니다.',
      },
      {
        type: 'heading',
        text: '수(水) - 물의 기운',
      },
      {
        type: 'paragraph',
        text: '수는 겨울, 북쪽, 흑색을 상징하며 지혜와 유연성의 에너지를 나타냅니다. 총명하고 적응력이 있으며 직관력이 뛰어난 특성을 가집니다. 직업으로는 연구, 유통, 물류업 등이 해당됩니다. 수가 과하면 변덕스럽고, 부족하면 고지식할 수 있습니다.',
      },
      {
        type: 'heading',
        text: '상생(相生)의 원리',
      },
      {
        type: 'paragraph',
        text: '상생은 서로 도와주는 관계입니다. 목생화(木生火): 나무가 불을 피움, 화생토(火生土): 불이 타고 나면 재가 되어 흙이 됨, 토생금(土生金): 흙 속에서 금속이 생김, 금생수(金生水): 금속 표면에 이슬이 맺힘, 수생목(水生木): 물이 나무를 키움. 이 순환이 끊임없이 반복됩니다.',
      },
      {
        type: 'heading',
        text: '상극(相剋)의 원리',
      },
      {
        type: 'paragraph',
        text: '상극은 서로 제약하는 관계입니다. 목극토(木剋土): 나무가 흙의 양분을 흡수, 토극수(土剋水): 흙이 물을 막음, 수극화(水剋火): 물이 불을 끔, 화극금(火剋金): 불이 쇠를 녹임, 금극목(金剋木): 쇠가 나무를 자름. 상극도 과하지 않으면 균형을 유지하는 역할을 합니다.',
      },
      {
        type: 'heading',
        text: '오행의 균형',
      },
      {
        type: 'paragraph',
        text: '건강한 사주는 오행이 고르게 분포되어 있습니다. 특정 오행이 지나치게 강하거나 약하면 삶의 불균형이 생길 수 있습니다. 부족한 오행은 색상, 방향, 직업 선택 등으로 보완할 수 있으며, 과한 오행은 이를 설기(洩氣)하는 요소를 활용하여 조절할 수 있습니다.',
      },
    ],
  },
  'day-lord-analysis': {
    title: '일주(日柱) 분석법: 나의 본질 이해하기',
    description: '일간을 중심으로 사주를 분석하는 방법과 각 일주의 특성을 상세히 다룹니다.',
    category: '실전 분석',
    readTime: '15분',
    date: '2026-01-25',
    content: [
      {
        type: 'heading',
        text: '일주의 중요성',
      },
      {
        type: 'paragraph',
        text: '일주(日柱)는 사주 팔자 중에서 가장 중요한 기둥입니다. 일간(日干)은 나 자신을, 일지(日支)는 배우자와 가정을 나타냅니다. 일주 하나만으로도 성격, 적성, 배우자운, 건강 등 많은 정보를 파악할 수 있어 "소(小)사주"라고도 불립니다.',
      },
      {
        type: 'heading',
        text: '일간으로 보는 나의 본성',
      },
      {
        type: 'paragraph',
        text: '일간은 나의 핵심 정체성을 나타냅니다. 갑목일간은 곧고 정직하며 리더십이 있고, 을목일간은 유연하고 적응력이 뛰어납니다. 병화일간은 밝고 외향적이며, 정화일간은 섬세하고 따뜻합니다. 무토일간은 안정적이고 포용력이 있으며, 기토일간은 실용적이고 배려심이 깊습니다.',
      },
      {
        type: 'paragraph',
        text: '경금일간은 강하고 원칙적이며, 신금일간은 세련되고 미적 감각이 뛰어납니다. 임수일간은 지혜롭고 유연하며, 계수일간은 순수하고 직관력이 뛰어납니다. 자신의 일간을 이해하면 타고난 강점을 최대한 발휘하고 약점을 보완할 수 있습니다.',
      },
      {
        type: 'heading',
        text: '일지로 보는 배우자궁',
      },
      {
        type: 'paragraph',
        text: '일지는 배우자궁으로, 결혼운과 배우자의 성향을 파악하는 데 중요합니다. 일지에 등장하는 지지의 성격과 일간과의 관계를 통해 부부 궁합을 볼 수 있습니다. 예를 들어, 일지가 일간을 생조해주면 배우자의 도움을 받고, 일지가 일간을 극한다면 배우자와의 갈등이 있을 수 있습니다.',
      },
      {
        type: 'heading',
        text: '간지의 조화',
      },
      {
        type: 'paragraph',
        text: '일간과 일지의 조화도 중요합니다. 간지가 서로 생조하면 심신이 건강하고 안정적입니다. 갑인일주, 을묘일주처럼 간지가 같은 오행이면 "록지(祿地)"라 하여 자신감이 넘치고 독립적입니다. 반대로 간지가 충이나 극을 이루면 내면의 갈등이나 건강 문제가 있을 수 있습니다.',
      },
      {
        type: 'heading',
        text: '십이운성으로 보는 기운',
      },
      {
        type: 'paragraph',
        text: '일지에서 일간이 받는 십이운성(장생, 목욕, 관대, 건록, 제왕, 쇠, 병, 사, 묘, 절, 태, 양)도 일주 분석의 중요한 요소입니다. 장생이면 생명력이 왕성하고, 건록이면 자립심이 강하며, 제왕이면 권력욕이 있습니다. 사절지면 변화와 고난이 많을 수 있지만 지혜를 얻게 됩니다.',
      },
      {
        type: 'heading',
        text: '60갑자 일주의 분류',
      },
      {
        type: 'paragraph',
        text: '일주는 총 60개의 조합(60갑자)이 있으며, 각각 독특한 특성을 가집니다. 같은 일간이라도 일지에 따라 성격이 크게 달라집니다. 예를 들어 갑자일주와 갑오일주는 모두 갑목이지만, 자수와 오화의 차이로 전혀 다른 성향을 보입니다. 60갑자 일주 각각의 특성을 공부하면 사주 해석의 깊이가 더해집니다.',
      },
      {
        type: 'heading',
        text: '일주 분석의 활용',
      },
      {
        type: 'paragraph',
        text: '일주 분석은 자기 이해의 출발점입니다. 자신의 일주를 깊이 공부하면 왜 특정 상황에서 그렇게 행동하는지, 어떤 환경에서 편안함을 느끼는지 이해할 수 있습니다. 또한 배우자나 가족, 동료의 일주를 알면 그들을 더 잘 이해하고 조화로운 관계를 만들 수 있습니다. 일주는 변하지 않는 나의 본질이므로, 이를 인정하고 발전시키는 것이 성공적인 삶의 비결입니다.',
      },
    ],
  },
};

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const article = blogContent[id as string];
  const insets = useSafeAreaInsets();

  if (!article) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">게시글을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <WebSEO title={`${article.title} - 사주라떼`} description={article.description} />

      <ScrollView className="flex-1" contentContainerClassName="pb-20">
        {/* Header */}
        <View className="border-b border-gray-200 bg-gradient-to-b from-amber-50 to-white px-6 py-8">
          <View className="mb-3 flex-row items-center gap-3">
            <View className="rounded-full bg-amber-600 px-3 py-1">
              <Text className="text-xs font-semibold text-white">{article.category}</Text>
            </View>
            <Text className="text-sm text-gray-500">{article.readTime} 읽기</Text>
          </View>
          <Text className="mb-3 text-3xl font-bold leading-tight text-gray-900">
            {article.title}
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-600">{article.description}</Text>
          <Text className="text-sm text-gray-400">게시일: {article.date}</Text>
        </View>

        {/* Content */}
        <View className="gap-6 px-6 py-8">
          {article.content.map((section: any, index: number) => {
            if (section.type === 'heading') {
              return (
                <Text key={index} className="mt-4 text-2xl font-bold text-gray-900">
                  {section.text}
                </Text>
              );
            }
            if (section.type === 'paragraph') {
              return (
                <Text key={index} className="leading-7 text-gray-700">
                  {section.text}
                </Text>
              );
            }
            if (section.type === 'list') {
              return (
                <View key={index} className="gap-2">
                  {section.items.map((item: string, itemIndex: number) => (
                    <View key={itemIndex} className="flex-row">
                      <Text className="mr-2 text-amber-600">•</Text>
                      <Text className="flex-1 leading-6 text-gray-700">{item}</Text>
                    </View>
                  ))}
                </View>
              );
            }
            return null;
          })}
        </View>

        {/* Author Info */}
        <View className="mx-6 mb-6 rounded-2xl bg-amber-50 p-6">
          <View className="mb-3 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-amber-600">
              <Text className="text-xl">✍️</Text>
            </View>
            <View>
              <Text className="font-bold text-gray-900">사주라떼 전문가팀</Text>
              <Text className="text-sm text-gray-600">명리학 전문 연구원</Text>
            </View>
          </View>
          <Text className="leading-6 text-gray-700">
            20년 이상의 명리학 연구 경험을 가진 전문가들이 정확하고 신뢰할 수 있는 정보를 제공하기
            위해 노력하고 있습니다.
          </Text>
        </View>

        {/* Related Articles */}
        <View className="mx-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <Text className="mb-3 text-lg font-bold text-gray-900">
            💡 이 글과 함께 읽으면 좋은 글
          </Text>
          <View className="gap-2">
            <Text className="text-amber-800">• 사주명리학이란 무엇인가</Text>
            <Text className="text-amber-800">• 천간 완벽 가이드</Text>
            <Text className="text-amber-800">• 지지 이해하기</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
