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
  sendMessage: (
    conversationId: string,
    content: string,
    senderId: string,
    senderName: string,
    senderAvatar: string,
    replyToId?: string,
    replyToContent?: string,
    replyToName?: string
  ) => void;
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
      { id: 'artist-1', name: 'Elena Martinez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', role: 'artist' },
      { id: 'agent-1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', role: 'agent' },
    ],
    lastMessage: {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'artist-1',
      senderName: 'Elena Martinez',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: 'Yes, I can create a custom piece in that style. Would you like to discuss the details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      type: 'text',
    },
    unreadCount: 1,
    artworkId: 'art-001',
    artworkTitle: 'Ethereal Dreams',
    artworkThumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'conv-2',
    participants: [
      { id: 'artist-2', name: 'James Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', role: 'artist' },
      { id: 'agent-1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', role: 'agent' },
    ],
    lastMessage: {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'agent-1',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      content: 'That sounds great! I\'ll proceed with the purchase.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    artworkId: 'art-002',
    artworkTitle: 'Urban Solitude',
    artworkThumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'conv-3',
    participants: [
      { id: 'artist-1', name: 'Elena Martinez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', role: 'artist' },
      { id: 'agent-1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', role: 'agent' },
    ],
    lastMessage: {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'artist-1',
      senderName: 'Elena Martinez',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: 'Thank you for your interest in my work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
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
      senderId: 'agent-1',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      content: 'Hi Elena! I love your artwork "Ethereal Dreams". Is it still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'agent-1',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      content: 'Also, do you take commissions? I\'d love something similar for my living room.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'artist-1',
      senderName: 'Elena Martinez',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: 'Yes, I can create a custom piece in that style. Would you like to discuss the details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      type: 'text',
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'artist-2',
      senderName: 'James Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      content: 'Thanks for reaching out! The piece includes a certificate of authenticity and free shipping.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'agent-1',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      content: 'That sounds great! I\'ll proceed with the purchase.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      type: 'text',
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'artist-1',
      senderName: 'Elena Martinez',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: 'Thank you for your interest in my work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
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

  sendMessage: (conversationId, content, senderId, senderName, senderAvatar, replyToId, replyToContent, replyToName) => {
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
      replyToId,
      replyToContent,
      replyToName,
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
