import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useNewsFilterStore } from '../store/newsFilterStore';
import { useTopHeadlines } from '../query/useTopHeadlines';
import { CategoryFilter } from './CategoryFilter';
import { ArticleCard } from './ArticleCard';

export function NewsListScreen() {
  const router = useRouter();
  const category = useNewsFilterStore((s) => s.category);
  const { data, isLoading, isError, error, refetch } = useTopHeadlines(category);

  return (
    <View style={styles.container}>
      <CategoryFilter />
      {isLoading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error?.message ?? 'Something went wrong'}</Text>
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
          keyExtractor={(item) => item.url}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              onPress={() =>
                router.push({
                  pathname: '/(news)/[id]',
                  // Encode so the full article URL survives as a single route segment
                  // (it contains '/', '?', '&'); the detail screen decodes it.
                  params: { id: encodeURIComponent(item.url) },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingVertical: 8 },
  errorText: { color: '#b00020', marginBottom: 12, textAlign: 'center' },
  retry: { backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff' },
});
