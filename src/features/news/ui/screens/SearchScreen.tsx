import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { toMessage } from 'opticore-react-native';
import { articleKeyExtractor, LIST_PERF_PROPS } from '@/shared/components/article';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { useSearchScreen } from '../../hooks/useSearchScreen';
import { SearchBar } from '../components/SearchBar';

export function SearchScreen() {
  const styles = useStyles(createStyles);
  const { data, isLoading, isError, error, isFetched, term, setTerm, debounced, isEmptyTerm, renderItem } =
    useSearchScreen();

  return (
    <View style={styles.container}>
      <SearchBar value={term} onChangeText={setTerm} />
      {isEmptyTerm ? (
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
