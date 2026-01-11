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
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { useState, useEffect, useMemo } from 'react';
import { getMonthlyIljin, getMyEightSaju } from '@/lib/utils/latte';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function PillarsCalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const today = new Date();
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const [calendarData, setCalendarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userIlgan, setUserIlgan] = useState<string | undefined>(undefined);
  const [userIlji, setUserIlji] = useState<string | undefined>(undefined);
  const [userIlganColor, setUserIlganColor] = useState<string | undefined>(undefined);

  // Date Picker Modal State
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerYear, setPickerYear] = useState(2024);
  const [pickerMonth, setPickerMonth] = useState(1);

  // Day Analysis Modal State Removed

  const YEARS = Array.from({ length: 1101 }, (_, i) => 1900 + i);
  const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
  const ITEM_HEIGHT = 50;

  useEffect(() => {
    // Fetch User Ilgan
    const fetchUserData = async () => {
      try {
        const result = await getMyEightSaju();
        console.log(111, result);
        if (result && result.meta) {
          if (result.meta.ilgan) {
            setUserIlgan(result.meta.ilgan);
            // Ilgan is day's gan.
            if (result.day && result.day.gan && result.day.gan.color) {
              setUserIlganColor(result.day.gan.color);
            }
          }
          if (result.meta.sajuJiHjs && result.meta.sajuJiHjs.dayJi) {
            setUserIlji(result.meta.sajuJiHjs.dayJi);
          }
        }
      } catch (e) {
        console.error('Failed to fetch user ilgan:', e);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch data when year/month changes
    setLoading(true);
    // Simulate slight delay for rendering smoothness or just direct call implies instant
    // We can just call it directly since it's synchronous
    try {
      const data = getMonthlyIljin(currentDate.year, currentDate.month, userIlgan);
      setCalendarData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentDate, userIlgan]);

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
    // Trailing Padding (Optional, for full grid look)
    //   while (cells.length % 7 !== 0) {
    //       cells.push({ type: 'empty', key: `pad-end-${cells.length}` });
    //   }
    return cells;
  }, [calendarData]);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <WebSEO
        title="만세력 달력 - 사주라떼"
        description="이달의 일진과 사주 흐름을 확인하는 만세력 달력"
      />
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

      {/* Calendar Grid */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#d97706" />
        </View>
      ) : (
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
              console.log(day);
              const isSun = day.weekDay === 0;
              const isSat = day.weekDay === 6;
              // Check if today
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
              <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
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
}
