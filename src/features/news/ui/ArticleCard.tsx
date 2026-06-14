import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Article } from '../model/news.types';

export function ArticleCard({ article, onPress }: { article: Article; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {article.urlToImage ? (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.source}>{article.source.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  image: { width: '100%', height: 160 },
  body: { padding: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  source: { marginTop: 6, fontSize: 12, color: '#666' },
});
