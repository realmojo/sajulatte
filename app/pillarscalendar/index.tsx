import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMonthlyIljin, getMyEightSaju, getMyIlganFromDate } from '@/lib/utils/latte';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { signInWithKakao } from '@/lib/services/authService';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function PillarsCalendarScreen() {
  const isWeb = Platform.OS === 'web';
  const router = useRouter();

  const today = new Date();
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const [calendarData, setCalendarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null); // null: checking, true: yes, false: no
  const [userIlgan, setUserIlgan] = useState<string | undefined>(undefined);
  const [userIlji, setUserIlji] = useState<string | undefined>(undefined);
  const [userIlganColor, setUserIlganColor] = useState<string | undefined>(undefined);

  // Date Picker Modal State
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerYear, setPickerYear] = useState(2024);
  const [pickerMonth, setPickerMonth] = useState(1);

  const YEARS = Array.from({ length: 1101 }, (_, i) => 1900 + i);
  const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
  const ITEM_HEIGHT = 50;

  useEffect(() => {
    // Fetch User Ilgan and Check Profile
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // 1. Try fetching authenticated user data first
        const result = await getMyEightSaju();
        if (result && result.meta) {
          setHasProfile(true);
          if (result.meta.ilgan) {
            setUserIlgan(result.meta.ilgan);
            if (result.day && result.day.gan && result.day.gan.color) {
              setUserIlganColor(result.day.gan.color);
            }
          }
          if (result.meta.sajuJiHjs && result.meta.sajuJiHjs.dayJi) {
            setUserIlji(result.meta.sajuJiHjs.dayJi);
          }
        } else {
          // 2. If no auth data, try local storage
          const jsonValue = await AsyncStorage.getItem('my_saju_list');
          if (jsonValue) {
            const profiles = JSON.parse(jsonValue);
            if (profiles && profiles.length > 0) {
              // Use the first profile (most recent or main)
              const localProfile = profiles[0];
              const pYear = Number(localProfile.birth_year || localProfile.year);
              const pMonth = Number(localProfile.birth_month || localProfile.month);
              const pDay = Number(localProfile.birth_day || localProfile.day);
              const pHour = Number(localProfile.birth_hour || localProfile.hour || 0);
              const pMinute = Number(localProfile.birth_minute || localProfile.minute || 0);
              const pCalType = localProfile.calendar_type || localProfile.calendarType || 'solar';
              const pIsLeap = localProfile.is_leap || localProfile.isLeapMonth === 'true' || false;

              const localResult = getMyIlganFromDate(
                pYear,
                pMonth,
                pDay,
                pCalType,
                pIsLeap,
                pHour,
                pMinute
              );

              if (localResult) {
                setHasProfile(true);
                setUserIlgan(localResult.ilgan);
                setUserIlji(localResult.ilji);
                setUserIlganColor(localResult.color);
              } else {
                setHasProfile(false);
              }
            } else {
              setHasProfile(false);
            }
          } else {
            setHasProfile(false);
          }
        }
      } catch (e) {
        console.error('Failed to fetch user ilgan:', e);
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (hasProfile === false) return; // Don't fetch calendar if no profile

    // Fetch data when year/month changes
    // Only set loading if checking profile is done
    if (hasProfile !== null) {
      // We can do background update or just quick calc
      try {
        const data = getMonthlyIljin(currentDate.year, currentDate.month, userIlgan);
        setCalendarData(data);
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentDate, userIlgan, hasProfile]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month - 1;
      if (newMonth < 1) return { year: prev.year - 1, month: 12 };
      return { ...prev, month: newMonth };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month + 1;
      if (newMonth > 12) return { year: prev.year + 1, month: 1 };
      return { ...prev, month: newMonth };
    });
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate({ year: now.getFullYear(), month: now.getMonth() + 1 });
  };

  const handleOpenDatePicker = () => {
    setPickerYear(currentDate.year);
    setPickerMonth(currentDate.month);
    setDatePickerVisible(true);
  };

  const handleConfirmDate = () => {
    setCurrentDate({ year: pickerYear, month: pickerMonth });
    setDatePickerVisible(false);
  };

  const handleDayPress = (day: any) => {
    if (!userIlgan || !userIlji) {
      return;
    }

    router.push({
      pathname: '/pillarscalendar/analysis',
      params: {
        year: currentDate.year,
        month: currentDate.month,
        day: day.day,
        gan: day.gan.hanja,
        ji: day.ji.hanja,
      },
    });
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
      // After login, ideally we should refresh or redirect.
      // Since signInWithKakao redirects, page will reload.
    } catch (e) {
      console.error('Login failed', e);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleGoToInput = () => {
    router.push('/saju');
  };

  // Grid Generation logic with padding
  const gridCells = useMemo(() => {
    if (!calendarData) return [];

    const cells = [];
    // Empty Padding for start
    for (let i = 0; i < calendarData.startWeekDay; i++) {
      cells.push({ type: 'empty', key: `pad-${i}` });
    }
    // Day Cells
    calendarData.days.forEach((day: any) => {
      cells.push({ type: 'day', data: day, key: `day-${day.day}` });
    });
    return cells;
  }, [calendarData]);

  const content = (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="z-10 flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={handlePrevMonth}
            className="rounded-full p-2 active:bg-gray-100">
            <ChevronLeft size={20} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOpenDatePicker}
            className="items-center active:opacity-70">
            <Text className="text-lg font-bold text-gray-900">
              {currentDate.year}년 {currentDate.month}월
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextMonth}
            className="rounded-full p-2 active:bg-gray-100">
            <ChevronRight size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleToday} className="rounded-full bg-gray-100 px-3 py-1.5">
          <Text className="text-xs font-bold text-gray-600">오늘</Text>
        </TouchableOpacity>
      </View>

      {userIlji && (
        <View className="items-center justify-center bg-gray-50 py-2">
          <Text className="text-sm font-medium text-gray-600">
            나의 일간:{' '}
            <Text className="font-bold" style={{ color: userIlganColor }}>
              {userIlgan}
            </Text>
          </Text>
        </View>
      )}

      {/* Weekday Header */}
      <View className="flex-row border-b border-gray-100 bg-gray-50/50 py-2">
        {WEEKDAYS.map((day, idx) => (
          <View key={day} className="flex-1 items-center justify-center">
            <Text
              className={`text-xs font-medium ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Main Content Area */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#d97706" />
        </View>
      ) : hasProfile === false ? (
        // NO PROFILE - LOGIN GUARD
        <View className="flex-1 items-center justify-center p-8">
          <View className="mb-6 rounded-full bg-gray-50 p-6">
            <Lock size={48} color="#9ca3af" />
          </View>
          <Text className="mb-2 text-center text-xl font-bold text-gray-900">
            사주 정보가 필요해요
          </Text>
          <Text className="mb-8 text-center leading-6 text-gray-500">
            나의 일간과 사주 흐름을 분석하여{'\n'}
            맞춤형 만세력 달력을 제공해드립니다.
          </Text>

          <TouchableOpacity
            onPress={handleKakaoLogin}
            className="mb-3 w-full max-w-xs flex-row items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-4 active:opacity-90">
            <Text className="text-xl">💬</Text>
            <Text className="text-base font-bold text-[#191919]">카카오로 3초만에 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoToInput}
            className="w-full max-w-xs rounded-xl border border-gray-200 py-3 active:bg-gray-50">
            <Text className="text-center font-semibold text-gray-600">직접 정보 입력하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // CALENDAR GRID
        <ScrollView className="flex-1" contentContainerClassName="pb-10">
          <View className="flex-row flex-wrap">
            {gridCells.map((cell: any, index) => {
              if (cell.type === 'empty') {
                return (
                  <View
                    key={cell.key}
                    className="h-28 border-b border-r border-gray-50"
                    style={{ width: '14.28%' }}
                  />
                );
              }

              const day = cell.data;
              const isSun = day.weekDay === 0;
              const isSat = day.weekDay === 6;
              const isToday =
                today.getFullYear() === currentDate.year &&
                today.getMonth() + 1 === currentDate.month &&
                today.getDate() === day.day;

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleDayPress(day)}
                  key={cell.key}
                  className={`relative h-28 border-b border-r border-gray-100 p-1 ${isToday ? 'bg-green-100' : day.isMyIlgan ? 'bg-amber-100/30' : ''}`}
                  style={{ width: '14.28%' }}>
                  {/* Date Number */}
                  <View className="flex-row items-start justify-between">
                    <Text
                      className={`pl-1 pt-1 text-sm font-semibold ${isSun ? 'text-red-500' : isSat ? 'text-blue-500' : 'text-gray-800'}`}>
                      {day.day}
                    </Text>
                    {day.isMyIlgan && (
                      <View className="mt-1 rounded-md bg-amber-100 px-1.5">
                        <Text
                          className="text-[10px] font-bold text-amber-700"
                          style={{ color: userIlganColor }}>
                          {userIlgan}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Iljin Info */}
                  <View className="flex-1 items-center justify-center gap-1">
                    <View className="flex-row items-center gap-0.5">
                      <Text className="text-lg font-black" style={{ color: day.gan.color }}>
                        {day.gan.hanja}
                      </Text>
                      <Text className="text-lg font-black" style={{ color: day.ji.color }}>
                        {day.ji.hanja}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-0.5">
                      <Text className="text-[10px] font-medium text-gray-500">
                        {day.gan.korean}
                      </Text>
                      <Text className="text-[10px] font-medium text-gray-500">{day.ji.korean}</Text>
                    </View>
                  </View>

                  {/* Lunar Date (Bottom Right) */}
                  <View className="absolute bottom-1 right-1">
                    <Text
                      className={`text-[10px] ${day.isLunarLeap ? 'text-amber-600' : 'text-gray-400'}`}>
                      {day.lunarText}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Date Picker Modal */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDatePickerVisible(false)}>
          <View className="flex-1 items-center justify-center bg-black/50 p-6">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="w-full max-w-sm rounded-2xl bg-white p-6">
                <Text className="mb-4 text-center text-lg font-bold text-gray-900">날짜 선택</Text>

                <View className="h-64 flex-row gap-4">
                  {/* Year List */}
                  <View className="flex-1 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <Text className="bg-gray-100 py-2 text-center text-sm font-medium text-gray-500">
                      년도
                    </Text>
                    <FlatList
                      data={YEARS}
                      keyExtractor={(item) => item.toString()}
                      getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                      })}
                      initialScrollIndex={Math.max(0, pickerYear - 1900 - 2)} // Center roughly
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => setPickerYear(item)}
                          className={`h-[50px] items-center justify-center ${
                            pickerYear === item ? 'bg-amber-100' : ''
                          }`}>
                          <Text
                            className={`text-lg ${
                              pickerYear === item ? 'font-bold text-amber-900' : 'text-gray-600'
                            }`}>
                            {item}년
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>

                  {/* Month List */}
                  <View className="flex-1 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <Text className="bg-gray-100 py-2 text-center text-sm font-medium text-gray-500">
                      월
                    </Text>
                    <FlatList
                      data={MONTHS}
                      keyExtractor={(item) => item.toString()}
                      getItemLayout={(data, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                      })}
                      initialScrollIndex={Math.max(0, pickerMonth - 1 - 2)}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => setPickerMonth(item)}
                          className={`h-[50px] items-center justify-center ${
                            pickerMonth === item ? 'bg-amber-100' : ''
                          }`}>
                          <Text
                            className={`text-lg ${
                              pickerMonth === item ? 'font-bold text-amber-900' : 'text-gray-600'
                            }`}>
                            {item}월
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>

                <View className="mt-6 flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 items-center justify-center rounded-xl bg-gray-100 py-3.5"
                    onPress={() => setDatePickerVisible(false)}>
                    <Text className="font-semibold text-gray-600">취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 items-center justify-center rounded-xl bg-amber-500 py-3.5"
                    onPress={handleConfirmDate}>
                    <Text className="font-semibold text-white">이동</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );

  return (
    <FullWidthWebLayout>
      <WebSEO
        title="만세력 달력 - 사주라떼"
        description="이달의 일진과 사주 흐름을 확인하는 만세력 달력"
      />
      {content}
    </FullWidthWebLayout>
  );
}
