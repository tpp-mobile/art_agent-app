import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShortlistState {
  shortlistedIds: string[];

  // Actions
  toggle: (artworkId: string) => void;
  add: (artworkId: string) => void;
  remove: (artworkId: string) => void;
  isShortlisted: (artworkId: string) => boolean;
  clear: () => void;
  getCount: () => number;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      shortlistedIds: [],

      toggle: (artworkId: string) => {
        const current = get().shortlistedIds;
        if (current.includes(artworkId)) {
          set({ shortlistedIds: current.filter(id => id !== artworkId) });
        } else {
          set({ shortlistedIds: [...current, artworkId] });
        }
      },

      add: (artworkId: string) => {
        const current = get().shortlistedIds;
        if (!current.includes(artworkId)) {
          set({ shortlistedIds: [...current, artworkId] });
        }
      },

      remove: (artworkId: string) => {
        set(state => ({
          shortlistedIds: state.shortlistedIds.filter(id => id !== artworkId),
        }));
      },

      isShortlisted: (artworkId: string) => {
        return get().shortlistedIds.includes(artworkId);
      },

      clear: () => {
        set({ shortlistedIds: [] });
      },

      getCount: () => {
        return get().shortlistedIds.length;
      },
    }),
    {
      name: 'art-agent-shortlist',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
