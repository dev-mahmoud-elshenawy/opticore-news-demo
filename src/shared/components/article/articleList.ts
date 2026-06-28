import type { Article } from '@/shared/models/article';

/** Stable keyExtractor for article lists (avoids inline closures per render). */
export const articleKeyExtractor = (article: Article) => article.url;

/** Shared FlatList virtualization tuning for article lists. */
export const LIST_PERF_PROPS = {
  initialNumToRender: 6,
  maxToRenderPerBatch: 8,
  windowSize: 7,
} as const;
