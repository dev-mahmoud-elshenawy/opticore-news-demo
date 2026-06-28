import type { Article } from '@/shared/models/article';

/** Stable keyExtractor for article lists; NewsAPI can return duplicate URLs. */
export const articleKeyExtractor = (article: Article, index: number) =>
  `${article.url}-${index}`;

/** Shared FlatList virtualization tuning for article lists. */
export const LIST_PERF_PROPS = {
  initialNumToRender: 6,
  maxToRenderPerBatch: 8,
  windowSize: 7,
} as const;
