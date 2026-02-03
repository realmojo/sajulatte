import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { useRouter, Stack, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, BookOpen, ChevronRight } from 'lucide-react-native';
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
  color_class: string;
  text_color_class: string;
  display_date: string;
}

export default function StoryListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from('sajulatte_posts')
          .select('id, category, title, description, color_class, text_color_class, display_date')
          .order('display_date', { ascending: false });

        if (error) {
          console.error('Error fetching stories:', error);
        } else {
          // If data is empty, we might want to show dummy data for review purposes if the DB is empty
          // But for now let's just use what's real.
          setStories(data || []);
        }
      } catch (e) {
        console.error('Exception fetching stories:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  /* Structured Data for SEO: Blog (Stories) */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '사주 이야기 - 사주라떼',
    description: '운세, 사주, 풍수 등 흥미로운 사주라떼의 이야기를 읽어보세요.',
    url: 'https://sajulatte.app/story',
    blogPost: stories.map((story) => ({
      '@type': 'BlogPosting',
      headline: story.title,
      description: story.description,
      datePublished: story.display_date, // Assuming format YYYY-MM-DD or readable text
      author: {
        '@type': 'Organization',
        name: '사주라떼',
      },
      url: `https://sajulatte.app/story/${story.id}`,
    })),
  };

  const seoProps = {
    title: '사주 이야기 - 사주라떼',
    description:
      '운세, 사주, 풍수 등 흥미로운 이야기를 읽어보세요. 사주라떼에서 제공하는 유익한 사주 콘텐츠입니다.',
    keywords: '사주 이야기, 운세 칼럼, 풍수 정보, 사주 공부, 사주라떼 스토리',
    url: 'https://sajulatte.app/story',
    type: 'blog',
    image: 'https://sajulatte.app/assets/images/og-image.png',
    jsonLd: jsonLd,
  };

  if (Platform.OS === 'web') {
    return (
      <FullWidthWebLayout>
        <WebSEO {...seoProps} />
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-bold">사주 이야기</Text>
            <View className="w-8" />
          </View>
          <ScrollView className="flex-1" contentContainerClassName="p-4 pb-20">
            {loading ? (
              <View className="py-20">
                <ActivityIndicator size="large" color="#4F46E5" />
              </View>
            ) : stories.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Text className="text-gray-500">등록된 이야기가 없습니다.</Text>
              </View>
            ) : (
              <View className="gap-4">
                {stories.map((story) => (
                  <Link key={story.id} href={`/story/${story.id}`} asChild>
                    <TouchableOpacity className="flex-row items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:bg-gray-50 active:bg-gray-50">
                      <View
                        className={`h-12 w-12 items-center justify-center rounded-full ${story.color_class || 'bg-gray-100'}`}>
                        <BookOpen
                          size={20}
                          className={story.text_color_class || 'text-gray-600'}
                          color="#4b5563"
                        />
                      </View>
                      <View className="flex-1 gap-1">
                        <View className="flex-row items-center gap-2">
                          <Text
                            className={`text-xs font-bold ${story.text_color_class?.replace('text-', 'text-') || 'text-blue-600'}`}>
                            {story.category}
                          </Text>
                          <Text className="text-xs text-gray-400">{story.display_date}</Text>
                        </View>
                        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                          {story.title}
                        </Text>
                        <Text className="text-sm text-gray-500" numberOfLines={2}>
                          {story.description}
                        </Text>
                      </View>
                      <ChevronRight size={20} color="#9ca3af" />
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </FullWidthWebLayout>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <WebSEO {...seoProps} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">사주 이야기</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-20">
        {loading ? (
          <View className="py-20">
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : stories.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500">등록된 이야기가 없습니다.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {stories.map((story) => (
              <Link key={story.id} href={`/story/${story.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 active:bg-gray-50">
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-full ${story.color_class || 'bg-gray-100'}`}>
                    <BookOpen
                      size={20}
                      className={story.text_color_class || 'text-gray-600'}
                      color="#4b5563"
                    />
                  </View>
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-xs font-bold ${story.text_color_class?.replace('text-', 'text-') || 'text-blue-600'}`}>
                        {story.category}
                      </Text>
                      <Text className="text-xs text-gray-400">{story.display_date}</Text>
                    </View>
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                      {story.title}
                    </Text>
                    <Text className="text-sm text-gray-500" numberOfLines={2}>
                      {story.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
