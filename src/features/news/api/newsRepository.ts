import { ApiClient, HttpMethod } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import type { ArticlesResponse, NewsCategory } from '../model/news.types';
import { newsEndpoints } from './newsEndpoints';

/**
 * Repository for newsapi.org — the ONLY place that knows the newsapi URL shape.
 *
 * Error handling is automatic: OptiCore throws an `ApiError` on any non-2xx
 * response (e.g. newsapi's 401/429), so these methods only deal with the
 * successful body and map it to typed domain data.
 */
export const newsRepository = {
  async getTopHeadlines(category: NewsCategory): Promise<Article[]> {
    const { data } = await ApiClient.getInstance().request<ArticlesResponse>({
      method: HttpMethod.GET,
      url: newsEndpoints.topHeadlines(category),
    });
    return data.articles ?? [];
  },

  async searchEverything(query: string): Promise<Article[]> {
    const { data } = await ApiClient.getInstance().request<ArticlesResponse>({
      method: HttpMethod.GET,
      url: newsEndpoints.everything(query),
    });
    return data.articles ?? [];
  },
};
