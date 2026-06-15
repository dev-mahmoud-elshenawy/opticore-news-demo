import React from 'react';
import { Linking } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ArticleDetailScreen, useArticleByUrl } from '@/features/news';
import { useSavedStore } from '@/features/saved';
import { ARTICLE_TITLE } from '@/core/navigation/tabs';

/**
 * Shared article-detail route (pushed over the tabs). Composes the news feature
 * (find the article) and the saved feature (bookmark toggle) here, so neither
 * feature imports the other. expo-router decodes the `url` param automatically.
 */
export default function ArticleRoute() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const cached = useArticleByUrl(url);
  const savedItem = useSavedStore((s) => s.items.find((a) => a.url === url));
  const article = cached ?? savedItem;

  const isSaved = useSavedStore((s) => (url ? s.isSaved(url) : false));
  const toggle = useSavedStore((s) => s.toggle);

  return (
    <>
      <Stack.Screen options={{ title: ARTICLE_TITLE }} />
      <ArticleDetailScreen
        article={article}
        isSaved={isSaved}
        onToggleSave={() => article && toggle(article)}
        onOpen={() => article && Linking.openURL(article.url).catch(() => undefined)}
      />
    </>
  );
}
