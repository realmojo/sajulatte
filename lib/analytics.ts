import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// TODO: USER_REPLACE_ME
// Replace with your GA4 Measurement ID (starts with G-)
const MEASUREMENT_ID = 'G-MXR810EQ7G';
// Replace with your GA4 Measurement Protocol API Secret (Create in GA4 Console > Admin > Data Streams > API Secrets)
// Required for Native (iOS/Android) tracking to work reliably via Measurement Protocol.
const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}`;

let isInitialized = false;
let clientId: string | null = null;

const generateClientId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getClientId = async () => {
  if (clientId) return clientId;
  try {
    const savedId = await AsyncStorage.getItem('ga4_client_id');
    if (savedId) {
      clientId = savedId;
      return savedId;
    }
    const newId = generateClientId();
    await AsyncStorage.setItem('ga4_client_id', newId);
    clientId = newId;
    return newId;
  } catch (e) {
    return generateClientId(); // Fallback
  }
};

export const Analytics = {
  /**
   * Initialize GA4 (Web: Injects script, Native: Loads Client ID)
   */
  init: async () => {
    if (isInitialized) return;

    if (Platform.OS === 'web') {
      // Web Initialization
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}', { 'send_page_view': false }); 
        `;
        document.head.appendChild(inlineScript);
      }
    } else {
      // Native Initialization
      await getClientId();
    }
    isInitialized = true;
  },

  /**
   * Log a custom event
   */
  logEvent: async (eventName: string, params: Record<string, any> = {}) => {
    if (!isInitialized) await Analytics.init();

    if (Platform.OS === 'web') {
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag('event', eventName, params);
      }
    } else {
      // Native: Measurement Protocol
      try {
        const cid = await getClientId();
        const payload = {
          client_id: cid,
          events: [
            {
              name: eventName,
              params: {
                ...params,
                engagement_time_msec: 100, // Basic engagement
                session_id: cid, // Simplified session tracking
              },
            },
          ],
        };

        fetch(GA4_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // Fail silently
        console.log('Analytics Error', e);
      }
    }
  },

  /**
   * Log a screen view
   */
  logScreenView: async (screenName: string) => {
    await Analytics.logEvent('screen_view', {
      screen_name: screenName,
      app_name: Constants.expoConfig?.name || 'SajuLatte',
    });
  },
};
