import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Trash2 } from 'lucide-react-native';

export default function SavedScreen() {
  const [list, setList] = React.useState<any[]>([]);
  const router = useRouter();

  const loadList = async () => {
    try {
      const existingData = await AsyncStorage.getItem('saju_list');
      if (existingData) {
        setList(JSON.parse(existingData));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadList();
    }, [])
  );

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation(); // prevent item press
    try {
      const newList = list.filter((item) => item.id !== id);
      setList(newList);
      await AsyncStorage.setItem('saju_list', JSON.stringify(newList));
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
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: '저장된 사주' }} />
      <View className="flex-1 bg-background p-4">
        {list.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">저장된 사주가 없습니다.</Text>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-3"
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center justify-between rounded-lg border border-border bg-card p-4"
                onPress={() => handlePress(item)}>
                <View className="gap-1">
                  <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {item.birth_year}.{item.birth_month}.{item.birth_day} (
                    {item.gender === 'male' ? '남' : '여'})
                  </Text>
                </View>
                <TouchableOpacity onPress={(e) => handleDelete(item.id, e)} className="p-2">
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  );
}
