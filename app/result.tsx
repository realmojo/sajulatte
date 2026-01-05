import { SajuResultView } from '@/components/SajuResultView';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function ResultScreen() {
  const { name, year, month, day, hour, minute, gender } = useLocalSearchParams<{
    name: string;
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    gender: string;
  }>();

  // Parse inputs
  const y = parseInt(year || '2000', 10);
  const m = parseInt(month || '1', 10);
  const d = parseInt(day || '1', 10);
  const h = hour ? parseInt(hour, 10) : 0;
  const min = minute ? parseInt(minute, 10) : 0;

  if (!year || !month || !day) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg">잘못된 접근입니다.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: '사주 결과', headerBackTitle: '뒤로' }} />
      <SajuResultView
        name={name}
        year={y}
        month={m}
        day={d}
        hour={h}
        minute={min}
        gender={gender as 'male' | 'female'}
      />
    </>
  );
}
