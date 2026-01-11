import * as React from 'react';
import {
  Circle,
  CircleHelp,
  CircleX,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Svg, {
  Circle as SvgCircle,
  Defs,
  G,
  Line,
  Marker,
  Polygon,
  Text as SvgText,
} from 'react-native-svg';
import { CalendarDays } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/text';
import {
  getMonthList,
  getMyEightSaju,
  getYearList,
  calc12ShinSal,
  getSpecialShinSals,
  getCurrentYearJi,
  getGongmang,
  get12Wunsung,
  getShinsalFromWunsung,
} from '@/lib/utils/latte';
import { ENCYCLOPEDIA_DATA } from '@/lib/utils/encyclopedia';

interface SajuResultProps {
  name: string;
  year: number; // YYYY
  month: number;
  day: number;
  hour?: number; // 0-23
  minute?: number;
  gender: 'male' | 'female';
  calendarType?: string;
  isLeapMonth?: boolean;
}

export const SajuResultView = ({
  name,
  year,
  month,
  day,
  hour = 0,
  minute = 0,
  gender,
  calendarType = 'solar',
  isLeapMonth = false,
}: SajuResultProps) => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // Calculate Saju
  const [saju, setSaju] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadSaju() {
      try {
        const data = await getMyEightSaju({
          year,
          month,
          day,
          hour,
          minute,
          gender,
          calendarType,
          isLeapMonth,
        });
        console.log(data);
        setSaju(data);
      } catch (e) {
        console.error(e);
        setSaju(null);
      }
    }
    loadSaju();
  }, [year, month, day, hour, minute, gender, calendarType, isLeapMonth]);

  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';
  const [sewunData, setSewunData] = React.useState<any[]>([]);
  const [selectedAge, setSelectedAge] = React.useState<number | null>(null);
  const [monthData, setMonthData] = React.useState<any[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);
  const [infoModal, setInfoModal] = React.useState<{ title: string; content: string } | null>(null);

  React.useEffect(() => {
    if (saju && saju.yearList && saju.yearList.length > 0) {
      setSewunData(saju.yearList);
      // 초기 선택된 대운 찾기
      const startYear = saju.yearList[0].year;
      const age = startYear - year + 1;
      setSelectedAge(age);

      // 초기 선택된 세운(연도) 설정 및 월운 데이터 생성
      setSelectedYear(startYear);
      const mList = getMonthList(startYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
      setMonthData(mList);
    }
  }, [saju, year]);

  const handleDaewunPress = (daewunAge: number) => {
    if (!saju) return;
    setSelectedAge(daewunAge);
    // 선택된 대운의 시작 연도 계산
    const startYear = year + daewunAge - 1;
    const newSewun = getYearList(startYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
    setSewunData(newSewun);

    // 대운 변경 시 첫 번째 세운의 월운으로 갱신
    if (newSewun.length > 0) {
      const firstYear = newSewun[0].year;
      setSelectedYear(firstYear);
      const mList = getMonthList(firstYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
      setMonthData(mList);
    }
  };

  const handleYearPress = (targetYear: number) => {
    if (!saju) return;
    setSelectedYear(targetYear);
    const mList = getMonthList(targetYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
    setMonthData(mList);
  };

  const openInfoModal = (type: 'daewun' | 'sewun' | 'wolwun') => {
    const info = {
      daewun: {
        title: '대운 (10년 운)',
        content:
          '10년마다 바뀌는 큰 운의 흐름입니다.\n인생의 큰 계절과 같아서 전체적인 환경과 분위기를 좌우합니다.',
      },
      sewun: {
        title: '세운 (1년 운)',
        content:
          '매년 들어오는 운으로, 그 해의 구체적인 사건이나 상황에 영향을 미칩니다.\n대운이라는 환경 속에서 일어나는 날씨와 같습니다.',
      },
      wolwun: {
        title: '월운 (매월 운)',
        content: '매달 바뀌는 운으로, 세운의 흐름 안에서 구체적인 월별 변화를 보여줍니다.',
      },
    };
    setInfoModal(info[type]);
  };

  const handleShinSalClick = (salName: string) => {
    if (!salName || salName === '-') return;

    // Find description in Encyclopedia
    let foundItem = null;
    for (const category of ENCYCLOPEDIA_DATA) {
      // Priority 1: Exact Hanja match (Best for Stems/Branches)
      const hanjaMatch = category.items.find((i) => i.hanja === salName);
      if (hanjaMatch) {
        foundItem = hanjaMatch;
        break;
      }

      // Priority 2: Exact Korean match (e.g. '비견' === '비견')
      const termKr = (item: any) => item.term.split(' ')[0];
      const exactMatch = category.items.find((i) => termKr(i) === salName || i.term === salName);
      if (exactMatch) {
        foundItem = exactMatch;
        break;
      }

      // Priority 3: Starts With (e.g. '역마' -> '역마살', '갑' -> '갑목')
      const startsWithMatch = category.items.find((i) => termKr(i).startsWith(salName));
      if (startsWithMatch) {
        foundItem = startsWithMatch;
        break;
      }
    }

    if (foundItem) {
      setInfoModal({
        title: foundItem.term,
        content: `${foundItem.description}\n\n${foundItem.details || ''}`,
      });
    } else {
      // Fallback for known terms not in encyclopedia yet?
      // Or just simple toast? For now, nothing or simple text.
      setInfoModal({
        title: salName,
        content: '신살에 대한 상세 설명이 준비 중입니다.',
      });
    }
  };

  if (!saju) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <ActivityIndicator size="large" color="#d97706" />
        <Text className="mt-4 text-base font-medium text-gray-500">
          사주 정보를 분석하고 있습니다...
        </Text>
      </View>
    );
  }

  const columns = [saju.hour, saju.day, saju.month, saju.year];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <CalendarDays size={24} className="text-foreground" color={iconColor} />
          <Text className="text-xl font-bold text-foreground">만세력</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 gap-10" className="flex-1 bg-background">
        <View className="pt-2">
          <View className="relative overflow-hidden rounded-3xl border border-gray-300 bg-white">
            {/* Top Accent Bar */}
            <View
              className="h-3 w-full opacity-80"
              style={{ backgroundColor: saju.day.gan.color }}
            />

            <View className="p-6">
              <View className="flex-row items-start justify-between">
                {/* Left Info */}
                <View className="flex-1 gap-1">
                  <Text className="text-2xl font-bold text-gray-900">{name}님</Text>
                  <Text className="mb-4 text-sm text-gray-400">운명의 사주 명식표</Text>

                  <View className="gap-3">
                    <View className="flex-row items-center gap-2">
                      <View className="rounded-md border border-rose-100 bg-rose-50 px-2 py-1">
                        <Text className="text-[10px] font-bold text-rose-600">양력</Text>
                      </View>
                      <Text className="text-sm font-medium text-gray-700">
                        {saju.meta.solar} <Text className="text-gray-400">|</Text>{' '}
                        {saju.meta.solarTime}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <View className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1">
                        <Text className="text-[10px] font-bold text-indigo-600">음력</Text>
                      </View>
                      <Text className="text-sm font-medium text-gray-700">{saju.meta.lunar}</Text>
                    </View>

                    <View className="mt-1 flex-row items-center gap-2">
                      <View className="rounded-full bg-gray-100 px-2 py-0.5">
                        <Text className="text-[10px] text-gray-500">
                          {gender === 'male' ? '남성' : '여성'}
                        </Text>
                      </View>
                      <View className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5">
                        <Text className="text-[10px] font-bold text-amber-700">
                          {saju.day.gan.hanja}
                          {saju.day.ji.hanja}({saju.day.korean})일주
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Right Symbol (Ilgan) */}
                <View className="ml-2 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50 p-3">
                  <Text className="mb-1 text-[10px] font-medium text-gray-400">본원(나)</Text>
                  <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <Text className="text-2xl font-black" style={{ color: saju.day.gan.color }}>
                      {saju.day.gan.hanja}
                    </Text>
                  </View>
                  <Text className="mb-1 text-xs font-bold text-gray-800">
                    {saju.day.gan.korean}
                  </Text>

                  {/* Animal Badge & Image */}
                  {(() => {
                    const GAN_COLOR: Record<string, string> = {
                      甲: '푸른',
                      乙: '푸른',
                      丙: '붉은',
                      丁: '붉은',
                      戊: '황금',
                      己: '황금',
                      庚: '하얀',
                      辛: '하얀',
                      壬: '검은',
                      癸: '검은',
                    };
                    const JI_ANIMAL: Record<string, string> = {
                      子: '쥐',
                      丑: '소',
                      寅: '호랑이',
                      卯: '토끼',
                      辰: '용',
                      巳: '뱀',
                      午: '말',
                      未: '양',
                      申: '원숭이',
                      酉: '닭',
                      戌: '개',
                      亥: '돼지',
                    };

                    const ZODIAC_IMAGES: Record<string, any> = {
                      子: require('../assets/images/zodiac_transparent/rat.png'),
                      丑: require('../assets/images/zodiac_transparent/ox.png'),
                      寅: require('../assets/images/zodiac_transparent/tiger.png'),
                      卯: require('../assets/images/zodiac_transparent/rabbit.png'),
                      辰: require('../assets/images/zodiac_transparent/dragon.png'),
                      巳: require('../assets/images/zodiac_transparent/snake.png'),
                      午: require('../assets/images/zodiac_transparent/horse.png'),
                      未: require('../assets/images/zodiac_transparent/sheep.png'),
                      申: require('../assets/images/zodiac_transparent/monkey.png'),
                      酉: require('../assets/images/zodiac_transparent/rooster.png'),
                      戌: require('../assets/images/zodiac_transparent/dog.png'),
                      亥: require('../assets/images/zodiac_transparent/pig.png'),
                    };

                    const color = GAN_COLOR[saju.day.gan.hanja] || '';
                    const animal = JI_ANIMAL[saju.day.ji.hanja] || '';
                    const imageSource = ZODIAC_IMAGES[saju.day.ji.hanja];

                    if (color && animal) {
                      return (
                        <View className="items-center gap-1">
                          <View className="mb-0.5 rounded-full bg-slate-800 px-2 py-0.5 shadow-sm">
                            <Text className="text-[9px] font-bold text-white">
                              {color} {animal}
                            </Text>
                          </View>
                          {imageSource && (
                            <Image
                              source={imageSource}
                              style={{ width: 40, height: 40 }}
                              resizeMode="contain"
                            />
                          )}
                        </View>
                      );
                    }
                    return null;
                  })()}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Four Pillars Table */}
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-foreground">만세력</Text>
            {/* <TouchableOpacity onPress={() => openInfoModal('daewun')}>
            <CircleHelp size={16} color="#A3A3A3" />
          </TouchableOpacity> */}
          </View>
          <View className="overflow-hidden rounded-xl border border-gray-300 bg-white">
            {/* Header Row */}
            <View className="flex-row border-b border-gray-200 bg-gray-50">
              <View className="w-12 items-center justify-center p-2" />
              {['생시', '생일', '생월', '생년'].map((title, i) => (
                <View
                  key={i}
                  className={`flex-1 items-center justify-center p-2 ${
                    i > 0 ? 'border-l border-gray-200' : ''
                  }`}>
                  <Text className="text-sm font-medium text-gray-500">{title}</Text>
                </View>
              ))}
            </View>

            {/* Row 1: 천간 (Gan) */}
            <View className="h-20 flex-row border-b border-gray-200">
              <View className="w-12 items-center justify-center bg-gray-50">
                <Text className="text-xs font-medium text-gray-500">천간</Text>
              </View>
              {columns.map((pillar, i) => (
                <View
                  key={i}
                  className="flex-1 items-center justify-center border-l border-gray-200">
                  <TouchableOpacity
                    className="h-full w-full items-center justify-center gap-1"
                    onPress={() => handleShinSalClick(pillar.gan.hanja)}>
                    <Text
                      className="text-4xl font-bold"
                      style={{
                        color: pillar.gan.color,
                        // @ts-ignore
                        textShadowColor: 'rgba(0,0,0,0.1)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                      }}>
                      {pillar.gan.hanja}
                    </Text>
                    <View className="absolute bottom-1 right-2">
                      <Text className="text-[10px] font-medium text-gray-400 underline decoration-gray-300 decoration-dotted underline-offset-2">
                        {pillar.gan.korean}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Row 2: 십성 (Sipsin for Gan) */}
            <View className="flex-row border-b border-gray-200">
              <View className="w-12 items-center justify-center bg-gray-50 py-1">
                <Text className="text-xs font-medium text-gray-500">십성</Text>
              </View>
              {columns.map((pillar, i) => (
                <View
                  key={i}
                  className="flex-1 items-center justify-center border-l border-gray-200">
                  <TouchableOpacity onPress={() => handleShinSalClick(pillar.gan.sipsin || '일간')}>
                    <Text
                      className="text-xs font-medium underline decoration-gray-300 decoration-dotted underline-offset-4"
                      style={{ color: pillar.gan.color }}>
                      {pillar.gan.sipsin || '일간'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Row 3: 지지 (Ji) */}
            <View className="h-20 flex-row border-b border-gray-200">
              <View className="w-12 items-center justify-center bg-gray-50 py-1">
                <Text className="text-xs font-medium text-gray-500">지지</Text>
              </View>
              {columns.map((pillar, i) => (
                <View
                  key={i}
                  className="flex-1 items-center justify-center border-l border-gray-200">
                  <TouchableOpacity
                    className="h-full w-full items-center justify-center gap-1"
                    onPress={() => handleShinSalClick(pillar.ji.hanja)}>
                    <Text
                      className="text-4xl font-bold"
                      style={{
                        color: pillar.ji.color,
                        // @ts-ignore
                        textShadowColor: 'rgba(0,0,0,0.1)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1,
                      }}>
                      {pillar.ji.hanja}
                    </Text>
                    <View className="absolute bottom-1 right-2">
                      <Text className="text-[10px] font-medium text-gray-400 underline decoration-gray-300 decoration-dotted underline-offset-2">
                        {pillar.ji.korean}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Row 4: 십성 (Sipsin for Ji) */}
            <View className="flex-row border-b border-gray-200">
              <View className="w-12 items-center justify-center bg-gray-50 py-1">
                <Text className="text-xs font-medium text-gray-500">십성</Text>
              </View>
              {columns.map((pillar, i) => (
                <View
                  key={i}
                  className="flex-1 items-center justify-center border-l border-gray-200">
                  <TouchableOpacity onPress={() => handleShinSalClick(pillar.ji.sipsin || '-')}>
                    <Text
                      className="text-xs font-medium underline decoration-gray-300 decoration-dotted underline-offset-4"
                      style={{ color: pillar.ji.color }}>
                      {pillar.ji.sipsin || '-'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Row 5: 지장간 (Jijangan) */}
            <View className="flex-row border-b border-gray-200">
              <View className="w-12 items-center justify-center bg-gray-50 py-1">
                <Text className="text-xs font-medium text-gray-500">지장간</Text>
              </View>
              {columns.map((pillar, i) => (
                <View
                  key={i}
                  className="flex-1 items-center justify-center border-l border-gray-200">
                  <TouchableOpacity onPress={() => handleShinSalClick('지장간')}>
                    <Text className="text-xs font-medium text-gray-600 underline decoration-gray-300 decoration-dotted underline-offset-4">
                      {pillar.ji.jijangan || '-'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Row 6: 12운성 (12Wunsung) */}
            <View className="flex-row border-b border-gray-200">
              <View className="w-12 items-center justify-center bg-gray-50 py-1">
                <Text className="text-xs font-medium text-gray-500">12운성</Text>
              </View>
              {columns.map((pillar, i) => (
                <View
                  key={i}
                  className="flex-1 items-center justify-center border-l border-gray-200">
                  <TouchableOpacity onPress={() => handleShinSalClick(pillar.ji.wunsung)}>
                    <Text className="text-xs font-medium text-gray-600 underline decoration-gray-300 decoration-dotted underline-offset-4">
                      {pillar.ji.wunsung || '-'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Row 7: 12신살 (12Shinsal) */}
            <View className="flex-row">
              <View className="w-12 items-center justify-center bg-gray-50 py-1">
                <Text className="text-xs font-medium text-gray-500">12신살</Text>
              </View>
              {columns.map((pillar, i) => (
                <View
                  key={i}
                  className="flex-1 items-center justify-center border-l border-gray-200">
                  <TouchableOpacity onPress={() => handleShinSalClick(pillar.ji.shinsal)}>
                    <Text className="text-xs font-medium text-gray-600 underline decoration-gray-300 decoration-dotted underline-offset-4">
                      {pillar.ji.shinsal || '-'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Detailed 12-Shin-sal & Special Shin-sal Table */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-lg font-semibold text-foreground">신살 상세 분석</Text>
            <TouchableOpacity
              onPress={() => router.push('/encyclopedia')}
              className="flex-row items-center gap-1 active:opacity-70">
              <Text className="text-sm font-medium text-gray-500">용어 사전</Text>
              <ChevronRight size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View className="gap-3 rounded-2xl border border-gray-300 bg-white p-5">
            <View className="flex-row justify-between gap-2">
              {(() => {
                const dayGongmang = getGongmang(saju.day.gan.hanja, saju.day.ji.hanja);
                const yearGongmang = getGongmang(saju.year.gan.hanja, saju.year.ji.hanja);

                return [
                  { label: '시주', data: saju.hour },
                  { label: '일주', data: saju.day },
                  { label: '월주', data: saju.month },
                  { label: '년주', data: saju.year },
                ].map((pillar, idx) => {
                  const isGongmang =
                    dayGongmang.includes(pillar.data.ji.korean) ||
                    yearGongmang.includes(pillar.data.ji.korean);
                  // 1. Calculate 12-Shin-sal
                  // Standard 1: Year Ji Base
                  const shinSalYear = calc12ShinSal(saju.year.ji.hanja, pillar.data.ji.hanja);
                  // Standard 2: Day Ji Base
                  const shinSalDay = calc12ShinSal(saju.day.ji.hanja, pillar.data.ji.hanja);
                  // Standard 3: Current Daewoon Base
                  const currentYear = new Date().getFullYear();
                  const mAge = currentYear - year + 1;
                  let daewoonJi = getCurrentYearJi(); // Fallback
                  let daewoonGan = '';

                  if (saju.lifeList && saju.lifeList.list) {
                    const list = saju.lifeList.list;
                    let active = null;
                    // Assuming list is sorted by start age ascending
                    for (const item of list) {
                      const startAge = parseInt(item.age || item.startAge || '0');
                      if (mAge >= startAge) {
                        active = item;
                      }
                    }
                    if (active) {
                      daewoonJi = active.ji.hanja;
                      daewoonGan = active.gan.hanja;
                    }
                  }
                  // Standard 4 (User Req): Day Gan Base (12 Wunsung -> Shin-sal)
                  const wunsung = get12Wunsung(saju.day.gan.hanja, pillar.data.ji.hanja);
                  const wunsungShinSal = getShinsalFromWunsung(wunsung);

                  // 2. Special Shin-sals
                  const specialShinSals = getSpecialShinSals(
                    pillar.data.gan.hanja,
                    pillar.data.ji.hanja,
                    saju.day.gan.hanja,
                    saju.month.ji.hanja
                  );

                  return (
                    <View key={idx} className="flex-1 items-center gap-2">
                      {/* Header */}
                      <View className="mb-1 rounded-full bg-gray-100 px-2.5 py-1">
                        <Text className="text-xs font-bold text-gray-500">{pillar.label}</Text>
                      </View>

                      {/* 12 Shin-sal Rows */}
                      <View className="items-center gap-1">
                        {/* (1) Gongmang */}
                        {isGongmang ? (
                          <View className="rounded bg-gray-500 px-1.5 py-0.5">
                            <Text className="text-[10px] text-white">공망</Text>
                          </View>
                        ) : (
                          <View className="h-4" />
                        )}

                        {/* (2) Year Ji Base */}
                        <TouchableOpacity onPress={() => handleShinSalClick(shinSalYear)}>
                          <Text className="text-xs font-medium text-gray-800 underline decoration-gray-300 decoration-dotted underline-offset-4">
                            {shinSalYear}
                          </Text>
                        </TouchableOpacity>

                        {/* (3) Day Ji Base */}
                        <TouchableOpacity onPress={() => handleShinSalClick(shinSalDay)}>
                          <Text className="text-xs font-medium text-gray-600 underline decoration-gray-300 decoration-dotted underline-offset-4">
                            {shinSalDay}
                          </Text>
                        </TouchableOpacity>

                        {/* (4) Day Gan Base (Wunsung -> Shin-sal) */}
                        <TouchableOpacity onPress={() => handleShinSalClick(wunsungShinSal)}>
                          <Text className="text-xs font-bold text-teal-600 underline decoration-teal-200 decoration-dotted underline-offset-4">
                            {wunsungShinSal}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Divider */}
                      <View className="my-1 h-[1px] w-full bg-gray-100" />

                      {/* Special Shin-sals */}
                      <View className="min-h-[60px] w-full items-center gap-1">
                        {specialShinSals.length > 0 ? (
                          specialShinSals.map((sal, sIdx) => (
                            <TouchableOpacity key={sIdx} onPress={() => handleShinSalClick(sal)}>
                              <Text className="text-center text-[11px] font-bold text-indigo-600 underline decoration-indigo-200 decoration-dotted underline-offset-4">
                                {sal}
                              </Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <Text className="text-[11px] text-gray-300">-</Text>
                        )}
                      </View>
                    </View>
                  );
                });
              })()}
            </View>
          </View>
        </View>

        {/* Strength Graph */}
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-foreground">신강/신약지수</Text>
            <TouchableOpacity onPress={() => openInfoModal('daewun')}>
              <CircleHelp size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View className="rounded-xl border border-border bg-card p-5">
            {/* Indicators */}
            <View className="mb-4 flex-row gap-4">
              {[
                { label: '득령', value: saju.strength?.flags.deukRyeong, color: '#3B82F6' },
                { label: '득지', value: saju.strength?.flags.deukJi, color: '#EF4444' },
                { label: '득시', value: saju.strength?.flags.deukSi, color: '#EF4444' },
                { label: '득세', value: saju.strength?.flags.deukSe, color: '#3B82F6' },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center gap-1">
                  <Text className="text-sm text-gray-600">{item.label}</Text>
                  {item.value ? (
                    <Circle size={14} color={item.color} fill={item.color} />
                  ) : (
                    <CircleX size={14} color="#EF4444" />
                  )}
                </View>
              ))}
            </View>

            <Text className="mb-1 text-base leading-6 text-foreground">
              {name}님은 <Text className="font-bold">{saju.strength?.verdict} 사주</Text>입니다.
            </Text>
            <Text className="mb-6 text-sm text-muted-foreground">
              {saju.strength?.ratio}%의 사람이 여기에 해당합니다.
            </Text>

            {/* Chart */}
            <View className="h-48 w-full flex-row items-end justify-between px-2">
              {['극약', '태약', '신약', '중화\n신약', '중화\n신강', '신강', '태강', '극왕'].map(
                (label, i) => {
                  const isMe = saju.strength?.verdict.replace(' ', '') === label.replace('\n', '');
                  // Distribution data
                  const ratios = [3.2, 8.5, 16.1, 22.2, 22.2, 16.1, 8.5, 3.2];
                  const heightPct = (ratios[i] / 25) * 100; // 25 is approx max (22.2)

                  return (
                    <View key={i} className="flex-1 items-center gap-2">
                      <View className="w-full flex-1 items-center justify-end">
                        {/* Line connector simulation could be done with SVG overlay,
                          but here we just show the structure.
                          To match the image perfectly we need SVG.
                          Let's draw the SVG overlay on top of this container.
                       */}
                        <View
                          className="w-full rounded-t-sm bg-gray-100"
                          style={{ height: '100%' }}
                        />
                      </View>
                      <Text className="text-center text-[10px] text-gray-500">{label}</Text>
                    </View>
                  );
                }
              )}

              {/* SVG Overlay for the Line Chart */}
              <View className="absolute left-0 right-0 top-0 h-40" pointerEvents="none">
                <Svg height="100%" width="100%">
                  {/* 
                   We need to compute points. 
                   With 8 items, each takes 12.5% width. center is 6.25%, 18.75%...
                */}
                  {[3.2, 8.5, 16.1, 22.2, 22.2, 16.1, 8.5, 3.2].map((val, i, arr) => {
                    if (i === arr.length - 1) return null;
                    const x1 = `${(i * 100) / 8 + 100 / 16}%`;
                    const y1 = `${100 - (val / 25) * 80}%`; // Scaling factor
                    const x2 = `${((i + 1) * 100) / 8 + 100 / 16}%`;
                    const y2 = `${100 - (arr[i + 1] / 25) * 80}%`;
                    return (
                      <Line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#525252"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  {/* My Point */}
                  {[3.2, 8.5, 16.1, 22.2, 22.2, 16.1, 8.5, 3.2].map((val, i) => {
                    const label = [
                      '극약',
                      '태약',
                      '신약',
                      '중화신약',
                      '중화신강',
                      '신강',
                      '태강',
                      '극왕',
                    ][i];
                    const isMe = saju.strength?.verdict === label;
                    if (!isMe) return null;

                    const x = `${(i * 100) / 8 + 100 / 16}%`;
                    const y = `${100 - (val / 25) * 80}%`;

                    return (
                      <React.Fragment key={i}>
                        <SvgCircle cx={x} cy={y} r="5" fill="#4B5563" />
                        <SvgText
                          // @ts-ignore
                          x={x}
                          y={y}
                          dy="20"
                          fontSize="12"
                          fontWeight="bold"
                          fill="#4B5563"
                          textAnchor="middle">
                          나
                        </SvgText>
                      </React.Fragment>
                    );
                  })}
                </Svg>
              </View>
            </View>
          </View>
        </View>

        {/* Five Elements Distribution */}
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-foreground">
              나의 오행: {saju.day.gan.korean} ({saju.day.gan.hanja})
            </Text>
          </View>

          <View className="items-center rounded-xl border border-border bg-card p-6">
            {/* Five Elements Cycle Diagram */}
            <View className="h-[320px] w-full items-center justify-center">
              {/* Legend */}
              <View className="flex-row items-center gap-2">
                <View className="h-[2px] w-6 bg-gray-300" />
                <Text className="text-[10px] font-medium text-gray-600">생(生) : 상생</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="h-[0px] w-6 border-b border-dashed border-gray-300" />
                <Text className="text-[10px] font-medium text-gray-600">극(剋) : 상극</Text>
              </View>

              <Svg width="320" height="320" viewBox="0 0 320 320">
                <Defs>
                  <Marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto">
                    <Polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
                  </Marker>
                  <Marker
                    id="arrowhead-control"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto">
                    <Polygon points="0 0, 8 3, 0 6" fill="#D1D5DB" />
                  </Marker>
                </Defs>

                {['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'].map((key, i, arr) => {
                  const radius = 105;
                  const center = 160;
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  const x = center + radius * Math.cos(angle);
                  const y = center + radius * Math.sin(angle);

                  // @ts-ignore
                  const percent = saju.distributions?.[key]?.percent || 0;
                  // Limit the max size so it doesn't overlap arrows
                  // Min 22, Max ~38 (at 63% like example)
                  const r = 22 + Math.min(percent, 60) * 0.25;

                  // --- Generation Link (Saeng) ---
                  const nextI = (i + 1) % 5;
                  const nextAngle = (nextI * 72 - 90) * (Math.PI / 180);
                  const nextX = center + radius * Math.cos(nextAngle);
                  const nextY = center + radius * Math.sin(nextAngle);
                  // @ts-ignore
                  const nextPercent = saju.distributions?.[arr[nextI]]?.percent || 0;
                  const nextR = 22 + Math.min(nextPercent, 60) * 0.25;

                  const dx = nextX - x;
                  const dy = nextY - y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const gap = 16; // Increased gap for visibility
                  let genLink = null;

                  if (dist > 0) {
                    const startT = (r + gap) / dist;
                    const endT = 1 - (nextR + gap) / dist;
                    if (startT < endT) {
                      genLink = (
                        <Line
                          x1={x + dx * startT}
                          y1={y + dy * startT}
                          x2={x + dx * endT}
                          y2={y + dy * endT}
                          stroke="#E5E7EB" // Gray-200
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    }
                  }

                  // --- Control Link (Geuk) ---
                  const controlI = (i + 2) % 5;
                  const controlAngle = (controlI * 72 - 90) * (Math.PI / 180);
                  const controlX = center + radius * Math.cos(controlAngle);
                  const controlY = center + radius * Math.sin(controlAngle);
                  // @ts-ignore
                  const controlPercent = saju.distributions?.[arr[controlI]]?.percent || 0;
                  const controlR = 22 + Math.min(controlPercent, 60) * 0.25;

                  const cDx = controlX - x;
                  const cDy = controlY - y;
                  const cDist = Math.sqrt(cDx * cDx + cDy * cDy);
                  let controlLink = null;

                  if (cDist > 0) {
                    const cStartT = (r + gap) / cDist;
                    const cEndT = 1 - (controlR + gap) / cDist;
                    if (cStartT < cEndT) {
                      controlLink = (
                        <Line
                          x1={x + cDx * cStartT}
                          y1={y + cDy * cStartT}
                          x2={x + cDx * cEndT}
                          y2={y + cDy * cEndT}
                          stroke="#D1D5DB" // Gray-300 (Subtle)
                          strokeWidth="1.5"
                          strokeDasharray="4, 4"
                          markerEnd="url(#arrowhead-control)"
                        />
                      );
                    }
                  }

                  const labels: any = {
                    WOOD: '목',
                    FIRE: '화',
                    EARTH: '토',
                    METAL: '금',
                    WATER: '수',
                  };
                  const colors: any = {
                    WOOD: '#4ADE80',
                    FIRE: '#F87171',
                    EARTH: '#FACC15',
                    METAL: '#9CA3AF',
                    WATER: '#60A5FA',
                  };
                  const textColors: any = {
                    WOOD: '#15803d', // green-700
                    FIRE: '#b91c1c', // red-700
                    EARTH: '#a16207', // yellow-700
                    METAL: '#4b5563', // gray-600
                    WATER: '#1d4ed8', // blue-700
                  };
                  const color = colors[key];
                  const textColor = textColors[key];

                  return (
                    <React.Fragment key={key}>
                      {/* Render Links underneath nodes */}
                      {controlLink}
                      {genLink}

                      <G>
                        <SvgCircle
                          cx={x}
                          cy={y}
                          r={r}
                          fill="white"
                          stroke={color}
                          strokeWidth="3"
                        />
                        {/* Assuming imageSource is defined in this scope */}
                        {/* {imageSource && (
                            <Image
                              source={imageSource}
                              style={{ width: 40, height: 40 }}
                              resizeMode="contain"
                            />
                          )} */}
                        <SvgCircle cx={x} cy={y} r={r - 3} fill={color} fillOpacity={0.15} />
                        <SvgText
                          x={x}
                          y={y - 4}
                          fill={textColor}
                          fontSize="15"
                          fontWeight="bold"
                          textAnchor="middle"
                          alignmentBaseline="middle">
                          {labels[key]}
                        </SvgText>
                        <SvgText
                          x={x}
                          y={y + 11}
                          fill={textColor}
                          fontSize="11"
                          fontWeight="500"
                          textAnchor="middle"
                          alignmentBaseline="middle">
                          {percent.toFixed(0)}%
                        </SvgText>
                      </G>
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>
          </View>

          {/* Detailed Interpretations */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">상세 해석</Text>
            <View className="gap-3 rounded-xl border border-border bg-card p-4">
              {/* NaYin */}
              <View>
                <Text className="mb-2 text-sm font-bold text-gray-700">납음 (소리 오행)</Text>
                <View className="flex-row gap-2">
                  {[
                    { label: '년주', value: saju.details?.nayin.year },
                    { label: '월주', value: saju.details?.nayin.month },
                    { label: '일주', value: saju.details?.nayin.day },
                    { label: '시주', value: saju.details?.nayin.hour },
                  ].map((item, i) => (
                    <View key={i} className="flex-1 items-center gap-1 rounded bg-gray-50 p-2">
                      <Text className="text-xs text-gray-500">{item.label}</Text>
                      <Text
                        className="text-center text-xs font-medium text-gray-800"
                        numberOfLines={2}>
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="my-1 h-[1px] bg-border" />

              {/* 28 Xiu & Chong/Sha */}
              <View className="flex-row gap-4">
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-bold text-gray-700">28수 (별자리)</Text>
                  <Text className="text-sm text-gray-600">{saju.details?.xiu}</Text>
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-bold text-gray-700">충(沖) / 살(煞)</Text>
                  <View className="gap-1">
                    <Text className="text-xs text-gray-600">
                      <Text className="font-semibold text-red-500">충:</Text> {saju.details?.chong}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      <Text className="font-semibold text-gray-800">살방위:</Text>{' '}
                      {saju.details?.sha}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="my-1 h-[1px] bg-border" />

              {/* PengZu */}
              <View className="gap-1">
                <Text className="text-sm font-bold text-gray-700">팽조백기 (금기사항)</Text>
                <View className="gap-1.5 rounded bg-gray-50 p-3">
                  <Text className="text-xs leading-4 text-gray-600">
                    <Text className="font-semibold text-gray-800">천간:</Text>{' '}
                    {saju.details?.pengzu.gan}
                  </Text>
                  <Text className="text-xs leading-4 text-gray-600">
                    <Text className="font-semibold text-gray-800">지지:</Text>{' '}
                    {saju.details?.pengzu.zhi}
                  </Text>
                </View>
              </View>

              <View className="my-1 h-[1px] bg-border" />

              {/* Positions */}
              <View className="gap-2">
                <Text className="text-sm font-bold text-gray-700">신살 방위 (길신)</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    {
                      label: '희신',
                      value: saju.details?.positions.xi,
                      bg: 'bg-blue-50',
                      text: 'text-blue-700',
                    },
                    {
                      label: '재신',
                      value: saju.details?.positions.cai,
                      bg: 'bg-yellow-50',
                      text: 'text-yellow-700',
                    },
                    {
                      label: '복신',
                      value: saju.details?.positions.fu,
                      bg: 'bg-green-50',
                      text: 'text-green-700',
                    },
                    {
                      label: '양귀인',
                      value: saju.details?.positions.yangGui,
                      bg: 'bg-purple-50',
                      text: 'text-purple-700',
                    },
                    {
                      label: '음귀인',
                      value: saju.details?.positions.yinGui,
                      bg: 'bg-purple-50',
                      text: 'text-purple-700',
                    },
                  ].map((item, i) => (
                    <View key={i} className={`rounded px-2.5 py-1.5 ${item.bg}`}>
                      <Text className={`text-xs font-medium ${item.text}`}>
                        {item.label}: {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Daeun List */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-foreground">대운</Text>
              <TouchableOpacity onPress={() => openInfoModal('daewun')}>
                <CircleHelp size={16} color="#A3A3A3" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                대운수: {saju.lifeList.daewunSu}
              </Text>
              <Text className="text-sm text-muted-foreground">({saju.lifeList.directionText})</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-1">
            {saju.lifeList.list.map((item: any, index: number) => {
              const isSelected = selectedAge === item.age;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDaewunPress(item.age)}
                  key={index}
                  className={`w-[60px] items-center overflow-hidden rounded-xl border bg-white ${
                    isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
                  }`}>
                  {/* Header */}
                  <View
                    className={`w-full items-center py-1.5 ${
                      isSelected ? 'bg-blue-500' : 'bg-gray-50'
                    }`}>
                    <Text
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-white' : 'text-gray-500'
                      }`}>
                      {item.age}세
                    </Text>
                  </View>

                  {/* Pillars */}
                  <View className="w-full gap-1 py-2">
                    {/* Gan */}
                    <View className="items-center">
                      <Text className="text-lg font-bold" style={{ color: item.gan.color }}>
                        {item.gan.hanja}
                      </Text>
                      <Text className="text-[9px] text-gray-400">{item.gan.sipsin}</Text>
                    </View>

                    {/* Divider */}
                    <View className="h-[1px] w-8 self-center bg-gray-100" />

                    {/* Ji */}
                    <View className="items-center">
                      <Text className="text-lg font-bold" style={{ color: item.ji.color }}>
                        {item.ji.hanja}
                      </Text>
                      <Text className="text-[9px] text-gray-400">{item.ji.sipsin}</Text>
                    </View>
                  </View>

                  {/* Footer */}
                  <View className="w-full items-center gap-0.5 bg-gray-50/50 py-1.5">
                    <Text className="text-[10px] font-medium text-gray-600">{item.ji.wunsung}</Text>
                    {Array.isArray(item.ji.shinsal) &&
                      item.ji.shinsal.slice(0, 3).map((sal: string, idx: number) => (
                        <Text key={idx} className="text-[9px] text-gray-400" numberOfLines={1}>
                          {sal}
                        </Text>
                      ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Sewun List */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-foreground">세운 (10년)</Text>
              <TouchableOpacity onPress={() => openInfoModal('sewun')}>
                <CircleHelp size={16} color="#A3A3A3" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-1">
            {sewunData.map((item: any, index: number) => {
              const isSelected = selectedYear === item.year;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleYearPress(item.year)}
                  key={index}
                  className={`w-[60px] items-center overflow-hidden rounded-xl border bg-white ${
                    isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
                  }`}>
                  {/* Header */}
                  <View
                    className={`w-full items-center py-1.5 ${
                      isSelected ? 'bg-blue-500' : 'bg-gray-50'
                    }`}>
                    <Text
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-white' : 'text-gray-500'
                      }`}>
                      {item.year}
                    </Text>
                  </View>

                  {/* Pillars */}
                  <View className="w-full gap-1 py-2">
                    {/* Gan */}
                    <View className="items-center">
                      <Text className="text-lg font-bold" style={{ color: item.gan.color }}>
                        {item.gan.hanja}
                      </Text>
                      <Text className="text-[9px] text-gray-400">{item.gan.sipsin}</Text>
                    </View>

                    {/* Divider */}
                    <View className="h-[1px] w-8 self-center bg-gray-100" />

                    {/* Ji */}
                    <View className="items-center">
                      <Text className="text-lg font-bold" style={{ color: item.ji.color }}>
                        {item.ji.hanja}
                      </Text>
                      <Text className="text-[9px] text-gray-400">{item.ji.sipsin}</Text>
                    </View>
                  </View>

                  {/* Footer */}
                  <View className="w-full items-center gap-0.5 bg-gray-50/50 py-1.5">
                    <Text className="text-[10px] font-medium text-gray-600">{item.ji.wunsung}</Text>
                    {Array.isArray(item.ji.shinsals) &&
                      item.ji.shinsals.slice(0, 3).map((sal: string, idx: number) => (
                        <Text key={idx} className="text-[9px] text-gray-400" numberOfLines={1}>
                          {sal}
                        </Text>
                      ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Wolwun List */}
        <View className="mb-2 gap-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-foreground">월운 (12개월)</Text>
              <TouchableOpacity onPress={() => openInfoModal('wolwun')}>
                <CircleHelp size={16} color="#A3A3A3" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-1">
            {monthData.map((item: any, index: number) => (
              <View
                key={index}
                className="w-[60px] items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                {/* Header */}
                <View className="w-full items-center bg-gray-50 py-1.5">
                  <Text className="text-[11px] font-bold text-gray-500">{item.month}월</Text>
                </View>

                {/* Pillars */}
                <View className="w-full gap-1 py-2">
                  {/* Gan */}
                  <View className="items-center">
                    <Text className="text-lg font-bold" style={{ color: item.gan.color }}>
                      {item.gan.hanja}
                    </Text>
                    <Text className="text-[9px] text-gray-400">{item.gan.sipsin}</Text>
                  </View>

                  {/* Divider */}
                  <View className="h-[1px] w-8 self-center bg-gray-100" />

                  {/* Ji */}
                  <View className="items-center">
                    <Text className="text-lg font-bold" style={{ color: item.ji.color }}>
                      {item.ji.hanja}
                    </Text>
                    <Text className="text-[9px] text-gray-400">{item.ji.sipsin}</Text>
                  </View>
                </View>

                {/* Footer */}
                <View className="w-full items-center gap-0.5 bg-gray-50/50 py-1.5">
                  <Text className="text-[10px] font-medium text-gray-600">{item.ji.wunsung}</Text>
                  {Array.isArray(item.ji.shinsals) &&
                    item.ji.shinsals.slice(0, 3).map((sal: string, idx: number) => (
                      <Text key={idx} className="text-[9px] text-gray-400" numberOfLines={1}>
                        {sal}
                      </Text>
                    ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="pb-10">
          <TouchableOpacity
            onPress={() => router.push('/pillarscalendar')}
            className="flex-row items-center justify-between rounded-2xl border border-gray-300 bg-white p-5 active:bg-gray-50">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-bold text-gray-900">만세력 달력</Text>
                <View className="rounded-full bg-amber-100 px-2 py-0.5">
                  <Text className="text-xs font-bold text-amber-700">NEW</Text>
                </View>
              </View>
              <Text className="text-sm text-gray-500">나의 일진과 하루 운세를 확인해보세요</Text>
            </View>
            <CalendarIcon size={24} className="text-gray-400" color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <Modal
          visible={!!infoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setInfoModal(null)}>
          <TouchableWithoutFeedback onPress={() => setInfoModal(null)}>
            <View className="flex-1 items-center justify-center bg-black/50 p-6">
              <TouchableWithoutFeedback>
                <View className="w-full max-w-sm gap-4 rounded-xl bg-white p-6 shadow-xl">
                  <Text className="text-lg font-bold text-gray-900">{infoModal?.title}</Text>
                  <Text className="leading-6 text-gray-600">{infoModal?.content}</Text>
                  <TouchableOpacity
                    onPress={() => setInfoModal(null)}
                    className="mt-2 items-center rounded-lg bg-gray-100 py-3">
                    <Text className="font-semibold text-gray-900">확인</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </View>
  );
};
