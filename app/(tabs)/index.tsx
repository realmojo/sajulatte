import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import {
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { SajuResultView } from '@/components/SajuResultView';
import { RefreshCcw } from 'lucide-react-native';

export default function Screen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');
  const [hour, setHour] = React.useState('');
  const [minute, setMinute] = React.useState('');
  const [gender, setGender] = React.useState<'male' | 'female'>('male');

  const [savedProfile, setSavedProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();

  // Load saved profile on focus
  useFocusEffect(
    React.useCallback(() => {
      const loadFirstProfile = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('saju_list');
          if (jsonValue != null) {
            const list = JSON.parse(jsonValue);
            if (list.length > 0) {
              setSavedProfile(list[0]);
            } else {
              setSavedProfile(null);
            }
          } else {
            setSavedProfile(null);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      loadFirstProfile();
    }, [])
  );

  const handleSubmit = async () => {
    if (!year || !month || !day) {
      // Basic validation
      return;
    }

    const newProfile = {
      id: Date.now().toString(), // 임시 ID (timestamp)
      name,
      gender,
      birth_year: parseInt(year),
      birth_month: parseInt(month),
      birth_day: parseInt(day),
      birth_hour: hour ? parseInt(hour) : null,
      birth_minute: minute ? parseInt(minute) : null,
      calendar_type: 'solar',
      created_at: new Date().toISOString(),
    };

    try {
      // 로컬 스토리지에 리스트 형태로 저장
      const existingData = await AsyncStorage.getItem('saju_list');
      const list = existingData ? JSON.parse(existingData) : [];
      list.push(newProfile);
      await AsyncStorage.setItem('saju_list', JSON.stringify(list));

      console.log('Saved to local list. Total:', list.length + 1);
      // 저장 후 바로 뷰 갱신을 위해 상태 업데이트
      setSavedProfile(newProfile);
    } catch (e) {
      console.error('Failed to save local data:', e);
    }
  };

  const handleReset = () => {
    setSavedProfile(null);
    setName('');
    setYear('');
    setMonth('');
    setDay('');
    setHour('');
    setMinute('');
    setGender('male');
  };

  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLoading]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-6 bg-background">
        <Animated.View
          style={{
            transform: [{ rotate: spin }, { scale: pulseAnim }],
          }}>
          <View className="overflow-hidden rounded-full border-4 border-amber-100 shadow-xl">
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 120, height: 120 }}
              resizeMode="cover"
            />
          </View>
        </Animated.View>
        <Text className="text-lg font-bold text-foreground">사주를 분석하고 있습니다...</Text>
      </View>
    );
  }

  if (savedProfile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: '만세력',
            headerRight: () => (
              <TouchableOpacity onPress={handleReset} className="mr-4">
                <RefreshCcw size={20} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <SajuResultView
          name={savedProfile.name}
          year={savedProfile.birth_year}
          month={savedProfile.birth_month}
          day={savedProfile.birth_day}
          hour={savedProfile.birth_hour || 0}
          minute={savedProfile.birth_minute || 0}
          gender={savedProfile.gender}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: '만세력', headerTransparent: false }} />
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
