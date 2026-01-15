import { create } from 'zustand';
import { Bid, BidStatus } from '../types';

interface BidState {
    bids: Record<string, Bid[]>; // artworkId -> Bid[]

    // Actions
    getBidsByArtworkId: (artworkId: string) => Bid[];
    getHighestBid: (artworkId: string) => Bid | undefined;
    placeBid: (
        artworkId: string,
        bidderId: string,
        bidderName: string,
        bidderAvatar: string,
        amount: number
    ) => { success: boolean; message: string };
    updateBidStatus: (bidId: string, artworkId: string, status: BidStatus) => void;
}

// Mock initial bids
const mockBids: Record<string, Bid[]> = {
    'art-001': [
        {
            id: 'bid-1',
            artworkId: 'art-001',
            bidderId: 'agent-1',
            bidderName: 'Sarah Johnson',
            bidderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
            amount: 2600,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: 'outbid',
        },
        {
            id: 'bid-2',
            artworkId: 'art-001',
            bidderId: 'agent-2',
            bidderName: 'Michael Brown',
            bidderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
            amount: 2800,
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            status: 'pending',
        }
    ]
};

export const useBidStore = create<BidState>((set, get) => ({
    bids: mockBids,

    getBidsByArtworkId: (artworkId) => {
        return (get().bids[artworkId] || []).sort((a, b) => b.amount - a.amount);
    },

    getHighestBid: (artworkId) => {
        const artworkBids = get().getBidsByArtworkId(artworkId);
        return artworkBids[0];
    },

    placeBid: (artworkId, bidderId, bidderName, bidderAvatar, amount) => {
        const artworkBids = get().getBidsByArtworkId(artworkId);
        const currentHighest = artworkBids[0]?.amount || 0;

        if (amount <= currentHighest) {
            return {
                success: false,
                message: `Your bid must be higher than the current highest bid of $${currentHighest.toLocaleString()}.`
            };
        }

        const newBid: Bid = {
            id: `bid-${Date.now()}`,
            artworkId,
            bidderId,
            bidderName,
            bidderAvatar,
            amount,
            timestamp: new Date(),
            status: 'pending',
        };

        set((state) => {
            // Mark previous highest bid as 'outbid'
            const updatedBids = (state.bids[artworkId] || []).map(bid =>
                bid.status === 'pending' ? { ...bid, status: 'outbid' as BidStatus } : bid
            );

            return {
                bids: {
                    ...state.bids,
                    [artworkId]: [newBid, ...updatedBids],
                }
            };
        });

        return { success: true, message: 'Bid placed successfully!' };
    },

    updateBidStatus: (bidId, artworkId, status) => {
        set((state) => ({
            bids: {
                ...state.bids,
                [artworkId]: (state.bids[artworkId] || []).map((bid) =>
                    bid.id === bidId ? { ...bid, status } : bid
                ),
            },
        }));
    },
}));
