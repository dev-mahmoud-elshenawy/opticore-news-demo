import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { NEWS_CATEGORIES } from '../../model/news.types';
import { useNewsFilterStore } from '../../store/newsFilterStore';

export function CategoryFilter() {
  const styles = useStyles(createStyles);
  const category = useNewsFilterStore((s) => s.category);
  const setCategory = useNewsFilterStore((s) => s.setCategory);

  return (
    <ScrollView testID="category-scroll" horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      {NEWS_CATEGORIES.map((c) => {
        const active = c === category;
        return (
          <Pressable
            key={c}
            testID={`category-chip-${c}`}
            onPress={() => setCategory(c)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{c}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    row: { flexGrow: 0, paddingVertical: t.spacing.sm },
    chip: {
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.sm,
      borderRadius: t.borderRadius.full,
      backgroundColor: t.colors.surface,
      marginRight: t.spacing.sm,
    },
    chipActive: { backgroundColor: t.colors.primary },
    label: { fontSize: t.typography.sizes.md, color: t.colors.text, textTransform: 'capitalize' },
    labelActive: { color: t.colors.background },
  });
