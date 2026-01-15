import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useArtworkStore, useShortlistStore } from '../../src/stores';
import { Button, Card } from '../../src/components/ui';
import { ArtworkCard } from '../../src/components/artwork';

export default function Shortlist() {
  const { shortlistedIds, clear } = useShortlistStore();
  const { getArtworkById } = useArtworkStore();
  const insets = useSafeAreaInsets();

  const shortlistedArtworks = shortlistedIds
    .map(id => getArtworkById(id))
    .filter(Boolean);

  const totalValue = shortlistedArtworks.reduce(
    (sum, a) => sum + (a?.price || 0),
    0
  );

  const handleClearAll = () => {
    Alert.alert(
      'Clear Shortlist',
      'Remove all saved artworks from your shortlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clear },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">Saved</Text>
          <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            {shortlistedIds.length} artworks saved
          </Text>
        </View>
        {shortlistedIds.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text className="text-sm text-error font-medium">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Summary Card */}
      {shortlistedIds.length > 0 && (
        <View className="px-4 mb-4">
          <Card variant="elevated" padding="md">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-text-secondary dark:text-gray-400">Total Value</Text>
                <Text className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ${totalValue.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center">
                  <Ionicons name="heart" size={20} color="#ef4444" />
                </View>
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Artworks List */}
      <FlatList
        data={shortlistedArtworks}
        keyExtractor={item => item!.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 + insets.bottom }}
        renderItem={({ item }) =>
          item ? <ArtworkCard artwork={item} variant="list" /> : null
        }
        ListEmptyComponent={
          <View className="items-center py-16">
            <View className="w-24 h-24 bg-background-tertiary dark:bg-dark-tertiary rounded-full items-center justify-center mb-4">
              <Ionicons name="heart-outline" size={48} color="#94a3b8" />
            </View>
            <Text className="text-xl font-semibold text-text-primary dark:text-text-inverse">
              No saved artworks
            </Text>
            <Text className="text-sm text-text-secondary dark:text-gray-400 mt-2 text-center">
              Browse the marketplace and tap the heart{'\n'}icon to save artworks you love
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
