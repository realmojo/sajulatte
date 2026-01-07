import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function LoginCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      console.log('LoginCallback mounted with params:', params);

      try {
        // Check for tokens in standard query params
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;
        const code = params.code as string;
        const error = params.error as string;

        if (error) {
          console.error('Auth error:', error, params.error_description);
          // Go back to settings with error (optional)
          router.replace('/(tabs)/settings');
          return;
        }

        if (accessToken && refreshToken) {
          console.log('Tokens found in params. Setting session...');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          console.log('Session set successfully.');
        } else if (code) {
          console.log('Code found, exchanging...');
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          console.log('Code exchange successful.');
        } else {
          // Sometimes tokens are in the hash, which Expo Router might not parse into useLocalSearchParams depending on version
          // But usually for deep links, they come as query params or we access the full URL
          console.log('No direct params found, tokens might be in hash or not present.');

          // Fallback: Check if we have a session anyway (from implicit handling)
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log('Session already exists.');
          }
        }
      } catch (e) {
        console.error('Error in login callback:', e);
      } finally {
        // Navigate back to settings
        router.replace('/(tabs)/settings');
      }
    };

    handleAuth();
  }, [params]);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#FEE500" />
      <Text style={{ marginTop: 20 }}>로그인 처리 중...</Text>
    </View>
  );
}
