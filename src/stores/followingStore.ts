import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FollowingState {
    followedArtistIds: string[];
    follow: (artistId: string) => void;
    unfollow: (artistId: string) => void;
    isFollowing: (artistId: string) => boolean;
}

export const useFollowingStore = create<FollowingState>()(
    persist(
        (set, get) => ({
            followedArtistIds: [],

            follow: (artistId: string) => {
                set((state) => {
                    if (state.followedArtistIds.includes(artistId)) return state;
                    return { followedArtistIds: [...state.followedArtistIds, artistId] };
                });
            },

            unfollow: (artistId: string) => {
                set((state) => ({
                    followedArtistIds: state.followedArtistIds.filter((id) => id !== artistId),
                }));
            },

            isFollowing: (artistId: string) => {
                return get().followedArtistIds.includes(artistId);
            },
        }),
        {
            name: 'art-agent-following-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
