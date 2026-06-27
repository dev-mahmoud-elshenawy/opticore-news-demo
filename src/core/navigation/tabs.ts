/** Bottom-tab definitions — drives the Tabs layout (no inline strings there). */
export const TABS = [
  { name: 'headlines', title: 'Headlines', icon: '📰' },
  { name: 'search', title: 'Search', icon: '🔍' },
  { name: 'saved', title: 'Saved', icon: '🔖' },
  { name: 'settings', title: 'Settings', icon: '⚙️' },
] as const;

/** Title for the shared article-detail route. */
export const ARTICLE_TITLE = 'Article';
