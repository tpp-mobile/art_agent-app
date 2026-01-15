import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useArtworkStore, useShortlistStore, useThemeStore, useOnboardingStore, useAppNotificationStore } from '../../src/stores';
import { StatCard, Card, Avatar } from '../../src/components/ui';
import { ArtworkCard } from '../../src/components/artwork';
import { OnboardingModal } from '../../src/components/onboarding';
import { colors } from '../../src/constants/theme';

export default function AgentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { verifiedArtworks, getStatistics } = useArtworkStore();
  const { shortlistedIds } = useShortlistStore();
  const { effectiveTheme, toggleTheme } = useThemeStore();
  const { hasSeenOnboarding } = useOnboardingStore();
  const { getUnreadCount } = useAppNotificationStore();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const unreadCount = getUnreadCount();

  useEffect(() => {
    // Show onboarding if user hasn't seen it
    if (!hasSeenOnboarding.agent) {
      setShowOnboarding(true);
    }
  }, [hasSeenOnboarding.agent]);

  const stats = getStatistics();
  const verified = verifiedArtworks();
  const featuredArtworks = verified.slice(0, 2);
  const recentArtworks = verified.slice(0, 4);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Avatar source={user?.avatar} name={user?.name} size="lg" />
            <View className="ml-3">
              <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">
                Welcome, {user?.name?.split(' ')[0]}
              </Text>
              <Text className="text-sm text-text-secondary dark:text-gray-400">Agent Portal</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push('/(agent)/notifications')}
              className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center mr-2"
            >
              <View>
                <Ionicons name="notifications-outline" size={22} color="#64748b" />
                {unreadCount > 0 && (
                  <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-[10px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleTheme}
              className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center mr-2"
            >
              <Ionicons
                name={effectiveTheme === 'dark' ? 'sunny' : 'moon'}
                size={22}
                color={effectiveTheme === 'dark' ? '#f59e0b' : '#64748b'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center"
            >
              <Ionicons name="log-out-outline" size={22} color={effectiveTheme === 'dark' ? colors.dark.textSecondary : '#64748b'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-4 mb-4">
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <StatCard
                title="Saved"
                value={shortlistedIds.length}
                icon={<Ionicons name="heart" size={20} color="#ef4444" />}
                color="error"
              />
            </View>
            <View className="flex-1 ml-2">
              <StatCard
                title="Verified Art"
                value={stats.verifiedCount}
                icon={<Ionicons name="shield-checkmark" size={20} color="#10b981" />}
                color="success"
              />
            </View>
          </View>
        </View>

        {/* Featured Artworks */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">Featured</Text>
            <TouchableOpacity onPress={() => router.push('/(agent)/marketplace')}>
              <Text className="text-sm text-primary-600 dark:text-primary-400 font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          {featuredArtworks.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} variant="featured" />
          ))}
        </View>

        {/* Categories */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-text-primary dark:text-text-inverse mb-3">Browse by Medium</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { icon: 'brush', label: 'Digital', color: '#3b82f6' },
              { icon: 'color-palette', label: 'Oil', color: '#f59e0b' },
              { icon: 'water', label: 'Watercolor', color: '#06b6d4' },
              { icon: 'camera', label: 'Photo', color: '#8b5cf6' },
              { icon: 'cube', label: '3D Art', color: '#ec4899' },
            ].map((category, index) => (
              <TouchableOpacity
                key={index}
                className="items-center mr-4"
                onPress={() => router.push('/(agent)/marketplace')}
              >
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Ionicons
                    name={category.icon as keyof typeof Ionicons.glyphMap}
                    size={28}
                    color={category.color}
                  />
                </View>
                <Text className="text-sm text-text-secondary dark:text-gray-400">{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Artworks */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">Recently Added</Text>
            <TouchableOpacity onPress={() => router.push('/(agent)/marketplace')}>
              <Text className="text-sm text-primary-600 dark:text-primary-400 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {recentArtworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} variant="grid" />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Onboarding Modal */}
      <OnboardingModal
        visible={showOnboarding}
        role="agent"
        onComplete={() => setShowOnboarding(false)}
      />
    </SafeAreaView>
  );
}
