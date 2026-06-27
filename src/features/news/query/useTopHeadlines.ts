import { createQueryHook } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import { newsRepository } from '../api/newsRepository';
import { newsKeys } from './newsKeys';
import type { NewsCategory } from '../model/news.types';

/**
 * React Query hook owning the server cache for top headlines by category.
 *
 * Built with OptiCore's `createQueryHook` — pass a key function and a fetcher, and it
 * returns a typed hook whose error is a `RenderError`. Caching/retry defaults come from
 * the shared client (`core/query/queryClient`).
 */
export const useTopHeadlines = createQueryHook<NewsCategory, Article[]>(
  (category) => newsKeys.topHeadlines(category),
  (category) => newsRepository.getTopHeadlines(category)
);
