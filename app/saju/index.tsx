import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMainProfileFromSupabase } from '@/lib/services/authService';
import { Plus, User, Calendar, Clock, ChevronRight } from 'lucide-react-native';

interface SajuProfile {
  id: string;
  name: string;
  gender: string;
  birth_year?: number;
  birth_month?: number;
  birth_day?: number;
  birth_hour?: number;
  birth_minute?: number;
  year?: string | number;
  month?: string | number;
  day?: string | number;
  hour?: string | number;
  minute?: string | number;
  calendar_type?: string;
  calendarType?: string;
  relationship?: string;
}

export default function SajuInputScreen() {
  const isWeb = Platform.OS === 'web';
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [savedProfiles, setSavedProfiles] = useState<SajuProfile[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('form');

  // Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');

  useEffect(() => {
    loadSavedProfiles();
  }, []);

  const loadSavedProfiles = async () => {
    setLoading(true);
    try {
      // 1. Try Local Storage
      const jsonValue = await AsyncStorage.getItem('my_saju_list');
      let profiles: SajuProfile[] = [];

      if (jsonValue) {
        profiles = JSON.parse(jsonValue);
      }

      // 2. If no local profiles, try Supabase (Sync)
      if (profiles.length === 0) {
        const remoteProfile = await fetchMainProfileFromSupabase();
        if (remoteProfile) {
          profiles = [remoteProfile as any];
        }
      }

      setSavedProfiles(profiles);

      // Determine initial view mode
      if (profiles.length > 0) {
        setViewMode('list');
      } else {
        setViewMode('form');
      }
    } catch (e) {
      console.error('Failed to load profiles:', e);
    } finally {
      setLoading(false);
    }
  };

  const switchToForm = () => {
    // Reset form
    setName('');
    setGender('male');
    setYear('');
    setMonth('');
    setDay('');
    setHour('');
    setMinute('');
    setCalendarType('solar');
    setViewMode('form');
  };

  const handleAnalyze = async (profile?: SajuProfile) => {
    let pName, pYear, pMonth, pDay, pHour, pMinute, pGender, pCalType;

    if (profile) {
      // Use profile data
      pName = profile.name;
      pYear = profile.birth_year || profile.year;
      pMonth = profile.birth_month || profile.month;
      pDay = profile.birth_day || profile.day;
      pHour = profile.birth_hour ?? profile.hour;
      pMinute = profile.birth_minute ?? profile.minute;
      pGender = profile.gender;
      pCalType = profile.calendar_type || profile.calendarType || 'solar';
    } else {
      // Use form data
      if (!name || !year || !month || !day) {
        alert('필수 정보를 입력해주세요.');
        return;
      }
      pName = name;
      pYear = year;
      pMonth = month;
      pDay = day;
      pHour = hour || '0';
      pMinute = minute || '0';
      pGender = gender;
      pCalType = calendarType;

      // SAVE TO LOCAL STORAGE
      try {
        const newProfile: SajuProfile = {
          id: Date.now().toString(),
          name: pName,
          gender: pGender,
          year: pYear,
          month: pMonth,
          day: pDay,
          hour: pHour,
          minute: pMinute,
          calendarType: pCalType,
          birth_year: Number(pYear),
          birth_month: Number(pMonth),
          birth_day: Number(pDay),
          birth_hour: Number(pHour),
          birth_minute: Number(pMinute),
          calendar_type: pCalType,
          relationship: 'other',
        };

        // Check for duplicates
        const isDuplicate = savedProfiles.some(
          (p) =>
            p.name === newProfile.name &&
            (p.birth_year == newProfile.birth_year || p.year == newProfile.year) &&
            (p.birth_month == newProfile.birth_month || p.month == newProfile.month) &&
            (p.birth_day == newProfile.birth_day || p.day == newProfile.day)
        );

        if (!isDuplicate) {
          const updatedProfiles = [...savedProfiles, newProfile];
          await AsyncStorage.setItem('my_saju_list', JSON.stringify(updatedProfiles));
          setSavedProfiles(updatedProfiles);
        }
      } catch (e) {
        console.error('Failed to save profile locally:', e);
      }
    }

    // Convert to strings for URL params
    const sYear = pYear?.toString() || '';
    const sMonth = pMonth?.toString().padStart(2, '0') || '';
    const sDay = pDay?.toString().padStart(2, '0') || '';
    const sHour = pHour !== undefined && pHour !== null ? pHour.toString().padStart(2, '0') : '00';
    const sMinute =
      pMinute !== undefined && pMinute !== null ? pMinute.toString().padStart(2, '0') : '00';

    // Normalize calendar type
    const sCalType = pCalType === 'lunar-leap' || pCalType === 'lunar' ? 'lunar' : 'solar';
    const sIsLeap = pCalType === 'lunar-leap' ? 'true' : 'false';

    router.push({
      pathname: '/saju/result',
      params: {
        name: pName || '',
        year: sYear,
        month: sMonth,
        day: sDay,
        hour: sHour,
        minute: sMinute,
        gender: pGender || 'male',
        calendarType: sCalType,
        isLeapMonth: sIsLeap,
      },
    });
  };

  const ProfileCard = ({ profile }: { profile: SajuProfile }) => {
    const y = profile.birth_year || profile.year;
    const m = profile.birth_month || profile.month;
    const d = profile.birth_day || profile.day;
    const type = profile.calendar_type || profile.calendarType === 'lunar' ? '음력' : '양력';
    const genderStr = profile.gender === 'female' ? '여' : '남';

    return (
      <View className="mb-4 w-full rounded-2xl border border-gray-200 bg-white p-6">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className={`h-12 w-12 items-center justify-center rounded-full ${profile.id ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <User size={24} color={profile.id ? '#d97706' : '#6b7280'} />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">{profile.name}</Text>
              <Text className="text-sm text-gray-500">
                {profile.relationship === 'me' ? '본인' : '가족/지인'} • {genderStr}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleAnalyze(profile)}
            className="rounded-xl bg-amber-500 px-5 py-2.5 active:bg-amber-600">
            <Text className="font-bold text-white">분석</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4 border-t border-gray-100 pt-4">
          <View className="flex-row items-center gap-2">
            <Calendar size={16} color="#9ca3af" />
            <Text className="text-gray-600">
              {y}년 {m}월 {d}일 ({type})
            </Text>
          </View>
          {(profile.birth_hour !== undefined || profile.hour !== undefined) && (
            <View className="flex-row items-center gap-2">
              <Clock size={16} color="#9ca3af" />
              <Text className="text-gray-600">
                {String(profile.birth_hour || profile.hour).padStart(2, '0')}:
                {String(profile.birth_minute || profile.minute).padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center p-8">
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text className="mt-4 text-gray-500">정보를 불러오는 중...</Text>
        </View>
      );
    }

    // LIST VIEW
    if (viewMode === 'list') {
      return (
        <View className="w-full max-w-2xl items-center p-8">
          <View className="mb-10 items-center">
            <View className="mb-6 h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-amber-100">
              <Text className="text-4xl">📜</Text>
            </View>
            <Text className="mb-2 text-3xl font-bold text-gray-900">저장된 사주 목록</Text>
            <Text className="text-center text-gray-600">
              분석할 대상을 선택하거나{'\n'}새로운 정보를 입력해주세요.
            </Text>
          </View>

          <View className="w-full">
            {savedProfiles.map((item, idx) => (
              <ProfileCard key={item.id || idx} profile={item} />
            ))}
          </View>

          <TouchableOpacity
            onPress={switchToForm}
            className="mt-4 w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-4 hover:border-amber-400 hover:bg-amber-50 active:bg-gray-50">
            <Plus size={20} color="#6b7280" />
            <Text className="font-semibold text-gray-600">새로운 사주 입력하기</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // FORM VIEW
    return (
      <View className="w-full max-w-2xl items-center justify-center p-8">
        {/* Header */}
        <View className="mb-8 w-full items-center">
          <View className="mb-6 h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-amber-100">
            <Text className="text-5xl">☕️</Text>
          </View>
          <Text className="mb-3 text-center text-4xl font-bold text-gray-900">사주 분석</Text>
          <Text className="text-center text-lg leading-7 text-gray-600">
            정통 명리학 기반의 정확한 사주 풀이
          </Text>
        </View>

        {/* Input Form */}
        <View className="w-full rounded-2xl border border-gray-200 bg-white p-8">
          {/* List Back Button */}
          {savedProfiles.length > 0 && (
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              className="mb-6 flex-row items-center gap-1 self-start">
              <Text className="text-sm font-medium text-gray-500">← 목록으로 돌아가기</Text>
            </TouchableOpacity>
          )}

          {/* Name */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-700">이름</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            />
          </View>

          {/* Gender */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-700">성별</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setGender('male')}
                className={`flex-1 rounded-xl border py-3 ${
                  gender === 'male' ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-white'
                }`}>
                <Text
                  className={`text-center font-semibold ${
                    gender === 'male' ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                  남자
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('female')}
                className={`flex-1 rounded-xl border py-3 ${
                  gender === 'female' ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-white'
                }`}>
                <Text
                  className={`text-center font-semibold ${
                    gender === 'female' ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                  여자
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendar Type */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-700">생년월일</Text>
            <View className="mb-3 flex-row gap-3">
              <TouchableOpacity
                onPress={() => setCalendarType('solar')}
                className={`flex-1 rounded-xl border py-2 ${
                  calendarType === 'solar'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-300 bg-white'
                }`}>
                <Text
                  className={`text-center text-sm font-semibold ${
                    calendarType === 'solar' ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                  양력
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCalendarType('lunar')}
                className={`flex-1 rounded-xl border py-2 ${
                  calendarType === 'lunar'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-300 bg-white'
                }`}>
                <Text
                  className={`text-center text-sm font-semibold ${
                    calendarType === 'lunar' ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                  음력
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              <TextInput
                value={year}
                onChangeText={setYear}
                placeholder="YYYY"
                keyboardType="number-pad"
                maxLength={4}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-base text-gray-900"
              />
              <TextInput
                value={month}
                onChangeText={setMonth}
                placeholder="MM"
                keyboardType="number-pad"
                maxLength={2}
                className="w-20 rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-base text-gray-900"
              />
              <TextInput
                value={day}
                onChangeText={setDay}
                placeholder="DD"
                keyboardType="number-pad"
                maxLength={2}
                className="w-20 rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-base text-gray-900"
              />
            </View>
          </View>

          {/* Birth Time (Optional) */}
          <View className="mb-8">
            <Text className="mb-2 text-sm font-semibold text-gray-700">
              태어난 시각 <Text className="text-gray-400">(선택)</Text>
            </Text>
            <View className="flex-row gap-3">
              <TextInput
                value={hour}
                onChangeText={setHour}
                placeholder="HH"
                keyboardType="number-pad"
                maxLength={2}
                className="w-20 rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-base text-gray-900"
              />
              <Text className="py-3 text-xl text-gray-400">:</Text>
              <TextInput
                value={minute}
                onChangeText={setMinute}
                placeholder="MM"
                keyboardType="number-pad"
                maxLength={2}
                className="w-20 rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-base text-gray-900"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => handleAnalyze()}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 active:scale-95">
            <Text className="text-center text-lg font-bold text-white">분석하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return isWeb ? (
    <FullWidthWebLayout>
      <Stack.Screen options={{ headerShown: false }} />
      <WebSEO
        title="사주 분석 - 사주라떼"
        description="생년월일만 입력하면 정통 명리학 기반의 정확한 사주 풀이와 만세력을 무료로 확인할 수 있습니다."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: '사주 분석',
          url: 'https://sajulatte.app/saju',
        }}
      />
      <View className="flex-1 items-center justify-center">{renderContent()}</View>
    </FullWidthWebLayout>
  ) : (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebSEO
        title="사주 분석 - 사주라떼"
        description="생년월일만 입력하면 정통 명리학 기반의 정확한 사주 풀이와 만세력을 무료로 확인할 수 있습니다."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: '사주 분석',
          url: 'https://sajulatte.app/saju',
        }}
      />
      <View className="flex-1 items-center justify-center">{renderContent()}</View>
    </ScrollView>
  );
}
