import { buildUrl } from 'opticore-react-native';
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
 * newsapi.org endpoint builders — the single source of URL/query construction.
 * Uses OptiCore's `buildUrl` so params are encoded consistently (no inline
 * string concatenation or manual encodeURIComponent).
 */
export const newsEndpoints = {
  topHeadlines: (category: NewsCategory) =>
    buildUrl(PATHS.topHeadlines, { country: DEFAULTS.country, category }),
  everything: (query: string) =>
    buildUrl(PATHS.everything, {
      q: query,
      language: DEFAULTS.language,
      sortBy: DEFAULTS.sortBy,
      pageSize: DEFAULTS.searchPageSize,
    }),
};
