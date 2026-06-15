import type { NewsCategory } from '../model/news.types';

/** Query-key scope segments. */
const SCOPE = {
  root: 'news',
  topHeadlines: 'top-headlines',
  search: 'search',
} as const;

export const newsKeys = {
  all: [SCOPE.root] as const,
  topHeadlines: (category: NewsCategory) =>
    [...newsKeys.all, SCOPE.topHeadlines, category] as const,
  search: (query: string) => [...newsKeys.all, SCOPE.search, query] as const,
};
