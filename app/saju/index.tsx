import { SajuResultView } from '@/components/SajuResultView';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebSEO } from '@/components/ui/WebSEO';

export default function SajuResultScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    name: string;
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    gender: string;
    calendarType: string;
    isLeapMonth: string;
  }>();

  const { name, year, month, day, hour, minute, gender, calendarType, isLeapMonth } = params;
  console.log('SajuResultScreen Params:', params);

  // Parse inputs
  const y = parseInt(year || '2000', 10);
  const m = parseInt(month || '1', 10);
  const d = parseInt(day || '1', 10);
  const h = hour ? parseInt(hour, 10) : 0;
  const min = minute ? parseInt(minute, 10) : 0;
  const isLeap = isLeapMonth === 'true';

  if (!year || !month || !day) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg">잘못된 접근입니다.</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-gray-50">
        <WebSEO
          title="디지털 부적 - 사주라떼"
          description="나만의 디지털 부적으로 행운을 높여보세요."
        />
        <Stack.Screen options={{ headerShown: false }} />
        <SajuResultView
          name={name}
          year={y}
          month={m}
          day={d}
          hour={h}
          minute={min}
          gender={gender as 'male' | 'female'}
          calendarType={calendarType}
          isLeapMonth={isLeap}
        />
      </View>
    </>
  );
}
