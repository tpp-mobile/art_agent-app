import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '../../src/stores';
import { ChatListItem } from '../../src/components/chat';
import { Conversation } from '../../src/types';

export default function AgentChat() {
  const { getConversations } = useChatStore();
  const conversations = getConversations();

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">Messages</Text>
        <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Chat with artists about their work
        </Text>
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        keyExtractor={(item: Conversation) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }: { item: Conversation }) => <ChatListItem conversation={item} />}
        ListEmptyComponent={
          <View className="items-center py-16 px-8">
            <View className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center mb-4">
              <Ionicons name="chatbubbles" size={48} color="#3b82f6" />
            </View>
            <Text className="text-xl font-semibold text-text-primary dark:text-text-inverse text-center">
              No conversations yet
            </Text>
            <Text className="text-sm text-text-secondary dark:text-gray-400 mt-2 text-center">
              Start a conversation with an artist{'\n'}by messaging them from an artwork page
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
