import { ApiClient, HttpMethod } from 'opticore-react-native';
import type { Article, NewsCategory, TopHeadlinesResponse } from '../model/news.types';

/**
 * Repository for newsapi.org. The ONLY place that knows the newsapi URL shape
 * and response envelope. Returns typed domain data; throws on API errors.
 */
export const newsRepository = {
  async getTopHeadlines(category: NewsCategory): Promise<Article[]> {
    const response = await ApiClient.getInstance().request<TopHeadlinesResponse>({
      method: HttpMethod.GET,
      url: `/top-headlines?country=us&category=${category}`,
    });

    const envelope = response.data;
    if (envelope.status !== 'ok') {
      throw new Error(envelope.message ?? 'newsapi.org request failed');
    }
    return envelope.articles ?? [];
  },
};
