import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { getMyEightSaju } from '@/lib/utils/latte';

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
  const h = hour ? parseInt(hour, 10) : 0; // Default to 00:00 if not provided
  const min = minute ? parseInt(minute, 10) : 0;

  // Calculate Saju
  // Note: getMyEightSaju might need try-catch or handling if inputs are invalid
  const saju = React.useMemo(() => {
    try {
      return getMyEightSaju(y, m, d, h, min, gender);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [y, m, d, h, min, gender]);

  if (!saju) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg">사주 정보를 계산할 수 없습니다.</Text>
      </View>
    );
  }

  const pillars = [
    { title: '시주', data: saju.hour },
    { title: '일주', data: saju.day },
    { title: '월주', data: saju.month },
    { title: '년주', data: saju.year },
  ];

  return (
    <>
      <Stack.Screen options={{ title: '사주 결과', headerBackTitle: '뒤로' }} />
      <ScrollView contentContainerClassName="p-6 gap-8" className="flex-1 bg-background">
        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-foreground">
            {name || '사용자'}님의 사주팔자
          </Text>
          <Text className="text-muted-foreground">
            {y}년 {m}월 {d}일 {h !== undefined && `${h}시`} {min !== undefined && `${min}분`} (
            {gender === 'male' ? '남성' : '여성'})
          </Text>
        </View>

        {/* Four Pillars Grid */}
        <View className="flex-row justify-between rounded-xl border border-border bg-card p-3">
          {pillars.map((pillar, index) => (
            <View key={index} className="flex-1 items-center gap-2">
              <Text className="text-xs font-medium text-muted-foreground">{pillar.title}</Text>

              {/* Heaven Stem (Gan) */}
              <View className="items-center gap-0.5">
                <Text className="text-[10px] text-muted-foreground">
                  {pillar.data.gan.sipsin || '-'}
                </Text>
                <View
                  className="h-10 w-10 items-center justify-center rounded-full border border-border"
                  style={{ backgroundColor: pillar.data.gan.color }}>
                  <Text
                    className="text-xl font-bold text-white"
                    style={{
                      textShadowColor: 'rgba(0,0,0,1)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 2,
                    }}>
                    {pillar.data.gan.hanja}
                  </Text>
                </View>
                <Text className="text-sm font-medium text-foreground">
                  {pillar.data.gan.korean}
                </Text>
              </View>

              {/* Earth Branch (Ji) */}
              <View className="items-center gap-0.5">
                <Text className="text-sm font-medium text-foreground">{pillar.data.ji.korean}</Text>
                <View
                  className="h-10 w-10 items-center justify-center rounded-full border border-border"
                  style={{ backgroundColor: pillar.data.ji.color }}>
                  <Text
                    className="text-xl font-bold text-white"
                    style={{
                      textShadowColor: 'rgba(0,0,0,1)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 2,
                    }}>
                    {pillar.data.ji.hanja}
                  </Text>
                </View>
                <Text className="text-[10px] text-muted-foreground">
                  {pillar.data.ji.sipsin || '-'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="gap-2">
          <Text className="text-lg font-semibold text-foreground">상세 정보</Text>
          <View className="gap-2 rounded-lg border border-border bg-card p-4">
            <Text className="text-foreground">일간(본인): {saju.meta.ilgan}</Text>
            <Text className="text-foreground">음력: {saju.meta.lunar}</Text>
          </View>
        </View>

        {/* Daeun List */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">대운</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">대운수: {saju.daewun.daewunSu}</Text>
              <Text className="text-sm text-muted-foreground">({saju.daewun.directionText})</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2">
            {saju.daewun.list.map((item: any, index: number) => (
              <View
                key={index}
                className="w-10 items-center gap-1.5 rounded-lg border border-border bg-card p-1.5 py-2">
                <Text className="text-[10px] font-medium text-muted-foreground">{item.age}</Text>

                {/* Gan */}
                <View className="items-center gap-0.5">
                  <Text className="text-[10px] text-muted-foreground">{item.gan.sipsin}</Text>
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.gan.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.gan.hanja}
                    </Text>
                  </View>
                </View>

                {/* Ji */}
                <View className="items-center gap-0.5">
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.ji.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.ji.hanja}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-muted-foreground">{item.ji.sipsin}</Text>
                  <Text className="text-[10px] font-medium text-muted-foreground">
                    {item.ji.wunsung}
                  </Text>
                  {/* 12 Shin-sal */}
                  {item.ji.shinsal?.map((sal: string, idx: number) => (
                    <Text key={idx} className="text-[10px] text-muted-foreground opacity-80">
                      {sal}
                    </Text>
                  ))}
                </View>

                <Text className="text-center text-[10px] text-muted-foreground" numberOfLines={1}>
                  {item.gan.korean}
                  {item.ji.korean}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Sewun List */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">세운 (10년)</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2">
            {saju.sewun?.map((item: any, index: number) => (
              <View
                key={index}
                className="w-10 items-center gap-1.5 rounded-lg border border-border bg-card p-1.5 py-2">
                <Text className="text-[10px] font-medium text-muted-foreground">{item.year}</Text>

                {/* Gan */}
                <View className="items-center gap-0.5">
                  <Text className="text-[10px] text-muted-foreground">{item.gan.sipsin}</Text>
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.gan.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.gan.hanja}
                    </Text>
                  </View>
                </View>

                {/* Ji */}
                <View className="items-center gap-0.5">
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.ji.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.ji.hanja}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-muted-foreground">{item.ji.sipsin}</Text>
                  <Text className="text-[10px] font-medium text-muted-foreground">
                    {item.ji.wunsung}
                  </Text>
                  {/* 12 Shin-sal */}
                  {item.ji.shinsals?.map((sal: string, idx: number) => (
                    <Text key={idx} className="text-[10px] text-muted-foreground opacity-80">
                      {sal}
                    </Text>
                  ))}
                </View>

                <Text className="text-center text-[10px] text-muted-foreground" numberOfLines={1}>
                  {item.gan.korean}
                  {item.ji.korean}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}
