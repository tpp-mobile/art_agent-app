import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useArtworkStore, useAuthStore, useChatStore, useFollowingStore } from '../../src/stores';
import { Card, Avatar, Button, Badge } from '../../src/components/ui';
import { ArtworkCard } from '../../src/components/artwork';
import { demoUsers } from '../../src/constants/mockData';

export default function ArtistProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { artworks } = useArtworkStore();
  const { user: currentUser } = useAuthStore();
  const { startConversation } = useChatStore();
  const { follow, unfollow, isFollowing } = useFollowingStore();

  // Find the artist
  const artist = useMemo(() => {
    return demoUsers.find(u => u.id === id && u.role === 'artist');
  }, [id]);

  // Get artist's verified artworks
  const artistArtworks = useMemo(() => {
    return artworks.filter(a => a.artistId === id && a.status === 'verified');
  }, [artworks, id]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalViews = artistArtworks.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = artistArtworks.reduce((sum, a) => sum + a.likes, 0);
    const avgScore = artistArtworks.length > 0
      ? artistArtworks.reduce((sum, a) => sum + (a.verificationResult?.humanScore || 0), 0) / artistArtworks.length
      : 0;
    const totalSales = artistArtworks.filter(a => a.price).length;

    return {
      artworks: artistArtworks.length,
      views: totalViews,
      likes: totalLikes,
      avgScore: Math.round(avgScore * 10) / 10,
      sales: totalSales,
    };
  }, [artistArtworks]);

  if (!artist) {
    return (
      <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary items-center justify-center">
        <Ionicons name="person-outline" size={64} color="#94a3b8" />
        <Text className="text-lg text-text-secondary dark:text-gray-400 mt-4">Artist not found</Text>
        <Button title="Go Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const isOwnProfile = currentUser?.id === artist.id;
  const isFollowed = isFollowing(artist.id);

  const handleFollow = () => {
    if (isFollowed) {
      unfollow(artist.id);
    } else {
      follow(artist.id);
    }
  };

  const handleMessage = () => {
    if (!currentUser) return;

    // In a real app we might pick an artwork context or general chat
    // For now we start a general chat about "Artist Inquiry"
    const conversationId = startConversation(
      artist.id,
      artist.name,
      artist.avatar,
      'artist',
      currentUser.id,
      currentUser.name,
      currentUser.avatar,
      currentUser.role
    );

    router.push(`/chat/${conversationId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header with Back Button */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">Artist Profile</Text>
        </View>

        {/* Profile Header */}
        <View className="px-4 py-6">
          <Card variant="elevated" padding="lg">
            <View className="items-center">
              {/* Avatar */}
              <View className="mb-4">
                <Image
                  source={{ uri: artist.avatar }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  contentFit="cover"
                />
                <View className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-1">
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                </View>
              </View>

              {/* Name & Info */}
              <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">
                {artist.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <Badge label="Verified Artist" variant="success" size="sm" />
              </View>
              <Text className="text-sm text-text-tertiary mt-2">
                Member since {new Date(artist.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <View className="flex-row mt-4">
                  <Button
                    title="Message"
                    variant="primary"
                    size="sm"
                    icon={<Ionicons name="chatbubble-outline" size={16} color="#ffffff" />}
                    onPress={handleMessage}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    title={isFollowed ? "Following" : "Follow"}
                    variant={isFollowed ? "secondary" : "outline"}
                    size="sm"
                    icon={<Ionicons name={isFollowed ? "checkmark" : "person-add-outline"} size={16} color={isFollowed ? "#64748b" : "#059669"} />}
                    onPress={handleFollow}
                  />
                </View>
              )}
            </View>
          </Card>
        </View>

        {/* Stats */}
        <View className="px-4 mb-6">
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <Card variant="outlined" padding="md">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary-600">{stats.artworks}</Text>
                  <Text className="text-xs text-text-tertiary">Artworks</Text>
                </View>
              </Card>
            </View>
            <View className="flex-1 mr-2">
              <Card variant="outlined" padding="md">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary-600">{stats.avgScore}%</Text>
                  <Text className="text-xs text-text-tertiary">Avg Score</Text>
                </View>
              </Card>
            </View>
            <View className="flex-1 mr-2">
              <Card variant="outlined" padding="md">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary-600">{stats.views}</Text>
                  <Text className="text-xs text-text-tertiary">Views</Text>
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card variant="outlined" padding="md">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary-600">{stats.likes}</Text>
                  <Text className="text-xs text-text-tertiary">Likes</Text>
                </View>
              </Card>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-2">About</Text>
          <Card variant="outlined" padding="md">
            <Text className="text-sm text-text-secondary dark:text-gray-400 leading-5">
              A passionate artist dedicated to creating authentic, human-made artwork.
              All pieces are verified through Art Agent's rigorous verification process,
              ensuring collectors receive genuine human creativity.
            </Text>
            <View className="flex-row flex-wrap mt-3">
              {['Digital Art', 'Oil Painting', 'Landscapes', 'Portraits'].map(tag => (
                <View key={tag} className="bg-background-tertiary dark:bg-dark-tertiary px-2 py-1 rounded mr-2 mb-2">
                  <Text className="text-xs text-text-secondary dark:text-gray-400">{tag}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Verified Artworks */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-medium text-text-tertiary uppercase">
              Verified Artworks ({artistArtworks.length})
            </Text>
          </View>

          {artistArtworks.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              {artistArtworks.map(artwork => (
                <View key={artwork.id} className="w-[48%] mb-4">
                  <ArtworkCard artwork={artwork} variant="grid" />
                </View>
              ))}
            </View>
          ) : (
            <Card variant="outlined" padding="lg">
              <View className="items-center py-4">
                <Ionicons name="images-outline" size={48} color="#94a3b8" />
                <Text className="text-sm text-text-tertiary mt-2">No verified artworks yet</Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
