import { View, ScrollView, Pressable, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Link, usePathname } from 'expo-router';
import { PropsWithChildren } from 'react';
import {
  BookOpen,
  Home,
  Calendar,
  Heart,
  HelpCircle,
  Mail,
  Info,
  FileText,
} from 'lucide-react-native';

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '사주 분석', href: '/saju', icon: Calendar },
  { name: '궁합', href: '/compatibility', icon: Heart },
  { name: '가이드', href: '/blog', icon: FileText },
  { name: '백과사전', href: '/encyclopedia', icon: BookOpen },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: '문의', href: '/contact', icon: Mail },
  { name: '소개', href: '/about', icon: Info },
];

interface WebLayoutProps extends PropsWithChildren {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showHeader?: boolean;
}

export function WebLayout({ children, maxWidth = 'xl', showHeader = true }: WebLayoutProps) {
  const pathname = usePathname();
  const isWeb = Platform.OS === 'web';

  // Mobile - return as is
  if (!isWeb) {
    return <>{children}</>;
  }

  const maxWidthClass = {
    sm: ' sm:max-w-screen-sm',
    md: ' md:max-w-screen-md',
    lg: ' lg:max-w-screen-lg',
    xl: ' xl:max-w-screen-xl',
    '2xl': ' 2xl:max-w-screen-2xl',
    full: '',
  }[maxWidth];

  // Web - desktop layout
  return (
    <View className="min-h-screen bg-gray-50">
      {/* Top Navigation Header */}
      {showHeader && (
        <View className="border-b border-gray-200 bg-white shadow-sm">
          <View className={`mx-auto w-full px-4${maxWidthClass}`}>
            <View className="flex-row items-center justify-between py-4">
              {/* Logo */}
              <Link href="/" asChild>
                <Pressable className="flex-row items-center gap-2">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <Text className="text-xl">☕️</Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-900">사주라떼</Text>
                </Pressable>
              </Link>

              {/* Desktop Navigation */}
              <View className="hidden flex-row gap-1 md:flex">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  const Icon = item.icon;

                  return (
                    <Link key={item.name} href={item.href as any} asChild>
                      <Pressable
                        className={`flex-row items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                          isActive
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                        <Icon size={18} color={isActive ? '#78350f' : '#4b5563'} />
                        <Text
                          className={`font-medium ${
                            isActive ? 'text-amber-900' : 'text-gray-700'
                          }`}>
                          {item.name}
                        </Text>
                      </Pressable>
                    </Link>
                  );
                })}
              </View>

              {/* Mobile Menu Button */}
              <Pressable className="rounded-lg p-2 hover:bg-gray-100 md:hidden">
                <View className="h-6 w-6 flex-col justify-between">
                  <View className="h-0.5 w-full bg-gray-600" />
                  <View className="h-0.5 w-full bg-gray-600" />
                  <View className="h-0.5 w-full bg-gray-600" />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Main Content */}
      <View className={`mx-auto w-full${maxWidthClass}`}>{children}</View>

      {/* Footer */}
      <View className="mt-auto border-t border-gray-200 bg-white">
        <View className={`mx-auto w-full px-4 py-12${maxWidthClass}`}>
          <View className="flex-col gap-8 md:flex-row md:justify-between">
            {/* Company Info */}
            <View className="flex-1">
              <View className="mb-4 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Text className="text-base">☕️</Text>
                </View>
                <Text className="text-xl font-bold text-gray-900">사주라떼</Text>
              </View>
              <Text className="leading-6 text-gray-600">
                천년의 지혜를 한 잔의 커피처럼{'\n'}
                따뜻하고 편안하게 전달합니다
              </Text>
            </View>

            {/* Quick Links */}
            <View className="flex-col gap-4 md:flex-row md:gap-12">
              <View>
                <Text className="mb-3 font-bold text-gray-900">서비스</Text>
                <View className="gap-2">
                  <Link href={'/saju' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">사주 분석</Text>
                    </Pressable>
                  </Link>
                  <Link href={'/compatibility' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">궁합 보기</Text>
                    </Pressable>
                  </Link>
                  <Link href={'/pillarscalendar' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">만세력</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>

              <View>
                <Text className="mb-3 font-bold text-gray-900">정보</Text>
                <View className="gap-2">
                  <Link href={'/blog' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">가이드</Text>
                    </Pressable>
                  </Link>
                  <Link href={'/faq' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">FAQ</Text>
                    </Pressable>
                  </Link>
                  <Link href={'/about' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">회사 소개</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>

              <View>
                <Text className="mb-3 font-bold text-gray-900">고객지원</Text>
                <View className="gap-2">
                  <Link href={'/contact' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">문의하기</Text>
                    </Pressable>
                  </Link>
                  <Link href={'/privacy' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">개인정보처리방침</Text>
                    </Pressable>
                  </Link>
                  <Link href={'/terms' as any} asChild>
                    <Pressable>
                      <Text className="text-gray-600 hover:text-amber-600">이용약관</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          </View>

          {/* Copyright */}
          <View className="mt-8 border-t border-gray-200 pt-8">
            <Text className="text-center text-sm text-gray-500">
              © 2026 사주라떼. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
