import { useQuery } from '@tanstack/react-query';
import type { Article } from '@/shared/models/article';
import { newsRepository } from '../api/newsRepository';
import { newsKeys } from './newsKeys';
import type { NewsCategory } from '../model/news.types';

/**
 * React Query hook owning the server cache for top headlines by category.
 * Caching/retry defaults come from the shared client (`core/query/queryClient`).
 */
export function useTopHeadlines(category: NewsCategory) {
  return useQuery<Article[]>({
    queryKey: newsKeys.topHeadlines(category),
    queryFn: () => newsRepository.getTopHeadlines(category),
  });
}
