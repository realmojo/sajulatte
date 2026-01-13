import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Megaphone } from 'lucide-react-native';

const NOTICE_DATA = [
  {
    id: '1',
    title: '사주라떼 서비스 정식 오픈 안내',
    date: '2026.01.01',
    content:
      '안녕하세요, 사주라떼 팀입니다. 드디어 사주라떼가 정식 오픈했습니다! 많은 사랑 부탁드립니다.',
    isImportant: true,
  },
  {
    id: '2',
    title: 'v1.0.1 업데이트 안내',
    date: '2026.01.05',
    content: '앱 안정성 개선 및 일부 버그가 수정되었습니다.',
    isImportant: false,
  },
];

export default function NoticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: '공지사항' }} />

      <FlatList
        data={NOTICE_DATA}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 gap-3"
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400">등록된 공지사항이 없습니다.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            className={`w-full flex-row items-center justify-between rounded-xl border p-5 shadow-sm active:bg-gray-50 ${
              item.isImportant ? 'border-indigo-100 bg-indigo-50/30' : 'border-gray-100 bg-white'
            }`}
            onPress={() => {
              // Future: Navigate to detail
              // router.push(`/notice/${item.id}`)
            }}>
            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-2">
                {item.isImportant && (
                  <View className="rounded bg-indigo-500 px-1.5 py-0.5">
                    <Text className="text-[10px] font-bold text-white">중요</Text>
                  </View>
                )}
                <Text
                  className={`text-base font-semibold ${item.isImportant ? 'text-indigo-900' : 'text-gray-900'}`}
                  numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
              <Text className="text-xs text-gray-500">{item.date}</Text>
            </View>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
