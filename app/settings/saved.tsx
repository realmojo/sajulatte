import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Trash2, Plus, X, Pencil, Star, Moon, Sun, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ProfileEditModal, ProfileData } from '@/components/modal/ProfileEditModal';
import { updateRemoteProfile } from '@/lib/services/authService';
import { WebSEO } from '@/components/ui/WebSEO';

// --- Helpers ---

// 12간지 (띠) 계산
const getZodiacEmoji = (year: number) => {
  const animals = ['🐵', '🐔', '🐶', '🐷', '🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑'];
  return animals[year % 12];
};

const getZodiacName = (year: number) => {
  const animals = [
    '원숭이',
    '닭',
    '개',
    '돼지',
    '쥐',
    '소',
    '호랑이',
    '토끼',
    '용',
    '뱀',
    '말',
    '양',
  ];
  return animals[year % 12];
};

// 관계 라벨 변환
const getRelationshipLabel = (key?: string) => {
  const map: Record<string, string> = {
    me: '본인',
    family: '가족',
    friend: '친구',
    partner: '연인',
    colleague: '동료',
    other: '기타',
  };
  return map[key || 'me'] || '본인';
};

// 오행 색상 계산 (생년 끝자리 기준)
const getElementColor = (year: number, isDark: boolean) => {
  const lastDigit = year % 10;
  // 0,1: 금(Metal) - White/Silver
  // 2,3: 수(Water) - Black/Blue
  // 4,5: 목(Wood) - Green
  // 6,7: 화(Fire) - Red
  // 8,9: 토(Earth) - Yellow/Brown

  if (lastDigit === 0 || lastDigit === 1) {
    // 금
    return {
      bg: isDark ? 'bg-slate-800' : 'bg-slate-100',
      border: 'border-slate-300',
      text: 'text-slate-600',
      icon: '#64748b',
    };
  } else if (lastDigit === 2 || lastDigit === 3) {
    // 수
    return {
      bg: isDark ? 'bg-blue-950' : 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      icon: '#2563eb',
    };
  } else if (lastDigit === 4 || lastDigit === 5) {
    // 목
    return {
      bg: isDark ? 'bg-emerald-950' : 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      icon: '#059669',
    };
  } else if (lastDigit === 6 || lastDigit === 7) {
    // 화
    return {
      bg: isDark ? 'bg-rose-950' : 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-600',
      icon: '#e11d48',
    };
  } else {
    // 토 (8, 9)
    return {
      bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600',
      icon: '#d97706',
    };
  }
};

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#fff' : '#000';

  const [list, setList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  // Modal State
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any | null>(null);

  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);

  const loadList = async () => {
    try {
      const myDataRaw = await AsyncStorage.getItem('my_saju_list');
      const otherDataRaw = await AsyncStorage.getItem('relationship_saju_list');

      const myList = myDataRaw ? JSON.parse(myDataRaw) : [];
      const otherList = otherDataRaw ? JSON.parse(otherDataRaw) : [];

      setList([...myList, ...otherList]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadList();
    }, [])
  );

  const handleDelete = (id: string, e: any) => {
    e.stopPropagation();
    setDeleteId(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      // Load current lists
      const myDataRaw = await AsyncStorage.getItem('my_saju_list');
      const otherDataRaw = await AsyncStorage.getItem('relationship_saju_list');

      let myList = myDataRaw ? JSON.parse(myDataRaw) : [];
      let otherList = otherDataRaw ? JSON.parse(otherDataRaw) : [];

      // Filter out from both (simplest way to ensure deletion regardless of where it is)
      myList = myList.filter((item: any) => item.id !== deleteId);
      otherList = otherList.filter((item: any) => item.id !== deleteId);

      // Save back
      await AsyncStorage.setItem('my_saju_list', JSON.stringify(myList));
      await AsyncStorage.setItem('relationship_saju_list', JSON.stringify(otherList));

      // Update state
      setList([...myList, ...otherList]);

      setIsDeleteModalVisible(false);
      setDeleteId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePress = (item: any) => {
    router.push({
      pathname: '/result',
      params: {
        name: item.name,
        year: item.birth_year,
        month: item.birth_month,
        day: item.birth_day,
        hour: item.birth_hour,
        minute: item.birth_minute,
        gender: item.gender,
        calendarType: item.calendar_type,
        isLeapMonth: item.is_leap_month,
      },
    });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleSave = async (data: ProfileData) => {
    try {
      // 1. Load current lists
      const myDataRaw = await AsyncStorage.getItem('my_saju_list');
      const otherDataRaw = await AsyncStorage.getItem('relationship_saju_list');
      let myList = myDataRaw ? JSON.parse(myDataRaw) : [];
      let otherList = otherDataRaw ? JSON.parse(otherDataRaw) : [];

      // 2. If editing, remove the item from existing lists first (handles updates and relationship changes)
      if (editingItem) {
        myList = myList.filter((item: any) => item.id !== editingItem.id);
        otherList = otherList.filter((item: any) => item.id !== editingItem.id);
      }

      // 3. Process Save based on Relationship
      if (data.relationship === 'me') {
        // --- CASE: Relationship is 'me' ---

        // Try to update via Auth Service (Supabase + Local 'my_saju_list')
        try {
          await updateRemoteProfile({
            name: data.name,
            gender: data.gender,
            birth_year: data.birth_year,
            birth_month: data.birth_month,
            birth_day: data.birth_day,
            birth_hour: data.birth_hour,
            birth_minute: data.birth_minute,
            calendar_type: data.calendar_type,
            is_leap: data.is_leap,
          });

          // Note: updateRemoteProfile overwrites 'my_saju_list' with the single profile.
          // This is fine as 'me' should be unique.

          // However, we must ensure 'relationship_saju_list' is also saved
          // (in case we moved an item FROM 'other' TO 'me', removing it from otherList)
          await AsyncStorage.setItem('relationship_saju_list', JSON.stringify(otherList));
        } catch (authError) {
          console.log(
            'Remote update failed (likely not logged in), falling back to local only',
            authError
          );

          // Fallback: Save to 'my_saju_list' manually
          const newItem = {
            id: editingItem ? editingItem.id : Date.now().toString(),
            name: data.name,
            gender: data.gender,
            birth_year: data.birth_year,
            birth_month: data.birth_month,
            birth_day: data.birth_day,
            birth_hour: data.birth_hour,
            birth_minute: data.birth_minute,
            calendar_type: data.calendar_type,
            is_leap_month: data.is_leap,
            relationship: 'me',
            created_at: editingItem ? editingItem.created_at : new Date().toISOString(),
          };

          // Enforce singular 'Me' locally if manual save
          await AsyncStorage.setItem('my_saju_list', JSON.stringify([newItem]));
          await AsyncStorage.setItem('relationship_saju_list', JSON.stringify(otherList));
        }
      } else {
        // --- CASE: Relationship is NOT 'me' ---

        const newItem = {
          id: editingItem ? editingItem.id : Date.now().toString(),
          name: data.name,
          gender: data.gender,
          birth_year: data.birth_year,
          birth_month: data.birth_month,
          birth_day: data.birth_day,
          birth_hour: data.birth_hour,
          birth_minute: data.birth_minute,
          calendar_type: data.calendar_type,
          is_leap_month: data.is_leap,
          relationship: data.relationship,
          created_at: editingItem ? editingItem.created_at : new Date().toISOString(),
        };

        otherList.push(newItem);

        await AsyncStorage.setItem('relationship_saju_list', JSON.stringify(otherList));
        // Save myList (in case we moved an item FROM 'me' TO 'other', removing it from myList)
        await AsyncStorage.setItem('my_saju_list', JSON.stringify(myList));
      }

      // 4. Reload List
      await loadList();
      setIsModalVisible(false);
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isMain = index === 0;
    const colors = getElementColor(item.birth_year, isDark);
    const zodiacEmoji = getZodiacEmoji(item.birth_year);
    const zodiacName = getZodiacName(item.birth_year);
    const relationshipLabel = getRelationshipLabel(item.relationship);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress(item)}
        className={`mb-3 w-full flex-row items-center justify-between rounded-2xl border ${colors.bg} ${
          isMain ? 'border-2 border-amber-400' : 'border-transparent' // Remove border from non-main items for cleaner look or use colors.border
        } p-4 shadow-sm`}
        style={!isMain ? { borderWidth: 1, borderColor: isDark ? '#333' : '#e5e7eb' } : {}}>
        <View className="flex-1 flex-row items-center gap-3">
          {/* Avatar / Icon */}
          <View
            className={`h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm`}>
            <Text className="text-xl">{zodiacEmoji}</Text>
          </View>

          {/* Text Info */}
          <View className="flex-1">
            <View className="mb-0.5 flex-row items-center gap-2">
              <Text
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                numberOfLines={1}>
                {item.name}
              </Text>
              {/* Relationship Badge */}
              <View
                className={`rounded-full px-2 py-0.5 ${isMain ? 'bg-amber-100' : 'bg-gray-100'}`}>
                <Text
                  className={`text-[10px] font-bold ${isMain ? 'text-amber-600' : 'text-gray-500'}`}>
                  {isMain ? '나의 명식' : relationshipLabel}
                </Text>
              </View>
            </View>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.calendar_type === 'lunar' ? '음' : '양'} {item.birth_year.toString().slice(2)}.
              {String(item.birth_month).padStart(2, '0')}.{String(item.birth_day).padStart(2, '0')}{' '}
              · {zodiacName}띠
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="ml-2 flex-row items-center gap-2">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              openEditModal(item);
            }}
            className="rounded-full bg-white/50 p-2 active:bg-gray-200">
            <Pencil size={16} color={isDark ? '#aaa' : '#9ca3af'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => handleDelete(item.id, e)}
            className="rounded-full bg-white/50 p-2 active:bg-red-200">
            <Trash2 size={16} color={isDark ? '#ff6b6b' : '#ef4444'} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <WebSEO title={`저장된 목록 - 사주라떼`} />
      <Stack.Screen options={{ headerShown: false, title: '궁합 분석 결과' }} />
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-1 px-4 pt-4">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={iconColor} />
              <Text className="mt-4 text-muted-foreground">목록을 불러오는 중...</Text>
            </View>
          ) : list.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-4">
              <View className="h-32 w-32 items-center justify-center rounded-full bg-muted/20">
                <Star size={48} color="#9ca3af" />
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-foreground">아직 저장된 사주가 없어요</Text>
                <Text className="mt-2 text-center text-muted-foreground">
                  소중한 사람들의 생일을 등록하고{'\n'}사주와 운세를 확인해보세요.
                </Text>
              </View>
            </View>
          ) : (
            <FlatList
              data={list}
              keyExtractor={(item) => item.id}
              contentContainerClassName="pb-32"
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
            />
          )}
        </View>

        {/* Floating Action Button (FAB) */}
        <View className="absolute bottom-16 right-6">
          <TouchableOpacity
            onPress={openCreateModal}
            activeOpacity={0.8}
            className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/30"
            style={{ elevation: 5 }}>
            <Plus size={32} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <ProfileEditModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSave}
          initialData={editingItem}
          showRelationship={true}
        />

        <Modal
          visible={isDeleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDeleteModalVisible(false)}>
          <View className="flex-1 items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <View className="w-full max-w-sm gap-4 rounded-2xl border border-white/10 bg-background p-6 shadow-2xl">
              <View className="items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <Trash2 size={24} color="#ef4444" />
                </View>
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-foreground">사주 명식 삭제</Text>
                  <Text className="text-center text-muted-foreground">
                    정말로 삭제하시겠습니까?{'\n'}삭제된 정보는 되돌릴 수 없습니다.
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-3 pt-2">
                <TouchableOpacity
                  className="flex-1 items-center justify-center rounded-xl bg-muted py-3.5"
                  onPress={() => setIsDeleteModalVisible(false)}>
                  <Text className="font-semibold text-foreground">취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 items-center justify-center rounded-xl bg-red-500 py-3.5"
                  onPress={confirmDelete}>
                  <Text className="font-semibold text-white">삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
