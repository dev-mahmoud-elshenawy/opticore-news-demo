import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useArticleByUrl } from '@/features/news';
import { useSavedStore } from '@/features/saved';

/**
 * Composition-layer ViewModel for the article-detail route. Composes the news
 * feature (find the article from cache) and the saved feature (bookmark toggle)
 * here — neither feature imports the other; cross-feature wiring lives above
 * the feature layer and below the router.
 */
export function useArticleDetail(url?: string) {
  const cached = useArticleByUrl(url);
  const savedItem = useSavedStore((s) => s.items.find((a) => a.url === url));
  const article = cached ?? savedItem;

  const isSaved = useSavedStore((s) => (url ? s.isSaved(url) : false));
  const toggle = useSavedStore((s) => s.toggle);

  const onToggleSave = useCallback(() => {
    if (article) toggle(article);
  }, [article, toggle]);

  const onOpen = useCallback(() => {
    if (article) Linking.openURL(article.url).catch(() => undefined);
  }, [article]);

  return { article, isSaved, onToggleSave, onOpen };
}
