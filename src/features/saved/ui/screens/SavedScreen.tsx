import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Article } from '@/shared/models/article';
import { ArticleCard } from '@/shared/components/ArticleCard';
import { articleKeyExtractor, LIST_PERF_PROPS } from '@/shared/components/articleList';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { Routes } from '@/core/navigation/routes';
import { useSavedStore } from '../../store/savedStore';

export function SavedScreen() {
  const router = useRouter();
  const styles = useStyles(createStyles);
  const items = useSavedStore((s) => s.items);

  const openArticle = useCallback(
    (article: Article) => router.push(Routes.article(article.url)),
    [router],
  );
  const renderItem = useCallback(
    ({ item }: { item: Article }) => <ArticleCard article={item} onPress={openArticle} />,
    [openArticle],
  );

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.hint}>No saved articles yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={articleKeyExtractor}
      contentContainerStyle={styles.list}
      renderItem={renderItem}
      {...LIST_PERF_PROPS}
    />
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.surface,
    },
    hint: { color: t.colors.textSecondary },
    list: { padding: t.spacing.md, backgroundColor: t.colors.surface, flexGrow: 1 },
  });
