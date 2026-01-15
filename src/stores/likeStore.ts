import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LikeState {
    likedIds: string[];

    // Actions
    toggle: (artworkId: string) => void;
    like: (artworkId: string) => void;
    unlike: (artworkId: string) => void;
    isLiked: (artworkId: string) => boolean;
    clear: () => void;
}

export const useLikeStore = create<LikeState>()(
    persist(
        (set, get) => ({
            likedIds: [],

            toggle: (artworkId: string) => {
                const current = get().likedIds;
                if (current.includes(artworkId)) {
                    set({ likedIds: current.filter(id => id !== artworkId) });
                } else {
                    set({ likedIds: [...current, artworkId] });
                }
            },

            like: (artworkId: string) => {
                const current = get().likedIds;
                if (!current.includes(artworkId)) {
                    set({ likedIds: [...current, artworkId] });
                }
            },

            unlike: (artworkId: string) => {
                set(state => ({
                    likedIds: state.likedIds.filter(id => id !== artworkId),
                }));
            },

            isLiked: (artworkId: string) => {
                return get().likedIds.includes(artworkId);
            },

            clear: () => {
                set({ likedIds: [] });
            },
        }),
        {
            name: 'art-agent-likes',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
