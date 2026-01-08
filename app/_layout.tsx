import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, Platform } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

import { LogBox } from 'react-native';

// Suppress known warnings from dependencies
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();

  React.useEffect(() => {
    setColorScheme('light');
  }, [setColorScheme]);

  return (
    <ThemeProvider value={NAV_THEME['light']}>
      <StatusBar style="dark" />
      {/* Web Layout Container */}
      <View
        style={{
          flex: 1,
          backgroundColor: Platform.OS === 'web' ? '#f3f4f6' : 'transparent', // Light gray background for web desktop
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            maxWidth: Platform.OS === 'web' ? 480 : '100%', // Limit width on web
            backgroundColor: '#ffffff',
            // Simple shadow for web to distinguish from background
            ...(Platform.OS === 'web' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 5,
            }),
          }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="saved/index"
              options={{ title: '저장된 사주', headerBackTitle: '뒤로' }}
            />
            <Stack.Screen
              name="encyclopedia/index"
              options={{ title: '사주 백과', headerBackTitle: '뒤로' }}
            />
            <Stack.Screen
              name="preferences/index"
              options={{ title: '환경 설정', headerBackTitle: '뒤로' }}
            />
          </Stack>
        </View>
      </View>
      <PortalHost />
    </ThemeProvider>
  );
}
