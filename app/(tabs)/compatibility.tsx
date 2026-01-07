import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  X,
  Heart,
  Plus,
  Sparkles,
  TrendingUp,
  Calendar,
  Share,
  Search,
  Star,
} from 'lucide-react-native';
import { getMyEightSaju, isSummerTime, getElementInfo } from '@/lib/utils/latte';
import { supabase } from '@/lib/supabase';
import { userService, UserProfile } from '@/lib/services/userService';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { CELEBS, Celebrity } from '@/lib/data/celebs';

type Gender = 'male' | 'female';
type CalendarType = 'solar' | 'lunar';

interface PartnerProfile {
  name: string;
  gender: Gender;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  calendarType: CalendarType;
}

interface ElementData {
  element: string; // WOOD, FIRE...
  label: string;
  color: string;
  meScore: number;
  youScore: number;
}

interface CompatibilityResult {
  score: number;
  verdict: string;
  keywords: string[];
  description: string;
  graphData: ElementData[];
  dateAdvice: {
    title: string;
    content: string;
    luckyColor: string;
    luckyPlace: string;
  };
}

const ELEMENT_LABELS: Record<string, string> = {
  WOOD: '목',
  FIRE: '화',
  EARTH: '토',
  METAL: '금',
  WATER: '수',
};

// Simple compatibility logic helper
const calculateRealCompatibility = (meSaju: any, youSaju: any) => {
  // 1. Element Balance Check
  const meDist = meSaju.distributions; // { WOOD: 20, ... }
  const youDist = youSaju.distributions;

  // Normalize scores
  const elements = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];

  // Graph Data Preparation
  const graphData: ElementData[] = elements.map((el) => ({
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

  // Determine Missing/Excess Elements
  const getWeakest = (dist: any) => elements.reduce((a, b) => (dist[a] < dist[b] ? a : b));
  const getStrongest = (dist: any) => elements.reduce((a, b) => (dist[a] > dist[b] ? a : b));

  const meWeak = getWeakest(meDist);
  const meStrong = getStrongest(meDist);
  const youWeak = getWeakest(youDist);
  const youStrong = getStrongest(youDist);

  // Score Calculation
  let score = 70; // Base score

  // (1) Complementary check
  if (youStrong === meWeak) score += 15;
  // (2) Does Partner need my strongest element?
  if (meStrong === youWeak) score += 15;

  // (3) Ilgan (Day Master) Harmony (Simple check)
  const nameCode = (meSaju.meta.ilgan.charCodeAt(0) + youSaju.meta.ilgan.charCodeAt(0)) % 20;
  score += nameCode - 10;

  score = Math.min(100, Math.max(40, score)); // Clamp 40-100

  // Verdict
  let verdict = '';
  if (score >= 90) verdict = '천생연분';
  else if (score >= 80) verdict = '좋은 인연';
  else if (score >= 70) verdict = '무난한 사이';
  else verdict = '노력이 필요해요';

  // Keywords
  const keywords = [];
  if (score >= 85) keywords.push('#찰떡궁합');
  if (youStrong === meWeak) keywords.push('#상호보완');
  else if (youStrong === meStrong) keywords.push('#비슷한성향');

  if (score < 60) keywords.push('#티격태격');
  else keywords.push('#평화주의');

  if (meStrong === 'FIRE' || youStrong === 'FIRE') keywords.push('#불꽃같은사랑');

  const description =
    score >= 80
      ? '두 분은 서로에게 부족한 기운을 채워줄 수 있는 훌륭한 관계입니다. 서로 다른 점이 오히려 매력으로 다가올 것입니다.'
      : score >= 60
        ? '가끔은 의견 차이가 있을 수 있지만, 대화를 통해 충분히 맞춰갈 수 있는 무난한 궁합입니다.'
        : '서로의 성향이 많이 다릅니다. 다름을 인정하고 배려한다면 새로운 시너지를 낼 수 있습니다.';

  // Date Advice
  const today = new Date();
  const advIdx = (today.getDate() + score) % 3;
  let dateAdvice = {
    title: '',
    content: '',
    luckyColor: '',
    luckyPlace: '',
  };

  if (advIdx === 0) {
    dateAdvice = {
      title: '차분한 대화가 필요한 날',
      content:
        '오늘은 조용한 곳에서 깊은 대화를 나누기 좋은 날입니다. 서로의 속마음을 털어놓아 보세요.',
      luckyColor: '#3b82f6', // Blue
      luckyPlace: '조용한 카페, 서점',
    };
  } else if (advIdx === 1) {
    dateAdvice = {
      title: '활동적인 데이트 추천!',
      content: '에너지가 넘치는 날입니다. 함께 땀을 흘리거나 새로운 곳으로 떠나보세요.',
      luckyColor: '#ef4444', // Red
      luckyPlace: '테마파크, 스포츠 관람',
    };
  } else {
    dateAdvice = {
      title: '감성 충전의 시간',
      content: '문화 생활을 즐기거나 맛있는 음식을 먹으며 힐링하는 시간을 가져보세요.',
      luckyColor: '#f59e0b', // Yellow
      luckyPlace: '전시회, 영화관, 맛집',
    };
  }

  return { score, verdict, keywords, description, graphData, dateAdvice };
};

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets();
  const viewShotRef = useRef<ViewShot>(null);
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showCelebModal, setShowCelebModal] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);

  // Input form states
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await userService.getUser(user.id);
        if (data) setMyProfile(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeCalculate = (targetPartner: PartnerProfile) => {
    if (!myProfile) {
      Alert.alert('로그인 필요', '먼저 나의 사주 정보를 설정 탭에서 입력해주세요.');
      return;
    }
    if (!myProfile.birth_year || !myProfile.birth_month || !myProfile.birth_day) {
      Alert.alert('정보 부족', '설정 탭에서 나의 생년월일을 정확히 입력해주세요.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        // 1. Calculate My Saju
        const meSaju = getMyEightSaju(
          myProfile.birth_year!,
          myProfile.birth_month!,
          myProfile.birth_day!,
          myProfile.birth_hour || 0,
          myProfile.birth_minute || 0,
          myProfile.gender || 'male'
        );

        // 2. Calculate Partner Saju
        // Parse birthHour "HH:mm"
        let h = 0;
        let m = 0;
        if (targetPartner.birthHour && targetPartner.birthHour.includes(':')) {
          const parts = targetPartner.birthHour.split(':');
          h = parseInt(parts[0]);
          m = parseInt(parts[1]);
        }

        const youSaju = getMyEightSaju(
          parseInt(targetPartner.birthYear),
          parseInt(targetPartner.birthMonth),
          parseInt(targetPartner.birthDay),
          h,
          m,
          targetPartner.gender
        );

        // 3. Compute Compatibility
        const compResult = calculateRealCompatibility(meSaju, youSaju);

        setPartner(targetPartner);
        setResult(compResult);
        setShowInputModal(false);
        setShowCelebModal(false);

        // Update input fields to match calculation
        setName(targetPartner.name);
        setGender(targetPartner.gender);
        setBirthDate(
          `${targetPartner.birthYear}${targetPartner.birthMonth.padStart(2, '0')}${targetPartner.birthDay.padStart(2, '0')}`
        );
        setBirthTime(targetPartner.birthHour ? targetPartner.birthHour.replace(':', '') : '');
      } catch (e) {
        Alert.alert('계산 오류', '사주 분석 중 오류가 발생했습니다.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleCalculateFromForm = () => {
    if (!name || birthDate.length !== 8) {
      Alert.alert('입력 오류', '이름과 생년월일(8자리)을 정확히 입력해주세요.');
      return;
    }

    const year = birthDate.substring(0, 4);
    const month = birthDate.substring(4, 6);
    const day = birthDate.substring(6, 8);

    if (isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
      Alert.alert('입력 오류', '올바른 날짜 형식이 아닙니다.');
      return;
    }

    let hourStr = '';
    if (birthTime.length === 4) {
      const h = birthTime.substring(0, 2);
      const m = birthTime.substring(2, 4);
      hourStr = `${h}:${m}`;
    }

    executeCalculate({
      name,
      gender,
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      birthHour: hourStr,
      calendarType,
    });
  };

  const handleCelebSelect = (celeb: Celebrity) => {
    executeCalculate({
      name: celeb.name,
      gender: celeb.gender,
      birthYear: celeb.birthYear,
      birthMonth: celeb.birthMonth,
      birthDay: celeb.birthDay,
      birthHour: celeb.birthHour || '',
      calendarType: 'solar', // Celeb info is usually solar
    });
  };

  const handleShare = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri);
      } catch (error) {
        Alert.alert('오류', '공유하기 기능에 문제가 발생했습니다.');
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setGender('female');
    setBirthDate('');
    setBirthTime('');
    setCalendarType('solar');
    setResult(null);
    setPartner(null);
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="p-4 pb-20">
        {/* Header */}
        <View className="mb-6 mt-2">
          <Text className="text-2xl font-bold text-gray-900">나의 인연 찾기 💕</Text>
          <Text className="mt-1 text-gray-500">오행 분석을 통해 상세한 궁합을 확인합니다.</Text>
        </View>

        {/* Main Card */}
        <View className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {!result ? (
            <View className="items-center px-6 py-8">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-rose-50">
                <Heart size={32} color="#fb7185" fill="#fb7185" />
              </View>
              <Text className="mb-2 text-lg font-bold text-gray-800">
                아직 등록된 상대가 없어요
              </Text>
              <Text className="mb-6 text-center text-gray-500">
                상대방의 정보를 입력하고{'\n'}두 사람의 오행 궁합을 확인해보세요!
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowInputModal(true)}
                className="mb-3 w-full flex-row items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3">
                <Plus size={18} color="white" />
                <Text className="font-bold text-white">상대방 추가하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCelebModal(true)}
                className="w-full flex-row items-center justify-center gap-2 rounded-full bg-rose-100 px-6 py-3">
                <Star size={18} color="#e11d48" />
                <Text className="font-bold text-rose-600">유명인과 궁합 보기</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
              <View className="bg-white p-6">
                {/* Top: Names & Reset */}
                <View className="mb-6 flex-row items-start justify-between">
                  <View>
                    <Text className="mb-1 text-sm text-gray-500">상대방</Text>
                    <Text className="text-xl font-bold text-gray-900">{partner?.name}</Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={handleShare}
                      className="rounded-full bg-gray-100 p-2">
                      <Share size={18} color="#4b5563" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('다시 입력하기', '정보를 지우고 다시 입력하시겠습니까?', [
                          { text: '취소', style: 'cancel' },
                          { text: '확인', onPress: resetForm },
                        ]);
                      }}
                      className="justify-center rounded-full bg-gray-100 px-3 py-2">
                      <Text className="text-xs font-bold text-gray-600">다시하기</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Score & Verdict */}
                <View className="mb-8 items-center">
                  <View className="relative items-center justify-center">
                    <Text className="mb-2 text-6xl font-black text-rose-500">{result.score}</Text>
                    <Text className="rounded-full bg-rose-50 px-4 py-1 text-lg font-bold text-gray-800 text-rose-600">
                      {result.verdict}
                    </Text>
                  </View>
                </View>

                {/* Keywords */}
                <View className="mb-8 flex-row flex-wrap justify-center gap-2">
                  {result.keywords.map((keyword, index) => (
                    <Text
                      key={index}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                      {keyword}
                    </Text>
                  ))}
                </View>

                <View className="mb-8 rounded-xl bg-gray-50 p-4">
                  <Text className="text-center leading-6 text-gray-700">{result.description}</Text>
                </View>

                {/* Five Elements Graph */}
                <View className="mb-8">
                  <View className="mb-4 flex-row items-center gap-2">
                    <TrendingUp size={20} className="text-gray-900" color="black" />
                    <Text className="text-lg font-bold text-gray-900">오행 에너지 비교</Text>
                  </View>

                  <View className="gap-3">
                    {result.graphData.map((data, idx) => {
                      // Simple max for scaling
                      const maxScore = 150;
                      const meWidth = Math.min((data.meScore / maxScore) * 100, 100);
                      const youWidth = Math.min((data.youScore / maxScore) * 100, 100);

                      return (
                        <View key={idx} className="flex-row items-center gap-3">
                          <View className="w-8 items-center justify-center rounded-md bg-gray-100 py-1">
                            <Text className="font-bold text-gray-600">{data.label}</Text>
                          </View>
                          <View className="flex-1 gap-1">
                            {/* My Bar */}
                            <View className="flex-row items-center gap-2">
                              <View
                                style={{ width: `${meWidth}%`, backgroundColor: data.color }}
                                className="h-2 rounded-full opacity-80"
                              />
                            </View>
                            {/* Partner Bar */}
                            <View className="flex-row items-center gap-2">
                              <View
                                style={{ width: `${youWidth}%`, backgroundColor: data.color }}
                                className="h-2 rounded-full opacity-40"
                              />
                            </View>
                          </View>
                        </View>
                      );
                    })}
                    <View className="mt-2 flex-row justify-end gap-4">
                      <View className="flex-row items-center gap-1">
                        <View className="h-2 w-2 rounded-full bg-gray-600" />
                        <Text className="text-xs text-gray-500">나</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <View className="h-2 w-2 rounded-full bg-gray-300" />
                        <Text className="text-xs text-gray-500">상대방</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Date Advice */}
                <View className="mb-0 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                  <View className="mb-3 flex-row items-center gap-2">
                    <Sparkles size={18} className="text-blue-600" color="#2563eb" />
                    <Text className="text-base font-bold text-blue-900">오늘의 데이트 조언</Text>
                  </View>

                  <Text className="mb-1 text-lg font-bold text-gray-900">
                    {result.dateAdvice.title}
                  </Text>
                  <Text className="mb-4 leading-5 text-gray-600">{result.dateAdvice.content}</Text>

                  <View className="flex-row gap-2">
                    <View className="rounded-lg border border-blue-100 bg-white px-3 py-1">
                      <Text className="text-xs text-gray-500">행운의 장소</Text>
                      <Text className="font-medium text-blue-700">
                        {result.dateAdvice.luckyPlace}
                      </Text>
                    </View>
                    <View className="rounded-lg border border-blue-100 bg-white px-3 py-1">
                      <Text className="text-xs text-gray-500">행운의 컬러</Text>
                      <View className="flex-row items-center gap-1">
                        <View
                          style={{ backgroundColor: result.dateAdvice.luckyColor }}
                          className="h-3 w-3 rounded-full"
                        />
                        <Text className="font-medium text-blue-700">
                          {result.dateAdvice.luckyColor === '#3b82f6'
                            ? '블루'
                            : result.dateAdvice.luckyColor === '#ef4444'
                              ? '레드'
                              : '옐로우'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ViewShot>
          )}
        </View>
      </ScrollView>

      {/* Input Modal */}
      <Modal
        visible={showInputModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInputModal(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
            <Text className="text-lg font-bold">상대방 정보 입력</Text>
            <TouchableOpacity onPress={() => setShowInputModal(false)} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
            <View className="gap-6 pb-10">
              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-600">이름</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="상대방의 이름을 입력하세요"
                  className="w-full rounded-xl bg-gray-50 p-4 text-base text-gray-900"
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-600">성별</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setGender('male')}
                    className={`flex-1 items-center rounded-xl border p-4 ${gender === 'male' ? 'border-blue-200 bg-blue-50' : 'border-transparent bg-gray-50'}`}>
                    <Text
                      className={`font-semibold ${gender === 'male' ? 'text-blue-600' : 'text-gray-500'}`}>
                      남성
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGender('female')}
                    className={`flex-1 items-center rounded-xl border p-4 ${gender === 'female' ? 'border-rose-200 bg-rose-50' : 'border-transparent bg-gray-50'}`}>
                    <Text
                      className={`font-semibold ${gender === 'female' ? 'text-rose-600' : 'text-gray-500'}`}>
                      여성
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-600">생년월일 (8자리)</Text>
                <TextInput
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder="예: 19950815"
                  keyboardType="number-pad"
                  maxLength={8}
                  className="w-full rounded-xl bg-gray-50 p-4 text-base text-gray-900"
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-600">
                  태어난 시간 (4자리, 선택)
                </Text>
                <TextInput
                  value={birthTime}
                  onChangeText={setBirthTime}
                  placeholder="예: 1430 (오후 2시 30분)"
                  keyboardType="number-pad"
                  maxLength={4}
                  className="w-full rounded-xl bg-gray-50 p-4 text-base text-gray-900"
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-600">양력/음력</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setCalendarType('solar')}
                    className={`flex-1 items-center rounded-xl border p-3 ${calendarType === 'solar' ? 'border-amber-200 bg-amber-50' : 'border-transparent bg-gray-50'}`}>
                    <Text
                      className={`font-medium ${calendarType === 'solar' ? 'text-amber-700' : 'text-gray-500'}`}>
                      양력
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setCalendarType('lunar')}
                    className={`flex-1 items-center rounded-xl border p-3 ${calendarType === 'lunar' ? 'border-amber-200 bg-amber-50' : 'border-transparent bg-gray-50'}`}>
                    <Text
                      className={`font-medium ${calendarType === 'lunar' ? 'text-amber-700' : 'text-gray-500'}`}>
                      음력
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCalculateFromForm}
                disabled={loading}
                className={`mt-6 w-full items-center rounded-xl p-4 shadow-sm ${loading ? 'bg-gray-400' : 'bg-gray-900'}`}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-bold text-white">궁합 보기</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Celeb Modal */}
      <Modal
        visible={showCelebModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCelebModal(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
            <Text className="text-lg font-bold">유명인 선택</Text>
            <TouchableOpacity onPress={() => setShowCelebModal(false)} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={CELEBS}
            keyExtractor={(item) => item.id}
            contentContainerClassName="p-4"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCelebSelect(item)}
                className="mb-3 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <Text className="text-xl">🌟</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                    {item.group && (
                      <Text className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                        {item.group}
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm text-gray-500">
                    {item.job} · {item.birthYear}.{item.birthMonth}.{item.birthDay}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
