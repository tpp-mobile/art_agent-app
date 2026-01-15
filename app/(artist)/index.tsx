import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useArtworkStore, useThemeStore, useOnboardingStore } from '../../src/stores';
import { StatCard, Card, Avatar, Button } from '../../src/components/ui';
import { ArtworkCard } from '../../src/components/artwork';
import { OnboardingModal } from '../../src/components/onboarding';

export default function ArtistDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getArtworksByArtist, getStatistics } = useArtworkStore();
  const { effectiveTheme, toggleTheme } = useThemeStore();
  const { hasSeenOnboarding } = useOnboardingStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if user hasn't seen it
    if (!hasSeenOnboarding.artist) {
      setShowOnboarding(true);
    }
  }, [hasSeenOnboarding.artist]);

  const artistArtworks = user ? getArtworksByArtist(user.id) : [];
  const verifiedCount = artistArtworks.filter(a => a.status === 'verified').length;
  const pendingCount = artistArtworks.filter(
    a => a.status === 'pending' || a.status === 'in_review'
  ).length;
  const recentArtworks = artistArtworks.slice(0, 4);

  // Calculate average human score
  const verifiedWithScores = artistArtworks.filter(
    a => a.status === 'verified' && a.verificationResult
  );
  const avgScore =
    verifiedWithScores.length > 0
      ? verifiedWithScores.reduce((sum, a) => sum + (a.verificationResult?.humanScore || 0), 0) /
        verifiedWithScores.length
      : 0;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
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
                {user?.name}
              </Text>
              <Text className="text-sm text-text-secondary dark:text-gray-400">Artist Portal</Text>
            </View>
          </View>
          <View className="flex-row items-center">
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
              <Ionicons name="log-out-outline" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust Score Card */}
        <View className="px-4 mb-4">
          <Card variant="elevated" padding="lg">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-text-secondary dark:text-gray-400">Trust Score</Text>
                <Text className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {avgScore.toFixed(1)}%
                </Text>
                <Text className="text-xs text-text-tertiary mt-1">
                  Average human verification score
                </Text>
              </View>
              <View className="w-20 h-20 rounded-full border-4 border-primary-500 items-center justify-center">
                <Ionicons name="shield-checkmark" size={32} color="#10b981" />
              </View>
            </View>
          </Card>
        </View>

        {/* Stats Grid */}
        <View className="px-4 mb-4">
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <StatCard
                title="Total Artworks"
                value={artistArtworks.length}
                icon={<Ionicons name="images" size={20} color="#059669" />}
                color="primary"
              />
            </View>
            <View className="w-[48%] mb-3">
              <StatCard
                title="Verified"
                value={verifiedCount}
                icon={<Ionicons name="checkmark-circle" size={20} color="#10b981" />}
                color="success"
              />
            </View>
            <View className="w-[48%] mb-3">
              <StatCard
                title="Pending Review"
                value={pendingCount}
                icon={<Ionicons name="time" size={20} color="#f59e0b" />}
                color="warning"
              />
            </View>
            <View className="w-[48%] mb-3">
              <StatCard
                title="Total Views"
                value={artistArtworks.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
                icon={<Ionicons name="eye" size={20} color="#3b82f6" />}
                color="default"
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-text-primary dark:text-text-inverse mb-3">Quick Actions</Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push('/(artist)/upload')}
              className="flex-1 mr-2"
            >
              <Card variant="outlined" padding="md">
                <View className="items-center">
                  <View className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center mb-2">
                    <Ionicons name="cloud-upload" size={24} color="#059669" />
                  </View>
                  <Text className="text-sm font-medium text-text-primary dark:text-text-inverse">Upload Art</Text>
                </View>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(artist)/certificates')}
              className="flex-1 ml-2"
            >
              <Card variant="outlined" padding="md">
                <View className="items-center">
                  <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-2">
                    <Ionicons name="ribbon" size={24} color="#3b82f6" />
                  </View>
                  <Text className="text-sm font-medium text-text-primary dark:text-text-inverse">Certificates</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Artworks */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">Recent Artworks</Text>
            <TouchableOpacity onPress={() => router.push('/(artist)/portfolio')}>
              <Text className="text-sm text-primary-600 dark:text-primary-400 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          {recentArtworks.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              {recentArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} variant="grid" />
              ))}
            </View>
          ) : (
            <Card variant="outlined" padding="lg">
              <View className="items-center py-4">
                <Ionicons name="images-outline" size={48} color="#94a3b8" />
                <Text className="text-text-secondary dark:text-gray-400 mt-2">No artworks yet</Text>
                <Button
                  title="Upload Your First Artwork"
                  variant="primary"
                  size="sm"
                  onPress={() => router.push('/(artist)/upload')}
                  style={{ marginTop: 16 }}
                />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Onboarding Modal */}
      <OnboardingModal
        visible={showOnboarding}
        role="artist"
        onComplete={() => setShowOnboarding(false)}
      />
    </SafeAreaView>
  );
}
