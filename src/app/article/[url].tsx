import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ArticleDetailScreen } from '@/features/news';
import { ARTICLE_TITLE } from '@/core/navigation/tabs';
import { useArticleDetail } from '@/composition/useArticleDetail';

/**
 * Shared article-detail route (pushed over the tabs). Composition of the news +
 * saved features lives in the composition layer (`useArticleDetail`); this route
 * just binds that ViewModel to the presentational screen. expo-router decodes `url`.
 */
export default function ArticleRoute() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const { article, isSaved, onToggleSave, onOpen } = useArticleDetail(url);

  return (
    <>
      <Stack.Screen
        options={{
          title: ARTICLE_TITLE,
          headerBackTitle: '',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <ArticleDetailScreen
        article={article}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onOpen={onOpen}
      />
    </>
  );
}
