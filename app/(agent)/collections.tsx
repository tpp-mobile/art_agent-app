import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCollectionsStore, useArtworkStore } from '../../src/stores';
import { Card, Button, Input } from '../../src/components/ui';
import { Collection } from '../../src/stores/collectionsStore';

function CollectionCard({ collection, onPress, onDelete }: {
  collection: Collection;
  onPress: () => void;
  onDelete: () => void;
}) {
  const { getArtworkById } = useArtworkStore();
  const artworks = collection.artworkIds.map(id => getArtworkById(id)).filter(Boolean);

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onDelete} className="mb-4">
      <Card variant="elevated" padding="none">
        {/* Cover Image Grid */}
        <View className="h-32 bg-background-tertiary dark:bg-dark-tertiary rounded-t-xl overflow-hidden">
          {collection.coverImage ? (
            <Image
              source={{ uri: collection.coverImage }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : artworks.length > 0 ? (
            <View className="flex-row flex-wrap h-full">
              {artworks.slice(0, 4).map((artwork, index) => (
                <Image
                  key={artwork!.id}
                  source={{ uri: artwork!.thumbnailUrl }}
                  style={{
                    width: artworks.length === 1 ? '100%' : '50%',
                    height: artworks.length <= 2 ? '100%' : '50%'
                  }}
                  contentFit="cover"
                />
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="images-outline" size={40} color="#94a3b8" />
            </View>
          )}
        </View>

        {/* Info */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">
            {collection.name}
          </Text>
          {collection.description && (
            <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1" numberOfLines={1}>
              {collection.description}
            </Text>
          )}
          <View className="flex-row items-center mt-2">
            <Ionicons name="images" size={14} color="#64748b" />
            <Text className="text-xs text-text-tertiary ml-1">
              {collection.artworkIds.length} artwork{collection.artworkIds.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function CollectionsScreen() {
  const router = useRouter();
  const { collections, createCollection, deleteCollection } = useCollectionsStore();
  const insets = useSafeAreaInsets();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateCollection = () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }

    createCollection(newName.trim(), newDescription.trim() || undefined);
    setNewName('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  const handleDeleteCollection = (collection: Collection) => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCollection(collection.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <View>
          <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">
            Collections
          </Text>
          <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            {collections.length} collection{collections.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          className="w-10 h-10 bg-primary-600 rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Collections List */}
      <FlatList
        data={collections}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 + insets.bottom }}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => router.push(`/collection/${item.id}`)}
            onDelete={() => handleDeleteCollection(item)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <View className="w-20 h-20 bg-background-tertiary dark:bg-dark-tertiary rounded-full items-center justify-center mb-4">
              <Ionicons name="folder-open-outline" size={40} color="#94a3b8" />
            </View>
            <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">
              No collections yet
            </Text>
            <Text className="text-sm text-text-secondary dark:text-gray-400 text-center mt-2 px-8">
              Create collections to organize your favorite artworks
            </Text>
            <Button
              title="Create Collection"
              variant="primary"
              onPress={() => setShowCreateModal(true)}
              style={{ marginTop: 24 }}
            />
          </View>
        }
      />

      {/* Create Collection Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-light dark:border-dark-tertiary">
            <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">
              New Collection
            </Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close" size={28} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View className="p-4">
            <Input
              label="Name"
              placeholder="e.g., Living Room Ideas"
              value={newName}
              onChangeText={setNewName}
            />

            <Input
              label="Description (optional)"
              placeholder="What's this collection for?"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: 'top' }}
            />

            <Button
              title="Create Collection"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleCreateCollection}
              style={{ marginTop: 16 }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
