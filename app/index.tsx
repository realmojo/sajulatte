import { View, Text, TouchableOpacity, Platform, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { Calendar } from 'lucide-react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const isWeb = Platform.OS === 'web';
  const router = useRouter();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');

  const handleSubmit = () => {
    if (!name || !year || !month || !day) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    router.push({
      pathname: '/saju',
      params: {
        name,
        year,
        month,
        day,
        hour: hour || '0',
        minute: minute || '0',
        gender,
        calendarType,
        isLeapMonth: 'false',
      },
    });
  };

  const content = (
    <View className="flex-1 items-center justify-center p-8">
      {/* Hero Section */}
      <View className="mb-12 w-full max-w-2xl items-center">
        <View className="mb-6 h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-amber-100 shadow-xl">
          <Text className="text-5xl">☕️</Text>
        </View>
        <Text className="mb-3 text-center text-4xl font-bold text-gray-900">사주 분석</Text>
        <Text className="text-center text-lg leading-7 text-gray-600">
          정통 명리학 기반의 정확한 사주 풀이
        </Text>
      </View>

      {/* Input Form */}
      <View className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
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
          onPress={handleSubmit}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 shadow-lg active:scale-95">
          <Text className="text-center text-lg font-bold text-white">분석하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return isWeb ? (
    <FullWidthWebLayout>
      <WebSEO
        title="사주라떼 - 무료 사주 만세력"
        description="생년월일만 입력하면 정통 명리학 기반의 정확한 사주 풀이와 만세력을 무료로 확인할 수 있습니다. 오늘의 운세와 궁합도 확인해보세요."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '사주라떼',
          url: 'https://sajulatte.app',
        }}
      />
      {content}
    </FullWidthWebLayout>
  ) : (
    <ScrollView className="flex-1 bg-white">
      <WebSEO
        title="사주라떼 - 무료 사주 만세력"
        description="생년월일만 입력하면 정통 명리학 기반의 정확한 사주 풀이와 만세력을 무료로 확인할 수 있습니다. 오늘의 운세와 궁합도 확인해보세요."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '사주라떼',
          url: 'https://sajulatte.app',
        }}
      />
      {content}
    </ScrollView>
  );
}
