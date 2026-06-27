import { api } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import type { ArticlesResponse, NewsCategory } from '../model/news.types';
import { newsEndpoints } from './newsEndpoints';

/**
 * Repository for newsapi.org — the ONLY place that knows the newsapi URL shape.
 *
 * Uses the `api` facade (no `.getInstance()`, no `HttpMethod` enum). The verbs return
 * the response body directly, so `api.get<T>()` resolves to `T` — no `ApiResponse`
 * wrapper to destructure.
 *
 * Error handling is automatic: OptiCore throws an `ApiError` on any non-2xx
 * response (e.g. newsapi's 401/429), so these methods only deal with the
 * successful body and map it to typed domain data.
 */
export const newsRepository = {
  async getTopHeadlines(category: NewsCategory): Promise<Article[]> {
    const { url, params } = newsEndpoints.topHeadlines(category);
    const data = await api.get<ArticlesResponse>(url, { params });
    return data.articles ?? [];
  },

  async searchEverything(query: string): Promise<Article[]> {
    const { url, params } = newsEndpoints.everything(query);
    const data = await api.get<ArticlesResponse>(url, { params });
    return data.articles ?? [];
  },
};
