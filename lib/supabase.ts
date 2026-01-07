import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { Platform, AppState } from 'react-native';
import { userService } from './services/userService';

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
    flowType: 'implicit',
    // flowType: 'pkce',
  },
});

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_IN` events
// if the user's session is valid.
AppState.addEventListener('change', (state) => {
  console.log('state', state);
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
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;
    const user = session.user;

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

/**
 * Fetch Main Saju Profile from Supabase -> Save to Local Storage
 */
export const fetchMainProfileFromSupabase = async () => {
  try {
    console.log('Fetching remote profile...');
    await supabase.auth.startAutoRefresh();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log('사용자 정보:', session);
    if (!session?.user) return null;

    // const { data, error } = await supabase
    //   .from('sajulatte_users')
    //   .select('*')
    //   .eq('id', session.user.id)
    //   .single();

    const { data, error } = await userService.getUser(session.user.id);

    console.log('Fetched remote profile:', data);

    if (error) {
      // It's possible the row doesn't exist yet
      console.log('No remote profile found or error:', error.message);
      return null;
    }

    if (data) {
      // Map DB columns to our local shape
      const profile = {
        id: Date.now().toString(), // local ID
        name: data.name,
        gender: data.gender,
        birth_year: data.birth_year,
        birth_month: data.birth_month,
        birth_day: data.birth_day,
        birth_hour: data.birth_hour,
        birth_minute: data.birth_minute,
        calendar_type: data.calendar_type,
        createdAt: new Date().toISOString(),
      };

      // Save to AsyncStorage (overwrite/prepend)
      // Decision: Current logic uses list[0] as main. We'll overwrite the list with this one as primary.
      // Or we can prepend if we want to keep history, but for synchronization, usually the account profile is the single source of truth.
      // Let's replace list with this profile as single item for now to ensure consistency.
      await supaStorage.setItem('saju_list', JSON.stringify([profile]));
      console.log('Fetched and saved remote profile to local storage');
      return profile;
    }
  } catch (e) {
    console.error('Error in fetchMainProfileFromSupabase:', e);
  }
  return null;
};

/**
 * Sync logic: Try to fetch. If remote exists, use it. If not, try to upload local.
 */
// Sync logic: Try to fetch. If remote exists, use it. If not, try to upload local.
export const syncUserProfile = async () => {
  const remoteProfile = await fetchMainProfileFromSupabase();
  if (remoteProfile) {
    return remoteProfile;
  }

  // If no remote profile, assume we might have a local one to upload
  const jsonValue = await supaStorage.getItem('saju_list');
  let hasLocal = false;

  if (jsonValue) {
    const list = JSON.parse(jsonValue);
    if (list.length > 0) {
      console.log('Local profile found, uploading...');
      hasLocal = true;
      await uploadMainProfileToSupabase();
      return list[0];
    }
  }

  // If neither remote nor local profile exists, ensure the user is registered in the DB
  if (!hasLocal) {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      console.log('Failed to get auth session for registration:', sessionError);
      return null;
    }

    const { user } = session;

    // Upsert only ID and Email to reserve the row
    const { error } = await supabase.from('sajulatte_users').upsert({
      id: user.id,
      email: user.email,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('FAILED to register new user row in DB:', error);
    } else {
      console.log('Successfully registered new user ID in sajulatte_users');
    }
  }

  return null;
};

/**
 * Update User Profile directly with provided data
 */
export const updateRemoteProfile = async (profileData: {
  name: string;
  gender: 'male' | 'female';
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour?: number | null;
  birth_minute?: number | null;
  calendar_type: 'solar' | 'lunar';
  is_leap: boolean;
}) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user logged in');
    const user = session.user;

    const dbCalendarType =
      profileData.calendar_type === 'lunar' && profileData.is_leap
        ? 'lunar-leap'
        : profileData.calendar_type;

    // Upsert to DB
    const { error } = await supabase.from('sajulatte_users').upsert({
      id: user.id,
      email: user.email,
      name: profileData.name,
      gender: profileData.gender,
      birth_year: profileData.birth_year,
      birth_month: profileData.birth_month,
      birth_day: profileData.birth_day,
      birth_hour: profileData.birth_hour,
      birth_minute: profileData.birth_minute,
      calendar_type: dbCalendarType,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    // Also update local storage to match
    const newProfile = {
      id: Date.now().toString(),
      year: profileData.birth_year, // legacy support
      month: profileData.birth_month,
      day: profileData.birth_day,
      hour: profileData.birth_hour,
      minute: profileData.birth_minute,
      ...profileData,
      calendar_type: dbCalendarType, // Store standard string 'lunar-leap' locally too
      createdAt: new Date().toISOString(),
    };
    await supaStorage.setItem('saju_list', JSON.stringify([newProfile]));

    return newProfile;
  } catch (e) {
    console.error('Error in updateRemoteProfile:', e);
    throw e;
  }
};
