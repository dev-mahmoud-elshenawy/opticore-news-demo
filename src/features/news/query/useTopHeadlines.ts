import { useQuery } from '@tanstack/react-query';
import { newsRepository } from '../api/newsRepository';
import { newsKeys } from './newsKeys';
import type { Article, NewsCategory } from '../model/news.types';

/** React Query hook owning the server cache for top headlines by category. */
export function useTopHeadlines(category: NewsCategory) {
  return useQuery<Article[]>({
    queryKey: newsKeys.topHeadlines(category),
    queryFn: () => newsRepository.getTopHeadlines(category),
    staleTime: 5 * 60 * 1000,
  });
}
