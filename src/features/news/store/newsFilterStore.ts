import { create } from 'zustand';
import type { NewsCategory } from '../model/news.types';

const DEFAULT_CATEGORY: NewsCategory = 'general';

interface NewsFilterState {
  category: NewsCategory;
  setCategory: (category: NewsCategory) => void;
  reset: () => void;
}

/** Ephemeral UI state only — server data belongs to React Query, not here. */
export const useNewsFilterStore = create<NewsFilterState>((set) => ({
  category: DEFAULT_CATEGORY,
  setCategory: (category) => set({ category }),
  reset: () => set({ category: DEFAULT_CATEGORY }),
}));
