import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { NEWS_CATEGORIES } from '../model/news.types';
import { useNewsFilterStore } from '../store/newsFilterStore';

export function CategoryFilter() {
  const category = useNewsFilterStore((s) => s.category);
  const setCategory = useNewsFilterStore((s) => s.setCategory);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      {NEWS_CATEGORIES.map((c) => {
        const active = c === category;
        return (
          <Pressable
            key={c}
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

const styles = StyleSheet.create({
  row: { flexGrow: 0, paddingVertical: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  chipActive: { backgroundColor: '#111' },
  label: { fontSize: 13, color: '#333', textTransform: 'capitalize' },
  labelActive: { color: '#fff' },
});
