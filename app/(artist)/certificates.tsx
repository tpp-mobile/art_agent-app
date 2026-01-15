import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useArtworkStore } from '../../src/stores';
import { Card, Badge, Avatar } from '../../src/components/ui';
import { Artwork } from '../../src/types';

function CertificateCard({ artwork }: { artwork: Artwork }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my verified artwork "${artwork.title}" on Art Agent! Certificate ID: ${artwork.certificateId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Card variant="elevated" padding="md" className="mb-4">
      <View className="flex-row items-start">
        <View className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl items-center justify-center">
          <Ionicons name="ribbon" size={32} color="#059669" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">{artwork.title}</Text>
          <Text className="text-sm text-text-tertiary mt-1">
            Certificate: {artwork.certificateId}
          </Text>
          {artwork.verificationResult && (
            <View className="flex-row items-center mt-2">
              <View className="bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-primary-700 dark:text-primary-400">
                  {artwork.verificationResult.humanScore}% Human
                </Text>
              </View>
              <Text className="text-xs text-text-tertiary ml-2">
                Verified {artwork.verificationResult.verifiedAt?.toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Certificate Details */}
      <View className="mt-4 pt-4 border-t border-border-light dark:border-dark-tertiary">
        <View className="flex-row flex-wrap">
          <View className="w-1/2 mb-2">
            <Text className="text-xs text-text-tertiary">Edition</Text>
            <Text className="text-sm text-text-primary dark:text-text-inverse">{artwork.edition || 'Original'}</Text>
          </View>
          <View className="w-1/2 mb-2">
            <Text className="text-xs text-text-tertiary">Medium</Text>
            <Text className="text-sm text-text-primary dark:text-text-inverse">{artwork.medium}</Text>
          </View>
          <View className="w-1/2">
            <Text className="text-xs text-text-tertiary">Dimensions</Text>
            <Text className="text-sm text-text-primary dark:text-text-inverse">{artwork.dimensions || 'N/A'}</Text>
          </View>
          <View className="w-1/2">
            <Text className="text-xs text-text-tertiary">Created</Text>
            <Text className="text-sm text-text-primary dark:text-text-inverse">
              {artwork.createdAt.toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row mt-4 pt-4 border-t border-border-light dark:border-dark-tertiary">
        <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2">
          <Ionicons name="eye-outline" size={18} color="#059669" />
          <Text className="text-sm font-medium text-primary-600 ml-2">View</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2">
          <Ionicons name="download-outline" size={18} color="#059669" />
          <Text className="text-sm font-medium text-primary-600 ml-2">Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          className="flex-1 flex-row items-center justify-center py-2"
        >
          <Ionicons name="share-outline" size={18} color="#059669" />
          <Text className="text-sm font-medium text-primary-600 ml-2">Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function ArtistCertificates() {
  const { user } = useAuthStore();
  const { getArtworksByArtist } = useArtworkStore();

  const artistArtworks = user ? getArtworksByArtist(user.id) : [];
  const verifiedArtworks = artistArtworks.filter(
    a => a.status === 'verified' && a.certificateId
  );

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">Certificates</Text>
        <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          {verifiedArtworks.length} verified artworks
        </Text>
      </View>

      {/* Certificate Stats */}
      <View className="px-4 mb-4">
        <Card variant="outlined" padding="md">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center">
                <Ionicons name="shield-checkmark" size={24} color="#059669" />
              </View>
              <View className="ml-3">
                <Text className="text-sm text-text-secondary dark:text-gray-400">Blockchain Verified</Text>
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">
                  {verifiedArtworks.length} Certificates
                </Text>
              </View>
            </View>
            <Badge label="Active" variant="success" />
          </View>
        </Card>
      </View>

      {/* Certificates List */}
      <FlatList
        data={verifiedArtworks}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => <CertificateCard artwork={item} />}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Ionicons name="ribbon-outline" size={64} color="#94a3b8" />
            <Text className="text-lg text-text-secondary dark:text-gray-400 mt-4">No certificates yet</Text>
            <Text className="text-sm text-text-tertiary mt-1 text-center">
              Upload and verify your artworks to{'\n'}receive authenticity certificates
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
