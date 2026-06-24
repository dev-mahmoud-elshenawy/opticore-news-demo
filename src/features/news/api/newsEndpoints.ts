import type { NewsCategory } from '../model/news.types';

/** newsapi.org path segments. */
const PATHS = {
  topHeadlines: '/top-headlines',
  everything: '/everything',
} as const;

/** Default query params, kept out of the call sites. */
const DEFAULTS = {
  country: 'us',
  language: 'en',
  sortBy: 'publishedAt',
  searchPageSize: 30,
} as const;

/**
 * newsapi.org request descriptors — the single source of path + query params.
 * Returns `{ url, params }`; ApiClient (via axios) serializes the query string,
 * so there's no inline string concatenation, encodeURIComponent, or buildUrl at
 * call sites.
 */
export const newsEndpoints = {
  topHeadlines: (category: NewsCategory) => ({
    url: PATHS.topHeadlines,
    params: { country: DEFAULTS.country, category },
  }),
  everything: (query: string) => ({
    url: PATHS.everything,
    params: {
      q: query,
      language: DEFAULTS.language,
      sortBy: DEFAULTS.sortBy,
      pageSize: DEFAULTS.searchPageSize,
    },
  }),
};
