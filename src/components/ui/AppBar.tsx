import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../stores';
import { Avatar } from './Avatar';

interface AppBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showThemeToggle?: boolean;
  showAvatar?: boolean;
  avatarSource?: string;
  avatarName?: string;
  rightActions?: React.ReactNode;
  onBackPress?: () => void;
}

export function AppBar({
  title,
  subtitle,
  showBack = false,
  showThemeToggle = true,
  showAvatar = false,
  avatarSource,
  avatarName,
  rightActions,
  onBackPress,
}: AppBarProps) {
  const router = useRouter();
  const { effectiveTheme, toggleTheme } = useThemeStore();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="px-4 py-4 flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
        )}

        {showAvatar && (
          <Avatar source={avatarSource} name={avatarName} size="lg" />
        )}

        <View className={showAvatar ? 'ml-3' : ''}>
          <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-text-secondary dark:text-gray-400">
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center">
        {showThemeToggle && (
          <TouchableOpacity
            onPress={toggleTheme}
            className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center"
          >
            <Ionicons
              name={effectiveTheme === 'dark' ? 'sunny' : 'moon'}
              size={22}
              color={effectiveTheme === 'dark' ? '#f59e0b' : '#64748b'}
            />
          </TouchableOpacity>
        )}
        {rightActions}
      </View>
    </View>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <View className="px-4 py-4">
      <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
