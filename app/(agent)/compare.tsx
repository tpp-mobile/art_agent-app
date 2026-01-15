import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useComparisonStore, useArtworkStore, useShortlistStore } from '../../src/stores';
import { Card, Button, Badge } from '../../src/components/ui';
import { Artwork } from '../../src/types';


function ComparisonCard({ artwork, onRemove }: { artwork: Artwork; onRemove: () => void }) {
  const router = useRouter();
  const { toggle, isShortlisted } = useShortlistStore();
  const saved = isShortlisted(artwork.id);

  return (
    <View className="flex-1 mx-1">
      <Card variant="elevated" padding="none">
        {/* Remove Button */}
        <TouchableOpacity
          onPress={onRemove}
          className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={14} color="#ffffff" />
        </TouchableOpacity>

        {/* Image */}
        <TouchableOpacity onPress={() => router.push(`/artwork/${artwork.id}`)}>
          <Image
            source={{ uri: artwork.thumbnailUrl }}
            style={{ width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            contentFit="cover"
          />
        </TouchableOpacity>

        {/* Content */}
        <View className="p-3">
          {/* Title */}
          <Text className="text-sm font-semibold text-text-primary dark:text-text-inverse" numberOfLines={1}>
            {artwork.title}
          </Text>
          <Text className="text-xs text-text-tertiary mb-2" numberOfLines={1}>
            {artwork.artistName}
          </Text>

          {/* Human Score */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={14} color="#10b981" />
            <Text className="text-sm font-bold text-primary-600 ml-1">
              {artwork.verificationResult?.humanScore || 0}%
            </Text>
          </View>

          {/* Price */}
          {artwork.price ? (
            <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">
              ${artwork.price.toLocaleString()}
            </Text>
          ) : (
            <Text className="text-sm text-text-tertiary">Not for sale</Text>
          )}

          {/* Medium */}
          <View className="mt-2">
            <Badge variant="default" size="sm" label={artwork.medium} />
          </View>

          {/* Actions */}
          <View className="flex-row mt-3">
            <TouchableOpacity
              onPress={() => toggle(artwork.id)}
              className={`flex-1 flex-row items-center justify-center py-2 rounded-lg mr-1 ${saved ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-background-tertiary dark:bg-dark-tertiary'
                }`}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={16}
                color={saved ? '#ef4444' : '#64748b'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/artwork/${artwork.id}`)}
              className="flex-1 flex-row items-center justify-center py-2 rounded-lg bg-primary-600"
            >
              <Text className="text-xs font-medium text-white">View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </View>
  );
}

function ComparisonRow({ label, values }: { label: string; values: (string | number | undefined)[] }) {
  return (
    <View className="flex-row py-3 border-b border-border-light dark:border-dark-tertiary">
      <View className="w-24">
        <Text className="text-xs font-medium text-text-tertiary">{label}</Text>
      </View>
      <View className="flex-1 flex-row">
        {values.map((value, index) => (
          <View key={index} className="flex-1 mx-1">
            <Text className="text-sm text-text-primary dark:text-text-inverse text-center" numberOfLines={2}>
              {value ?? '-'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function CompareScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { selectedIds, removeFromComparison, clearComparison } = useComparisonStore();
  const { getArtworkById } = useArtworkStore();
  const insets = useSafeAreaInsets();

  const artworks = selectedIds.map(id => getArtworkById(id)).filter(Boolean) as Artwork[];

  if (artworks.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top', 'left', 'right']}>
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Compare Artworks</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-background-tertiary dark:bg-dark-tertiary rounded-full items-center justify-center mb-4">
            <Ionicons name="git-compare-outline" size={40} color="#94a3b8" />
          </View>
          <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse text-center">
            No artworks to compare
          </Text>
          <Text className="text-sm text-text-secondary dark:text-gray-400 text-center mt-2">
            Enable compare mode in the marketplace and select 2-3 artworks
          </Text>
          <Button
            title="Go to Marketplace"
            variant="primary"
            onPress={() => router.push('/(agent)/marketplace')}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">
            Compare ({artworks.length})
          </Text>
        </View>
        <TouchableOpacity onPress={clearComparison}>
          <Text className="text-sm font-medium text-primary-600">Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}>
        {/* Artwork Cards */}
        <View className="flex-row px-3 mb-6">
          {artworks.map(artwork => (
            <ComparisonCard
              key={artwork.id}
              artwork={artwork}
              onRemove={() => removeFromComparison(artwork.id)}
            />
          ))}
          {/* Empty slots */}
          {artworks.length < 3 && (
            <View className="flex-1 mx-1">
              <TouchableOpacity
                onPress={() => router.push('/(agent)/marketplace')}
                className="border-2 border-dashed border-border-light dark:border-dark-tertiary rounded-xl items-center justify-center"
                style={{ height: 280 }}
              >
                <Ionicons name="add-circle-outline" size={32} color="#94a3b8" />
                <Text className="text-sm text-text-tertiary mt-2">Add Artwork</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Comparison Table */}
        <View className="px-4">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-3">Comparison</Text>
          <Card variant="outlined" padding="md">
            <ComparisonRow
              label="Human Score"
              values={artworks.map(a => a.verificationResult?.humanScore ? `${a.verificationResult.humanScore}%` : undefined)}
            />
            <ComparisonRow
              label="Price"
              values={artworks.map(a => a.price ? `$${a.price.toLocaleString()}` : 'Not for sale')}
            />
            <ComparisonRow
              label="Medium"
              values={artworks.map(a => a.medium)}
            />
            <ComparisonRow
              label="Dimensions"
              values={artworks.map(a => a.dimensions)}
            />
            <ComparisonRow
              label="Edition"
              values={artworks.map(a => a.edition)}
            />
            <ComparisonRow
              label="License"
              values={artworks.map(a => a.licenseType ? a.licenseType.charAt(0).toUpperCase() + a.licenseType.slice(1) : undefined)}
            />
            <ComparisonRow
              label="Views"
              values={artworks.map(a => a.views.toLocaleString())}
            />
            <ComparisonRow
              label="Likes"
              values={artworks.map(a => a.likes.toLocaleString())}
            />
            <ComparisonRow
              label="Artist"
              values={artworks.map(a => a.artistName)}
            />
          </Card>
        </View>

        {/* Verification Details */}
        <View className="px-4 mt-6">
          <Text className="text-sm font-medium text-text-tertiary uppercase mb-3">Verification Details</Text>
          <Card variant="outlined" padding="md">
            <ComparisonRow
              label="AI Probability"
              values={artworks.map(a => a.verificationResult?.aiProbability ? `${a.verificationResult.aiProbability}%` : undefined)}
            />
            <ComparisonRow
              label="Metadata"
              values={artworks.map(a => a.verificationResult?.metadataAudit)}
            />
            <ComparisonRow
              label="Layer Analysis"
              values={artworks.map(a => a.verificationResult?.layerAnalysis)}
            />
            <ComparisonRow
              label="Process Proofs"
              values={artworks.map(a => a.processProofs.length > 0 ? `${a.processProofs.length} provided` : 'None')}
            />
            <ComparisonRow
              label="Certificate"
              values={artworks.map(a => a.certificateId ? 'Yes' : 'No')}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
