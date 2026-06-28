import { createQueryHook } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import { newsRepository } from '../api/newsRepository';
import { newsKeys } from './newsKeys';

/** Base query hook (built with OptiCore's createQueryHook). */
const useSearchQuery = createQueryHook<string, Article[]>(
  (query) => newsKeys.search(query),
  (query) => newsRepository.searchEverything(query)
);

function dedupByUrl(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((a) => !seen.has(a.url) && !!seen.add(a.url));
}

/**
 * React Query hook for the newsapi /everything search.
 * Disabled until there's a non-empty query, so an empty box makes no request.
 * Duplicate URLs from the NewsAPI are removed via the `select` transform.
 */
export function useSearchNews(query: string) {
  const trimmed = query.trim();
  return useSearchQuery(trimmed, { enabled: trimmed.length > 0, select: dedupByUrl });
}
