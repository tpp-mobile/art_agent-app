import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useThemeStore, useShortlistStore, useAppNotificationStore, useOnboardingStore } from '../../src/stores';
import { Card, Avatar } from '../../src/components/ui';
import { resetAllDemoData } from '../../src/utils/resetDemoData';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
  badge?: number;
}

function SettingsItem({ icon, title, subtitle, onPress, rightElement, danger, badge }: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-4 px-4"
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-background-tertiary dark:bg-dark-tertiary'
          }`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? '#ef4444' : '#64748b'}
        />
      </View>
      <View className="flex-1 ml-3">
        <View className="flex-row items-center">
          <Text className={`text-base ${danger ? 'text-error' : 'text-text-primary dark:text-text-inverse'}`}>
            {title}
          </Text>
          {badge !== undefined && badge > 0 && (
            <View className="bg-red-500 rounded-full px-2 py-0.5 ml-2">
              <Text className="text-xs text-white font-medium">{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text className="text-sm text-text-tertiary">{subtitle}</Text>
        )}
      </View>
      {rightElement || (onPress && (
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      ))}
    </TouchableOpacity>
  );
}

export default function AgentSettings() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { effectiveTheme, toggleTheme, mode } = useThemeStore();
  const { shortlistedIds, clear } = useShortlistStore();
  const { getUnreadCount } = useAppNotificationStore();
  const { resetOnboarding } = useOnboardingStore();

  const unreadNotifications = getUnreadCount();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  const handleClearShortlist = () => {
    if (shortlistedIds.length === 0) return;

    Alert.alert(
      'Clear Shortlist',
      `Remove all ${shortlistedIds.length} saved artworks?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clear },
      ]
    );
  };


  const handleResetDemoData = () => {
    Alert.alert(
      'Reset Demo Data',
      'This will clear all local data and reset the app to its initial demo state. You will be logged out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAllDemoData();
              logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to reset demo data');
            }
          },
        },
      ]
    );
  };

  const handleReplayOnboarding = () => {
    resetOnboarding('agent');
    logout();
  };

  const handleNotImplemented = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} is not yet implemented in this demo.`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">Settings</Text>
        </View>

        {/* Profile Card */}
        <View className="px-4 mb-4">
          <Card variant="elevated" padding="md">
            <View className="flex-row items-center">
              <Avatar source={user?.avatar} name={user?.name} size="xl" />
              <View className="flex-1 ml-4">
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">{user?.name}</Text>
                <Text className="text-sm text-text-secondary dark:text-gray-400">{user?.email}</Text>
                <View className="flex-row items-center mt-1">
                  <View className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-medium text-blue-700 dark:text-blue-400">Agent / Buyer</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push('/settings/profile')}>
                <Ionicons name="pencil" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Account Settings */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-4">
            Account
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="person"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push('/settings/profile')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="card"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => router.push('/settings/payment')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="location"
              title="Shipping Address"
              subtitle="Manage delivery addresses"
              onPress={() => router.push('/settings/shipping')}
            />
          </Card>
        </View>

        {/* Collection */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-4">
            Collection
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="notifications"
              title="Notifications"
              subtitle="View your notifications"
              badge={unreadNotifications}
              onPress={() => router.push('/(agent)/notifications')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="folder"
              title="Collections"
              subtitle="Organize your saved artworks"
              onPress={() => router.push('/(agent)/collections')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="heart"
              title="Saved Artworks"
              subtitle={`${shortlistedIds.length} items saved`}
              onPress={() => router.push('/(agent)/shortlist')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="git-compare"
              title="Compare Artworks"
              subtitle="View side-by-side comparison"
              onPress={() => router.push('/(agent)/compare')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="trash"
              title="Clear Shortlist"
              subtitle="Remove all saved items"
              onPress={handleClearShortlist}
            />
          </Card>
        </View>

        {/* Preferences */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-4">
            Preferences
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon={effectiveTheme === 'dark' ? 'moon' : 'sunny'}
              title="Dark Mode"
              subtitle={mode === 'system' ? 'Following system' : `${effectiveTheme} mode`}
              rightElement={
                <Switch
                  value={effectiveTheme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                  thumbColor="#ffffff"
                />
              }
            />
          </Card>
        </View>

        {/* Demo Controls */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-4">
            Demo
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="refresh"
              title="Reset Demo Data"
              subtitle="Clear all data and start fresh"
              onPress={handleResetDemoData}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="play"
              title="Replay Onboarding"
              subtitle="See the welcome tour again"
              onPress={handleReplayOnboarding}
            />
          </Card>
        </View>

        {/* Actions */}
        <View className="px-4 mb-4">
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="log-out"
              title="Logout"
              onPress={handleLogout}
              danger
            />
          </Card>
        </View>

        {/* Version */}
        <View className="items-center py-4">
          <Text className="text-sm text-text-tertiary">Art Agent v1.0.0</Text>
          <Text className="text-xs text-text-tertiary mt-1">Demo Mode</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
