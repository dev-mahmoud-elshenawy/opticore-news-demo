/**
 * Centralized route definitions — screens push these instead of inline strings.
 *
 * Dynamic routes use the `{ pathname, params }` form so expo-router (typed
 * routes) handles param encoding/decoding automatically; no manual
 * encodeURIComponent needed for navigation.
 */
export const Routes = {
  headlines: '/(tabs)/headlines',
  search: '/(tabs)/search',
  saved: '/(tabs)/saved',
  article: (url: string) => ({ pathname: '/article/[url]' as const, params: { url } }),
} as const;
