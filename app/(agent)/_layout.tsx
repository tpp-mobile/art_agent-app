import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useShortlistStore, useChatStore } from '../../src/stores';
import { colors } from '../../src/constants/theme';
import { View, Text } from 'react-native';

export default function AgentLayout() {
  const { effectiveTheme } = useThemeStore();
  const { shortlistedIds } = useShortlistStore();
  const { getTotalUnreadCount } = useChatStore();
  const insets = useSafeAreaInsets();
  const isDark = effectiveTheme === 'dark';
  const unreadCount = getTotalUnreadCount();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: isDark ? colors.dark.textTertiary : colors.light.textTertiary,
        tabBarStyle: {
          backgroundColor: isDark ? colors.dark.bgCard : colors.light.bgCard,
          borderTopColor: isDark ? colors.dark.borderLight : colors.light.borderLight,
          paddingTop: 6,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          height: 70 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shortlist"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
              {shortlistedIds.length > 0 && (
                <View className="absolute -top-1 -right-2 w-4 h-4 bg-error rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">{shortlistedIds.length}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={size} color={color} />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-2 w-4 h-4 bg-primary-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden screens that are still accessible via navigation */}
      <Tabs.Screen
        name="notifications"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
