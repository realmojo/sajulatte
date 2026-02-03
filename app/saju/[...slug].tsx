import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { SajuResultView } from '@/components/SajuResultView';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebSEO } from '@/components/ui/WebSEO';

export default function SajuDynamicResultScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { slug, name } = useLocalSearchParams();

  console.log('Dynamic Params:', slug, name);

  // Parse slug
  // Path structure: /saju/[gender]/[year]/[month]/[day]/[hour]/[minute]/[calendarType]/[isLeap]
  // slug array: [gender, year, month, day, hour, minute, calendarType, isLeap]
  const segments = Array.isArray(slug) ? slug : typeof slug === 'string' ? slug.split('/') : [];

  // Validation
  const isValid = segments.length >= 4; // At least gender, y, m, d

  const gender = isValid ? (segments[0] as 'male' | 'female') : 'male';
  const year = isValid ? parseInt(segments[1], 10) : 0;
  const month = isValid ? parseInt(segments[2], 10) : 0;
  const day = isValid ? parseInt(segments[3], 10) : 0;
  const hour = segments[4] ? parseInt(segments[4], 10) : 0;
  const minute = segments[5] ? parseInt(segments[5], 10) : 0;
  const calendarType = segments[6] || 'solar';
  const isLeapMonth = segments[7] === 'true' || segments[7] === 'leap';

  const userName = (name as string) || '사용자';

  const content = (
    <SajuResultView
      name={userName}
      year={year}
      month={month}
      day={day}
      hour={hour}
      minute={minute}
      gender={gender}
      calendarType={calendarType}
      isLeapMonth={isLeapMonth}
    />
  );

  if (!isValid || !year || !month || !day) {
    if (isWeb) {
      return (
        <FullWidthWebLayout>
          <Stack.Screen options={{ headerShown: false }} />
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-lg text-gray-800">
              잘못된 접근입니다. 정보를 다시 입력해주세요.
            </Text>
          </View>
        </FullWidthWebLayout>
      );
    }

    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-lg text-gray-800">잘못된 접근입니다. 정보를 다시 입력해주세요.</Text>
      </View>
    );
  }

  // Generate a cleaner description for SEO
  const dateStr = `${year}년 ${month}월 ${day}일`;
  const timeStr = hour === 0 && minute === 0 ? '' : ` ${hour}시 ${minute}분`;
  const calStr = calendarType === 'lunar' ? '(음력)' : '(양력)';
  const seoDesc = `${userName}님의 ${dateStr}${timeStr}${calStr} 생년월일 운세 분석 결과입니다. 오행 분석, 대운, 연운, 신살 등 상세한 사주 풀이를 확인하세요.`;

  return isWeb ? (
    <FullWidthWebLayout>
      <Stack.Screen options={{ headerShown: false }} />
      <WebSEO title={`${userName}님의 사주 분석 - 사주라떼`} description={seoDesc} />
      {content}
    </FullWidthWebLayout>
  ) : (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebSEO title={`${userName}님의 사주 분석 - 사주라떼`} description={seoDesc} />
      {content}
    </View>
  );
}
