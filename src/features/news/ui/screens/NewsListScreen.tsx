import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { toMessage } from 'opticore-react-native';
import { useResponsive } from 'opticore-react-native/hooks';
import { articleKeyExtractor, LIST_PERF_PROPS } from '@/shared/components/article';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { useNewsListScreen } from '../../hooks/useNewsListScreen';
import { CategoryFilter } from '../components/CategoryFilter';

export function NewsListScreen() {
  const styles = useStyles(createStyles);
  const { data, isLoading, isError, error, refetch, renderItem } = useNewsListScreen();
  // Responsive grid: two columns on large/tablet widths (useResponsive).
  const { isLarge, isXLarge } = useResponsive();
  const numColumns = isLarge || isXLarge ? 2 : 1;

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
          key={numColumns} // remount when the column count changes
          data={data}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.column : undefined}
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
    column: { gap: t.spacing.sm },
    errorText: { color: t.colors.error, marginBottom: t.spacing.sm, textAlign: 'center' },
    retry: {
      backgroundColor: t.colors.primary,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm,
      borderRadius: t.borderRadius.md,
    },
    retryText: { color: t.colors.background },
  });
