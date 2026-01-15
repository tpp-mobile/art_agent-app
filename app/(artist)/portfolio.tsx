import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useArtworkStore } from '../../src/stores';
import { SearchInput, Badge } from '../../src/components/ui';
import { ArtworkCard } from '../../src/components/artwork';
import { VerificationStatus, Artwork } from '../../src/types';

const statusFilters: { label: string; value: VerificationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Verified', value: 'verified' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Flagged', value: 'flagged' },
];

export default function ArtistPortfolio() {
  const { user } = useAuthStore();
  const { getArtworksByArtist, searchArtworks } = useArtworkStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'all'>('all');
  const insets = useSafeAreaInsets();

  const artistArtworks = user ? getArtworksByArtist(user.id) : [];

  const filteredArtworks = useMemo(() => {
    let result = artistArtworks;

    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(a => a.status === selectedStatus);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.tags.some(t => t.toLowerCase().includes(query)) ||
          a.medium.toLowerCase().includes(query)
      );
    }

    return result;
  }, [artistArtworks, selectedStatus, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">My Portfolio</Text>
        <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          {artistArtworks.length} artworks
        </Text>
      </View>

      {/* Search */}
      <View className="px-4">
        <SearchInput
          placeholder="Search artworks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}
      >
        {statusFilters.map(filter => (
          <TouchableOpacity
            key={filter.value}
            onPress={() => setSelectedStatus(filter.value)}
            className={`px-4 py-2 rounded-full mr-2 ${selectedStatus === filter.value ? 'bg-primary-600' : 'bg-background-card dark:bg-dark-card'}`}
          >
            <Text
              className={`text-sm font-medium ${selectedStatus === filter.value ? 'text-white' : 'text-text-secondary dark:text-gray-400'}`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Artworks Grid */}
      <FlatList
        data={filteredArtworks}
        keyExtractor={(item: Artwork) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 + insets.bottom }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }: { item: Artwork }) => <ArtworkCard artwork={item} variant="grid" />}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Ionicons name="images-outline" size={64} color="#94a3b8" />
            <Text className="text-lg text-text-secondary dark:text-gray-400 mt-4">No artworks found</Text>
            <Text className="text-sm text-text-tertiary mt-1">
              {searchQuery ? 'Try a different search' : 'Upload your first artwork'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
