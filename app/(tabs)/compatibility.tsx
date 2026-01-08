import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ChevronRight, X, Plus, Star, HeartHandshake } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { supabase } from '@/lib/supabase';
import { userService, UserProfile } from '@/lib/services/userService';
import { CELEBS, Celebrity } from '@/lib/data/celebs';
import { ProfileEditModal, ProfileData } from '@/components/modal/ProfileEditModal';
// Web SEO Helper
import { Platform } from 'react-native';

type Gender = 'male' | 'female';
type CalendarType = 'solar' | 'lunar';

interface PartnerProfile {
  name: string;
  gender: Gender;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  calendarType: CalendarType;
}

const WebSEO = ({ title, description }: { title: string; description: string }) => {
  if (Platform.OS !== 'web') return null;
  useEffect(() => {
    document.title = title;
  }, [title, description]);
  return null;
};

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [showInputModal, setShowInputModal] = useState(false);
  const [showCelebModal, setShowCelebModal] = useState(false);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [savedList, setSavedList] = useState<any[]>([]);

  const fetchMyProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await userService.getUser(session.user.id);
        if (data) setMyProfile(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadSavedList = async () => {
        try {
          const json = await AsyncStorage.getItem('relationship_saju_list');
          if (json) {
            const list = JSON.parse(json);
            const filtered = list.filter((item: any) => item.relationship !== 'me');
            setSavedList(filtered);
          }
        } catch (e) {
          console.error(e);
        }
      };

      loadSavedList();
      fetchMyProfile();
    }, [])
  );

  const executeCalculate = (targetPartner: PartnerProfile) => {
    if (!myProfile) {
      Alert.alert('로그인 필요', '먼저 나의 사주 정보를 설정 탭에서 입력해주세요.');
      return;
    }
    if (!myProfile.birth_year || !myProfile.birth_month || !myProfile.birth_day) {
      Alert.alert('정보 부족', '설정 탭에서 나의 생년월일을 정확히 입력해주세요.');
      return;
    }

    // Parse Time
    let pHour = 0;
    if (targetPartner.birthHour && targetPartner.birthHour.includes(':')) {
      const [h] = targetPartner.birthHour.split(':').map(Number);
      pHour = h;
    } else if (targetPartner.birthHour && !isNaN(Number(targetPartner.birthHour))) {
      pHour = Number(targetPartner.birthHour);
    }

    // Navigate to Analysis Screen
    router.push({
      pathname: '/compatibility/analysis',
      params: {
        name: targetPartner.name,
        gender: targetPartner.gender,
        birthYear: targetPartner.birthYear,
        birthMonth: targetPartner.birthMonth,
        birthDay: targetPartner.birthDay,
        birthHour: pHour.toString(),
        calendarType: targetPartner.calendarType,
      },
    });

    setShowInputModal(false);
    setShowCelebModal(false);
  };

  const handleSelectFromList = (item: any) => {
    // Convert saved item to PartnerProfile
    const hourStr =
      item.birth_hour !== null && item.birth_minute !== null
        ? `${String(item.birth_hour).padStart(2, '0')}:${String(item.birth_minute).padStart(2, '0')}`
        : '';

    executeCalculate({
      name: item.name,
      gender: item.gender,
      birthYear: String(item.birth_year),
      birthMonth: String(item.birth_month),
      birthDay: String(item.birth_day),
      birthHour: hourStr,
      calendarType: item.calendar_type,
    });
  };

  const handleSavePartner = async (data: ProfileData) => {
    try {
      // 1. Save to relationship_saju_list
      const existingData = await AsyncStorage.getItem('relationship_saju_list');
      const list = existingData ? JSON.parse(existingData) : [];

      const newProfile = {
        id: Date.now().toString(),
        name: data.name,
        gender: data.gender,
        birth_year: data.birth_year,
        birth_month: data.birth_month,
        birth_day: data.birth_day,
        birth_hour: data.birth_hour,
        birth_minute: data.birth_minute,
        calendar_type: data.calendar_type,
        is_leap_month: data.is_leap,
        relationship: data.relationship || 'friend',
        created_at: new Date().toISOString(),
      };

      const newList = [...list, newProfile];
      await AsyncStorage.setItem('relationship_saju_list', JSON.stringify(newList));
      setSavedList(newList);

      // Close modal immediately
      setShowInputModal(false);

      // 2. Execute Calculation
      const hourStr =
        data.birth_hour !== null && data.birth_minute !== null
          ? `${String(data.birth_hour).padStart(2, '0')}:${String(data.birth_minute).padStart(2, '0')}`
          : '';

      executeCalculate({
        name: data.name,
        gender: data.gender,
        birthYear: String(data.birth_year),
        birthMonth: String(data.birth_month),
        birthDay: String(data.birth_day),
        birthHour: hourStr,
        calendarType: data.calendar_type,
      });
    } catch (e) {
      console.error('Failed to save partner:', e);
      Alert.alert('오류', '파트너 정보를 저장하는 데 실패했습니다.');
    }
  };

  const handleCelebSelect = (celeb: Celebrity) => {
    executeCalculate({
      name: celeb.name,
      gender: celeb.gender,
      birthYear: celeb.birthYear,
      birthMonth: celeb.birthMonth,
      birthDay: celeb.birthDay,
      birthHour: celeb.birthHour || '',
      calendarType: 'solar', // Celeb info is usually solar
    });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <WebSEO
        title="무료 궁합 보기 - 사주라떼"
        description="연인, 친구, 동료와의 궁합을 오행 분석을 통해 무료로 확인해보세요."
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <HeartHandshake
            size={24}
            className="text-foreground"
            color={colorScheme === 'dark' ? '#fff' : '#000'}
          />
          <Text className="text-xl font-bold text-foreground">궁합</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="pb-20">
        <View className="px-6 py-8">
          <Text className="mb-6 text-xl font-bold text-gray-900">누구와 궁합을 볼까요?</Text>

          {/* Saved List */}
          {savedList.length > 0 ? (
            <View className="mb-6 gap-3">
              {savedList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelectFromList(item)}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`h-12 w-12 items-center justify-center rounded-full ${
                        item.gender === 'male' ? 'bg-blue-100' : 'bg-rose-100'
                      }`}>
                      <Text className="text-xl">{item.gender === 'male' ? '👨' : '👩'}</Text>
                    </View>
                    <View>
                      <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                      <Text className="text-xs text-gray-500">
                        {item.birth_year}.{item.birth_month}.{item.birth_day} ·{' '}
                        {item.relationship === 'family'
                          ? '가족'
                          : item.relationship === 'partner'
                            ? '연인'
                            : item.relationship === 'colleague'
                              ? '동료'
                              : '친구/기타'}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="mb-8 items-center justify-center p-4">
              <Text className="text-gray-400">저장된 상대가 없습니다.</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowInputModal(true)}
              className="w-full flex-row items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 shadow-sm">
              <Plus size={20} color="white" />
              <Text className="text-base font-bold text-white">새로운 상대 추가하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCelebModal(true)}
              className="w-full flex-row items-center justify-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-6 py-4">
              <Star size={20} color="#e11d48" />
              <Text className="text-base font-bold text-rose-600">유명인과 궁합 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Input Modal using ProfileEditModal */}
      <ProfileEditModal
        visible={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSave={async (data) => {
          await handleSavePartner(data);
        }}
        initialData={null}
        showRelationship={true}
      />

      {/* Celeb Modal */}
      <Modal
        visible={showCelebModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCelebModal(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
            <Text className="text-lg font-bold">유명인 선택</Text>
            <TouchableOpacity onPress={() => setShowCelebModal(false)} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={CELEBS}
            keyExtractor={(item) => item.id}
            contentContainerClassName="p-4"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCelebSelect(item)}
                className="mb-3 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <Text className="text-xl">🌟</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                    {item.group && (
                      <Text className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                        {item.group}
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm text-gray-500">
                    {item.job} · {item.birthYear}.{item.birthMonth}.{item.birthDay}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
