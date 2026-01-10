import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
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

  useEffect(() => {
    // Fetch User Ilgan
    const fetchUserData = async () => {
      try {
        const result = await getMyEightSaju();
        if (result && result.meta && result.meta.ilgan) {
          setUserIlgan(result.meta.ilgan);
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
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-900">
              {currentDate.year}년 {currentDate.month}월
            </Text>
          </View>
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
              const isSun = day.weekDay === 0;
              const isSat = day.weekDay === 6;
              // Check if today
              const isToday =
                today.getFullYear() === currentDate.year &&
                today.getMonth() + 1 === currentDate.month &&
                today.getDate() === day.day;

              return (
                <View
                  key={cell.key}
                  className={`relative h-28 border-b border-r border-gray-100 p-1 ${isToday ? 'bg-amber-50' : day.isMyIlgan ? 'bg-amber-100/30' : ''}`}
                  style={{ width: '14.28%' }}>
                  {/* Date Number */}
                  <View className="flex-row items-start justify-between">
                    <Text
                      className={`pl-1 pt-1 text-sm font-semibold ${isSun ? 'text-red-500' : isSat ? 'text-blue-500' : 'text-gray-800'}`}>
                      {day.day}
                    </Text>
                    {day.isMyIlgan && (
                      <View className="mr-1 mt-1 rounded-md bg-amber-100 px-1.5 py-0.5">
                        <Text className="text-[10px] font-bold text-amber-700">나의 일진</Text>
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
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
