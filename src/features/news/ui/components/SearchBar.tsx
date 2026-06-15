import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';

export function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const styles = useStyles(createStyles);
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Search news…"
      autoCorrect={false}
      autoCapitalize="none"
      clearButtonMode="while-editing"
      returnKeyType="search"
    />
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    input: {
      backgroundColor: t.colors.card,
      borderRadius: t.borderRadius.md,
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.sm,
      fontSize: t.typography.sizes.md,
      color: t.colors.text,
      marginVertical: t.spacing.sm,
    },
  });
