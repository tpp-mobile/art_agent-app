import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Share,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArtworkStore, useShortlistStore, useAuthStore, useChatStore, useLikeStore, useThemeStore } from '../../src/stores';
import { showSuccess } from '../../src/stores/notificationStore';
import { Card, Badge, StatusBadge, Avatar, Button, Progress } from '../../src/components/ui';
import { colors } from '../../src/constants/theme';
import { ProcessProof } from '../../src/types';

export default function ArtworkDetail() {
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getArtworkById } = useArtworkStore();
  const { toggle, isShortlisted } = useShortlistStore();
  const { toggle: toggleLike, isLiked } = useLikeStore();
  const { user } = useAuthStore();
  const { startConversation } = useChatStore();
  const { effectiveTheme } = useThemeStore();
  const isDark = effectiveTheme === 'dark';
  const [selectedProof, setSelectedProof] = React.useState<ProcessProof | null>(null);

  const artwork = getArtworkById(id || '');

  if (!artwork) {
    return (
      <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary items-center justify-center">
        <Ionicons name="alert-circle" size={64} color="#E0E0E0" />
        <Text className="text-lg text-text-secondary dark:text-gray-400 mt-4">Artwork not found</Text>
        <Button title="Go Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const shortlisted = isShortlisted(artwork.id);
  const liked = isLiked(artwork.id);
  const result = artwork.verificationResult;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${artwork.title}" by ${artwork.artistName} on Art Agent!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShortlist = () => {
    toggle(artwork.id);
    showSuccess(
      shortlisted ? 'Removed from Saved' : 'Added to Saved',
      shortlisted ? 'Artwork removed from your shortlist' : 'Artwork added to your shortlist'
    );
  };

  const handleLike = () => {
    toggleLike(artwork.id);
  };

  const handleContactArtist = (context: 'general' | 'request_proof' = 'general') => {
    if (!user) return;

    const initialMessage = context === 'request_proof'
      ? `Hi, I'm interested in "${artwork.title}" and would like to request additional process proofs to verify its authenticity.`
      : undefined;

    const conversationId = startConversation(
      artwork.artistId,
      artwork.artistName,
      artwork.artistAvatar,
      'artist',
      user.id,
      user.name,
      user.avatar,
      user.role,
      artwork.id,
      artwork.title,
      artwork.thumbnailUrl
    );

    // In a real app we'd pass initialMessage to the chat screen or send it immediately
    // For now, we'll just navigate
    router.push({
      pathname: `/chat/${conversationId}`,
      params: { initialMessage }
    });
  };

  const openProof = (proof: ProcessProof) => {
    setSelectedProof(proof);
  };

  const closeProof = () => {
    setSelectedProof(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? colors.dark.textPrimary : '#1E1E1E'} />
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleShortlist}
            className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center mr-2"
          >
            <Ionicons
              name={shortlisted ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={shortlisted ? '#D97757' : (isDark ? colors.dark.textPrimary : '#1E1E1E')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLike}
            className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center mr-2"
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={24}
              color={liked ? '#C84B4B' : (isDark ? colors.dark.textPrimary : '#1E1E1E')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            className="w-10 h-10 rounded-full bg-background-card dark:bg-dark-card items-center justify-center"
          >
            <Ionicons name="share-outline" size={24} color={isDark ? colors.dark.textPrimary : '#1E1E1E'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Main Image */}
        <Image
          source={{ uri: artwork.imageUrl }}
          style={{ width, height: width * 0.75 }}
          resizeMode="cover"
        />

        {/* Content */}
        <View className="px-4 pt-4">
          {/* Title & Status */}
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse flex-1 mr-2">
              {artwork.title}
            </Text>
            <StatusBadge status={artwork.status} />
          </View>

          {/* Artist */}
          <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() => router.push(`/artist/${artwork.artistId}`)}
          >
            <Avatar source={artwork.artistAvatar} name={artwork.artistName} size="md" />
            <View className="ml-3">
              <Text className="text-base font-medium text-text-primary dark:text-text-inverse">
                {artwork.artistName}
              </Text>
              <Text className="text-sm text-text-tertiary">View Profile</Text>
            </View>
          </TouchableOpacity>

          {/* Price & Actions */}
          {artwork.price && (
            <Card variant="elevated" padding="md" className="mb-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-text-secondary dark:text-gray-400">Price</Text>
                  <Text className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${artwork.price.toLocaleString()}
                  </Text>
                </View>
                {user?.role === 'agent' && (
                  <View className="flex-row">
                    <Button
                      title="Request Proof"
                      variant="outline"
                      size="md"
                      onPress={() => handleContactArtist('request_proof')}
                      style={{ marginRight: 8, flex: 1 }}
                    />
                    <Button
                      title="Contact Artist"
                      variant="primary"
                      size="md"
                      onPress={() => handleContactArtist('general')}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}
              </View>
            </Card>
          )}

          {/* Verification Result */}
          {result && (
            <Card variant="elevated" padding="md" className="mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-text-primary dark:text-text-inverse">Verification</Text>
                <View className="flex-row items-center">
                  <Ionicons name="shield-checkmark" size={20} color="#6FAF8E" />
                  <Text className="text-sm font-medium text-success ml-1">
                    {result.humanScore}% Human
                  </Text>
                </View>
              </View>

              {/* Human Score Progress */}
              <View className="mb-4">
                <Progress
                  value={result.humanScore}
                  showLabel
                  label="Human Creation Score"
                  color={result.humanScore >= 95 ? 'success' : result.humanScore >= 80 ? 'warning' : 'error'}
                />
              </View>

              {/* Verification Checks */}
              <View className="flex-row flex-wrap">
                {[
                  { label: 'Metadata', status: result.metadataAudit },
                  { label: 'Layer Analysis', status: result.layerAnalysis },
                  { label: 'Process Proof', status: result.processVerification },
                  { label: 'Style Match', status: result.styleConsistency },
                ].map((check, index) => (
                  <View key={index} className="w-1/2 flex-row items-center mb-2">
                    <Ionicons
                      name={
                        check.status === 'passed'
                          ? 'checkmark-circle'
                          : check.status === 'warning'
                            ? 'alert-circle'
                            : 'close-circle'
                      }
                      size={18}
                      color={
                        check.status === 'passed'
                          ? '#6FAF8E'
                          : check.status === 'warning'
                            ? '#D97757'
                            : '#C84B4B'
                      }
                    />
                    <Text className="text-sm text-text-secondary dark:text-gray-400 ml-1">{check.label}</Text>
                  </View>
                ))}
              </View>

              {result.notes && (
                <View className="mt-3 pt-3 border-t border-border-light dark:border-dark-tertiary">
                  <Text className="text-sm text-text-tertiary">{result.notes}</Text>
                </View>
              )}

              {artwork.certificateId && (
                <View className="mt-3 pt-3 border-t border-border-light dark:border-dark-tertiary flex-row items-center">
                  <Ionicons name="ribbon" size={18} color="#3A7DFF" />
                  <Text className="text-sm text-text-secondary dark:text-gray-400 ml-2">
                    Certificate: {artwork.certificateId}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Details */}
          <Card variant="outlined" padding="md" className="mb-4">
            <Text className="text-lg font-bold text-text-primary dark:text-text-inverse mb-3">Details</Text>
            <View className="flex-row flex-wrap">
              <View className="w-1/2 mb-3">
                <Text className="text-xs text-text-tertiary">Medium</Text>
                <Text className="text-sm text-text-primary dark:text-text-inverse">{artwork.medium}</Text>
              </View>
              <View className="w-1/2 mb-3">
                <Text className="text-xs text-text-tertiary">Edition</Text>
                <Text className="text-sm text-text-primary dark:text-text-inverse">{artwork.edition || 'Original'}</Text>
              </View>
              <View className="w-1/2 mb-3">
                <Text className="text-xs text-text-tertiary">Dimensions</Text>
                <Text className="text-sm text-text-primary dark:text-text-inverse">{artwork.dimensions || 'N/A'}</Text>
              </View>
              <View className="w-1/2 mb-3">
                <Text className="text-xs text-text-tertiary">Created</Text>
                <Text className="text-sm text-text-primary dark:text-text-inverse">
                  {artwork.createdAt.toLocaleDateString()}
                </Text>
              </View>
              <View className="w-full">
                <Text className="text-xs text-text-tertiary">Tools</Text>
                <Text className="text-sm text-text-primary dark:text-text-inverse">{artwork.tools.join(', ')}</Text>
              </View>
            </View>
          </Card>

          {/* Description */}
          <Card variant="outlined" padding="md" className="mb-4">
            <Text className="text-lg font-bold text-text-primary dark:text-text-inverse mb-2">Description</Text>
            <Text className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
              {artwork.description}
            </Text>
          </Card>

          {/* Process Proofs */}
          {artwork.processProofs.length > 0 && (
            <Card variant="outlined" padding="md" className="mb-4">
              <Text className="text-lg font-bold text-text-primary dark:text-text-inverse mb-3">Process Proofs</Text>
              {artwork.processProofs.map((proof) => (
                <TouchableOpacity
                  key={proof.id}
                  className="flex-row items-center py-3 border-b border-border-light dark:border-dark-tertiary last:border-0"
                  onPress={() => openProof(proof)}
                >
                  <Image
                    source={{ uri: proof.thumbnail }}
                    className="w-14 h-14 rounded-lg"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-medium text-text-primary dark:text-text-inverse">{proof.title}</Text>
                    <Text className="text-xs text-text-tertiary">
                      {proof.fileName} • {proof.fileSize}
                    </Text>
                    {proof.metadata && (
                      <Text className="text-xs text-text-tertiary">
                        {proof.metadata.software}
                        {proof.metadata.layerCount && ` • ${proof.metadata.layerCount} layers`}
                        {proof.metadata.duration && ` • ${proof.metadata.duration}`}
                      </Text>
                    )}
                  </View>
                  <View className="flex-row items-center">
                    {proof.verified && (
                      <Ionicons name="checkmark-circle" size={18} color="#6FAF8E" />
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#E0E0E0" className="ml-2" />
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          )}

          {/* Tags */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">Tags</Text>
            <View className="flex-row flex-wrap">
              {artwork.tags.map((tag, index) => (
                <Badge key={index} label={tag} variant="outline" size="sm" className="mr-2 mb-2" />
              ))}
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row items-center justify-around py-4 border-t border-border-light dark:border-dark-tertiary">
            <View className="items-center">
              <Ionicons name="eye-outline" size={20} color={isDark ? colors.dark.textSecondary : "#4A4A4A"} />
              <Text className="text-sm font-medium text-text-primary dark:text-text-inverse mt-1">
                {artwork.views.toLocaleString()}
              </Text>
              <Text className="text-xs text-text-tertiary">Views</Text>
            </View>
            <View className="items-center">
              <Ionicons name="heart-outline" size={20} color={isDark ? colors.dark.textSecondary : "#4A4A4A"} />
              <Text className="text-sm font-medium text-text-primary dark:text-text-inverse mt-1">
                {artwork.likes.toLocaleString()}
              </Text>
              <Text className="text-xs text-text-tertiary">Likes</Text>
            </View>
            <View className="items-center">
              <Ionicons name="bookmark-outline" size={20} color={isDark ? colors.dark.textSecondary : "#4A4A4A"} />
              <Text className="text-sm font-medium text-text-primary dark:text-text-inverse mt-1">
                {artwork.shortlisted.toLocaleString()}
              </Text>
              <Text className="text-xs text-text-tertiary">Saved</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Proof Viewer Modal */}
      <Modal
        visible={!!selectedProof}
        transparent={true}
        animationType="fade"
        onRequestClose={closeProof}
      >
        <SafeAreaView className="flex-1 bg-black">
          <View className="flex-1 relative">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full"
              onPress={closeProof}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            {selectedProof && (
              <View className="flex-1 items-center justify-center p-4">
                <Image
                  source={{ uri: selectedProof.thumbnail }}
                  style={{ width: width, height: height * 0.8 }}
                  resizeMode="contain"
                />
                <View className="absolute bottom-10 left-0 right-0 items-center">
                  <Text className="text-white text-lg font-bold">{selectedProof.title}</Text>
                  <Text className="text-gray-400 text-sm">
                    {selectedProof.fileName} • {selectedProof.fileSize}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
