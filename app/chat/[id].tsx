import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore, useAuthStore } from '../../src/stores';
import { Avatar } from '../../src/components/ui';
import { Message } from '../../src/types';

function formatMessageTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateHeader(date: Date): string {
  const today = new Date();
  const messageDate = new Date(date);

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return messageDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
}

function MessageBubble({ message, isOwnMessage, showAvatar }: MessageBubbleProps) {
  return (
    <View className={`flex-row mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <View className="w-8 mr-2">
          {showAvatar && (
            <Avatar source={message.senderAvatar} name={message.senderName} size="sm" />
          )}
        </View>
      )}

      <View
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isOwnMessage
            ? 'bg-primary-500 rounded-br-sm'
            : 'bg-background-tertiary dark:bg-dark-tertiary rounded-bl-sm'
        }`}
      >
        <Text
          className={`text-base ${
            isOwnMessage ? 'text-white' : 'text-text-primary dark:text-text-inverse'
          }`}
        >
          {message.content}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            isOwnMessage ? 'text-white/70' : 'text-text-tertiary'
          }`}
        >
          {formatMessageTime(message.timestamp)}
        </Text>
      </View>

      {isOwnMessage && <View className="w-8 ml-2" />}
    </View>
  );
}

export default function ChatConversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getConversationById, getMessages, sendMessage, setActiveConversation } = useChatStore();

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const conversation = getConversationById(id || '');
  const messages = getMessages(id || '');

  const otherParticipant = conversation?.participants.find(p => p.id !== user?.id);

  useEffect(() => {
    if (id) {
      setActiveConversation(id);
    }
    return () => setActiveConversation(null);
  }, [id]);

  const handleSend = () => {
    if (!inputText.trim() || !id || !user) return;

    sendMessage(id, inputText.trim(), user.id, user.name, user.avatar);
    setInputText('');

    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  const renderMessages = () => {
    const items: { type: 'date' | 'message'; data: string | Message; showAvatar?: boolean }[] = [];

    Object.entries(groupedMessages).forEach(([date, msgs]) => {
      items.push({ type: 'date', data: date });
      msgs.forEach((msg, index) => {
        const prevMsg = msgs[index - 1];
        const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
        items.push({ type: 'message', data: msg, showAvatar });
      });
    });

    return items;
  };

  if (!conversation) {
    return (
      <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary items-center justify-center">
        <Text className="text-text-secondary dark:text-gray-400">Conversation not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-background-primary dark:bg-dark-secondary border-b border-border-light dark:border-dark-tertiary">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-background-tertiary dark:bg-dark-tertiary items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>

        <Avatar source={otherParticipant?.avatar} name={otherParticipant?.name} size="md" />

        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-text-primary dark:text-text-inverse">
            {otherParticipant?.name}
          </Text>
          <Text className="text-xs text-text-tertiary capitalize">
            {otherParticipant?.role}
          </Text>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-background-tertiary dark:bg-dark-tertiary items-center justify-center">
          <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Artwork Context Banner */}
      {conversation.artworkTitle && (
        <TouchableOpacity
          onPress={() => router.push(`/artwork/${conversation.artworkId}`)}
          className="flex-row items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/20 border-b border-border-light dark:border-dark-tertiary"
        >
          {conversation.artworkThumbnail && (
            <Image
              source={{ uri: conversation.artworkThumbnail }}
              className="w-10 h-10 rounded-lg mr-3"
              resizeMode="cover"
            />
          )}
          <View className="flex-1">
            <Text className="text-xs text-text-tertiary">Discussing artwork</Text>
            <Text className="text-sm font-medium text-primary-600 dark:text-primary-400" numberOfLines={1}>
              {conversation.artworkTitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
        </TouchableOpacity>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={renderMessages()}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            if (item.type === 'date') {
              return (
                <View className="items-center my-4">
                  <View className="px-3 py-1 bg-background-tertiary dark:bg-dark-tertiary rounded-full">
                    <Text className="text-xs text-text-tertiary">
                      {formatDateHeader(new Date(item.data as string))}
                    </Text>
                  </View>
                </View>
              );
            }

            const message = item.data as Message;
            return (
              <MessageBubble
                message={message}
                isOwnMessage={message.senderId === user?.id}
                showAvatar={item.showAvatar || false}
              />
            );
          }}
        />

        {/* Input Area */}
        <View className="px-4 py-3 bg-background-primary dark:bg-dark-secondary border-t border-border-light dark:border-dark-tertiary">
          <View className="flex-row items-end">
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Ionicons name="add-circle" size={28} color="#3b82f6" />
            </TouchableOpacity>

            <View className="flex-1 mx-2 bg-background-tertiary dark:bg-dark-tertiary rounded-2xl px-4 py-2 max-h-32">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#94a3b8"
                multiline
                className="text-base text-text-primary dark:text-text-inverse"
                style={{ maxHeight: 100 }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim()}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                inputText.trim() ? 'bg-primary-500' : 'bg-background-tertiary dark:bg-dark-tertiary'
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? '#ffffff' : '#94a3b8'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
