import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ToastContainer } from '../src/components/ui/Toast';
import { useThemeStore, useAuthStore } from '../src/stores';
import '../global.css';

export default function RootLayout() {
  const systemColorScheme = useSystemColorScheme();
  const { setColorScheme } = useColorScheme();
  const { effectiveTheme, mode, setMode } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  // Sync NativeWind color scheme with theme store
  useEffect(() => {
    setColorScheme(effectiveTheme);
  }, [effectiveTheme, setColorScheme]);

  // Update theme when system changes
  useEffect(() => {
    if (mode === 'system') {
      setMode('system'); // This will recalculate effective theme
    }
  }, [systemColorScheme]);

  // Handle auth state changes - redirect to landing when logged out
  useEffect(() => {
    const inAuthGroup = segments[0] === '(artist)' || segments[0] === '(agent)';

    if (!isAuthenticated && inAuthGroup) {
      // User logged out while in a protected route, redirect to landing
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
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
        <ToastContainer />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
