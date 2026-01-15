import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAppNotificationStore, AppNotification, AppNotificationType } from '../../src/stores/appNotificationStore';
import { Card, Avatar } from '../../src/components/ui';

const getNotificationIcon = (type: AppNotificationType): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'artwork_verified':
      return 'shield-checkmark';
    case 'artwork_flagged':
      return 'warning';
    case 'new_message':
      return 'chatbubble';
    case 'new_offer':
      return 'pricetag';
    case 'offer_accepted':
      return 'checkmark-circle';
    case 'offer_rejected':
      return 'close-circle';
    case 'new_follower':
      return 'person-add';
    case 'artwork_sold':
      return 'cart';
    case 'price_drop':
      return 'trending-down';
    default:
      return 'notifications';
  }
};

const getNotificationColor = (type: AppNotificationType): string => {
  switch (type) {
    case 'artwork_verified':
    case 'offer_accepted':
    case 'artwork_sold':
      return '#10b981';
    case 'artwork_flagged':
    case 'offer_rejected':
      return '#ef4444';
    case 'new_offer':
    case 'price_drop':
      return '#f59e0b';
    case 'new_message':
    case 'new_follower':
      return '#3b82f6';
    default:
      return '#64748b';
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

function NotificationItem({
  notification,
  onPress,
  onDelete,
}: {
  notification: AppNotification;
  onPress: () => void;
  onDelete: () => void;
}) {
  const iconName = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onDelete}
      className={`mx-4 mb-3 ${!notification.read ? 'opacity-100' : 'opacity-70'}`}
    >
      <Card variant={notification.read ? 'outlined' : 'elevated'} padding="md">
        <View className="flex-row">
          {/* Icon or Avatar */}
          <View className="mr-3">
            {notification.userAvatar ? (
              <Avatar source={notification.userAvatar} name={notification.userName} size="md" />
            ) : notification.artworkThumbnail ? (
              <Image
                source={{ uri: notification.artworkThumbnail }}
                style={{ width: 48, height: 48, borderRadius: 8 }}
                contentFit="cover"
              />
            ) : (
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: `${iconColor}20` }}
              >
                <Ionicons name={iconName} size={24} color={iconColor} />
              </View>
            )}
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className={`text-base font-semibold ${notification.read
                    ? 'text-text-secondary dark:text-gray-400'
                    : 'text-text-primary dark:text-text-inverse'
                  }`}
              >
                {notification.title}
              </Text>
              {!notification.read && (
                <View className="w-2 h-2 rounded-full bg-primary-600" />
              )}
            </View>
            <Text
              className="text-sm text-text-secondary dark:text-gray-400 mb-1"
              numberOfLines={2}
            >
              {notification.message}
            </Text>
            <Text className="text-xs text-text-tertiary">
              {formatTimeAgo(notification.timestamp)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadCount,
  } = useAppNotificationStore();
  const insets = useSafeAreaInsets();

  const unreadCount = getUnreadCount();

  const handleNotificationPress = (notification: AppNotification) => {
    markAsRead(notification.id);
    if (notification.artworkId) {
      router.push(`/artwork/${notification.artworkId}`);
    }
  };

  const handleDelete = (notification: AppNotification) => {
    Alert.alert(
      'Delete Notification',
      'Remove this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeNotification(notification.id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Remove all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <View>
          <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text className="text-sm text-text-secondary dark:text-gray-400">
              {unreadCount} unread
            </Text>
          )}
        </View>
        <View className="flex-row">
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              className="mr-4 px-3 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg"
            >
              <Text className="text-sm font-medium text-primary-700 dark:text-primary-400">
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Ionicons name="trash-outline" size={24} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 + insets.bottom }}
        ListEmptyComponent={
          <View className="items-center py-16">
            <View className="w-20 h-20 bg-background-tertiary dark:bg-dark-tertiary rounded-full items-center justify-center mb-4">
              <Ionicons name="notifications-off-outline" size={40} color="#94a3b8" />
            </View>
            <Text className="text-lg text-text-secondary dark:text-gray-400">
              No notifications
            </Text>
            <Text className="text-sm text-text-tertiary mt-1">
              You're all caught up!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
