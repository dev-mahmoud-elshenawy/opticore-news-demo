import React, { useCallback } from 'react';
import type { Article } from '@/shared/models/article';
import { ArticleCard } from '@/shared/components/article';
import { useOpenArticle } from '@/shared/hooks/useOpenArticle';
import { useSavedStore } from '../store/savedStore';

/**
 * ViewModel for the saved screen: exposes the bookmarked items and provides the
 * list row renderer. The View binds + renders only.
 */
export function useSavedScreen() {
  const items = useSavedStore((s) => s.items);
  const openArticle = useOpenArticle();

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCard article={item} onPress={openArticle} />,
    [openArticle],
  );

  return { items, renderItem };
}
