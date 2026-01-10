import { Button } from '@/components/ui/button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input'; // Import Input
import { Stack, useRouter } from 'expo-router';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  AppState,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview'; // Import WebView
import * as Linking from 'expo-linking';

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
  Check, // Added Check icon
  X, // Close icon
  Edit2, // Edit icon
  BookOpen,
  ChevronRight,
  CalendarDays,
  Share2,
  Volume2,
  MessageSquare,
  Users, // Added Users icon
  Ellipsis,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import {
  uploadMainProfileToSupabase,
  syncUserProfile,
  updateRemoteProfile,
} from '@/lib/services/authService';
import { isSummerTime } from '@/lib/utils/latte';
import { userService } from '@/lib/services/userService';
import { ProfileEditModal, ProfileData } from '@/components/modal/ProfileEditModal';

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // WebView State
  const [showWebView, setShowWebView] = useState(false);
  const [authUrl, setAuthUrl] = useState('');

  // Profile Edit State
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('getSessions', session);
      setSession(session);
    });

    // Helper to load local profile
    const loadProfile = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('my_saju_list');
        if (jsonValue) {
          const list = JSON.parse(jsonValue);
          if (list.length > 0) setUserProfile(list[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session Exists' : 'No Session');
      setSession(session);
      if (event === 'SIGNED_IN' && session) {
        // Sync profile (Fetch from DB > Local, or Upload Local > DB)
        console.log('sync');
        console.log('session', session);

        // 여기에
        const { data, error } = await userService.getUser(session.user.id);
        console.log('data Profile:', data);

        if (!data) {
          const { data, error } = await userService.upsertUser({
            id: session.user.id,
            email: session.user.email,
          });
          console.log('data Profile:', data);
        }

        // setShowProfileEdit(true);
        // Pass the session directly to avoid another getSession() call
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    setTimeout(async () => {
      const { data: currentUser } = await supabase.auth.getUser();
      console.log('currentUser');
      const syncedProfile = await syncUserProfile();
      console.log('Synced Profile');

      if (syncedProfile) {
        setUserProfile(syncedProfile);
        // If mandatory info is missing, open edit modal
        if (currentUser.user && (!syncedProfile.gender || !syncedProfile.birth_year)) {
          setTimeout(() => setShowProfileEdit(true), 500);
        }
      } else {
        // Fallback to reloading local just in case
        loadProfile();
      }
    }, 1000);

    return () => subscription.unsubscribe();
  }, []);

  // 1. Start Login Process
  const signInWithKakao = async () => {
    try {
      // Platform specific configuration
      const isWeb = Platform.OS === 'web';

      const redirectUrl = isWeb
        ? typeof window !== 'undefined'
          ? window.location.origin + '/settings'
          : ''
        : Linking.createURL('settings');

      console.log('Target Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: !isWeb,
          queryParams: {
            prompt: 'login',
          },
        },
      });

      if (error) {
        console.error('OAuth signIn error:', error);
        throw error;
      }

      // Native only: Open WebView with the received URL
      if (!isWeb && data?.url) {
        setAuthUrl(data.url);
        setShowWebView(true);
      }
    } catch (error) {
      console.error('Sign in error details:', error);
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      Alert.alert('로그인 오류', message);
    }
  };

  // 2. Intercept URL in WebView
  const handleNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    // Check for errors first
    if (url.includes('error=')) {
      console.error('OAuth error detected in URL:', url);
      setShowWebView(false);

      try {
        // Try to extract error from query params
        let errorParams: URLSearchParams;
        if (url.includes('?')) {
          const queryPart = url.split('?')[1].split('#')[0];
          errorParams = new URLSearchParams(queryPart);
        } else if (url.includes('#')) {
          const hashPart = url.split('#')[1];
          errorParams = new URLSearchParams(hashPart);
        } else {
          errorParams = new URLSearchParams();
        }

        const error = errorParams.get('error');
        const errorCode = errorParams.get('error_code');
        const errorDescription = decodeURIComponent(errorParams.get('error_description') || '');

        console.error('OAuth Error Code:', errorCode);
        console.error('OAuth Error:', error);
        console.error('OAuth Error Description:', errorDescription);
        console.error('Full error URL:', url);

        let errorMessage = '카카오 로그인 중 오류가 발생했습니다.';

        if (errorDescription) {
          errorMessage = errorDescription;
        } else if (error) {
          errorMessage = `오류: ${error}`;
        }
        Alert.alert('로그인 오류', errorMessage);
      } catch (e) {
        console.error('Error parsing error URL:', e);
        Alert.alert(
          '로그인 오류',
          '카카오 로그인 중 오류가 발생했습니다.\n\nSupabase 대시보드에서 카카오 OAuth 설정을 확인해주세요.'
        );
      }
      return;
    }

    // Check if the URL contains the access_token (Implicit Flow) or code (PKCE)
    // Supabase usually returns #access_token=... for Implicit Flow
    if (url.includes('access_token=') || url.includes('refresh_token=') || url.includes('code=')) {
      console.log('WebView Intercepted Tokens/Code:', url);

      // Hide WebView immediately to improve UX
      setShowWebView(false);

      try {
        // Extract tokens manually
        let accessToken = null;
        let refreshToken = null;
        let code = null;

        // Handle Hash (#) based tokens (Implicit Flow)
        if (url.includes('#')) {
          const hash = url.split('#')[1];
          const params = new URLSearchParams(hash);
          accessToken = params.get('access_token');
          refreshToken = params.get('refresh_token');
          code = params.get('code');
        }

        // Handle Query (?) based tokens/code (PKCE or fallback)
        if (!accessToken && url.includes('?')) {
          const query = url.split('?')[1].split('#')[0];
          const params = new URLSearchParams(query);
          accessToken = params.get('access_token');
          refreshToken = params.get('refresh_token');
          code = params.get('code');
        }

        if (accessToken && refreshToken) {
          console.log('Setting session with tokens...');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            console.error('setSession error:', error);
            throw error;
          }
          showToast();
        } else if (code) {
          console.log('Exchanging code for session...');
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('exchangeCodeForSession error:', error);
            throw error;
          }
          showToast();
        } else {
          console.warn('No tokens or code found in URL');
          Alert.alert('알림', '인증 정보를 찾을 수 없습니다.');
        }
      } catch (e) {
        console.error('WebView Auth Error:', e);
        const errorMessage = e instanceof Error ? e.message : '알 수 없는 오류';
        Alert.alert(
          '로그인 실패',
          `인증 정보를 처리하는 중 오류가 발생했습니다.\n\n${errorMessage}`
        );
      }
    }
  };

  const handleSaveProfile = async (data: ProfileData) => {
    try {
      const updatedProfile = await updateRemoteProfile({
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

      setUserProfile(updatedProfile);
      setShowProfileEdit(false);
      Alert.alert('완료', '사주 정보가 저장되었습니다.');
    } catch (e) {
      Alert.alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Ellipsis size={24} className="text-foreground" color={iconColor} />
          <Text className="text-xl font-bold text-foreground">설정</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Bell size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/preferences')}>
            <Settings size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Profile Edit Modal Component */}
      <ProfileEditModal
        visible={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        onSave={handleSaveProfile}
        initialData={userProfile}
      />
      {/* Login WebView Modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWebView(false)}>
        <View
          className="flex-1 bg-white"
          style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
          <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
            <Text className="text-lg font-bold">카카오 로그인</Text>
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <WebView
            key={authUrl}
            source={{ uri: authUrl }}
            // javaScriptEnabled={true}
            // domStorageEnabled={true}
            onShouldStartLoadWithRequest={(request) => {
              const { url } = request;

              // Prevent opening external apps (KakaoTalk, etc.) -> Force Web Login
              if (url.startsWith('kakaotalk://') || url.startsWith('intent://')) {
                return false;
              }

              // If the redirect URL is our app scheme, intercept it!
              if (url.startsWith('sajulatte://') || url.includes('/settings')) {
                console.log('Intercepting redirect:', url);
                handleNavigationStateChange(request);
                return false; // Stop loading, so we don't open the screen/app handler
              }
              return true;
            }}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState={true}
            renderLoading={() => (
              <View className="absolute inset-0 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#FEE500" />
              </View>
            )}
          />
        </View>
      </Modal>

      {/* Content */}
      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-20 gap-8">
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

              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xl font-bold text-foreground">
                    {userProfile?.name || session.user.email?.split('@')[0]}
                    <Text className="text-sm font-normal text-muted-foreground"> 님</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowProfileEdit(true)}
                    className="flex-row items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                    <Edit2 size={12} color="black" />
                    <Text className="text-xs font-semibold">정보수정</Text>
                  </TouchableOpacity>
                </View>

                {userProfile ? (
                  <View className="mt-1">
                    {(() => {
                      const isSummerTimeApplied =
                        userProfile.birth_year &&
                        userProfile.birth_month &&
                        userProfile.birth_day &&
                        userProfile.birth_hour !== undefined &&
                        userProfile.birth_hour !== null
                          ? isSummerTime(
                              userProfile.birth_year,
                              userProfile.birth_month,
                              userProfile.birth_day,
                              userProfile.birth_hour,
                              userProfile.birth_minute || 0
                            )
                          : false;

                      return (
                        <View className="mt-1 flex-row flex-wrap items-center gap-2">
                          <Text className="text-sm text-muted-foreground">
                            {userProfile.birth_year}년 {userProfile.birth_month}월{' '}
                            {userProfile.birth_day}일
                            {userProfile.birth_hour !== undefined && userProfile.birth_hour !== null
                              ? ` ${userProfile.birth_hour}시`
                              : ''}
                            {userProfile.birth_minute ? ` ${userProfile.birth_minute}분` : ''}
                          </Text>
                          {isSummerTimeApplied && (
                            <View className="rounded-full bg-orange-100 px-2 py-0.5">
                              <Text className="text-xs font-medium text-orange-600">
                                ☀️ 서머타임 적용
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })()}

                    <Text className="mt-1 text-xs text-gray-400">
                      {userProfile.calendar_type === 'lunar'
                        ? '음력'
                        : userProfile.calendar_type === 'solar'
                          ? '양력'
                          : '일력'}{' '}
                      /{' '}
                      {userProfile.gender === 'male'
                        ? '남성'
                        : userProfile.gender === 'female'
                          ? '여성'
                          : '성별'}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setShowProfileEdit(true)}>
                    <Text className="mt-1 text-sm font-bold text-amber-600 underline">
                      사주 정보 등록하기
                    </Text>
                  </TouchableOpacity>
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
              onPress={signInWithKakao}
              className="h-12 w-full flex-row items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4">
              <MessageCircle size={20} color="#000000" fill="#000000" />
              <Text className="text-base font-bold text-[#000000]">카카오 로그인</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu Sections */}
        <View className="gap-6">
          {/* Section: 사주 관리 */}
          <View className="gap-3">
            <Text className="ml-1 text-lg font-bold text-gray-900">🗂️ 사주 관리</Text>
            <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => router.push('/settings/saved')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                    <Users size={20} color="#6366f1" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">친구/가족 사주 저장</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: 즐길거리 */}
          <View className="gap-3">
            <Text className="ml-1 text-lg font-bold text-gray-900">✨ 즐길거리</Text>
            <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => router.push('/encyclopedia')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <BookOpen size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">사주 용어 백과</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View className="mx-4 h-[1px] bg-gray-100" />
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => router.push('/amulet')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                    <Sparkles size={20} color="#d97706" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">디지털 부적</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View className="mx-4 h-[1px] bg-gray-100" />
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => router.push('/pillarscalendar')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                    <CalendarDays size={20} color="#10b981" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">만세력 달력</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: 앱 설정 */}
          <View className="gap-3">
            <Text className="ml-1 text-lg font-bold text-gray-900">⚙️ 앱 설정</Text>
            <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => Alert.alert('알림 설정', '푸시 알림 설정 페이지로 이동합니다.')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Bell size={20} color="#4b5563" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">알림 설정</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View className="mx-4 h-[1px] bg-gray-100" />
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => router.push('/preferences')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Settings size={20} color="#4b5563" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">환경 설정</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: 고객지원 */}
          <View className="gap-3">
            <Text className="ml-1 text-lg font-bold text-gray-900">📢 고객지원</Text>
            <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => Alert.alert('공지사항', '새로운 소식이 없습니다.')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                    <Volume2 size={20} color="#9333ea" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">공지사항</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View className="mx-4 h-[1px] bg-gray-100" />
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => Linking.openURL('mailto:support@sajulatte.com')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-pink-50">
                    <MessageSquare size={20} color="#db2777" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">의견 보내기</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View className="mx-4 h-[1px] bg-gray-100" />
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 active:bg-gray-50"
                onPress={() => Alert.alert('공유하기', '친구에게 앱 추천 링크를 복사했습니다.')}>
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                    <Share2 size={20} color="#4f46e5" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">친구에게 추천하기</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="items-center pb-8 pt-4">
            <Text className="text-xs text-gray-400">앱 버전 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
      {/* Shadcn-style Toast */}
      {toastVisible && (
        <View className="absolute bottom-10 left-4 right-4 z-50">
          <View className="flex-row items-center gap-3 rounded-lg bg-zinc-900 px-4 py-4 shadow-lg">
            <View className="rounded-full bg-green-500 p-1">
              <Check size={16} color="white" strokeWidth={3} />
            </View>
            <View>
              <Text className="font-semibold text-white">성공</Text>
              <Text className="text-zinc-400">로그인이 완료되었습니다.</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
