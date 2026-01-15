import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  artworkIds: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionsState {
  collections: Collection[];

  // Actions
  createCollection: (name: string, description?: string) => Collection;
  updateCollection: (id: string, updates: Partial<Pick<Collection, 'name' | 'description'>>) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, artworkId: string) => void;
  removeFromCollection: (collectionId: string, artworkId: string) => void;
  getCollection: (id: string) => Collection | undefined;
  getCollectionsForArtwork: (artworkId: string) => Collection[];
  isInCollection: (collectionId: string, artworkId: string) => boolean;
  setCoverImage: (collectionId: string, imageUrl: string) => void;
}

// Demo collections
const demoCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Living Room Ideas',
    description: 'Art pieces that would look great in my living room',
    artworkIds: ['art-001', 'art-003'],
    coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'col-2',
    name: 'Gift Ideas',
    description: 'Potential gifts for friends and family',
    artworkIds: ['art-002', 'art-006'],
    coverImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: 'col-3',
    name: 'Office Decor',
    description: 'Professional pieces for my home office',
    artworkIds: ['art-006'],
    coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      collections: demoCollections,

      createCollection: (name: string, description?: string) => {
        const newCollection: Collection = {
          id: `col-${Date.now()}`,
          name,
          description,
          artworkIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({
          collections: [...state.collections, newCollection],
        }));
        return newCollection;
      },

      updateCollection: (id: string, updates) => {
        set(state => ({
          collections: state.collections.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
      },

      deleteCollection: (id: string) => {
        set(state => ({
          collections: state.collections.filter(c => c.id !== id),
        }));
      },

      addToCollection: (collectionId: string, artworkId: string) => {
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId && !c.artworkIds.includes(artworkId)
              ? { ...c, artworkIds: [...c.artworkIds, artworkId], updatedAt: new Date() }
              : c
          ),
        }));
      },

      removeFromCollection: (collectionId: string, artworkId: string) => {
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId
              ? { ...c, artworkIds: c.artworkIds.filter(id => id !== artworkId), updatedAt: new Date() }
              : c
          ),
        }));
      },

      getCollection: (id: string) => {
        return get().collections.find(c => c.id === id);
      },

      getCollectionsForArtwork: (artworkId: string) => {
        return get().collections.filter(c => c.artworkIds.includes(artworkId));
      },

      isInCollection: (collectionId: string, artworkId: string) => {
        const collection = get().collections.find(c => c.id === collectionId);
        return collection ? collection.artworkIds.includes(artworkId) : false;
      },

      setCoverImage: (collectionId: string, imageUrl: string) => {
        set(state => ({
          collections: state.collections.map(c =>
            c.id === collectionId ? { ...c, coverImage: imageUrl, updatedAt: new Date() } : c
          ),
        }));
      },
    }),
    {
      name: 'art-agent-collections',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
