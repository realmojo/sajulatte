import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');
  const [hour, setHour] = React.useState('');
  const [minute, setMinute] = React.useState('');
  const [gender, setGender] = React.useState<'male' | 'female'>('male');

  const router = useRouter();

  const handleSubmit = () => {
    if (!year || !month || !day) {
      // Basic validation
      return;
    }
    router.push({
      pathname: '/result',
      params: { name, year, month, day, hour, minute, gender },
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: '사주 정보 입력', headerTransparent: false }} />
      <ScrollView
        contentContainerClassName="flex-grow justify-center p-6 gap-8"
        className="flex-1 bg-background">
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-foreground">사주 확인하기</Text>
          <Text className="text-center text-muted-foreground">
            정확한 사주 풀이를 위해{'\n'}태어난 정보를 입력해주세요.
          </Text>
        </View>

        <View className="mx-auto w-full max-w-sm gap-6">
          {/* Name Input */}
          <View className="gap-2">
            <Text className="font-medium text-foreground">이름</Text>
            <Input placeholder="이름을 입력하세요" value={name} onChangeText={setName} />
          </View>

          {/* Gender Input */}
          <View className="gap-2">
            <Text className="font-medium text-foreground">성별</Text>
            <View className="flex-row gap-4">
              <Button
                variant={gender === 'male' ? 'default' : 'outline'}
                className="flex-1"
                onPress={() => setGender('male')}>
                <Text>남성</Text>
              </Button>
              <Button
                variant={gender === 'female' ? 'default' : 'outline'}
                className="flex-1"
                onPress={() => setGender('female')}>
                <Text>여성</Text>
              </Button>
            </View>
          </View>

          {/* Birth Date Input */}
          <View className="gap-2">
            <Text className="font-medium text-foreground">생년월일</Text>
            <View className="flex-row gap-2">
              <View className="flex-1 gap-1">
                <Input
                  placeholder="YYYY"
                  keyboardType="numeric"
                  maxLength={4}
                  value={year}
                  onChangeText={(t) => setYear(t.replace(/[^0-9]/g, ''))}
                  className="text-center"
                />
                <Text className="text-center text-xs text-muted-foreground">년</Text>
              </View>
              <View className="flex-1 gap-1">
                <Input
                  placeholder="MM"
                  keyboardType="numeric"
                  maxLength={2}
                  value={month}
                  onChangeText={(t) => setMonth(t.replace(/[^0-9]/g, ''))}
                  className="text-center"
                />
                <Text className="text-center text-xs text-muted-foreground">월</Text>
              </View>
              <View className="flex-1 gap-1">
                <Input
                  placeholder="DD"
                  keyboardType="numeric"
                  maxLength={2}
                  value={day}
                  onChangeText={(t) => setDay(t.replace(/[^0-9]/g, ''))}
                  className="text-center"
                />
                <Text className="text-center text-xs text-muted-foreground">일</Text>
              </View>
            </View>
          </View>

          {/* Birth Time Input */}
          <View className="gap-2">
            <Text className="font-medium text-foreground">태어난 시간 (선택)</Text>
            <View className="flex-row gap-2">
              <View className="flex-1 gap-1">
                <Input
                  placeholder="00"
                  keyboardType="numeric"
                  maxLength={2}
                  value={hour}
                  onChangeText={(t) => setHour(t.replace(/[^0-9]/g, ''))}
                  className="text-center"
                />
                <Text className="text-center text-xs text-muted-foreground">시</Text>
              </View>
              <View className="flex-1 gap-1">
                <Input
                  placeholder="00"
                  keyboardType="numeric"
                  maxLength={2}
                  value={minute}
                  onChangeText={(t) => setMinute(t.replace(/[^0-9]/g, ''))}
                  className="text-center"
                />
                <Text className="text-center text-xs text-muted-foreground">분</Text>
              </View>
            </View>
          </View>

          <Button size="lg" onPress={handleSubmit} className="mt-4">
            <Text>결과 보기</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
