import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

// Define Story type based on DB schema
interface Story {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  color_class: string;
  text_color_class: string;
  display_date: string;
  view_count: number;
  like_count: number;
}

export default function StoryDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('sajulatte_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching story:', error);
        } else {
          setStory(data);
        }
      } catch (e) {
        console.error('Exception fetching story:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      );
    }

    if (!story) {
      return (
        <View className="flex-1 items-center justify-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-gray-500">글을 찾을 수 없습니다.</Text>
          </TouchableOpacity>
        </View>
      );
    }

    /* Structured Data for SEO: BlogPosting */
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: story.title,
      description: story.description,
      datePublished: story.display_date,
      // dateModified: story.updated_at, // If available
      author: {
        '@type': 'Organization',
        name: '사주라떼',
      },
      publisher: {
        '@type': 'Organization',
        name: '사주라떼',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sajulatte.app/assets/images/icon.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://sajulatte.app/story/${story.id}`,
      },
      image: 'https://sajulatte.app/assets/images/og-image.png',
    };

    const seoProps = {
      title: `${story.title} - 사주라떼 이야기`,
      description: story.description || story.content.slice(0, 150).replace(/\*\*/g, ''),
      keywords: `사주 이야기, ${story.category}, ${story.title}, 운세 칼럼`,
      url: `https://sajulatte.app/story/${story.id}`,
      type: 'article',
      image: 'https://sajulatte.app/assets/images/og-image.png',
      author: '사주라떼',
      jsonLd: jsonLd,
    };

    return (
      <View className="flex-1">
        <WebSEO {...seoProps} />
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity>
              <Share2 size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="pb-20">
          <View className="px-6 py-4">
            {/* Category Badge */}
            <View className={`mb-4 self-start rounded-full px-3 py-1 ${story.color_class}`}>
              <Text className={`text-xs font-bold ${story.text_color_class}`}>
                {story.category}
              </Text>
            </View>

            {/* Title */}
            <Text className="mb-2 text-2xl font-bold leading-tight text-gray-900">
              {story.title}
            </Text>

            {/* Meta */}
            <View className="mb-8 flex-row items-center gap-2">
              <Text className="text-sm text-gray-400">사주라떼 에디터</Text>
              <View className="h-1 w-1 rounded-full bg-gray-300" />
              <Text className="text-sm text-gray-400">{story.display_date}</Text>
            </View>

            {/* Content Body */}
            <View className="gap-6">
              {/* Simple Markdown Rendering */}
              {story.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('**')) {
                  // Bold Header
                  return (
                    <Text key={idx} className="text-lg font-bold leading-7 text-gray-900">
                      {paragraph.replace(/\*\*/g, '')}
                    </Text>
                  );
                }
                return (
                  <Text key={idx} className="text-base font-normal leading-7 text-gray-700">
                    {paragraph.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <Text key={i} className="font-bold text-gray-900">
                          {part}
                        </Text>
                      ) : (
                        <Text key={i}>{part.replace('###', '')}</Text>
                      )
                    )}
                  </Text>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (Platform.OS === 'web') {
    return (
      <FullWidthWebLayout>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-white">{renderContent()}</View>
      </FullWidthWebLayout>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />
      {renderContent()}
    </View>
  );
}
