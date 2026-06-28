import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { articleKeyExtractor, LIST_PERF_PROPS } from '@/shared/components/article';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { useSavedScreen } from '../../hooks/useSavedScreen';

export function SavedScreen() {
  const styles = useStyles(createStyles);
  const { items, renderItem } = useSavedScreen();

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
