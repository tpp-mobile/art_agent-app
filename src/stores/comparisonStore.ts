import { create } from 'zustand';

interface ComparisonState {
  selectedIds: string[];
  isCompareMode: boolean;

  // Actions
  toggleCompareMode: () => void;
  addToComparison: (artworkId: string) => void;
  removeFromComparison: (artworkId: string) => void;
  toggleInComparison: (artworkId: string) => void;
  clearComparison: () => void;
  isInComparison: (artworkId: string) => boolean;
  canAddMore: () => boolean;
}

const MAX_COMPARISON_ITEMS = 3;

export const useComparisonStore = create<ComparisonState>()((set, get) => ({
  selectedIds: [],
  isCompareMode: false,

  toggleCompareMode: () => {
    set(state => ({
      isCompareMode: !state.isCompareMode,
      selectedIds: state.isCompareMode ? [] : state.selectedIds,
    }));
  },

  addToComparison: (artworkId: string) => {
    const { selectedIds } = get();
    if (selectedIds.length < MAX_COMPARISON_ITEMS && !selectedIds.includes(artworkId)) {
      set({ selectedIds: [...selectedIds, artworkId] });
    }
  },

  removeFromComparison: (artworkId: string) => {
    set(state => ({
      selectedIds: state.selectedIds.filter(id => id !== artworkId),
    }));
  },

  toggleInComparison: (artworkId: string) => {
    const { selectedIds } = get();
    if (selectedIds.includes(artworkId)) {
      set({ selectedIds: selectedIds.filter(id => id !== artworkId) });
    } else if (selectedIds.length < MAX_COMPARISON_ITEMS) {
      set({ selectedIds: [...selectedIds, artworkId] });
    }
  },

  clearComparison: () => {
    set({ selectedIds: [], isCompareMode: false });
  },

  isInComparison: (artworkId: string) => {
    return get().selectedIds.includes(artworkId);
  },

  canAddMore: () => {
    return get().selectedIds.length < MAX_COMPARISON_ITEMS;
  },
}));
