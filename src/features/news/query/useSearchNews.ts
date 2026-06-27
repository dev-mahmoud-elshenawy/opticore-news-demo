import { createQueryHook } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import { newsRepository } from '../api/newsRepository';
import { newsKeys } from './newsKeys';

/** Base query hook (built with OptiCore's createQueryHook). */
const useSearchQuery = createQueryHook<string, Article[]>(
  (query) => newsKeys.search(query),
  (query) => newsRepository.searchEverything(query)
);

/**
 * React Query hook for the newsapi /everything search.
 * Disabled until there's a non-empty query, so an empty box makes no request.
 */
export function useSearchNews(query: string) {
  const trimmed = query.trim();
  return useSearchQuery(trimmed, { enabled: trimmed.length > 0 });
}
