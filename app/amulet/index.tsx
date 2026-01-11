import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Sparkles, X, Share2, Download } from 'lucide-react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { DigitalAmulet, AmuletType } from '@/components/amulet/DigitalAmulet';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const AMULET_LIST: { type: AmuletType; title: string; desc: string }[] = [
  {
    type: 'wealth',
    title: '만사형통 부적',
    desc: '하늘과 땅의 재물 기운을 하나로 모아 금전운을 크게 열어주는 부적입니다. 막혀있던 재물 흐름을 뚫어주고, 하는 일마다 풍요로운 성과를 거두게 돕습니다.Unexpectedly, 횡재수와 사업운을 동시에 불러와 경제적인 안정을 찾고 부의 그릇을 넓혀줍니다. 지갑이나 금고 근처에 두면 그 효험이 더욱 빛을 발합니다.',
  },
  {
    type: 'love',
    title: '천생연분 부적',
    desc: '붉은 실의 인연을 끌어당겨 진정한 사랑을 찾게 돕는 신비한 부적입니다. 짝사랑은 이루어지고, 연인 사이에는 깊은 신뢰와 애정이 싹트게 합니다. 외로운 마음을 위로하고, 나를 진정으로 아껴줄 귀한 인연을 만나게 해줍니다. 사랑의 결실을 맺고, 오랫동안 행복한 관계를 유지할 수 있도록 따뜻한 기운을 불어넣어 줍니다.',
  },
  {
    type: 'health',
    title: '무병장수 부적',
    desc: '나쁜 병마와 탁한 기운을 물리치고, 생명력을 북돋아주는 치유의 부적입니다. 약해진 심신을 보호하며, 활기찬 에너지로 채워주어 건강한 삶을 영위하도록 돕습니다. 잔병치레를 막아주고, 큰 병을 예방하며, 몸과 마음의 조화를 되찾아줍니다. 가족의 건강과 장수를 기원하며 몸에 지니거나 침실에 두면 좋습니다.',
  },
  {
    type: 'success',
    title: '합격기원 부적',
    desc: '학업의 성취와 시험 합격을 강력하게 기원하는 부적입니다. 머리를 맑게 하여 집중력을 높여주고, 시험 당일 긴장하지 않고 최상의 실력을 발휘하도록 돕습니다. 노력한 만큼의 결실은 물론, 운까지 따라주어 원하는 대학이나 자격증, 승진 시험에서 반드시 좋은 결과를 얻게 해줍니다. 책상 앞이나 수험표와 함께 두세요.',
  },
  {
    type: 'business',
    title: '사업번창 부적',
    desc: '사업의 기운을 왕성하게 하여 고객을 끌어모으고 매출을 증대시키는 부적입니다. 귀인이 나타나 도움을 주고, 경쟁에서 우위를 점하게 하여 사업을 안정적인 궤도에 올려놓습니다. 막힌 자금줄을 풀고, 새로운 기회를 포착하는 지혜를 줍니다. 사무실이나 가게의 출입구, 카운터에 두어 번창의 기운을 받으세요.',
  },
  {
    type: 'promotion',
    title: '승승장구 부적',
    desc: '직장에서의 능력을 인정받고, 명예와 지위가 높아지는 입신양명의 부적입니다. 상사에게 신임을 얻고, 동료들과의 관계를 원만하게 하여 승진과 영전의 기회를 잡게 해줍니다. 리더십을 발휘할 수 있는 힘을 실어주며, 꼬인 업무를 술술 풀리게 하여 탄탄대로를 걷게 합니다. 업무 수첩이나 다이어리에 넣어 다니세요.',
  },
  {
    type: 'safety',
    title: '액운타파 부적',
    desc: '삼재와 같은 나쁜 운수와 다가오는 액운을 막아주는 수호의 부적입니다. 사고나 재난, 구설수로부터 나를 안전하게 지켜주며, 불안한 마음을 진정시켜 줍니다. 마치 든든한 방패처럼 보이지 않는 위협으로부터 보호막을 형성하여 평온한 일상을 지켜줍니다. 이동이 많거나 중요한 일을 앞두고 있을 때 지니면 더욱 좋습니다.',
  },
  {
    type: 'peace',
    title: '심신안정 부적',
    desc: '불안, 초조, 불면 등 흔들리는 마음을 다스려 깊은 평화를 가져다주는 부적입니다. 복잡한 생각과 스트레스를 씻어내고, 맑고 고요한 정신 상태를 유지하게 돕습니다. 마음의 상처를 치유하고 긍정적인 에너지를 채워주어, 어떤 상황에서도 흔들리지 않는 단단한 내면을 만들어줍니다. 잠들기 전이나 명상 시에 바라보면 좋습니다.',
  },
  {
    type: 'jackpot',
    title: '일확천금 부적',
    desc: '뜻밖의 행운과 횡재수를 불러와 일확천금의 기회를 잡게 해주는 부적입니다. 로또나 복권 당첨, 투자 성공 등 예상치 못한 금전적 이득을 기대하게 합니다. 하늘의 복을 끌어당겨 주머니를 두둑하게 하고, 경제적인 자유를 꿈꾸게 합니다. 재미 삼아 구매한 복권과 함께 보관하거나, 중요한 투자를 할 때 지니고 있으면 좋습니다.',
  },
  {
    type: 'harmony',
    title: '인화단결 부적',
    desc: '가정의 불화를 잠재우고, 사회생활에서 원만한 대인관계를 맺게 해주는 화합의 부적입니다. 다툼과 갈등을 해소하고, 서로 이해하고 배려하는 마음을 키워줍니다. 미움이 사랑으로, 오해가 이해로 바뀌는 기적을 선물합니다. 집안의 거실이나, 여러 사람이 모이는 장소에 두어 웃음이 끊이지 않는 화목한 분위기를 만드세요.',
  },
  {
    type: 'reunion',
    title: '재회성취 부적',
    desc: '헤어진 연인과 다시 만나고 싶거나, 소원해진 인간관계를 회복시켜주는 부적입니다. 간절한 그리움이 닿아 끊어진 인연의 끈을 다시 이어줍니다. 오해를 풀고 서로의 소중함을 깨닫게 하여, 예전보다 더 깊고 단단한 관계로 발전시킵니다. 떠나간 마음을 되돌리고 싶을 때 간직하세요.',
  },
  {
    type: 'popularity',
    title: '인기상승 부적',
    desc: '사람들 사이에서 인기와 평판을 높여주는 부적입니다. 나의 매력이 자연스럽게 발산되어 주변 사람들의 호감을 사고, 모임의 중심이 되도록 돕습니다. 연예인, 인플루언서, 영업직 등 대중의 관심이 필요한 분들에게 강력한 도화살의 기운을 불어넣어 줍니다.',
  },
  {
    type: 'sale',
    title: '부동산 매매 부적',
    desc: '잘 팔리지 않는 땅이나 집을 빠르게 매매하도록 돕는 부적입니다. 좋은 매수자를 만나게 하고, 원하는 가격에 거래가 성사되도록 기운을 터줍니다. 이사 날짜를 잡거나 새로운 투자를 할 때도 유리한 방향으로 이끌어줍니다. 매물 근처에 두면 더욱 효과적입니다.',
  },
  {
    type: 'legal',
    title: '관재소멸 부적',
    desc: '억울한 누명을 벗거나 소송에서 승리하도록 돕는 부적입니다. 복잡하게 얽힌 관재구설을 명쾌하게 해결하고, 법적인 문제로부터 나를 보호해줍니다. 시비나 다툼을 잠재우고, 정당한 권리를 되찾아 평온한 일상으로 복귀하게 합니다.',
  },
  {
    type: 'fertility',
    title: '순산기원 부적',
    desc: '건강하고 예쁜 아기를 기다리는 부부에게 새 생명의 기운을 전하는 부적입니다. 난임을 극복하고 순조로운 임신과 출산을 돕습니다. 산모와 태아를 보호하며, 집안에 아이의 웃음소리가 가득하도록 자손 번창의 복을 내려줍니다.',
  },
  {
    type: 'pet',
    title: '애견건강 부적',
    desc: '가족과 같은 반려동물의 건강과 안전을 지켜주는 수호 부적입니다. 질병과 사고를 막아주고, 아픈 곳이 있다면 빠른 회복을 돕습니다. 동물과 교감을 깊게 하고, 오랫동안 곁에서 함께 행복할 수 있도록 생명력을 불어넣어 줍니다.',
  },
  {
    type: 'sobriety',
    title: '금주금연 부적',
    desc: '술이나 담배 등 끊기 힘든 나쁜 습관을 의지로 이겨내게 돕는 부적입니다. 유혹을 뿌리칠 수 있는 강한 정신력을 심어주고, 건강한 몸과 마음을 되찾게 합니다. 작심삼일로 끝나지 않고 성공적인 금주/금연을 달성하도록 이끌어줍니다.',
  },
  {
    type: 'sleep',
    title: '숙면안정 부적',
    desc: '불면증에 시달리거나 악몽을 자주 꾸는 분들에게 꿀잠을 선물하는 부적입니다. 침실의 나쁜 기운을 정화하고, 편안하고 깊은 수면을 취하게 돕습니다. 자고 일어나면 머리가 맑고 개운해지며, 활기찬 아침을 맞이하게 해줍니다.',
  },
  {
    type: 'diet',
    title: '미용성형 부적',
    desc: '다이어트 의지를 불태우고 아름다움을 가꾸도록 돕는 부적입니다. 식욕을 조절하고 운동 효과를 높여 건강하게 체중을 감량하게 합니다. 내면의 자신감을 채워주어 외모뿐만 아니라 분위기까지 아름답게 변화시켜줍니다.',
  },
  {
    type: 'debt',
    title: '채무청산 부적',
    desc: '감당하기 힘든 빚을 청산하고 경제적인 자유를 찾도록 돕는 부적입니다. 새는 돈을 막고, 빚을 갚을 수 있는 능력을 키워줍니다. 흐트러진 재정 상태를 바로잡고, 다시 일어설 수 있는 희망과 기회를 가져다줍니다.',
  },
];

const CATEGORIES: { [key: string]: AmuletType[] } = {
  전체: [],
  '재물·성공': ['wealth', 'business', 'jackpot', 'promotion', 'success', 'sale', 'debt'],
  '사랑·인연': ['love', 'harmony', 'reunion', 'popularity', 'fertility'],
  '건강·안전': ['health', 'safety', 'peace', 'pet', 'sobriety', 'sleep', 'diet', 'legal'],
};

export default function AmuletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedAmulet, setSelectedAmulet] = useState<{
    type: AmuletType;
    title: string;
    desc: string;
  } | null>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredAmulets = AMULET_LIST.filter((item) => {
    if (selectedCategory === '전체') return true;
    return CATEGORIES[selectedCategory]?.includes(item.type);
  });

  const handleSave = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();

        if (Platform.OS === 'web') {
          const link = document.createElement('a');
          link.href = uri;
          link.download = `sajulatte_amulet_${selectedAmulet?.type}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Request permissions
          const { status } = await MediaLibrary.requestPermissionsAsync(true);
          if (status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(uri);
            // await MediaLibrary.createAlbumAsync('SajuLatte', asset, false); // Optional: Create an album
            alert('부적이 갤러리에 저장되었습니다.');
          } else {
            alert('갤러리 접근 권한이 필요합니다.');
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleShare = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          alert('공유 기능을 사용할 수 없습니다.');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <WebSEO
        title="디지털 부적 - 사주라떼"
        description="나만의 디지털 부적으로 행운을 높여보세요."
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">디지털 부적</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-4" contentContainerClassName="pb-20">
        {/* Banner */}
        <View className="relative mb-6 overflow-hidden rounded-2xl bg-amber-500 p-6 shadow-sm">
          <View className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-amber-400 opacity-50" />
          <View className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-amber-600 opacity-20" />
          <View className="flex-row items-center gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Sparkles size={24} color="white" />
            </View>
            <View>
              <Text className="text-lg font-bold text-white">행운을 부르는 디지털 부적</Text>
              <Text className="text-sm text-white/80">마음을 담아 간직하면 행운이 찾아옵니다.</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6 flex-row"
          contentContainerClassName="gap-2 px-1">
          {Object.keys(CATEGORIES).map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`rounded-full border px-4 py-2 ${
                selectedCategory === cat
                  ? 'border-gray-900 bg-gray-900'
                  : 'border-gray-200 bg-white'
              }`}>
              <Text
                className={`text-sm font-bold ${
                  selectedCategory === cat ? 'text-white' : 'text-gray-500'
                }`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-6">
          {filteredAmulets.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] items-center"
              onPress={() => setSelectedAmulet(item)}
              activeOpacity={0.8}>
              <View
                className="mb-2 transform overflow-hidden shadow-sm transition-all active:scale-95"
                pointerEvents="none">
                <DigitalAmulet type={item.type} width={160} height={240} />
              </View>
              <Text className="text-base font-bold text-gray-800">{item.title}</Text>
              <Text className="mt-1 text-center text-xs text-gray-500" numberOfLines={1}>
                #{item.desc.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={!!selectedAmulet}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedAmulet(null)}>
        <View className="flex-1 items-center justify-center bg-black/80 p-4">
          <View className="relative max-h-[85%] w-full max-w-sm overflow-hidden rounded-3xl bg-white">
            <TouchableOpacity
              onPress={() => setSelectedAmulet(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 shadow-sm">
              <X size={20} color="#000" />
            </TouchableOpacity>

            <ScrollView
              contentContainerClassName="p-6 items-center gap-6"
              showsVerticalScrollIndicator={false}>
              {selectedAmulet && (
                <>
                  <View className="mt-8 shadow-xl">
                    {/* Size slightly reduced for better fitting on smaller screens */}
                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
                      <DigitalAmulet type={selectedAmulet.type} width={220} height={330} />
                    </ViewShot>
                  </View>

                  <View className="items-center gap-2">
                    <Text className="text-center text-2xl font-bold text-gray-900">
                      {selectedAmulet.title}
                    </Text>
                    <Text className="select-text text-center font-medium leading-7 text-gray-600">
                      {selectedAmulet.desc}
                    </Text>
                  </View>

                  <View className="w-full gap-3 pt-2">
                    <TouchableOpacity
                      onPress={handleSave}
                      className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 shadow-sm active:bg-amber-600">
                      <Download size={20} color="white" />
                      <Text className="text-lg font-bold text-white">부적 저장하기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleShare}
                      className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-gray-100 py-4 active:bg-gray-200">
                      <Share2 size={20} color="#374151" />
                      <Text className="text-lg font-bold text-gray-700">친구에게 공유하기</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="h-4" />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
