import { View, ScrollView, Pressable, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Link, usePathname } from 'expo-router';
import { PropsWithChildren, useState } from 'react';
import {
  BookOpen,
  Home,
  Calendar,
  Heart,
  HelpCircle,
  Mail,
  Info,
  FileText,
  Menu,
  X,
  Sparkles,
  Users,
  Clock,
  Settings,
} from 'lucide-react-native';

const navigation = [
  { name: '홈', href: '/', icon: Home, color: '#3b82f6' },
  { name: '사주 분석', href: '/saju', icon: Calendar, color: '#8b5cf6' },
  { name: '궁합', href: '/compatibility', icon: Heart, color: '#ec4899' },
  { name: '만세력', href: '/pillarscalendar', icon: Clock, color: '#10b981' },
  { name: '블로그', href: '/blog', icon: FileText, color: '#f59e0b' },
  { name: '백과사전', href: '/encyclopedia', icon: BookOpen, color: '#06b6d4' },
  { name: 'FAQ', href: '/faq', icon: HelpCircle, color: '#84cc16' },
  { name: '문의', href: '/contact', icon: Mail, color: '#f97316' },
  { name: '소개', href: '/about', icon: Info, color: '#6366f1' },
];

interface FullWidthWebLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function FullWidthWebLayout({ children, showSidebar = true }: FullWidthWebLayoutProps) {
  const pathname = usePathname();
  const isWeb = Platform.OS === 'web';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mobile - return as is
  if (!isWeb) {
    return <>{children}</>;
  }

  // Web - full-width layout with sidebar
  return (
    <View className="flex-1 flex-row bg-gray-50">
      {/* Sidebar Navigation */}
      {showSidebar && (
        <View
          className={`border-r border-gray-200 bg-white transition-all ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}>
          {/* Logo & Toggle */}
          <View className="border-b border-gray-100 p-4">
            <View className="flex-row items-center justify-between">
              {sidebarOpen ? (
                <Link href={'/' as any} asChild>
                  <Pressable className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                      <Text className="text-xl">☕️</Text>
                    </View>
                    <View>
                      <Text className="text-xl font-bold text-gray-900">사주라떼</Text>
                      <Text className="text-xs text-gray-500">SajuLatte</Text>
                    </View>
                  </Pressable>
                </Link>
              ) : (
                <View className="mx-auto h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                  <Text className="text-xl">☕️</Text>
                </View>
              )}
              {sidebarOpen && (
                <Pressable
                  onPress={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 hover:bg-gray-100">
                  <Menu size={20} color="#6b7280" />
                </Pressable>
              )}
            </View>
            {!sidebarOpen && (
              <Pressable
                onPress={() => setSidebarOpen(true)}
                className="mx-auto mt-2 rounded-lg p-2 hover:bg-gray-100">
                <Menu size={20} color="#6b7280" />
              </Pressable>
            )}
          </View>

          {/* Navigation Items */}
          <ScrollView className="flex-1 p-3">
            <View className="gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link key={item.name} href={item.href as any} asChild>
                    <Pressable
                      className={`group flex-row items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-50 to-amber-100 shadow-sm'
                          : 'hover:bg-gray-50'
                      }`}>
                      <View
                        className={`rounded-lg p-2 ${
                          isActive ? 'bg-white shadow-sm' : 'bg-gray-100'
                        }`}
                        style={{
                          backgroundColor: isActive ? item.color : '#f3f4f6',
                        }}>
                        <Icon size={20} color={isActive ? '#fff' : '#6b7280'} />
                      </View>
                      {sidebarOpen && (
                        <View className="flex-1">
                          <Text
                            className={`text-sm font-semibold ${
                              isActive ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                            {item.name}
                          </Text>
                        </View>
                      )}
                      {isActive && sidebarOpen && (
                        <View className="h-2 w-2 rounded-full bg-amber-500" />
                      )}
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom User Section */}
          <View className="border-t border-gray-100 p-3">
            {sidebarOpen ? (
              <Pressable
                onPress={() => {
                  // Kakao Login will be handled here
                  if (Platform.OS === 'web') {
                    window.location.href = '/api/auth/kakao';
                  }
                }}
                className="flex-row items-center gap-3 rounded-xl bg-yellow-400 p-3 shadow-md transition-all hover:bg-yellow-500 active:scale-95">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                  <Text className="text-xl">💬</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-900">카카오 로그인</Text>
                  <Text className="text-xs text-gray-700">간편하게 시작하기</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  if (Platform.OS === 'web') {
                    window.location.href = '/api/auth/kakao';
                  }
                }}
                className="mx-auto h-10 w-10 items-center justify-center rounded-full bg-yellow-400 shadow-md hover:bg-yellow-500">
                <Text className="text-xl">💬</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View className="flex-1">
        {/* Scrollable Content */}
        <ScrollView className="flex-1">
          <View className="min-h-screen p-8">{children}</View>

          {/* Footer */}
          <View className="border-t border-gray-200 bg-white px-8 py-12">
            <View className="flex-row justify-between">
              {/* Company Info */}
              <View className="flex-1">
                <View className="mb-4 flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                    <Text className="text-2xl">☕️</Text>
                  </View>
                  <View>
                    <Text className="text-xl font-bold text-gray-900">사주라떼</Text>
                    <Text className="text-sm text-gray-500">SajuLatte</Text>
                  </View>
                </View>
                <Text className="max-w-sm text-sm leading-relaxed text-gray-600">
                  천년의 지혜를 한 잔의 커피처럼{'\n'}
                  따뜻하고 편안하게 전달합니다
                </Text>
              </View>

              {/* Quick Links */}
              <View className="flex-row gap-16">
                <View>
                  <Text className="mb-4 font-bold text-gray-900">서비스</Text>
                  <View className="gap-2">
                    {navigation.slice(0, 4).map((item) => (
                      <Link key={item.name} href={item.href as any} asChild>
                        <Pressable>
                          <Text className="text-sm text-gray-600 hover:text-amber-600">
                            {item.name}
                          </Text>
                        </Pressable>
                      </Link>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="mb-4 font-bold text-gray-900">콘텐츠</Text>
                  <View className="gap-2">
                    {navigation.slice(4, 7).map((item) => (
                      <Link key={item.name} href={item.href as any} asChild>
                        <Pressable>
                          <Text className="text-sm text-gray-600 hover:text-amber-600">
                            {item.name}
                          </Text>
                        </Pressable>
                      </Link>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="mb-4 font-bold text-gray-900">지원</Text>
                  <View className="gap-2">
                    <Link href={'/contact' as any} asChild>
                      <Pressable>
                        <Text className="text-sm text-gray-600 hover:text-amber-600">문의하기</Text>
                      </Pressable>
                    </Link>
                    <Link href={'/privacy' as any} asChild>
                      <Pressable>
                        <Text className="text-sm text-gray-600 hover:text-amber-600">
                          개인정보처리방침
                        </Text>
                      </Pressable>
                    </Link>
                    <Link href={'/terms' as any} asChild>
                      <Pressable>
                        <Text className="text-sm text-gray-600 hover:text-amber-600">이용약관</Text>
                      </Pressable>
                    </Link>
                  </View>
                </View>
              </View>
            </View>

            {/* Copyright */}
            <View className="mt-8 border-t border-gray-100 pt-8">
              <Text className="text-center text-sm text-gray-500">
                © 2026 사주라떼 SajuLatte. All rights reserved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
