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
  ScrollView,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore, useAuthStore, showSuccess, showInfo } from '../../src/stores';
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
  status?: 'sent' | 'delivered' | 'read';
  onSwipe?: () => void;
  onAvatarPress?: () => void;
}

function MessageBubble({ message, isOwnMessage, showAvatar, status = 'read', onSwipe, onAvatarPress }: MessageBubbleProps) {
  const renderRightActions = () => {
    return (
      <View className="justify-center px-4">
        <Ionicons name="arrow-undo" size={20} color="#3A7DFF" />
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={isOwnMessage ? undefined : renderRightActions}
      renderLeftActions={isOwnMessage ? renderRightActions : undefined}
      onSwipeableOpen={onSwipe}
      friction={2}
    >
      <View className={`flex-row mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        {!isOwnMessage && (
          <View className="w-8 mr-2">
            {showAvatar && (
              <TouchableOpacity onPress={onAvatarPress}>
                <Avatar source={message.senderAvatar} name={message.senderName} size="sm" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View
          className={`max-w-[75%] px-4 py-2 rounded-2xl ${isOwnMessage
            ? 'bg-primary-500 rounded-br-sm shadow-sm'
            : 'bg-background-tertiary dark:bg-dark-tertiary rounded-bl-sm'
            }`}
        >
          {message.replyToContent && (
            <View className="bg-black/5 dark:bg-white/10 rounded-lg p-2 mb-2 border-l-4 border-primary-300">
              <Text className="text-[10px] font-bold text-primary-600 dark:text-primary-300">
                Replying to {message.replyToName}
              </Text>
              <Text className="text-xs text-text-secondary dark:text-text-inverse h-[16px]" numberOfLines={1}>
                {message.replyToContent}
              </Text>
            </View>
          )}

          <Text
            className={`text-base ${isOwnMessage ? 'text-white' : 'text-text-primary dark:text-text-inverse'
              }`}
          >
            {message.content}
          </Text>
          <View className="flex-row items-center justify-end mt-1">
            <Text
              className={`text-[10px] mr-1 ${isOwnMessage ? 'text-white/70' : 'text-text-tertiary'
                }`}
            >
              {formatMessageTime(message.timestamp)}
            </Text>
            {isOwnMessage && (
              <View className="flex-row items-center">
                {status === 'sent' && (
                  <Ionicons name="checkmark" size={14} color="#CBD5E1" />
                )}
                {status === 'delivered' && (
                  <Ionicons name="checkmark-done" size={14} color="#CBD5E1" />
                )}
                {status === 'read' && (
                  <Ionicons name="checkmark-done" size={14} color="#93f5fd" />
                )}
              </View>
            )}
          </View>
        </View>

        {isOwnMessage && <View className="w-8 ml-2" />}
      </View>
    </Swipeable>
  );
}

const QUICK_ACTIONS = [
  'Is this still available?',
  'Can I see more details?',
  'What is the price?',
  'Check certificate',
  'Request process proof',
  'I love this piece!',
];

export default function ChatConversation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getConversationById, getMessages, sendMessage, setActiveConversation } = useChatStore();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
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

  const handleNavigateToProfile = (participantId?: string, role?: string) => {
    if (!participantId) return;

    if (role === 'artist') {
      router.push(`/artist/${participantId}`);
    } else {
      Alert.alert('Profile', 'Agent profiles are used for business verification and are currently private.');
    }
  };

  const handleSend = (text: string = inputText) => {
    const finalContent = text.trim();
    if (!finalContent || !id || !user) return;

    sendMessage(
      id,
      finalContent,
      user.id,
      user.name,
      user.avatar,
      replyTo?.id,
      replyTo?.content,
      replyTo?.senderName
    );

    setInputText('');
    setReplyTo(null);

    // Simulate other user typing
    if (finalContent.includes('?') || Math.random() > 0.7) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        sendMessage(id, "I'll get back to you on that as soon as possible!", otherParticipant?.id || '', otherParticipant?.name || 'Artist', otherParticipant?.avatar || '');
      }, 3000);
    }

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

        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={() => handleNavigateToProfile(otherParticipant?.id, otherParticipant?.role)}
        >
          <Avatar source={otherParticipant?.avatar} name={otherParticipant?.name} size="md" />

          <View className="flex-1 ml-3">
            <Text className="text-base font-semibold text-text-primary dark:text-text-inverse">
              {otherParticipant?.name}
            </Text>
            <Text className="text-xs text-text-tertiary capitalize">
              {otherParticipant?.role}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-background-tertiary dark:bg-dark-tertiary items-center justify-center"
          onPress={() => {
            Alert.alert(
              'Conversation Options',
              'Choose an action for this chat.',
              [
                { text: 'Mute Notifications', onPress: () => showInfo('Notifications Muted', 'You will no longer receive alerts for this chat.') },
                { text: 'Archive Chat', onPress: () => showSuccess('Chat Archived', 'The conversation has been moved to your archive.') },
                { text: 'Report User', onPress: () => Alert.alert('Report', 'Our team will review this user\'s activity.'), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {conversation.artworkTitle && (
        <View
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
            <Text className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Discussing artwork</Text>
            <Text className="text-sm font-semibold text-text-primary dark:text-text-inverse" numberOfLines={1}>
              {conversation.artworkTitle}
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push(`/artwork/${conversation.artworkId}`)}
              className="mr-2 bg-primary-100 dark:bg-primary-900/40 px-3 py-1.5 rounded-full"
            >
              <Text className="text-xs font-bold text-primary-600 dark:text-primary-400">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
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
            const isOwn = message.senderId === user?.id;
            // Mocking status logic: newer own messages might be 'sent'/'delivered'
            const msgIndex = messages.findIndex(m => m.id === message.id);
            const status = isOwn
              ? (msgIndex === messages.length - 1 ? 'sent' : 'read')
              : 'read';

            return (
              <MessageBubble
                message={message}
                isOwnMessage={isOwn}
                showAvatar={item.showAvatar || false}
                status={status}
                onSwipe={() => setReplyTo(message)}
                onAvatarPress={() => handleNavigateToProfile(message.senderId, otherParticipant?.role)}
              />
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <View className="flex-row items-center mb-4 ml-8 bg-background-tertiary dark:bg-dark-tertiary self-start px-4 py-2 rounded-2xl rounded-bl-sm">
                <Text className="text-xs text-text-tertiary font-medium">Artist is typing...</Text>
              </View>
            ) : null
          }
        />

        {/* Quick Action Chips */}
        {!inputText && !replyTo && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-2"
            contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
          >
            {QUICK_ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSend(action)}
                className="mr-2 px-4 py-2 bg-background-primary dark:bg-dark-secondary border border-border-light dark:border-dark-tertiary rounded-full shadow-sm"
                style={{ height: 36, justifyContent: 'center' }}
              >
                <Text className="text-sm font-medium text-text-secondary dark:text-text-inverse">{action}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Area */}
        <View className="px-4 py-3 bg-background-primary dark:bg-dark-secondary border-t border-border-light dark:border-dark-tertiary">
          {replyTo && (
            <View className="flex-row items-center bg-background-tertiary dark:bg-dark-tertiary p-3 rounded-t-2xl border-l-4 border-primary-500 mb-0.5">
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-primary-600 dark:text-primary-300">
                  Replying to {replyTo.senderName}
                </Text>
                <Text className="text-xs text-text-secondary dark:text-text-inverse" numberOfLines={1}>
                  {replyTo.content}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setReplyTo(null)}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          )}

          {showMediaMenu && (
            <View className="flex-row justify-around mb-4 bg-background-tertiary dark:bg-dark-tertiary p-3 rounded-2xl">
              <TouchableOpacity className="items-center">
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mb-1">
                  <Ionicons name="image" size={24} color="white" />
                </View>
                <Text className="text-[10px] font-bold text-text-secondary dark:text-text-inverse">Image</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className="w-12 h-12 bg-purple-500 rounded-full items-center justify-center mb-1">
                  <Ionicons name="document" size={24} color="white" />
                </View>
                <Text className="text-[10px] font-bold text-text-secondary dark:text-text-inverse">Proof</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mb-1">
                  <Ionicons name="location" size={24} color="white" />
                </View>
                <Text className="text-[10px] font-bold text-text-secondary dark:text-text-inverse">Meet</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row items-end">
            <TouchableOpacity
              onPress={() => setShowMediaMenu(!showMediaMenu)}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name={showMediaMenu ? "close-circle" : "add-circle"} size={28} color="#3A7DFF" />
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
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
              className={`w-10 h-10 rounded-full items-center justify-center ${inputText.trim() ? 'bg-primary-500' : 'bg-background-tertiary dark:bg-dark-tertiary'
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
