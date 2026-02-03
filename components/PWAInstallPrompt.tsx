import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, AppState } from 'react-native';
import { CheckCircle, X } from 'lucide-react-native';

// PWA Install Prompt Event Type
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Check if PWA is already installed
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const checkPWAInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      setIsPWAInstalled(isStandalone);
    };

    checkPWAInstalled();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => checkPWAInstalled();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Capture PWA install prompt event
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      console.log('PWA install prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show popup after 5 seconds if not installed and prompt is available
    const timeout = setTimeout(() => {
      if (!isPWAInstalled && deferredPromptRef.current) {
        setShowInstallModal(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timeout);
    };
  }, [isPWAInstalled]);

  const handleInstall = async () => {
    if (!deferredPromptRef.current) {
      alert('이미 설치되어 있거나 설치를 지원하지 않는 브라우저입니다.');
      setShowInstallModal(false);
      return;
    }

    setIsInstalling(true);
    try {
      await deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === 'accepted') {
        deferredPromptRef.current = null;
        setShowInstallModal(false);
        setShowSuccessModal(true);
        // Assuming successful installation, update state shortly after
        setTimeout(() => {
          setIsPWAInstalled(true);
        }, 500);
      } else {
        // User dismissed the native prompt
        // We can choose to keep our modal open or close it. Usually close it.
        // setShowInstallModal(false);
      }
    } catch (error) {
      console.error('PWA install error:', error);
      alert('설치 중 오류가 발생했습니다.');
    } finally {
      setIsInstalling(false);
    }
  };

  if (Platform.OS !== 'web' || isPWAInstalled) return null;

  return (
    <>
      {/* Install Modal */}
      <Modal
        visible={showInstallModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInstallModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <View className="mb-4 items-center">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                <Text className="text-3xl">☕️</Text>
              </View>
              <Text className="text-center text-xl font-bold text-gray-900">
                사주라떼 앱 설치하기
              </Text>
              <Text className="mt-2 text-center leading-relaxed text-gray-600">
                앱을 설치하고 매일 편하게{'\n'}
                운세를 확인해보세요!
              </Text>
            </View>

            <View className="gap-3">
              <TouchableOpacity
                onPress={handleInstall}
                disabled={isInstalling}
                className="w-full items-center justify-center rounded-xl bg-amber-500 py-4 active:bg-amber-600">
                <Text className="text-lg font-bold text-white">
                  {isInstalling ? '설치 중...' : '앱 설치하고 시작하기'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowInstallModal(false)}
                className="w-full items-center justify-center py-2">
                <Text className="text-gray-500">나중에 하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-sm items-center rounded-2xl bg-white p-6 shadow-xl">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={32} color="#16a34a" />
            </View>
            <Text className="text-center text-xl font-bold text-gray-900">
              설치가 완료되었습니다! 🎉
            </Text>
            <Text className="mt-2 text-center text-gray-600">
              홈 화면에서 사주라떼를{'\n'}바로 실행할 수 있습니다.
            </Text>

            <TouchableOpacity
              onPress={() => setShowSuccessModal(false)}
              className="mt-6 w-full items-center justify-center rounded-xl bg-gray-900 py-3 active:bg-gray-800">
              <Text className="font-bold text-white">확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
