export { NewsListScreen } from './ui/NewsListScreen';
export { useTopHeadlines } from './query/useTopHeadlines';
export { useNewsFilterStore } from './store/newsFilterStore';
// newsRepository is intentionally NOT exported: it is an implementation detail of
// the query layer. UI/consumers go through useTopHeadlines, never the repository.
export type { Article, NewsCategory } from './model/news.types';
