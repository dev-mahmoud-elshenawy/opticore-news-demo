import { useQueryClient } from '@tanstack/react-query';
import type { Article } from '@/shared/models/article';
import { newsKeys } from './newsKeys';

/**
 * Find an article by its url from any cached news list (headlines or search).
 *
 * newsapi has no get-by-id endpoint, so the detail screen reuses what the list
 * screens already fetched. Returns undefined if nothing is cached (e.g. deep
 * link / cold start) — callers can fall back accordingly.
 */
export function useArticleByUrl(url?: string): Article | undefined {
  const queryClient = useQueryClient();
  if (!url) return undefined;

  const cachedLists = queryClient.getQueriesData<Article[]>({ queryKey: newsKeys.all });
  for (const [, articles] of cachedLists) {
    const match = articles?.find((article) => article.url === url);
    if (match) return match;
  }
  return undefined;
}
