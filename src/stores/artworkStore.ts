import { create } from 'zustand';
import {
  Artwork,
  VerificationStatus,
  ArtworkMedium,
  ArtworkFilters,
  ArtworkStatistics,
  ProcessProof,
} from '../types';
import { demoArtworks } from '../constants/mockData';

interface ArtworkState {
  artworks: Artwork[];

  // Computed/Selectors
  allArtworks: () => Artwork[];
  verifiedArtworks: () => Artwork[];
  pendingArtworks: () => Artwork[];
  flaggedArtworks: () => Artwork[];

  // Actions
  getArtworkById: (id: string) => Artwork | undefined;
  getArtworksByArtist: (artistId: string) => Artwork[];
  getArtworksByStatus: (status: VerificationStatus) => Artwork[];
  searchArtworks: (query: string) => Artwork[];
  filterArtworks: (filters: ArtworkFilters) => Artwork[];
  addArtwork: (artwork: Omit<Artwork, 'id' | 'views' | 'likes' | 'shortlisted'>) => Artwork;
  updateArtwork: (id: string, updates: Partial<Artwork>) => void;
  addProcessProof: (artworkId: string, proof: Omit<ProcessProof, 'id'>) => void;
  getStatistics: () => ArtworkStatistics;
}

export const useArtworkStore = create<ArtworkState>()((set, get) => ({
  artworks: demoArtworks,

  // Computed selectors
  allArtworks: () => get().artworks,

  verifiedArtworks: () => get().artworks.filter(a => a.status === 'verified'),

  pendingArtworks: () =>
    get().artworks.filter(a => a.status === 'pending' || a.status === 'in_review'),

  flaggedArtworks: () => get().artworks.filter(a => a.status === 'flagged'),

  // Actions
  getArtworkById: (id: string) => {
    return get().artworks.find(a => a.id === id);
  },

  getArtworksByArtist: (artistId: string) => {
    return get().artworks.filter(a => a.artistId === artistId);
  },

  getArtworksByStatus: (status: VerificationStatus) => {
    return get().artworks.filter(a => a.status === status);
  },

  searchArtworks: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().artworks.filter(
      a =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.artistName.toLowerCase().includes(lowerQuery) ||
        a.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
        a.medium.toLowerCase().includes(lowerQuery)
    );
  },

  filterArtworks: (filters: ArtworkFilters) => {
    return get().artworks.filter(a => {
      if (filters.status?.length && !filters.status.includes(a.status)) return false;
      if (filters.medium?.length && !filters.medium.includes(a.medium)) return false;
      if (filters.minPrice && (!a.price || a.price < filters.minPrice)) return false;
      if (filters.maxPrice && a.price && a.price > filters.maxPrice) return false;
      if (
        filters.minHumanScore &&
        (!a.verificationResult || a.verificationResult.humanScore < filters.minHumanScore)
      )
        return false;
      return true;
    });
  },

  addArtwork: (artwork) => {
    const newArtwork: Artwork = {
      ...artwork,
      id: `art-${Date.now()}`,
      views: 0,
      likes: 0,
      shortlisted: 0,
    };
    set(state => ({ artworks: [...state.artworks, newArtwork] }));
    return newArtwork;
  },

  updateArtwork: (id: string, updates: Partial<Artwork>) => {
    set(state => ({
      artworks: state.artworks.map(a => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },

  addProcessProof: (artworkId: string, proof: Omit<ProcessProof, 'id'>) => {
    const newProof: ProcessProof = {
      ...proof,
      id: `proof-${Date.now()}`,
    };
    set(state => ({
      artworks: state.artworks.map(a =>
        a.id === artworkId ? { ...a, processProofs: [...a.processProofs, newProof] } : a
      ),
    }));
  },

  getStatistics: () => {
    const all = get().artworks;
    const verified = all.filter(a => a.status === 'verified');
    const pending = all.filter(a => a.status === 'pending' || a.status === 'in_review');
    const flagged = all.filter(a => a.status === 'flagged');

    const scoresWithResults = verified
      .filter(a => a.verificationResult)
      .map(a => a.verificationResult!.humanScore);

    const avgScore =
      scoresWithResults.length > 0
        ? scoresWithResults.reduce((sum, s) => sum + s, 0) / scoresWithResults.length
        : 0;

    return {
      totalArtworks: all.length,
      verifiedCount: verified.length,
      pendingCount: pending.length,
      flaggedCount: flagged.length,
      averageHumanScore: Math.round(avgScore * 10) / 10,
    };
  },
}));
