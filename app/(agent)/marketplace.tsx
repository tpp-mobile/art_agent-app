import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtworkStore, useComparisonStore } from '../../src/stores';
import { SearchInput, Button, Card } from '../../src/components/ui';
import { ArtworkCard } from '../../src/components/artwork';
import { ArtworkMedium, VerificationStatus } from '../../src/types';

const mediumOptions: ArtworkMedium[] = [
  'Digital Painting',
  'Oil Painting',
  'Watercolor',
  'Photography',
  'Mixed Media',
  '3D Render',
];

const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Highest Score', value: 'score' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
];

export default function Marketplace() {
  const router = useRouter();
  const { verifiedArtworks } = useArtworkStore();
  const { isCompareMode, toggleCompareMode, selectedIds, clearComparison } = useComparisonStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMediums, setSelectedMediums] = useState<ArtworkMedium[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minScore, setMinScore] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('recent');

  const verified = verifiedArtworks();

  const filteredArtworks = useMemo(() => {
    let result = [...verified];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.artistName.toLowerCase().includes(query) ||
          a.tags.some(t => t.toLowerCase().includes(query)) ||
          a.medium.toLowerCase().includes(query)
      );
    }

    // Filter by medium
    if (selectedMediums.length > 0) {
      result = result.filter(a => selectedMediums.includes(a.medium));
    }

    // Filter by price
    if (minPrice !== null) {
      result = result.filter(a => a.price && a.price >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter(a => a.price && a.price <= maxPrice);
    }

    // Filter by score
    if (minScore !== null) {
      result = result.filter(
        a => a.verificationResult && a.verificationResult.humanScore >= minScore
      );
    }

    // Sort
    switch (sortBy) {
      case 'score':
        result.sort(
          (a, b) =>
            (b.verificationResult?.humanScore || 0) -
            (a.verificationResult?.humanScore || 0)
        );
        break;
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        result.sort(
          (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
        );
    }

    return result;
  }, [verified, searchQuery, selectedMediums, minPrice, maxPrice, minScore, sortBy]);

  const toggleMedium = (medium: ArtworkMedium) => {
    setSelectedMediums(prev =>
      prev.includes(medium)
        ? prev.filter(m => m !== medium)
        : [...prev, medium]
    );
  };

  const clearFilters = () => {
    setSelectedMediums([]);
    setMinPrice(null);
    setMaxPrice(null);
    setMinScore(null);
    setSortBy('recent');
  };

  const hasActiveFilters =
    selectedMediums.length > 0 ||
    minPrice !== null ||
    maxPrice !== null ||
    minScore !== null;

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">Marketplace</Text>
            <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
              {filteredArtworks.length} verified artworks
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleCompareMode}
            className={`px-3 py-2 rounded-lg flex-row items-center ${
              isCompareMode ? 'bg-primary-600' : 'bg-background-card dark:bg-dark-card'
            }`}
          >
            <Ionicons
              name="git-compare-outline"
              size={18}
              color={isCompareMode ? '#ffffff' : '#64748b'}
            />
            <Text className={`text-sm font-medium ml-1 ${isCompareMode ? 'text-white' : 'text-text-secondary dark:text-gray-400'}`}>
              Compare
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Compare Mode Banner */}
      {isCompareMode && (
        <View className="mx-4 mb-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={20} color="#059669" />
              <Text className="text-sm text-primary-700 dark:text-primary-400 ml-2">
                Select 2-3 artworks to compare
              </Text>
            </View>
            <Text className="text-sm font-bold text-primary-600">{selectedIds.length}/3</Text>
          </View>
          {selectedIds.length >= 2 && (
            <View className="flex-row mt-2">
              <TouchableOpacity
                onPress={() => router.push('/(agent)/compare')}
                className="flex-1 bg-primary-600 py-2 rounded-lg mr-2"
              >
                <Text className="text-white text-sm font-medium text-center">Compare Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={clearComparison}
                className="px-4 py-2 bg-background-card dark:bg-dark-card rounded-lg"
              >
                <Text className="text-sm text-text-secondary dark:text-gray-400">Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Search & Filter Bar */}
      <View className="px-4">
        <View className="flex-row items-center">
          <View className="flex-1 mr-2">
            <SearchInput
              placeholder="Search artworks, artists, tags..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`
              w-12 h-12 rounded-xl items-center justify-center
              ${hasActiveFilters ? 'bg-primary-600' : 'bg-background-card dark:bg-dark-card'}
            `}
          >
            <Ionicons
              name="options"
              size={24}
              color={hasActiveFilters ? '#ffffff' : '#64748b'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}
      >
        {sortOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setSortBy(option.value)}
            className={`
              px-4 py-2 rounded-full mr-2
              ${sortBy === option.value ? 'bg-primary-600' : 'bg-background-card dark:bg-dark-card'}
            `}
          >
            <Text
              className={`
                text-sm font-medium
                ${sortBy === option.value ? 'text-white' : 'text-text-secondary dark:text-gray-400'}
              `}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Artworks Grid */}
      <FlatList
        data={filteredArtworks}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ArtworkCard
            artwork={item}
            variant="grid"
            showCompareCheckbox={isCompareMode}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Ionicons name="search-outline" size={64} color="#94a3b8" />
            <Text className="text-lg text-text-secondary dark:text-gray-400 mt-4">No artworks found</Text>
            <Text className="text-sm text-text-tertiary mt-1">
              Try adjusting your filters
            </Text>
            {hasActiveFilters && (
              <Button
                title="Clear Filters"
                variant="outline"
                size="sm"
                onPress={clearFilters}
                style={{ marginTop: 16 }}
              />
            )}
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-light dark:border-dark-tertiary">
            <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={28} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Medium */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-text-primary dark:text-text-inverse mb-3">
                Medium
              </Text>
              <View className="flex-row flex-wrap">
                {mediumOptions.map(medium => (
                  <TouchableOpacity
                    key={medium}
                    onPress={() => toggleMedium(medium)}
                    className={`
                      px-3 py-2 rounded-lg mr-2 mb-2
                      ${
                        selectedMediums.includes(medium)
                          ? 'bg-primary-600'
                          : 'bg-background-card dark:bg-dark-card border border-border-light dark:border-dark-tertiary'
                      }
                    `}
                  >
                    <Text
                      className={`text-sm ${
                        selectedMediums.includes(medium)
                          ? 'text-white font-medium'
                          : 'text-text-secondary dark:text-gray-400'
                      }`}
                    >
                      {medium}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-text-primary dark:text-text-inverse mb-3">
                Price Range
              </Text>
              <View className="flex-row">
                {[
                  { label: 'Under $500', min: 0, max: 500 },
                  { label: '$500-$2K', min: 500, max: 2000 },
                  { label: '$2K-$5K', min: 2000, max: 5000 },
                  { label: '$5K+', min: 5000, max: null },
                ].map((range, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setMinPrice(range.min);
                      setMaxPrice(range.max);
                    }}
                    className={`
                      px-3 py-2 rounded-lg mr-2
                      ${
                        minPrice === range.min && maxPrice === range.max
                          ? 'bg-primary-600'
                          : 'bg-background-card dark:bg-dark-card border border-border-light dark:border-dark-tertiary'
                      }
                    `}
                  >
                    <Text
                      className={`text-sm ${
                        minPrice === range.min && maxPrice === range.max
                          ? 'text-white font-medium'
                          : 'text-text-secondary dark:text-gray-400'
                      }`}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Minimum Human Score */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-text-primary dark:text-text-inverse mb-3">
                Minimum Human Score
              </Text>
              <View className="flex-row">
                {[90, 95, 98, 99].map(score => (
                  <TouchableOpacity
                    key={score}
                    onPress={() => setMinScore(minScore === score ? null : score)}
                    className={`
                      px-4 py-2 rounded-lg mr-2
                      ${
                        minScore === score
                          ? 'bg-primary-600'
                          : 'bg-background-card dark:bg-dark-card border border-border-light dark:border-dark-tertiary'
                      }
                    `}
                  >
                    <Text
                      className={`text-sm ${
                        minScore === score
                          ? 'text-white font-medium'
                          : 'text-text-secondary dark:text-gray-400'
                      }`}
                    >
                      {score}%+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Apply Buttons */}
          <View className="px-4 py-4 border-t border-border-light dark:border-dark-tertiary flex-row">
            <Button
              title="Clear All"
              variant="outline"
              onPress={clearFilters}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Apply Filters"
              variant="primary"
              onPress={() => setShowFilters(false)}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
