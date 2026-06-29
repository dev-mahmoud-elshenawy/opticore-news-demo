import { createClientStore } from 'opticore-react-native';
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
 * across restarts via OptiCore's `createClientStore` (`persist: true` routes through
 * OptiCore storage). Functions aren't serialized, so only `items` is written.
 */
export const useSavedStore = createClientStore<SavedState>(
  { name: STORE_KEY, persist: true, partialize: (state) => ({ items: state.items }) },
  (set, get) => ({
    items: [],
    isSaved: (url) => get().items.some((a) => a.url === url),
    toggle: (article) =>
      set((state) =>
        state.items.some((a) => a.url === article.url)
          ? { items: state.items.filter((a) => a.url !== article.url) }
          : { items: [article, ...state.items] }
      ),
    remove: (url) => set((state) => ({ items: state.items.filter((a) => a.url !== url) })),
  })
);
