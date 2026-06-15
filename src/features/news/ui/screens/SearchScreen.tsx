import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { toMessage, useDebounce } from 'opticore-react-native';
import type { Article } from '@/shared/models/article';
import { ArticleCard } from '@/shared/components/ArticleCard';
import { articleKeyExtractor, LIST_PERF_PROPS } from '@/shared/components/articleList';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { Routes } from '@/core/navigation/routes';
import { SearchBar } from '../components/SearchBar';
import { useSearchNews } from '../../query/useSearchNews';

const SEARCH_DEBOUNCE_MS = 400;

export function SearchScreen() {
  const router = useRouter();
  const styles = useStyles(createStyles);
  const [term, setTerm] = useState('');
  const debounced = useDebounce(term, SEARCH_DEBOUNCE_MS);
  const { data, isLoading, isError, error, isFetched } = useSearchNews(debounced);

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
      <SearchBar value={term} onChangeText={setTerm} />
      {debounced.trim().length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.hint}>Search for news by keyword.</Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{toMessage(error)}</Text>
        </View>
      ) : isFetched && (!data || data.length === 0) ? (
        <View style={styles.center}>
          <Text>No results for “{debounced.trim()}”.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={articleKeyExtractor}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
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
    hint: { color: t.colors.textSecondary },
    list: { paddingVertical: t.spacing.sm },
    errorText: { color: t.colors.error, textAlign: 'center' },
  });
