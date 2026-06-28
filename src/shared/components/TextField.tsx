import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from 'opticore-react-native';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';

export interface TextFieldProps extends TextInputProps {
  /** Optional label rendered above the input. */
  label?: string;
  /** Optional validation message rendered below the input (turns the border red). */
  error?: string;
}

/**
 * Themed text input — the shared building block for every text field in the app
 * (settings, search, …). Wraps RN `TextInput` with a label, error state, and the
 * theme tokens, and forwards all native `TextInputProps`.
 */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, style, ...rest },
  ref
) {
  const styles = useStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textSecondary}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    wrapper: { gap: t.spacing.xs },
    label: { color: t.colors.textSecondary },
    input: {
      backgroundColor: t.colors.card,
      color: t.colors.text,
      fontSize: t.typography.sizes.md,
      borderRadius: t.borderRadius.md,
      borderWidth: 1,
      borderColor: t.colors.textDisabled,
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.sm,
    },
    inputError: { borderColor: t.colors.error },
    error: { color: t.colors.error, fontSize: 12 },
  });
