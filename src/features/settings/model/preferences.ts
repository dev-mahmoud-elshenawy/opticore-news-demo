/** Domain model: user feed preferences. */
export interface Preferences {
  /** ISO 2-letter country for top headlines. */
  country: string;
  /** Page size for search results. */
  pageSize: number;
}

/** Allowed search page-size range (domain constraint). */
export const PAGE_SIZE = { min: 1, max: 100 } as const;
