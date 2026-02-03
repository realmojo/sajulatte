import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ChevronRight, X, Plus, Star, HeartHandshake, Trash2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { supabase } from '@/lib/supabase';
import { userService, UserProfile } from '@/lib/services/userService';
import { CELEBS, Celebrity } from '@/lib/data/celebs';
import { ProfileEditModal, ProfileData } from '@/components/modal/ProfileEditModal';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';

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

export default function CompatibilityScreen() {
  const router = useRouter();
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

  const deletePartner = async (id: string) => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const newList = savedList.filter((item) => item.id !== id);
            await AsyncStorage.setItem('relationship_saju_list', JSON.stringify(newList));
            setSavedList(newList);
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const executeCalculate = (targetPartner: PartnerProfile) => {
    if (!myProfile) {
      Alert.alert('로그인 필요', '먼저 나의 사주 정보를 설정 탭에서 입력해주세요.');
      return;
    }
    if (!myProfile.birth_year || !myProfile.birth_month || !myProfile.birth_day) {
      Alert.alert('정보 부족', '설정 탭에서 나의 생년월일을 정확히 입력해주세요.');
      return;
    }

    let pHour = 0;
    if (targetPartner.birthHour && targetPartner.birthHour.includes(':')) {
      const [h] = targetPartner.birthHour.split(':').map(Number);
      pHour = h;
    } else if (targetPartner.birthHour && !isNaN(Number(targetPartner.birthHour))) {
      pHour = Number(targetPartner.birthHour);
    }

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
      setShowInputModal(false);

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
      calendarType: 'solar',
    });
  };

  return (
    <FullWidthWebLayout>
      <WebSEO
        title="무료 궁합 보기 - 사주라떼"
        description="연인, 친구, 동료와의 궁합을 오행 분석을 통해 무료로 확인해보세요."
      />
      <View className="flex-1 items-center justify-center p-6">
        <ScrollView
          className="w-full max-w-2xl flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View className="mb-10 w-full items-center">
            <View className="mb-6 h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-pink-100 shadow-sm">
              <Text className="text-5xl">💑</Text>
            </View>
            <Text className="mb-3 text-center text-4xl font-bold text-gray-900">궁합 분석</Text>
            <Text className="text-center text-lg leading-7 text-gray-500">
              연인, 친구, 동료와의 인연을 확인해보세요.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="mb-8 flex-row gap-4">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowInputModal(true)}
              className="flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 py-4 shadow-md active:scale-95">
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Plus size={24} color="white" />
              </View>
              <Text className="font-bold text-white">새 파트너 추가</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowCelebModal(true)}
              className="flex-1 items-center justify-center rounded-2xl border border-gray-100 bg-white py-4 shadow-sm active:scale-95 active:bg-gray-50">
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <Star size={24} color="#ca8a04" />
              </View>
              <Text className="font-bold text-gray-800">유명인과 궁합</Text>
            </TouchableOpacity>
          </View>

          {/* Saved List Section */}
          <View>
            <View className="mb-4 flex-row items-center justify-between px-2">
              <Text className="text-lg font-bold text-gray-900">저장된 파트너</Text>
              <Text className="text-sm font-medium text-gray-400">{savedList.length}명</Text>
            </View>

            {savedList.length > 0 ? (
              <View className="gap-3">
                {savedList.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <TouchableOpacity
                      onPress={() => handleSelectFromList(item)}
                      activeOpacity={0.7}
                      className="flex-1 flex-row items-center gap-4">
                      <View
                        className={`h-14 w-14 items-center justify-center rounded-2xl ${
                          item.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50'
                        }`}>
                        <Text className="text-2xl">{item.gender === 'male' ? '👨' : '👩'}</Text>
                      </View>
                      <View>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                          <View className="rounded-md bg-gray-100 px-2 py-0.5">
                            <Text className="text-xs font-medium text-gray-500">
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
                        <Text className="text-sm text-gray-500">
                          {item.birth_year}.{item.birth_month}.{item.birth_day}
                          {item.calendar_type === 'lunar' && ' (음)'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-1">
                      <TouchableOpacity
                        onPress={() => handleSelectFromList(item)}
                        className="rounded-xl bg-pink-50 px-4 py-2 hover:bg-pink-100">
                        <Text className="text-sm font-bold text-pink-600">보기</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deletePartner(item.id)}
                        className="p-3 opacity-30 hover:opacity-100">
                        <Trash2 size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-12">
                <HeartHandshake size={48} color="#d1d5db" />
                <Text className="mt-4 text-center text-gray-400">
                  아직 저장된 파트너가 없습니다.{'\n'}새 파트너를 추가하고 궁합을 확인해보세요!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Input Modal */}
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
                className="mb-3 flex-row items-center rounded-xl border border-gray-100 bg-gray-50 p-4 active:bg-gray-100">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <Text className="text-2xl">🌟</Text>
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
    </FullWidthWebLayout>
  );
}
