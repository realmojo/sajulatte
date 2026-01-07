import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp, Search, BookOpen } from 'lucide-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Term = {
  term: string;
  hanja?: string;
  description: string;
  details?: string;
};

type Category = {
  id: string;
  title: string;
  description: string;
  items: Term[];
};

const ENCYCLOPEDIA_DATA: Category[] = [
  {
    id: 'basic',
    title: '기초 용어',
    description: '사주명리학 입문을 위한 핵심 개념',
    items: [
      {
        term: '사주 (Four Pillars)',
        hanja: '四柱',
        description: '사람이 태어난 연, 월, 일, 시의 네 가지 기둥.',
        details:
          '네 개의 기둥이라 하여 사주(四柱)라 부르며, 각각 연주(조상), 월주(부모/형제), 일주(자신/배우자), 시주(자녀/말년)를 의미합니다.',
      },
      {
        term: '팔자 (Eight Characters)',
        hanja: '八字',
        description: '네 개의 기둥(사주)에 각각 천간과 지지가 하나씩 있어 총 여덟 글자.',
        details: '사주와 팔자는 떼려야 뗄 수 없는 관계이므로 보통 "사주팔자"라고 합쳐서 부릅니다.',
      },
      {
        term: '명식 (Natal Chart)',
        hanja: '命式',
        description: '사주팔자를 도표로 그려놓은 것.',
        details: '자신의 운명을 분석하기 위해 천간과 지지를 배치한 사주 원국표를 말합니다.',
      },
      {
        term: '대운 (Great Luck)',
        hanja: '大運',
        description: '10년 단위로 변화하는 큰 운의 흐름.',
        details:
          '인생의 큰 계절이 바뀌는 것과 같습니다. 대운이 좋으면 매년 오는 운(세운)이 나빠도 어느 정도 커버가 됩니다.',
      },
      {
        term: '세운 (Annual Luck)',
        hanja: '歲運',
        description: '매년 들어오는 그 해의 운.',
        details:
          '연운(年運)이라고도 하며, 그 해에 일어날 수 있는 구체적인 사건, 사고, 길흉화복을 봅니다.',
      },
      {
        term: '용신 (Useful God)',
        hanja: '用神',
        description: '사주에서 가장 필요로 하고 도움이 되는 핵심 오행.',
        details:
          '내 사주의 균형을 잡아주는 "약"과 같은 존재입니다. 용신운이 오면 발복한다고 합니다.',
      },
    ],
  },
  {
    id: 'stems',
    title: '천간 (10 Heavenly Stems)',
    description: '하늘의 기운, 정신적인 면, 드러난 성격',
    items: [
      {
        term: '갑목 (Gap-Mok)',
        hanja: '甲',
        description: '양(陽)의 나무. 큰 거목, 대들보, 소나무.',
        details:
          '곧고 강직하며, 굽히지 않는 리더십과 추진력을 상징합니다. 시작과 성장의 기운이 강하며, 어진 성품(仁)을 가집니다.',
      },
      {
        term: '을목 (Eul-Mok)',
        hanja: '乙',
        description: '음(陰)의 나무. 화초, 넝쿨, 잔디.',
        details:
          '유연하고 적응력이 뛰어나며, 강한 생존력을 가집니다. 끈기와 인내심이 있고, 주변 환경을 잘 활용합니다.',
      },
      {
        term: '병화 (Byeong-Hwa)',
        hanja: '丙',
        description: '양(陽)의 불. 태양, 큰 불.',
        details:
          '세상을 환하게 비추는 태양처럼 밝고 열정적이며 공명정대합니다. 숨기는 것이 없고 화려함을 좋아합니다.',
      },
      {
        term: '정화 (Jeong-Hwa)',
        hanja: '丁',
        description: '음(陰)의 불. 촛불, 달빛, 별빛, 모닥불.',
        details:
          '따뜻하고 은근하며, 희생적인 면모(촛불)가 있습니다. 섬세하고 집중력이 뛰어나며 예의(禮)를 중시합니다.',
      },
      {
        term: '무토 (Mu-To)',
        hanja: '戊',
        description: '양(陽)의 흙. 태산, 광야, 제방.',
        details:
          '묵직하고 중후하며, 포용력이 있고 신용(信)을 중시합니다. 속을 알기 어렵지만 한번 믿음직하면 끝까지 갑니다.',
      },
      {
        term: '기토 (Gi-To)',
        hanja: '己',
        description: '음(陰)의 흙. 전원, 정원, 밭.',
        details:
          '비옥한 땅처럼 만물을 길러내는 어머니 같은 마음이 있습니다. 다정다감하고 실속을 챙기며 중재자 역할을 잘 합니다.',
      },
      {
        term: '경금 (Gyeong-Geum)',
        hanja: '庚',
        description: '양(陽)의 쇠. 무쇠, 바위, 원석, 도끼.',
        details:
          '단단하고 결단력이 있으며, 의리(義)가 매우 강합니다. 개혁적이고 숙살지기(엄숙한 기운)가 있어 맺고 끊음이 확실합니다.',
      },
      {
        term: '신금 (Sin-Geum)',
        hanja: '辛',
        description: '음(陰)의 쇠. 보석, 칼, 바늘.',
        details:
          '이미 제련된 보석처럼 예리하고 섬세하며, 깔끔하고 정확한 것을 좋아합니다. 자존심이 세고 감각이 뛰어납니다.',
      },
      {
        term: '임수 (Im-Su)',
        hanja: '壬',
        description: '양(陽)의 물. 바다, 큰 강, 호수.',
        details:
          '모든 것을 포용하는 바다처럼 지혜(智)롭고 유연하며 스케일이 큽니다. 깊은 생각과 창의성, 흐르는 성질(유통)을 가집니다.',
      },
      {
        term: '계수 (Gye-Su)',
        hanja: '癸',
        description: '음(陰)의 물. 비, 이슬, 시냇물.',
        details:
          '조용하고 침착하며, 감수성이 풍부하고 자상합니다. 만물을 적시는 생명수처럼 지혜롭고 기획력이 뛰어납니다.',
      },
    ],
  },
  {
    id: 'branches',
    title: '지지 (12 Earthly Branches)',
    description: '땅의 기운, 현실적인 환경, 시간과 계절',
    items: [
      {
        term: '자 (Ja)',
        hanja: '子',
        description: '쥐띠. 11월(동지), 한밤중(23~01시), 물(水).',
        details: '씨앗, 시작, 번식력, 비밀, 애정사, 지혜.',
      },
      {
        term: '축 (Chuk)',
        hanja: '丑',
        description: '소띠. 12월, 새벽(01~03시), 흙(土).',
        details: '인내, 근면, 보수적, 고집, 얼어붙은 땅.',
      },
      {
        term: '인 (In)',
        hanja: '寅',
        description: '호랑이띠. 1월, 새벽(03~05시), 나무(木).',
        details: '시작, 추진력, 용맹, 기획, 역마(활동성).',
      },
      {
        term: '묘 (Myo)',
        hanja: '卯',
        description: '토끼띠. 2월, 아침(05~07시), 나무(木).',
        details: '생기, 꾸미기, 도화(인기), 순수, 분주함.',
      },
      {
        term: '진 (Jin)',
        hanja: '辰',
        description: '용띠. 3월, 아침(07~09시), 흙(土).',
        details: '이상, 포부, 변화, 변동, 물 창고.',
      },
      {
        term: '사 (Sa)',
        hanja: '巳',
        description: '뱀띠. 4월, 오전(09~11시), 불(火).',
        details: '활동, 열정, 외교, 역마, 변신.',
      },
      {
        term: '오 (O)',
        hanja: '午',
        description: '말띠. 5월, 정오(11~13시), 불(火).',
        details: '정점, 도화, 공공성, 밝음, 화려함.',
      },
      {
        term: '미 (Mi)',
        hanja: '未',
        description: '양띠. 6월, 오후(13~15시), 흙(土).',
        details: '순수, 고집, 뜨거운 흙, 희생, 마무리를 준비.',
      },
      {
        term: '신 (Sin)',
        hanja: '申',
        description: '원숭이띠. 7월, 오후(15~17시), 쇠(金).',
        details: '재주, 기술, 결실, 역마, 다재다능.',
      },
      {
        term: '유 (Yu)',
        hanja: '酉',
        description: '닭띠. 8월, 저녁(17~19시), 쇠(金).',
        details: '청결, 도화, 정밀함, 예리함, 보석.',
      },
      {
        term: '술 (Sul)',
        hanja: '戌',
        description: '개띠. 9월, 저녁(19~21시), 흙(土).',
        details: '충직, 보관, 지킴, 불 창고, 이중성.',
      },
      {
        term: '해 (Hae)',
        hanja: '亥',
        description: '돼지띠. 10월, 밤(21~23시), 물(水).',
        details: '저장, 지혜, 식복, 유동성, 역마.',
      },
    ],
  },
  {
    id: 'ten_gods',
    title: '십성 (Ten Gods)',
    description: '나(일간)와 다른 글자들과의 관계 (육친)',
    items: [
      {
        term: '비견 (Bi-gyeon)',
        hanja: '比肩',
        description: '나와 오행이 같고 음양이 같은 것.',
        details:
          '어깨를 나란히 한다는 뜻으로, 형제, 자매, 친구, 동료, 경쟁자를 의미합니다. 주체성, 독립심, 고집을 상징합니다.',
      },
      {
        term: '겁재 (Geop-jae)',
        hanja: '劫財',
        description: '나와 오행이 같고 음양이 다른 것.',
        details:
          '재물을 빼앗는다는 뜻이나, 강한 승부욕, 투쟁심, 리더십, 야망을 상징하기도 합니다. 이복형제나 경쟁자를 의미합니다.',
      },
      {
        term: '식신 (Sik-sin)',
        hanja: '食神',
        description: '내가 생(生)하는 오행으로 음양이 같은 것.',
        details:
          '밥을 먹는 귀신(좋은 뜻)입니다. 의식주, 표현력, 재능, 탐구심을 상징합니다. 여명에게는 자식을 의미합니다.',
      },
      {
        term: '상관 (Sang-gwan)',
        hanja: '傷官',
        description: '내가 생(生)하는 오행으로 음양이 다른 것.',
        details:
          '관(벼슬)을 상하게 한다는 뜻입니다. 비판정신, 개혁성, 총명함, 말솜씨, 예술성, 화려한 표현력을 상징합니다.',
      },
      {
        term: '편재 (Pyeon-jae)',
        hanja: '偏財',
        description: '내가 극(剋)하는 오행으로 음양이 같은 것.',
        details:
          '치우친 재물입니다. 사업 소득, 횡재수, 투자, 유통, 활동비, 넓은 무대를 의미합니다. 남명에게는 애인(또는 부인)이나 아버지를 의미합니다.',
      },
      {
        term: '정재 (Jeong-jae)',
        hanja: '正財',
        description: '내가 극(剋)하는 오행으로 음양이 다른 것.',
        details:
          '바른 재물입니다. 월급, 고정 수입, 알뜰함, 성실함, 꼼꼼함을 상징합니다. 남명에게는 아내를 의미합니다.',
      },
      {
        term: '편관 (Pyeon-gwan)',
        hanja: '偏官',
        description: '나를 극(剋)하는 오행으로 음양이 같은 것.',
        details:
          '치우친 벼슬입니다. 권력, 명예, 카리스마, 원칙주의, 인내심, 때로는 강한 압박을 의미합니다. 여명에게는 애인(또는 남편)을 의미합니다.',
      },
      {
        term: '정관 (Jeong-gwan)',
        hanja: '正官',
        description: '나를 극(剋)하는 오행으로 음양이 다른 것.',
        details:
          '바른 벼슬입니다. 도덕, 규범, 질서, 안정된 직장, 명예, 반듯함을 상징합니다. 여명에게는 남편을 의미합니다.',
      },
      {
        term: '편인 (Pyeon-in)',
        hanja: '偏印',
        description: '나를 생(生)하는 오행으로 음양이 같은 것.',
        details:
          '치우친 도장입니다. 신비주의, 직관력, 눈치, 특수 기술, 철학, 종교 등을 상징합니다. 계모나 유모를 의미하기도 합니다.',
      },
      {
        term: '정인 (Jeong-in)',
        hanja: '正印',
        description: '나를 생(生)하는 오행으로 음양이 다른 것.',
        details:
          '바른 도장입니다. 학문, 자격증, 문서, 인정받음, 어머니와 같은 자애로움을 상징합니다. 정통성과 순수성을 추구합니다.',
      },
    ],
  },
];

export default function EncyclopediaScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleItem = (itemTerm: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems((prev) =>
      prev.includes(itemTerm) ? prev.filter((t) => t !== itemTerm) : [...prev, itemTerm]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="z-10 flex-row items-center justify-between bg-white px-4 pb-4 pt-14 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="-ml-2 w-10 p-2">
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">사주 용어 백과</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-10">
        {/* Intro Card */}
        <View className="mb-6 rounded-2xl bg-blue-500 p-6 shadow-md">
          <View className="mb-2 flex-row items-center gap-2">
            <BookOpen size={24} color="white" />
            <Text className="text-lg font-bold text-white">알기 쉬운 사주 이야기</Text>
          </View>
          <Text className="leading-6 text-blue-50">
            어렵게만 느껴졌던 사주 용어들, 이제 쉽고 명쾌하게 이해해보세요. 궁금한 카테고리를 눌러
            자세한 내용을 확인할 수 있습니다.
          </Text>
        </View>

        <View className="gap-4">
          {ENCYCLOPEDIA_DATA.map((category) => {
            const isExpanded = expandedSection === category.id;

            return (
              <View
                key={category.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleSection(category.id)}
                  className={`flex-row items-center justify-between p-5 ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}>
                  <View className="flex-1 pr-4">
                    <Text className="mb-1 text-lg font-bold text-gray-900">{category.title}</Text>
                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                      {category.description}
                    </Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={20} color="#6b7280" />
                  ) : (
                    <ChevronDown size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View className="border-t border-gray-100 bg-white px-2">
                    {category.items.map((item, index) => {
                      const isItemExpanded = expandedItems.includes(item.term);
                      const isLast = index === category.items.length - 1;

                      return (
                        <TouchableOpacity
                          key={item.term}
                          activeOpacity={0.7}
                          onPress={() => toggleItem(item.term)}
                          className={`p-4 ${!isLast ? 'border-b border-gray-50' : ''}`}>
                          <View className="flex-row items-start justify-between">
                            <View className="flex-1">
                              <View className="mb-1 flex-row items-center gap-2">
                                <Text className="text-base font-bold text-gray-800">
                                  {item.term}
                                </Text>
                                {item.hanja && (
                                  <Text className="rounded bg-amber-50 px-1.5 py-0.5 text-sm font-medium text-amber-600">
                                    {item.hanja}
                                  </Text>
                                )}
                              </View>
                              <Text className="text-sm leading-5 text-gray-600">
                                {item.description}
                              </Text>
                            </View>
                            <View className="ml-2 mt-1">
                              {isItemExpanded ? (
                                <ChevronUp size={16} color="#9ca3af" />
                              ) : (
                                <ChevronDown size={16} color="#9ca3af" />
                              )}
                            </View>
                          </View>

                          {isItemExpanded && item.details && (
                            <View className="mt-3 rounded-lg bg-gray-50 p-3">
                              <Text className="text-sm leading-5 text-gray-700">
                                <Text className="font-bold">💡 상세설명: </Text>
                                {item.details}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
