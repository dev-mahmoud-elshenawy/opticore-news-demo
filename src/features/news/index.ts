// Public surface of the news feature. UI/consumers go through these — never the
// repository (an implementation detail of the query layer).
export { NewsListScreen } from './ui/screens/NewsListScreen';
export { SearchScreen } from './ui/screens/SearchScreen';
export { ArticleDetailScreen } from './ui/screens/ArticleDetailScreen';
export { useTopHeadlines } from './query/useTopHeadlines';
export { useSearchNews } from './query/useSearchNews';
export { useArticleByUrl } from './query/useArticleByUrl';
export { useNewsFilterStore } from './store/newsFilterStore';
export type { NewsCategory } from './model/news.types';
