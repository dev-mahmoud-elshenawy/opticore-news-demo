import React, { useCallback, useState } from 'react';
import { useDebounce } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import { ArticleCard } from '@/shared/components/article';
import { useOpenArticle } from '@/shared/hooks/useOpenArticle';
import { useSearchNews } from '../query/useSearchNews';

const SEARCH_DEBOUNCE_MS = 400;

/**
 * ViewModel for the search screen: owns the search term + debounce and the
 * search query, derives the empty-term state, and provides the row renderer.
 */
export function useSearchScreen() {
  const [term, setTerm] = useState('');
  const debounced = useDebounce(term, SEARCH_DEBOUNCE_MS);
  const query = useSearchNews(debounced);
  const openArticle = useOpenArticle();

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCard article={item} onPress={openArticle} />,
    [openArticle],
  );

  return {
    ...query,
    term,
    setTerm,
    debounced,
    isEmptyTerm: debounced.trim().length === 0,
    renderItem,
  };
}
