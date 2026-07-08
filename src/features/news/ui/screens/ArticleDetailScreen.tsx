import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type TextStyle } from 'react-native';
import type { Article } from '@/shared/models/article';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';

interface ArticleDetailScreenProps {
  article?: Article;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
}

/**
 * Presentational article detail. Decoupled from features: it receives the
 * article plus saved-state and handlers as props, so the route composes the
 * news + saved features without this screen importing either store.
 */
export function ArticleDetailScreen({
  article,
  isSaved,
  onToggleSave,
  onOpen,
}: ArticleDetailScreenProps) {
  const styles = useStyles(createStyles);

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Article not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {article.urlToImage ? (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.meta}>
        {article.source.name}
        {article.author ? ` · ${article.author}` : ''}
      </Text>
      {article.description ? <Text style={styles.body}>{article.description}</Text> : null}
      {article.content ? <Text style={styles.body}>{article.content}</Text> : null}

      <View style={styles.actions}>
        <Pressable
          testID="article-save-toggle"
          style={[styles.button, isSaved && styles.buttonActive]}
          onPress={onToggleSave}
        >
          <Text style={[styles.buttonText, isSaved && styles.buttonTextActive]}>
            {isSaved ? '★ Saved' : '☆ Save'}
          </Text>
        </Pressable>
        <Pressable testID="article-open-browser" style={[styles.button, styles.buttonPrimary]} onPress={onOpen}>
          <Text style={styles.buttonPrimaryText}>Open in browser</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: t.colors.background },
    container: { padding: t.spacing.md, backgroundColor: t.colors.background },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.background,
      padding: t.spacing.md,
    },
    emptyText: { color: t.colors.text },
    image: { width: '100%', height: 200, borderRadius: t.borderRadius.lg, marginBottom: t.spacing.md },
    title: {
      fontSize: t.typography.sizes.xxl,
      fontWeight: t.typography.weights.bold as TextStyle['fontWeight'],
      color: t.colors.text,
      marginBottom: t.spacing.sm,
    },
    meta: { fontSize: t.typography.sizes.sm, color: t.colors.textSecondary, marginBottom: t.spacing.md },
    body: { fontSize: t.typography.sizes.md, lineHeight: 22, color: t.colors.text, marginBottom: t.spacing.sm },
    actions: { flexDirection: 'row', gap: t.spacing.sm, marginTop: t.spacing.sm },
    button: {
      flex: 1,
      paddingVertical: t.spacing.sm,
      borderRadius: t.borderRadius.md,
      alignItems: 'center',
      backgroundColor: t.colors.surface,
    },
    buttonActive: { backgroundColor: t.colors.success },
    buttonText: { color: t.colors.text, fontWeight: t.typography.weights.semibold as TextStyle['fontWeight'] },
    buttonTextActive: { color: t.colors.background },
    buttonPrimary: { backgroundColor: t.colors.primary },
    buttonPrimaryText: {
      color: t.colors.background,
      fontWeight: t.typography.weights.semibold as TextStyle['fontWeight'],
    },
  });
