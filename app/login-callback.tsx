import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';

export default function LoginCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const url = Linking.useURL();

  useEffect(() => {
    const handleAuth = async () => {
      console.log('LoginCallback mounted with params:', params);
      console.log('Full URL:', url);

      try {
        // 1. Check params from Expo Router (query params)
        let accessToken = params.access_token as string;
        let refreshToken = params.refresh_token as string;
        let code = params.code as string;
        const error = params.error as string;

        // 2. If missing, check URL hash or query manually
        if (!accessToken && url) {
          if (url.includes('#')) {
            const hash = url.split('#')[1];
            const searchParams = new URLSearchParams(hash);
            accessToken = searchParams.get('access_token') || '';
            refreshToken = searchParams.get('refresh_token') || '';
            // Supabase sometimes puts error in hash too
            const errorDescription = searchParams.get('error_description');
            if (errorDescription) console.error('Hash error:', errorDescription);
          }
          // Fallback for query in URL if not in params for some reason
          if (!accessToken && url.includes('?')) {
            const query = url.split('?')[1];
            const searchParams = new URLSearchParams(query);
            accessToken = searchParams.get('access_token') || '';
            refreshToken = searchParams.get('refresh_token') || '';
            code = searchParams.get('code') || '';
          }
        }

        if (error) {
          console.error('Auth error:', error, params.error_description);
          return;
        }

        if (accessToken && refreshToken) {
          console.log('Tokens found. Setting session...');
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
          console.log('No tokens found in params or URL.');
          // Check if session exists anyway
          const { data } = await supabase.auth.getSession();
          if (data.session) console.log('Session already exists.');
        }
      } catch (e) {
        console.error('Error in login callback:', e);
      } finally {
        // Navigate back to settings
        router.replace('/(tabs)/settings');
      }
    };

    if (url) {
      handleAuth();
    } else {
      // If url is not ready yet, wait? Or params might be ready.
      // Let's run handleAuth if params has content OR just wait for URL.
      // Usually useURL updates.
      // But if we navigated here, there should be a URL.
      // Just in case, try to run immediately if we have params?
      if (Object.keys(params).length > 0) handleAuth();
    }
  }, [url, params]);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#FEE500" />
      <Text style={{ marginTop: 20 }}>로그인 처리 중...</Text>
    </View>
  );
}
