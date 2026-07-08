import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { TextField } from '@/shared/components/TextField';

export function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.wrapper}>
      <TextField
        testID="search-input"
        value={value}
        onChangeText={onChangeText}
        placeholder="Search news…"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </View>
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    wrapper: { marginVertical: t.spacing.sm },
  });
