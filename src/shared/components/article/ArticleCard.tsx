import React from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';
import { Image } from 'expo-image';
import type { Article } from '@/shared/models/article';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';

interface ArticleCardProps {
  article: Article;
  /** Receives the article so the handler can stay stable across list renders. */
  onPress: (article: Article) => void;
}

/**
 * Presentational article card. Pure + memoized: with a stable `onPress` and the
 * stable `article` reference from list data, React.memo skips re-rendering rows
 * that didn't change. Uses expo-image for disk/memory caching in long lists.
 */
function ArticleCardComponent({ article, onPress }: ArticleCardProps) {
  const styles = useStyles(createStyles);
  return (
    <Pressable testID="article-card" style={styles.card} onPress={() => onPress(article)}>
      {article.urlToImage ? (
        <Image
          source={article.urlToImage}
          style={styles.image}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />
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

export const ArticleCard = React.memo(ArticleCardComponent);

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.colors.card,
      borderRadius: t.borderRadius.lg,
      marginBottom: t.spacing.sm,
      overflow: 'hidden',
    },
    image: { width: '100%', height: 160 },
    body: { padding: t.spacing.md },
    title: {
      fontSize: t.typography.sizes.lg,
      fontWeight: t.typography.weights.semibold as TextStyle['fontWeight'],
      color: t.colors.text,
    },
    source: { marginTop: t.spacing.xs, fontSize: t.typography.sizes.sm, color: t.colors.textSecondary },
  });
