import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { ToastContainer } from '../src/components/ui/Toast';
import { useThemeStore, useAuthStore } from '../src/stores';
import '../global.css';

function AuthNavigator() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(artist)' || segments[0] === '(agent)';

    if (!isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(artist)" />
      <Stack.Screen name="(agent)" />
      <Stack.Screen
        name="artwork/[id]"
        options={{
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="chat/[id]"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  const systemColorScheme = useSystemColorScheme();
  const { setColorScheme } = useColorScheme();
  const { effectiveTheme, mode, setMode } = useThemeStore();

  useEffect(() => {
    setColorScheme(effectiveTheme);
  }, [effectiveTheme, setColorScheme]);

  useEffect(() => {
    if (mode === 'system') {
      setMode('system');
    }
  }, [systemColorScheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
        <AuthNavigator />
        <ToastContainer />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
