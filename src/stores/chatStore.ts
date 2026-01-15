import { create } from 'zustand';
import { Message, Conversation, UserRole } from '../types';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;

  // Actions
  getConversations: () => Conversation[];
  getConversationById: (id: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  sendMessage: (conversationId: string, content: string, senderId: string, senderName: string, senderAvatar: string) => void;
  markAsRead: (conversationId: string) => void;
  setActiveConversation: (id: string | null) => void;
  startConversation: (
    otherUserId: string,
    otherUserName: string,
    otherUserAvatar: string,
    otherUserRole: UserRole,
    currentUserId: string,
    currentUserName: string,
    currentUserAvatar: string,
    currentUserRole: UserRole,
    artworkId?: string,
    artworkTitle?: string,
    artworkThumbnail?: string
  ) => string;
  getTotalUnreadCount: () => number;
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      { id: 'user-1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', role: 'artist' },
      { id: 'buyer-1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', role: 'buyer' },
    ],
    lastMessage: {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'Sarah Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      content: 'Yes, I can create a custom piece in that style. Would you like to discuss the details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: 'text',
    },
    unreadCount: 1,
    artworkId: 'art-1',
    artworkTitle: 'Ethereal Dreams',
    artworkThumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'conv-2',
    participants: [
      { id: 'user-2', name: 'Marcus Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', role: 'artist' },
      { id: 'buyer-1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', role: 'buyer' },
    ],
    lastMessage: {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'buyer-1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      content: 'That sounds great! I\'ll proceed with the purchase.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    artworkId: 'art-2',
    artworkTitle: 'Urban Sunset',
    artworkThumbnail: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=200',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'conv-3',
    participants: [
      { id: 'user-3', name: 'Elena Popov', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', role: 'artist' },
      { id: 'buyer-1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', role: 'buyer' },
    ],
    lastMessage: {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'user-3',
      senderName: 'Elena Popov',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      content: 'Thank you for your interest in my work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

// Mock messages data
const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'buyer-1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      content: 'Hi Sarah! I love your artwork "Ethereal Dreams". Is it still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'buyer-1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      content: 'Also, do you take commissions? I\'d love something similar for my living room.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'Sarah Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      content: 'Yes, I can create a custom piece in that style. Would you like to discuss the details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: 'text',
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'user-2',
      senderName: 'Marcus Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      content: 'Thanks for reaching out! The piece includes a certificate of authenticity and free shipping.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'buyer-1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      content: 'That sounds great! I\'ll proceed with the purchase.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      type: 'text',
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'user-3',
      senderName: 'Elena Popov',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      content: 'Thank you for your interest in my work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      read: true,
      type: 'text',
    },
  ],
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  messages: mockMessages,
  activeConversationId: null,

  getConversations: () => {
    const { conversations } = get();
    return [...conversations].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getConversationById: (id: string) => {
    return get().conversations.find(conv => conv.id === id);
  },

  getMessages: (conversationId: string) => {
    return get().messages[conversationId] || [];
  },

  sendMessage: (conversationId, content, senderId, senderName, senderAvatar) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      content,
      timestamp: new Date(),
      read: true,
      type: 'text',
    };

    set(state => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
          : conv
      ),
    }));
  },

  markAsRead: (conversationId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map(msg => ({
          ...msg,
          read: true,
        })),
      },
    }));
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id) {
      get().markAsRead(id);
    }
  },

  startConversation: (
    otherUserId,
    otherUserName,
    otherUserAvatar,
    otherUserRole,
    currentUserId,
    currentUserName,
    currentUserAvatar,
    currentUserRole,
    artworkId,
    artworkTitle,
    artworkThumbnail
  ) => {
    const { conversations } = get();

    // Check if conversation already exists
    const existingConv = conversations.find(conv =>
      conv.participants.some(p => p.id === otherUserId) &&
      conv.participants.some(p => p.id === currentUserId) &&
      (artworkId ? conv.artworkId === artworkId : true)
    );

    if (existingConv) {
      return existingConv.id;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [
        { id: otherUserId, name: otherUserName, avatar: otherUserAvatar, role: otherUserRole },
        { id: currentUserId, name: currentUserName, avatar: currentUserAvatar, role: currentUserRole },
      ],
      unreadCount: 0,
      artworkId,
      artworkTitle,
      artworkThumbnail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({
      conversations: [newConversation, ...state.conversations],
      messages: {
        ...state.messages,
        [newConversation.id]: [],
      },
    }));

    return newConversation.id;
  },

  getTotalUnreadCount: () => {
    return get().conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  },
}));
