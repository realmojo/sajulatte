import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { Platform, AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supaStorage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supaStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_IN` events
// if the user's session is valid.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

/**
 * Logged-in user's Main Saju Profile -> Upload to Supabase
 */
export const uploadMainProfileToSupabase = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Load local list
    const jsonValue = await supaStorage.getItem('saju_list');
    if (!jsonValue) return;

    const list = JSON.parse(jsonValue);
    if (list.length === 0) return;

    // Use the first item as the Main Profile
    const mainProfile = list[0];

    // Upsert to DB
    const { error } = await supabase.from('sajulatte_users').upsert({
      id: user.id, // Primary Key matches Auth UID
      email: user.email,
      name: mainProfile.name,
      gender: mainProfile.gender,
      birth_year: parseInt(mainProfile.birth_year || mainProfile.year),
      birth_month: parseInt(mainProfile.birth_month || mainProfile.month),
      birth_day: parseInt(mainProfile.birth_day || mainProfile.day),
      birth_hour:
        mainProfile.birth_hour || mainProfile.hour
          ? parseInt(mainProfile.birth_hour || mainProfile.hour)
          : null,
      birth_minute:
        mainProfile.birth_minute || mainProfile.minute
          ? parseInt(mainProfile.birth_minute || mainProfile.minute)
          : null,
      calendar_type: mainProfile.calendar_type || mainProfile.calendarType || 'solar',
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to sync profile:', error);
    } else {
      console.log('Profile synced successfully');
    }
  } catch (e) {
    console.error('Error in uploadMainProfileToSupabase:', e);
  }
};
