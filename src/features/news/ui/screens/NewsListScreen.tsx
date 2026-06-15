import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { toMessage } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import { ArticleCard } from '@/shared/components/ArticleCard';
import { articleKeyExtractor, LIST_PERF_PROPS } from '@/shared/components/articleList';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { Routes } from '@/core/navigation/routes';
import { useNewsFilterStore } from '../../store/newsFilterStore';
import { useTopHeadlines } from '../../query/useTopHeadlines';
import { CategoryFilter } from '../components/CategoryFilter';

export function NewsListScreen() {
  const router = useRouter();
  const styles = useStyles(createStyles);
  const category = useNewsFilterStore((s) => s.category);
  const { data, isLoading, isError, error, refetch } = useTopHeadlines(category);

  // Stable across renders so memoized rows don't re-render on every parent update.
  const openArticle = useCallback(
    (article: Article) => router.push(Routes.article(article.url)),
    [router],
  );
  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCard article={item} onPress={openArticle} />,
    [openArticle],
  );

  return (
    <View style={styles.container}>
      <CategoryFilter />
      {isLoading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{toMessage(error)}</Text>
          <Pressable style={styles.retry} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : !data || data.length === 0 ? (
        <View style={styles.center}>
          <Text>No articles found.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={articleKeyExtractor}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          {...LIST_PERF_PROPS}
        />
      )}
    </View>
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, paddingHorizontal: t.spacing.md, backgroundColor: t.colors.surface },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    list: { paddingVertical: t.spacing.sm },
    errorText: { color: t.colors.error, marginBottom: t.spacing.sm, textAlign: 'center' },
    retry: {
      backgroundColor: t.colors.primary,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm,
      borderRadius: t.borderRadius.md,
    },
    retryText: { color: t.colors.background },
  });
