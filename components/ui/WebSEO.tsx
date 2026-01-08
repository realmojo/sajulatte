import { Platform } from 'react-native';
import { useEffect } from 'react';

/**
 * WebSEO Component for managing meta tags and title dynamically on the web.
 * Does nothing on native platforms.
 */
export const WebSEO = ({ title, description }: { title: string; description?: string }) => {
  if (Platform.OS !== 'web') return null;

  useEffect(() => {
    // 1. Set Title
    if (title) {
      document.title = title;
    }

    // 2. Set Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};
