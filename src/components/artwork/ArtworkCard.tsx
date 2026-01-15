import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Artwork } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { useShortlistStore, useComparisonStore, useLikeStore } from '../../stores';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

interface ArtworkCardProps {
  artwork: Artwork;
  variant?: 'grid' | 'list' | 'featured';
  onPress?: () => void;
  showCompareCheckbox?: boolean;
}

export function ArtworkCard({
  artwork,
  variant = 'grid',
  onPress,
  showCompareCheckbox = false,
}: ArtworkCardProps) {
  const router = useRouter();
  const { toggle, isShortlisted } = useShortlistStore();
  const { toggle: toggleLike, isLiked } = useLikeStore();
  const { isInComparison, toggleInComparison, canAddMore } = useComparisonStore();
  const shortlisted = isShortlisted(artwork.id);
  const liked = isLiked(artwork.id);
  const inComparison = isInComparison(artwork.id);

  const handlePress = () => {
    if (showCompareCheckbox) {
      if (inComparison || canAddMore()) {
        toggleInComparison(artwork.id);
      }
      return;
    }
    if (onPress) {
      onPress();
    } else {
      router.push(`/artwork/${artwork.id}`);
    }
  };

  const handleShortlist = (e: any) => {
    e.stopPropagation();
    toggle(artwork.id);
  };

  const handleLike = (e: any) => {
    e.stopPropagation();
    toggleLike(artwork.id);
  };

  if (variant === 'list') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className="flex-row bg-background-card dark:bg-dark-card rounded-xl overflow-hidden mb-3 shadow-sm"
      >
        {showCompareCheckbox && (
          <View className="absolute top-2 left-2 z-10">
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${inComparison ? 'bg-primary-600 border-primary-600' : 'bg-white/80 border-gray-300'
              }`}>
              {inComparison && <Ionicons name="checkmark" size={14} color="#ffffff" />}
            </View>
          </View>
        )}
        <Image
          source={{ uri: artwork.thumbnailUrl }}
          className="w-24 h-24"
          resizeMode="cover"
        />
        <View className="flex-1 p-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-base font-semibold text-text-primary dark:text-text-inverse" numberOfLines={1}>
                {artwork.title}
              </Text>
              <Text className="text-sm text-text-secondary dark:text-gray-400" numberOfLines={1}>
                {artwork.artistName}
              </Text>
            </View>
            <StatusBadge status={artwork.status} size="sm" />
          </View>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-sm text-text-tertiary">{artwork.medium}</Text>
            {artwork.price && (
              <Text className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                ${artwork.price.toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className="bg-background-card dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg mb-4"
      >
        <View className="relative">
          <Image
            source={{ uri: artwork.imageUrl }}
            className="w-full h-56"
            resizeMode="cover"
          />
          {showCompareCheckbox && (
            <View className="absolute top-3 left-14 z-10">
              <View className={`w-8 h-8 rounded-full border-2 items-center justify-center ${inComparison ? 'bg-primary-600 border-primary-600' : 'bg-white/80 border-gray-300'
                }`}>
                {inComparison && <Ionicons name="checkmark" size={18} color="#ffffff" />}
              </View>
            </View>
          )}
          <View className="absolute top-3 left-3">
            <StatusBadge status={artwork.status} />
          </View>
          <TouchableOpacity
            onPress={handleShortlist}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
          >
            <Ionicons
              name={shortlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={shortlisted ? '#ef4444' : '#ffffff'}
            />
          </TouchableOpacity>
          {artwork.verificationResult && (
            <View className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-lg">
              <Text className="text-white text-xs font-medium">
                {artwork.verificationResult.humanScore}% Human
              </Text>
            </View>
          )}
        </View>
        <View className="p-4">
          <Text className="text-lg font-bold text-text-primary dark:text-text-inverse" numberOfLines={1}>
            {artwork.title}
          </Text>
          <View className="flex-row items-center mt-2">
            <Avatar source={artwork.artistAvatar} name={artwork.artistName} size="sm" />
            <Text className="text-sm text-text-secondary dark:text-gray-400 ml-2">{artwork.artistName}</Text>
          </View>
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-sm text-text-tertiary">{artwork.medium}</Text>
            {artwork.price && (
              <Text className="text-lg font-bold text-primary-600 dark:text-primary-400">
                ${artwork.price.toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid variant (default)
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={{ width: CARD_WIDTH }}
      className={`bg-background-card dark:bg-dark-card rounded-xl overflow-hidden shadow-sm mb-4 ${inComparison && showCompareCheckbox ? 'border-2 border-primary-600' : ''
        }`}
    >
      <View className="relative">
        <Image
          source={{ uri: artwork.thumbnailUrl }}
          style={{ width: CARD_WIDTH - (inComparison && showCompareCheckbox ? 4 : 0), height: CARD_WIDTH * 0.75 }}
          resizeMode="cover"
        />
        {showCompareCheckbox && (
          <View className="absolute top-2 left-2 z-10">
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${inComparison ? 'bg-primary-600 border-primary-600' : 'bg-white/80 border-gray-300'
              }`}>
              {inComparison && <Ionicons name="checkmark" size={14} color="#ffffff" />}
            </View>
          </View>
        )}
        <View className="absolute top-2 left-2" style={{ left: showCompareCheckbox ? 34 : 8 }}>
          <StatusBadge status={artwork.status} size="sm" />
        </View>
        <View className="absolute top-2 right-2 flex-row">
          {!showCompareCheckbox && (
            <>
              <TouchableOpacity
                onPress={handleShortlist}
                className="w-8 h-8 rounded-full bg-black/30 items-center justify-center mr-2"
              >
                <Ionicons
                  name={shortlisted ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={shortlisted ? '#f59e0b' : '#ffffff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLike}
                className="w-8 h-8 rounded-full bg-black/30 items-center justify-center"
              >
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={liked ? '#ef4444' : '#ffffff'}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View className="p-3">
        <Text className="text-sm font-semibold text-text-primary dark:text-text-inverse" numberOfLines={1}>
          {artwork.title}
        </Text>
        <Text className="text-xs text-text-secondary dark:text-gray-400 mt-1" numberOfLines={1}>
          {artwork.artistName}
        </Text>
        {artwork.price && (
          <Text className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-2">
            ${artwork.price.toLocaleString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
