import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export default function DailyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '오늘의 운세' }} />
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-xl font-bold text-foreground">오늘의 운세</Text>
        <Text className="mt-2 text-center text-muted-foreground">
          준비 중인 기능입니다.{'\n'}곧 업데이트 될 예정입니다!
        </Text>
      </View>
    </>
  );
}
