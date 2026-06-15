import type { ApiResult } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';

export const NEWS_CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/**
 * Raw body returned by newsapi.org article endpoints (/top-headlines, /everything).
 * Extends the core ApiResult envelope (status/message/code) with newsapi's payload.
 */
export interface ArticlesResponse extends ApiResult {
  totalResults?: number;
  articles?: Article[];
}
