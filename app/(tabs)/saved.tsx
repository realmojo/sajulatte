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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Trash2, Plus, X, Pencil, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';

  const [list, setList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  // Modal State
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');
  const [hour, setHour] = React.useState('');
  const [minute, setMinute] = React.useState('');
  const [gender, setGender] = React.useState<'male' | 'female'>('male');
  const [calendarType, setCalendarType] = React.useState<'solar' | 'lunar'>('solar');
  const [isLeapMonth, setIsLeapMonth] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);

  const loadList = async () => {
    try {
      const existingData = await AsyncStorage.getItem('saju_list');
      if (existingData) {
        setList(JSON.parse(existingData));
      }
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
    e.stopPropagation(); // prevent item press
    setDeleteId(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const newList = list.filter((item) => item.id !== deleteId);
      setList(newList);
      await AsyncStorage.setItem('saju_list', JSON.stringify(newList));
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
    setEditingId(null);
    setName('');
    setYear('');
    setMonth('');
    setDay('');
    setHour('');
    setMinute('');
    setGender('male');
    setCalendarType('solar');
    setIsLeapMonth(false);
    setIsModalVisible(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setYear(item.birth_year ? String(item.birth_year) : '');
    setMonth(item.birth_month ? String(item.birth_month) : '');
    setDay(item.birth_day ? String(item.birth_day) : '');
    setHour(item.birth_hour ? String(item.birth_hour) : '');
    setMinute(item.birth_minute ? String(item.birth_minute) : '');
    setGender(item.gender);
    setCalendarType(item.calendar_type || 'solar');
    setIsLeapMonth(item.is_leap_month || false);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !year || !month || !day) {
      alert('이름과 생년월일을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // Edit existing
      const updatedList = list.map((item) => {
        if (item.id === editingId) {
          return {
            ...item,
            name,
            gender,
            birth_year: parseInt(year),
            birth_month: parseInt(month),
            birth_day: parseInt(day),
            birth_hour: hour ? parseInt(hour) : null,
            birth_minute: minute ? parseInt(minute) : null,
            calendar_type: calendarType,
            is_leap_month: isLeapMonth,
          };
        }
        return item;
      });

      try {
        await AsyncStorage.setItem('saju_list', JSON.stringify(updatedList));
        setList(updatedList);
        setIsModalVisible(false);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Create new
      const newProfile = {
        id: Date.now().toString(),
        name,
        gender,
        birth_year: parseInt(year),
        birth_month: parseInt(month),
        birth_day: parseInt(day),
        birth_hour: hour ? parseInt(hour) : null,
        birth_minute: minute ? parseInt(minute) : null,
        calendar_type: calendarType,
        is_leap_month: isLeapMonth,
        created_at: new Date().toISOString(),
      };

      try {
        const newList = [newProfile, ...list];
        await AsyncStorage.setItem('saju_list', JSON.stringify(newList));
        setList(newList);
        setIsModalVisible(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-1 px-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={iconColor} />
            <Text className="mt-4 text-muted-foreground">목록을 불러오는 중...</Text>
          </View>
        ) : list.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">저장된 사주가 없습니다.</Text>
            <Button variant="outline" className="mt-4" onPress={openCreateModal}>
              <Text>새로운 사주 추가하기</Text>
            </Button>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-3 pb-20"
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                className={`rounded-xl border bg-card p-4 shadow-sm ${
                  index === 0 ? 'border-2 border-amber-400 bg-amber-50/10' : 'border-border'
                }`}
                onPress={() => handlePress(item)}>
                {index === 0 && (
                  <View className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5">
                    <Text className="text-[10px] font-bold text-amber-600">대표 사주</Text>
                  </View>
                )}
                <View className="flex-row items-center gap-3">
                  {/* Gender Icon */}
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-full ${
                      item.gender === 'male' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                    <Text className="text-xl">{item.gender === 'male' ? '👨' : '👩'}</Text>
                  </View>

                  <View className="gap-0.5">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
                      {index === 0 && <Star size={14} color="#F59E0B" fill="#F59E0B" />}
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {item.birth_year}.{item.birth_month}.{item.birth_day} (
                      {item.calendar_type === 'lunar' ? '음' : '양'})
                    </Text>
                  </View>
                </View>

                <View className="mt-3 flex-row items-center justify-between border-t border-border pt-2">
                  <View className="flex-1" />
                  <View className="flex-row items-center gap-1">
                    <TouchableOpacity onPress={() => openEditModal(item)} className="p-2">
                      <Pencil size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(e) => handleDelete(item.id, e)} className="p-2">
                      <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <View className="items-center px-6 py-4">
          <TouchableOpacity
            onPress={openCreateModal}
            activeOpacity={0.7}
            className="flex-row items-center gap-2 rounded-full border border-border bg-card px-5 py-3 shadow-sm">
            <Text className="text-xl font-bold text-foreground">추가</Text>
            <View className="rounded-full bg-secondary/20 p-1">
              <Plus size={18} color={iconColor} />
            </View>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <TouchableOpacity
              className="absolute inset-0"
              activeOpacity={1}
              onPress={() => setIsModalVisible(false)}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="rounded-t-3xl bg-background p-6 shadow-xl">
              {/* Modal Header */}
              <View className="mb-6 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground">새로운 사주 추가</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerClassName="gap-6 px-2 pb-8"
                showsVerticalScrollIndicator={false}>
                {/* Name Input */}
                <View className="gap-2">
                  <Text className="font-medium text-foreground">이름</Text>
                  <Input
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChangeText={setName}
                    className="bg-muted/30"
                  />
                </View>

                {/* Gender Input */}
                <View className="gap-2">
                  <Text className="font-medium text-foreground">성별</Text>
                  <View className="flex-row gap-3">
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

                {/* Calendar Type Input */}
                <View className="gap-2">
                  <Text className="font-medium text-foreground">양력/음력</Text>
                  <View className="flex-row gap-3">
                    <Button
                      variant={calendarType === 'solar' ? 'default' : 'outline'}
                      className="flex-1"
                      onPress={() => setCalendarType('solar')}>
                      <Text>양력</Text>
                    </Button>
                    <Button
                      variant={calendarType === 'lunar' ? 'default' : 'outline'}
                      className="flex-1"
                      onPress={() => setCalendarType('lunar')}>
                      <Text>음력</Text>
                    </Button>
                  </View>
                  {calendarType === 'lunar' && (
                    <TouchableOpacity
                      onPress={() => setIsLeapMonth(!isLeapMonth)}
                      className="mt-1 flex-row items-center gap-2">
                      <View
                        className={`h-5 w-5 items-center justify-center rounded border ${
                          isLeapMonth
                            ? 'border-primary bg-primary'
                            : 'border-gray-400 bg-transparent'
                        }`}>
                        {isLeapMonth && <Plus size={14} color="white" />}
                      </View>
                      <Text className="text-sm text-foreground">윤달</Text>
                    </TouchableOpacity>
                  )}
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
                        className="bg-muted/30 text-center"
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
                        className="bg-muted/30 text-center"
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
                        className="bg-muted/30 text-center"
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
                        className="bg-muted/30 text-center"
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
                        className="bg-muted/30 text-center"
                      />
                      <Text className="text-center text-xs text-muted-foreground">분</Text>
                    </View>
                  </View>
                </View>

                <Button size="lg" onPress={handleSave} className="mt-2">
                  <Text>{editingId ? '수정하기' : '저장하기'}</Text>
                </Button>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={isDeleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDeleteModalVisible(false)}>
          <View className="flex-1 items-center justify-center bg-black/50 p-6">
            <View className="w-full max-w-sm gap-4 rounded-xl border border-border bg-background p-6 shadow-lg">
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground">사주 삭제</Text>
                <Text className="text-muted-foreground">
                  정말로 이 사주를 삭제하시겠습니까?{'\n'}삭제된 데이터는 복구할 수 없습니다.
                </Text>
              </View>
              <View className="flex-row justify-end gap-3">
                <Button variant="outline" onPress={() => setIsDeleteModalVisible(false)}>
                  <Text>취소</Text>
                </Button>
                <Button variant="destructive" onPress={confirmDelete}>
                  <Text>삭제</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
