import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistStorage } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';

/** Persisted-store key. */
const STORE_KEY = 'saved-articles';

interface SavedState {
  items: Article[];
  isSaved: (url: string) => boolean;
  toggle: (article: Article) => void;
  remove: (url: string) => void;
}

/**
 * Bookmarked articles — a store-only feature (no API): client state persisted
 * across restarts via OptiCore's storage (see `createPersistStorage`). Functions
 * aren't serialized, so only `items` is written.
 */
export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      items: [],
      isSaved: (url) => get().items.some((a) => a.url === url),
      toggle: (article) =>
        set((state) =>
          state.items.some((a) => a.url === article.url)
            ? { items: state.items.filter((a) => a.url !== article.url) }
            : { items: [article, ...state.items] },
        ),
      remove: (url) => set((state) => ({ items: state.items.filter((a) => a.url !== url) })),
    }),
    {
      name: STORE_KEY,
      storage: createPersistStorage<SavedState>(),
      // Persist only the data, not the action functions — smaller writes.
      partialize: (state) => ({ items: state.items }) as SavedState,
    },
  ),
);
