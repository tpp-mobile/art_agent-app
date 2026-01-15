import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppNotificationType =
  | 'artwork_verified'
  | 'artwork_flagged'
  | 'new_message'
  | 'new_offer'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'new_follower'
  | 'artwork_sold'
  | 'price_drop'
  | 'system';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  artworkId?: string;
  artworkTitle?: string;
  artworkThumbnail?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  amount?: number;
}

interface AppNotificationState {
  notifications: AppNotification[];

  // Actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

// Demo notifications
const demoNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'artwork_verified',
    title: 'Artwork Verified',
    message: 'Your artwork "Ethereal Dreams" has been verified with a 99.2% human score!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    artworkId: 'art-001',
    artworkTitle: 'Ethereal Dreams',
    artworkThumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
  },
  {
    id: 'notif-2',
    type: 'new_message',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message about "Urban Solitude"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    userId: 'buyer-1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    artworkId: 'art-002',
    artworkTitle: 'Urban Solitude',
  },
  {
    id: 'notif-3',
    type: 'new_offer',
    title: 'New Offer Received',
    message: 'You received an offer of $2,200 for "Chromatic Waves"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: false,
    artworkId: 'art-003',
    artworkTitle: 'Chromatic Waves',
    artworkThumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=300&fit=crop',
    amount: 2200,
    userId: 'buyer-1',
    userName: 'Sarah Johnson',
  },
  {
    id: 'notif-4',
    type: 'artwork_flagged',
    title: 'Review Required',
    message: 'Your artwork "Suspicious Generation" has been flagged for review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    artworkId: 'art-007',
    artworkTitle: 'Suspicious Generation',
  },
  {
    id: 'notif-5',
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: '"Neon Nightscape" you shortlisted is now 20% off!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    artworkId: 'art-006',
    artworkTitle: 'Neon Nightscape',
    artworkThumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop',
  },
  {
    id: 'notif-6',
    type: 'new_follower',
    title: 'New Follower',
    message: 'James Chen started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    userId: 'artist-2',
    userName: 'James Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
];

export const useAppNotificationStore = create<AppNotificationState>()(
  persist(
    (set, get) => ({
      notifications: demoNotifications,

      addNotification: (notification) => {
        const newNotification: AppNotification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date(),
          read: false,
        };
        set(state => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      markAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
        }));
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },
    }),
    {
      name: 'art-agent-app-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
