import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCollectionsStore, useArtworkStore, useThemeStore } from '../../src/stores';
import { Card, Button, Input } from '../../src/components/ui';
import { ArtworkCard } from '../../src/components/artwork';
import { colors } from '../../src/constants/theme';

export default function CollectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCollection, updateCollection, removeFromCollection, deleteCollection } = useCollectionsStore();
  const { getArtworkById } = useArtworkStore();
  const { effectiveTheme } = useThemeStore();
  const isDark = effectiveTheme === 'dark';

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const collection = getCollection(id);

  if (!collection) {
    return (
      <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary items-center justify-center">
        <Ionicons name="folder-outline" size={64} color="#94a3b8" />
        <Text className="text-lg text-text-secondary dark:text-gray-400 mt-4">
          Collection not found
        </Text>
        <Button
          title="Go Back"
          variant="outline"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </SafeAreaView>
    );
  }

  const artworks = collection.artworkIds
    .map(artworkId => getArtworkById(artworkId))
    .filter(Boolean);

  const handleEdit = () => {
    setEditName(collection.name);
    setEditDescription(collection.description || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }
    updateCollection(collection.id, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });
    setShowEditModal(false);
  };

  const handleRemoveArtwork = (artworkId: string, artworkTitle: string) => {
    Alert.alert(
      'Remove Artwork',
      `Remove "${artworkTitle}" from this collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCollection(collection.id, artworkId),
        },
      ]
    );
  };

  const handleDeleteCollection = () => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCollection(collection.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={isDark ? colors.dark.textSecondary : "#64748b"} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">
            {collection.name}
          </Text>
          {collection.description && (
            <Text className="text-sm text-text-secondary dark:text-gray-400" numberOfLines={1}>
              {collection.description}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={handleEdit} className="mr-2">
          <Ionicons name="pencil" size={22} color={isDark ? colors.dark.textSecondary : "#64748b"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteCollection}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className="px-4 mb-4">
        <Text className="text-sm text-text-tertiary">
          {artworks.length} artwork{artworks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Artworks Grid */}
      <FlatList
        data={artworks}
        keyExtractor={item => item!.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View className="relative">
            <ArtworkCard artwork={item!} variant="grid" />
            <TouchableOpacity
              onPress={() => handleRemoveArtwork(item!.id, item!.title)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center z-10"
            >
              <Ionicons name="close" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <View className="w-20 h-20 bg-background-tertiary dark:bg-dark-tertiary rounded-full items-center justify-center mb-4">
              <Ionicons name="images-outline" size={40} color="#94a3b8" />
            </View>
            <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">
              No artworks yet
            </Text>
            <Text className="text-sm text-text-secondary dark:text-gray-400 text-center mt-2 px-8">
              Add artworks to this collection from the marketplace
            </Text>
            <Button
              title="Browse Marketplace"
              variant="primary"
              onPress={() => router.push('/(buyer)/marketplace')}
              style={{ marginTop: 24 }}
            />
          </View>
        }
      />

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-light dark:border-dark-tertiary">
            <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">
              Edit Collection
            </Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Ionicons name="close" size={28} color={isDark ? colors.dark.textPrimary : "#64748b"} />
            </TouchableOpacity>
          </View>

          <View className="p-4">
            <Input
              label="Name"
              placeholder="e.g., Living Room Ideas"
              value={editName}
              onChangeText={setEditName}
            />

            <Input
              label="Description (optional)"
              placeholder="What's this collection for?"
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: 'top' }}
            />

            <Button
              title="Save Changes"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSaveEdit}
              style={{ marginTop: 16 }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
