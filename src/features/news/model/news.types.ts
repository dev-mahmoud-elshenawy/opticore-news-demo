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

export interface ArticleSource {
  id: string | null;
  name: string;
}

export interface Article {
  source: ArticleSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

/** Raw envelope returned by newsapi.org /top-headlines */
export interface TopHeadlinesResponse {
  status: 'ok' | 'error';
  code?: string;
  message?: string;
  totalResults?: number;
  articles?: Article[];
}
