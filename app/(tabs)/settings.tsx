import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import {
  Settings,
  Bell,
  MessageCircle,
  Sparkles,
  Heart,
  Coins,
  HeartHandshake,
  Briefcase,
  Activity,
  User,
  Star,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase, uploadMainProfileToSupabase } from '@/lib/supabase';

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN' && session) {
        uploadMainProfileToSupabase();
      }
    });

    // Load local profile
    const loadProfile = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('saju_list');
        if (jsonValue) {
          const list = JSON.parse(jsonValue);
          if (list.length > 0) setUserProfile(list[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
            className="h-6 w-6 rounded-full"
          />
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Bell size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Settings size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" contentContainerClassName="p-4 gap-8">
        {/* Login CTA or Profile Section */}
        {session ? (
          <View className="w-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <View className="flex-row items-center gap-4">
              {session.user.user_metadata.avatar_url ? (
                <Image
                  source={{ uri: session.user.user_metadata.avatar_url }}
                  className="h-16 w-16 rounded-full border border-gray-200"
                />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <User size={32} className="text-amber-600" color="#d97706" />
                </View>
              )}

              <View>
                <Text className="text-xl font-bold text-foreground">
                  {userProfile?.name || session.user.email?.split('@')[0]}
                  <Text className="text-sm font-normal text-muted-foreground"> 님</Text>
                </Text>
                {userProfile ? (
                  <>
                    <Text className="text-sm text-muted-foreground">
                      {userProfile.birth_year}년 {userProfile.birth_month}월 {userProfile.birth_day}
                      일{userProfile.birth_hour ? ` ${userProfile.birth_hour}시` : ''}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-400">
                      {userProfile.calendar_type === 'lunar' ? '음력' : '양력'} /{' '}
                      {userProfile.gender === 'male' ? '남성' : '여성'}
                    </Text>
                  </>
                ) : (
                  <Text className="text-sm text-muted-foreground">사주 정보를 등록해주세요</Text>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View className="items-center gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <View className="items-center gap-2">
              <Text className="text-center text-xl font-bold text-foreground">
                로그인을 하시면{'\n'}더욱더 많은 내용을 볼 수 있어요!
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                3초만에 시작하고 나의 운세를 확인하세요
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'kakao',
                    options: {
                      redirectTo: 'sajulatte://',
                    },
                  });
                  if (error) alert(error.message);
                } catch (e) {
                  alert('로그인 중 오류가 발생했습니다.');
                }
              }}
              className="h-12 w-full flex-row items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4">
              <MessageCircle size={20} color="#000000" fill="#000000" />
              <Text className="text-base font-bold text-[#000000]">카카오 로그인</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories Grid */}
        <View className="gap-4">
          <Text className="px-1 text-lg font-bold text-foreground">전체 카테고리</Text>
          <View className="flex-row flex-wrap justify-between gap-y-6">
            {[
              { label: '총운', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
              { label: '연애운', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-100' },
              { label: '금전운', icon: Coins, color: 'text-yellow-600', bg: 'bg-yellow-100' },
              { label: '결혼운', icon: HeartHandshake, color: 'text-pink-500', bg: 'bg-pink-100' },
              { label: '직업운', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
              { label: '건강운', icon: Activity, color: 'text-green-500', bg: 'bg-green-100' },
              { label: '대인운', icon: User, color: 'text-purple-500', bg: 'bg-purple-100' },
              { label: '신년운세', icon: Sparkles, color: 'text-cyan-500', bg: 'bg-cyan-100' },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="w-[22%] items-center gap-2 active:opacity-70">
                <View
                  className={`h-14 w-14 items-center justify-center rounded-2xl ${item.bg} shadow-sm`}>
                  <item.icon size={24} className={item.color} strokeWidth={2.5} />
                </View>
                <Text className="text-xs font-medium text-foreground">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
