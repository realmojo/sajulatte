import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => Promise<void>;
  initialData: ProfileData | null;
  showRelationship?: boolean;
}

export interface ProfileData {
  name: string;
  gender: 'male' | 'female';
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number | null;
  birth_minute: number | null;
  calendar_type: 'solar' | 'lunar';
  is_leap: boolean;
  relationship?: string;
}

export function ProfileEditModal({
  visible,
  onClose,
  onSave,
  initialData,
  showRelationship = false,
}: ProfileEditModalProps) {
  const insets = useSafeAreaInsets();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [type, setType] = useState<'solar' | 'lunar'>('solar');
  const [isLeap, setIsLeap] = useState(false);
  const [relationship, setRelationship] = useState('friend');

  const relationships = [
    { label: '본인', value: 'me' },
    { label: '가족', value: 'family' },
    { label: '친구', value: 'friend' },
    { label: '연인', value: 'partner' },
    { label: '동료', value: 'colleague' },
    { label: '기타', value: 'other' },
  ];

  // Initialize form when opened or data changes
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.name || '');
        setYear(initialData.birth_year?.toString() || '');
        setMonth(initialData.birth_month?.toString() || '');
        setDay(initialData.birth_day?.toString() || '');
        setHour(
          initialData.birth_hour !== null && initialData.birth_hour !== undefined
            ? initialData.birth_hour.toString()
            : ''
        );
        setMinute(
          initialData.birth_minute !== null && initialData.birth_minute !== undefined
            ? initialData.birth_minute.toString()
            : ''
        );
        setGender(initialData.gender || 'male');
        setType(initialData.calendar_type || 'solar');
        setIsLeap(initialData.is_leap || false);
        setRelationship(initialData.relationship || 'friend');
      } else {
        // Reset defaults
        setName('');
        setYear('');
        setMonth('');
        setDay('');
        setHour('');
        setMinute('');
        setGender('male');
        setType('solar');
        setIsLeap(false);
        setRelationship('friend');
      }
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    if (!name || !year || !month || !day) {
      alert('이름과 생년월일은 필수 입력 항목입니다.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name,
        gender,
        birth_year: parseInt(year),
        birth_month: parseInt(month),
        birth_day: parseInt(day),
        birth_hour: hour ? parseInt(hour) : null,
        birth_minute: minute ? parseInt(minute) : null,
        calendar_type: type,
        is_leap: isLeap,
        relationship: showRelationship ? relationship : undefined,
      });
      // onClose is typically handled by parent after success,
      // but if onSave throws, we stay here.
    } catch (e) {
      console.error(e);
      alert('저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View
        className="flex-1 bg-white"
        style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
          <Text className="text-lg font-bold text-black">사주 정보 등록</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={120}
          enableAutomaticScroll={true}
          contentContainerStyle={{ padding: 24, paddingBottom: 150, gap: 24 }}
          keyboardShouldPersistTaps="handled">
          {/* Relationship Selector */}
          {showRelationship && (
            <View className="gap-2">
              <Text className="font-medium text-gray-700">나와의 관계</Text>
              <View className="flex-row flex-wrap gap-2">
                {relationships.map((rel) => (
                  <TouchableOpacity
                    key={rel.value}
                    onPress={() => setRelationship(rel.value)}
                    className={`rounded-full border px-4 py-2 ${
                      relationship === rel.value
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-200 bg-white'
                    }`}>
                    <Text
                      className={
                        relationship === rel.value ? 'font-medium text-white' : 'text-gray-600'
                      }>
                      {rel.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View className="gap-2">
            <Text className="font-medium text-gray-700">이름</Text>
            <Input
              placeholder="이름을 입력하세요"
              value={name}
              onChangeText={setName}
              className="bg-gray-50"
            />
          </View>

          <View className="gap-2">
            <Text className="font-medium text-gray-700">성별</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setGender('male')}
                className={`flex-1 items-center rounded-lg border py-3 ${
                  gender === 'male' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}>
                <Text className={gender === 'male' ? 'font-bold text-blue-600' : 'text-gray-500'}>
                  남성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('female')}
                className={`flex-1 items-center rounded-lg border py-3 ${
                  gender === 'female' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                }`}>
                <Text className={gender === 'female' ? 'font-bold text-red-600' : 'text-gray-500'}>
                  여성
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="gap-2">
            <Text className="font-medium text-gray-700">생년월일 (양력/음력)</Text>
            <View className="mb-2 flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setType('solar');
                  setIsLeap(false);
                }}
                className={`flex-1 items-center rounded-lg border py-2 ${
                  type === 'solar' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white'
                }`}>
                <Text className={type === 'solar' ? 'font-bold text-amber-600' : 'text-gray-500'}>
                  양력
                </Text>
              </TouchableOpacity>
              <View className="flex-1 flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setType('lunar')}
                  className={`flex-1 items-center rounded-lg border py-2 ${
                    type === 'lunar' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                  }`}>
                  <Text
                    className={type === 'lunar' ? 'font-bold text-indigo-600' : 'text-gray-500'}>
                    음력
                  </Text>
                </TouchableOpacity>
                {type === 'lunar' && (
                  <TouchableOpacity
                    onPress={() => setIsLeap(!isLeap)}
                    className={`w-16 items-center justify-center rounded-lg border py-2 ${
                      isLeap ? 'border-indigo-500 bg-indigo-500' : 'border-gray-200 bg-white'
                    }`}>
                    <Text className={isLeap ? 'font-bold text-white' : 'text-gray-500'}>윤달</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input
                  placeholder="YYYY"
                  value={year}
                  onChangeText={(t) => setYear(t.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  maxLength={4}
                  className="bg-gray-50 text-center"
                />
                <Text className="mt-1 text-center text-xs text-gray-400">년</Text>
              </View>
              <View className="flex-1">
                <Input
                  placeholder="MM"
                  value={month}
                  onChangeText={(t) => setMonth(t.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  maxLength={2}
                  className="bg-gray-50 text-center"
                />
                <Text className="mt-1 text-center text-xs text-gray-400">월</Text>
              </View>
              <View className="flex-1">
                <Input
                  placeholder="DD"
                  value={day}
                  onChangeText={(t) => setDay(t.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  maxLength={2}
                  className="bg-gray-50 text-center"
                />
                <Text className="mt-1 text-center text-xs text-gray-400">일</Text>
              </View>
            </View>
          </View>

          <View className="gap-2">
            <Text className="font-medium text-gray-700">태어난 시간 (선택)</Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input
                  placeholder="시"
                  value={hour}
                  onChangeText={(t) => setHour(t.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  maxLength={2}
                  className="bg-gray-50 text-center"
                />
              </View>
              <View className="flex-1">
                <Input
                  placeholder="분"
                  value={minute}
                  onChangeText={(t) => setMinute(t.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  maxLength={2}
                  className="bg-gray-50 text-center"
                />
              </View>
            </View>
          </View>

          <Button size="lg" className="mt-4" onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white">저장하기</Text>
            )}
          </Button>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}
