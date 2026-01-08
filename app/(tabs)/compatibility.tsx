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
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
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
  HeartHandshake,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { getMyEightSaju, isSummerTime, getElementInfo } from '@/lib/utils/latte';
import { supabase } from '@/lib/supabase';
import { userService, UserProfile } from '@/lib/services/userService';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { CELEBS, Celebrity } from '@/lib/data/celebs';
import { ProfileEditModal, ProfileData } from '@/components/modal/ProfileEditModal';

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
  const { colorScheme } = useColorScheme();
  const viewShotRef = useRef<ViewShot>(null);
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showCelebModal, setShowCelebModal] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [savedList, setSavedList] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadSavedList = async () => {
        try {
          const json = await AsyncStorage.getItem('saju_list');
          if (json) {
            const list = JSON.parse(json);
            // Filter out 'me' relationships if marked, assuming first item is user if not strictly marked
            // But let's verify via 'relationship' field if available, or just show all excluding index 0 if that's the convention
            // Based on saved.tsx, index 0 is main. Let's exclude relationship === 'me'
            const filtered = list.filter((item: any) => item.relationship !== 'me');
            setSavedList(filtered);
          }
        } catch (e) {
          console.error(e);
        }
      };
      loadSavedList();
    }, [])
  );

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
      } catch (e) {
        Alert.alert('계산 오류', '사주 분석 중 오류가 발생했습니다.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleSelectFromList = (item: any) => {
    // Convert saved item to PartnerProfile
    const hourStr =
      item.birth_hour !== null && item.birth_minute !== null
        ? `${String(item.birth_hour).padStart(2, '0')}:${String(item.birth_minute).padStart(2, '0')}`
        : '';

    executeCalculate({
      name: item.name,
      gender: item.gender,
      birthYear: String(item.birth_year),
      birthMonth: String(item.birth_month),
      birthDay: String(item.birth_day),
      birthHour: hourStr,
      calendarType: item.calendar_type,
    });
  };

  const handleSavePartner = async (data: ProfileData) => {
    // Convert ProfileData to PartnerProfile format for calculation
    const hourStr =
      data.birth_hour !== null && data.birth_minute !== null
        ? `${String(data.birth_hour).padStart(2, '0')}:${String(data.birth_minute).padStart(2, '0')}`
        : '';

    executeCalculate({
      name: data.name,
      gender: data.gender,
      birthYear: String(data.birth_year),
      birthMonth: String(data.birth_month),
      birthDay: String(data.birth_day),
      birthHour: hourStr,
      calendarType: data.calendar_type,
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
    if (viewShotRef.current?.capture) {
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
    setResult(null);
    setPartner(null);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <HeartHandshake
            size={24}
            className="text-foreground"
            color={colorScheme === 'dark' ? '#fff' : '#000'}
          />
          <Text className="text-xl font-bold text-foreground">궁합</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="pb-20">
        {/* Main Content */}
        <View>
          {!result ? (
            <View className="px-6 py-8">
              <Text className="mb-6 text-xl font-bold text-gray-900">누구와 궁합을 볼까요?</Text>

              {/* Saved List */}
              {savedList.length > 0 ? (
                <View className="mb-6 gap-3">
                  {savedList.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleSelectFromList(item)}
                      activeOpacity={0.7}
                      className="flex-row items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <View className="flex-row items-center gap-4">
                        <View
                          className={`h-12 w-12 items-center justify-center rounded-full ${
                            item.gender === 'male' ? 'bg-blue-100' : 'bg-rose-100'
                          }`}>
                          <Text className="text-xl">{item.gender === 'male' ? '👨' : '👩'}</Text>
                        </View>
                        <View>
                          <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                          <Text className="text-xs text-gray-500">
                            {item.birth_year}.{item.birth_month}.{item.birth_day} ·{' '}
                            {item.relationship === 'family'
                              ? '가족'
                              : item.relationship === 'partner'
                                ? '연인'
                                : item.relationship === 'colleague'
                                  ? '동료'
                                  : '친구/기타'}
                          </Text>
                        </View>
                      </View>
                      <ChevronRight size={20} color="#9ca3af" />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View className="mb-8 items-center justify-center p-4">
                  <Text className="text-gray-400">저장된 상대가 없습니다.</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="gap-3">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowInputModal(true)}
                  className="w-full flex-row items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 shadow-sm">
                  <Plus size={20} color="white" />
                  <Text className="text-base font-bold text-white">새로운 상대 추가하기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowCelebModal(true)}
                  className="w-full flex-row items-center justify-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-6 py-4">
                  <Star size={20} color="#e11d48" />
                  <Text className="text-base font-bold text-rose-600">유명인과 궁합 보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
              <View className="bg-background px-6 pb-20 pt-4">
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
      {/* Input Modal using ProfileEditModal */}
      <ProfileEditModal
        visible={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSave={async (data) => {
          await handleSavePartner(data);
        }}
        initialData={null}
        showRelationship={false} // Compatibility usually implies a specific relationship, or we can enable it if needed
      />

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
