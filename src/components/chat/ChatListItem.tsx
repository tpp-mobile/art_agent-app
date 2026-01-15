import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, Badge } from '../ui';
import { Conversation } from '../../types';
import { useAuthStore } from '../../stores';

interface ChatListItemProps {
  conversation: Conversation;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function ChatListItem({ conversation }: ChatListItemProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(
    p => p.id !== user?.id
  ) || conversation.participants[0];

  const handlePress = () => {
    router.push(`/chat/${conversation.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center p-4 bg-background-primary dark:bg-dark-secondary border-b border-border-light dark:border-dark-tertiary"
    >
      {/* Avatar */}
      <View className="relative">
        <Avatar source={otherParticipant.avatar} name={otherParticipant.name} size="lg" />
        {conversation.unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full items-center justify-center">
            <Text className="text-xs font-bold text-white">{conversation.unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-text-primary dark:text-text-inverse">
            {otherParticipant.name}
          </Text>
          {conversation.lastMessage && (
            <Text className="text-xs text-text-tertiary">
              {formatTimestamp(conversation.lastMessage.timestamp)}
            </Text>
          )}
        </View>

        {/* Artwork context */}
        {conversation.artworkTitle && (
          <View className="flex-row items-center mt-0.5">
            {conversation.artworkThumbnail && (
              <Image
                source={{ uri: conversation.artworkThumbnail }}
                className="w-4 h-4 rounded mr-1"
                resizeMode="cover"
              />
            )}
            <Text className="text-xs text-primary-600 dark:text-primary-400" numberOfLines={1}>
              Re: {conversation.artworkTitle}
            </Text>
          </View>
        )}

        {/* Last message preview */}
        {conversation.lastMessage && (
          <Text
            className={`text-sm mt-1 ${
              conversation.unreadCount > 0
                ? 'text-text-primary dark:text-text-inverse font-medium'
                : 'text-text-secondary dark:text-gray-400'
            }`}
            numberOfLines={1}
          >
            {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
            {conversation.lastMessage.content}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
