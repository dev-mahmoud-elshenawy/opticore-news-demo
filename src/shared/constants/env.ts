/**
 * App environment constants — the single source for values from `.env`
 * (Expo inlines `EXPO_PUBLIC_*` at build time). Import these instead of reading
 * `process.env` in multiple places.
 */

/** newsapi.org API key (set `EXPO_PUBLIC_NEWS_API_KEY` in your `.env`). */
export const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY ?? '';
