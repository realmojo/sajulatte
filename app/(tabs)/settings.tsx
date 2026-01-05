import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '설정' }} />
      <View className="flex-1 items-center justify-center gap-4 bg-background p-4">
        <Text className="text-xl font-bold text-foreground">설정</Text>
        <Text className="text-muted-foreground">버전 1.0.0</Text>

        {/* Placeholder for future login/account settings */}
        <Button variant="outline" onPress={() => alert('준비 중입니다.')}>
          <Text>로그인 / 계정 관리</Text>
        </Button>
      </View>
    </>
  );
}
