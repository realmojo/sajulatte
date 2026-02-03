import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { SajuResultView } from '@/components/SajuResultView';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebSEO } from '@/components/ui/WebSEO';

export default function SajuResultScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

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

  const content = (
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
  );

  if (!year || !month || !day) {
    if (isWeb) {
      return (
        <FullWidthWebLayout>
          <Stack.Screen options={{ headerShown: false }} />
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-lg">잘못된 접근입니다.</Text>
          </View>
        </FullWidthWebLayout>
      );
    }

    return (
      <View className="flex-1 items-center justify-center p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-lg">잘못된 접근입니다.</Text>
      </View>
    );
  }

  return isWeb ? (
    <FullWidthWebLayout>
      <Stack.Screen options={{ headerShown: false }} />
      <WebSEO
        title={`${name}님의 사주 분석 - 사주라떼`}
        description={`${name}님의 정통 명리학 기반 사주 풀이 결과입니다. 만세력, 운세, 궁합을 확인해보세요.`}
      />
      {content}
    </FullWidthWebLayout>
  ) : (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <WebSEO
        title={`${name}님의 사주 분석 - 사주라떼`}
        description={`${name}님의 정통 명리학 기반 사주 풀이 결과입니다. 만세력, 운세, 궁합을 확인해보세요.`}
      />
      {content}
    </View>
  );
}
