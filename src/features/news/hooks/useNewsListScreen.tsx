import React, { useCallback } from 'react';
import type { Article } from '@/shared/models/article';
import { ArticleCard } from '@/shared/components/article';
import { useOpenArticle } from '@/shared/hooks/useOpenArticle';
import { useNewsFilterStore } from '../store/newsFilterStore';
import { useTopHeadlines } from '../query/useTopHeadlines';

/**
 * ViewModel for the headlines screen: owns the selected category and headlines
 * query, and provides the list row renderer. The View binds + renders only.
 */
export function useNewsListScreen() {
  const category = useNewsFilterStore((s) => s.category);
  const query = useTopHeadlines(category);
  const openArticle = useOpenArticle();

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCard article={item} onPress={openArticle} />,
    [openArticle],
  );

  return { ...query, renderItem };
}
