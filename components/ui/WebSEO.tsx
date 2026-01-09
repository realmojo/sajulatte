import { Platform } from 'react-native';
import { useEffect } from 'react';

export interface WebSEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string; // 'website', 'article', 'profile', etc.
  author?: string;
  jsonLd?: Record<string, any>; // Structured Data Object
  siteName?: string;
}

/**
 * Enhanced WebSEO Component
 * Manages Title, Meta Tags (Standard, Open Graph, Twitter), Canonical Link, and JSON-LD.
 * Only active on Web platform.
 */
export const WebSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  jsonLd,
  siteName = '사주라떼',
}: WebSEOProps) => {
  if (Platform.OS !== 'web') return null;

  useEffect(() => {
    // Helper: Update or Create Meta Tag
    const updateMeta = (attribute: string, value: string, content: string | undefined) => {
      if (!content) return;

      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper: Update or Create Link Tag
    const updateLink = (rel: string, href: string | undefined) => {
      if (!href) return;

      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 1. Basic SEO
    document.title = title;
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywords);
    updateMeta('name', 'author', author);

    // 2. Open Graph (Facebook, LinkedIn, etc.)
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:image', image);
    updateMeta('property', 'og:url', url);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:site_name', siteName);

    // 3. Twitter Card
    updateMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', image);

    // 4. Canonical URL
    updateLink('canonical', url);

    // 5. JSON-LD (Structured Data)
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, keywords, image, url, type, author, jsonLd, siteName]);

  return null;
};
