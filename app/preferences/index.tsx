import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  FileText,
  HelpCircle,
  LogOut,
  Trash2,
  Info,
} from 'lucide-react-native';
import { useState } from 'react';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebSEO } from '@/components/ui/WebSEO';

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/(tabs)/settings');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 계속하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴하기', style: 'destructive', onPress: () => console.log('Delete account') },
      ]
    );
  };

  const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="mb-2 px-4 text-sm font-semibold text-gray-500">{title}</Text>
      <View className="overflow-hidden rounded-xl border border-gray-100 bg-white">{children}</View>
    </View>
  );

  const MenuItem = ({
    icon: Icon,
    label,
    value,
    onPress,
    showArrow = true,
    isDestructive = false,
    rightElement,
  }: {
    icon: any;
    label: string;
    value?: string;
    onPress?: () => void;
    showArrow?: boolean;
    isDestructive?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center justify-between border-b border-gray-100 px-4 py-4 last:border-b-0">
      <View className="flex-row items-center gap-3">
        <View className={`rounded-lg p-2 ${isDestructive ? 'bg-red-50' : 'bg-gray-50'}`}>
          <Icon size={20} color={isDestructive ? '#ef4444' : '#4b5563'} />
        </View>
        <Text
          className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-gray-900'}`}>
          {label}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && <Text className="text-sm text-gray-500">{value}</Text>}
        {rightElement}
        {showArrow && !rightElement && <ChevronRight size={18} color="#9ca3af" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <WebSEO
        title="디지털 부적 - 사주라떼"
        description="나만의 디지털 부적으로 행운을 높여보세요."
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">환경설정</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* 알림 설정 */}
        <MenuSection title="알림">
          <MenuItem
            icon={Bell}
            label="푸시 알림"
            showArrow={false}
            rightElement={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#d1d5db', true: '#fbbf24' }} // Amber-400
                thumbColor={'#fff'}
              />
            }
          />
        </MenuSection>

        {/* 서비스 정보 */}
        <MenuSection title="서비스 정보">
          <MenuItem icon={Info} label="앱 버전" value={`v${appVersion}`} showArrow={false} />
          <MenuItem
            icon={FileText}
            label="서비스 이용약관"
            onPress={() => Linking.openURL('https://sajulatte.app/terms')}
          />
          <MenuItem
            icon={FileText}
            label="개인정보 처리방침"
            onPress={() => Linking.openURL('https://sajulatte.app/privacy')}
          />
        </MenuSection>

        {/* 고객 지원 */}
        <MenuSection title="고객 지원">
          <MenuItem
            icon={HelpCircle}
            label="1:1 문의하기"
            onPress={() => Linking.openURL('mailto:support@sajulatte.app')}
          />
        </MenuSection>

        {/* 계정 관리 */}
        <MenuSection title="계정">
          <MenuItem icon={LogOut} label="로그아웃" onPress={handleLogout} showArrow={false} />
          <MenuItem
            icon={Trash2}
            label="회원 탈퇴"
            isDestructive
            onPress={handleDeleteAccount}
            showArrow={false}
          />
        </MenuSection>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
