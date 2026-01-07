import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{ paddingTop: insets.top }}>
      <Text className="text-xl font-bold">궁합</Text>
      <Text className="text-gray-500">준비 중입니다.</Text>
    </View>
  );
}
