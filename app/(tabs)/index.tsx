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
import { useFocusEffect } from '@react-navigation/native';
import { SajuResultView } from '@/components/SajuResultView';
import { RefreshCcw } from 'lucide-react-native';
import { updateRemoteProfile } from '@/lib/services/authService';

// Web SEO Helper Component
const WebSEO = ({ title, description }: { title: string; description: string }) => {
  if (Platform.OS !== 'web') return null;

  React.useEffect(() => {
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [title, description]);

  return null;
};

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
          const jsonValue = await AsyncStorage.getItem('my_saju_list');
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

    try {
      // Attempt to save (Update Remote matches 'me' logic: updates supabase + local my_saju_list)
      const data = {
        name,
        gender,
        birth_year: parseInt(year),
        birth_month: parseInt(month),
        birth_day: parseInt(day),
        birth_hour: hour ? parseInt(hour) : null,
        birth_minute: minute ? parseInt(minute) : null,
        calendar_type: 'solar',
        is_leap: false,
      };

      try {
        await updateRemoteProfile(data as any);
        // Cast as any if type mismatch on strict literal vs string, but shape matches.
      } catch (authError) {
        // Fallback: Save locally to my_saju_list if not logged in
        console.log('Not logged in, saving locally only');
        const newProfile = {
          id: Date.now().toString(),
          ...data,
          relationship: 'me',
          created_at: new Date().toISOString(),
        };
        // Enforce singular Me
        await AsyncStorage.setItem('my_saju_list', JSON.stringify([newProfile]));
      }

      // Reload/Set State
      const savedData = {
        id: Date.now().toString(),
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
      setSavedProfile(savedData);

      console.log('Saved profile successfully');
    } catch (e) {
      console.error('Failed to save data:', e);
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
        <WebSEO
          title="사주라떼 - 사주 분석 중..."
          description="사용자의 사주 정보를 정밀하게 분석하고 있습니다."
        />
        <Animated.View
          style={{
            transform: [{ rotate: spin }, { scale: pulseAnim }],
          }}>
          <View className="overflow-hidden rounded-full border-4 border-amber-100 shadow-xl">
            <Image
              source={require('../../assets/images/icon.png')}
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
        <WebSEO
          title={`${savedProfile.name}님의 사주 풀이 - 사주라떼`}
          description={`${savedProfile.name}님의 타고난 성향, 오행 분석, 대운 흐름 등 상세한 사주 분석 결과를 무료로 확인하세요.`}
        />
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
          calendarType={savedProfile.calendar_type}
          isLeapMonth={savedProfile.is_leap || savedProfile.is_leap_month}
        />
      </>
    );
  }

  return (
    <>
      <WebSEO
        title="사주라떼 - 무료 사주 만세력"
        description="생년월일만 입력하면 정통 명리학 기반의 정확한 사주 풀이와 만세력을 무료로 확인할 수 있습니다. 오늘의 운세와 궁합도 확인해보세요."
      />
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
