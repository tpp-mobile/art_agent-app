import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useThemeStore } from '../../src/stores';
import { Card, Avatar, Button } from '../../src/components/ui';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingsItem({ icon, title, subtitle, onPress, rightElement, danger }: SettingsItemProps) {
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
        <Text className={`text-base ${danger ? 'text-error' : 'text-text-primary dark:text-text-inverse'}`}>
          {title}
        </Text>
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

export default function ArtistSettings() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { effectiveTheme, toggleTheme, mode } = useThemeStore();

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
                  <View className="bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-medium text-primary-700 dark:text-primary-400">Artist</Text>
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
              icon="lock-closed"
              title="Security"
              subtitle="Password and authentication"
              onPress={() => router.push('/settings/security')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="wallet"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => router.push('/settings/payment')}
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
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="notifications"
              title="Notifications"
              subtitle="Push and email notifications"
              onPress={() => router.push('/settings/notifications')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="language"
              title="Language"
              subtitle="English (US)"
              onPress={() => router.push('/settings/language')}
            />
          </Card>
        </View>

        {/* Support */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-4">
            Support
          </Text>
          <Card variant="outlined" padding="none">
            <SettingsItem
              icon="help-circle"
              title="Help Center"
              onPress={() => router.push('/settings/help')}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="document-text"
              title="Terms of Service"
              onPress={() => router.push({ pathname: '/settings/legal', params: { type: 'terms' } })}
            />
            <View className="h-px bg-border-light dark:bg-dark-tertiary mx-4" />
            <SettingsItem
              icon="shield"
              title="Privacy Policy"
              onPress={() => router.push({ pathname: '/settings/legal', params: { type: 'privacy' } })}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
