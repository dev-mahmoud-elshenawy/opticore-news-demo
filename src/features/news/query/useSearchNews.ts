import { useQuery } from '@tanstack/react-query';
import type { Article } from '@/shared/models/article';
import { newsRepository } from '../api/newsRepository';
import { newsKeys } from './newsKeys';

/**
 * React Query hook for the newsapi /everything search.
 * Disabled until there's a non-empty query, so an empty box makes no request.
 */
export function useSearchNews(query: string) {
  const trimmed = query.trim();
  return useQuery<Article[]>({
    queryKey: newsKeys.search(trimmed),
    queryFn: () => newsRepository.searchEverything(trimmed),
    enabled: trimmed.length > 0,
  });
}
