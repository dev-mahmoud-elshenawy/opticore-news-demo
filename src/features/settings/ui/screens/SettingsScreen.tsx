import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ThemeMode } from 'opticore-react-native';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { useSettingsScreen } from '../../hooks/useSettingsScreen';

const MODES: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export function SettingsScreen() {
  const styles = useStyles(createStyles);
  const { theme, values, setValue, errors, isValid, submit, saved } = useSettingsScreen();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Theme — useTheme().setMode */}
      <Text style={styles.heading}>Appearance</Text>
      <View style={styles.segment}>
        {MODES.map((m) => {
          const active = theme.mode === m.value;
          return (
            <Pressable
              key={m.value}
              style={[styles.segmentItem, active && styles.segmentItemActive]}
              onPress={() => theme.setMode(m.value)}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Preferences — useFormState + Zod */}
      <Text style={styles.heading}>Feed preferences</Text>

      <Text style={styles.label}>Country (2-letter code)</Text>
      <TextInput
        style={styles.input}
        value={values.country}
        autoCapitalize="none"
        placeholder="us"
        placeholderTextColor={theme.colors.textSecondary}
        onChangeText={(v) => setValue('country', v, { shouldValidate: true })}
      />
      {errors.country && <Text style={styles.error}>{errors.country.message}</Text>}

      <Text style={styles.label}>Search page size</Text>
      <TextInput
        style={styles.input}
        value={values.pageSize}
        keyboardType="number-pad"
        placeholder="30"
        placeholderTextColor={theme.colors.textSecondary}
        onChangeText={(v) => setValue('pageSize', v, { shouldValidate: true })}
      />
      {errors.pageSize && <Text style={styles.error}>{errors.pageSize.message}</Text>}

      {/* Secure storage — storage.secure */}
      <Text style={styles.heading}>API key (stored securely)</Text>
      <Text style={styles.label}>newsapi.org key — Keychain / Keystore</Text>
      <TextInput
        style={styles.input}
        value={values.apiKey}
        secureTextEntry
        autoCapitalize="none"
        placeholder="••••••••"
        placeholderTextColor={theme.colors.textSecondary}
        onChangeText={(v) => setValue('apiKey', v, { shouldValidate: true })}
      />

      <Pressable style={[styles.save, !isValid && styles.saveDisabled]} disabled={!isValid} onPress={() => void submit()}>
        <Text style={styles.saveText}>{saved ? 'Saved ✓' : 'Save'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: t.colors.surface },
    content: { padding: t.spacing.md, gap: t.spacing.sm },
    heading: { fontSize: 18, fontWeight: '700', color: t.colors.text, marginTop: t.spacing.md },
    label: { color: t.colors.textSecondary, marginTop: t.spacing.sm },
    input: {
      backgroundColor: t.colors.card,
      color: t.colors.text,
      borderRadius: t.borderRadius.md,
      borderWidth: 1,
      borderColor: t.colors.textDisabled,
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.sm,
    },
    error: { color: t.colors.error, fontSize: 12 },
    segment: { flexDirection: 'row', gap: t.spacing.sm },
    segmentItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: t.spacing.sm,
      borderRadius: t.borderRadius.md,
      backgroundColor: t.colors.card,
    },
    segmentItemActive: { backgroundColor: t.colors.primary },
    segmentText: { color: t.colors.text },
    segmentTextActive: { color: t.colors.background, fontWeight: '700' },
    save: {
      marginTop: t.spacing.lg,
      backgroundColor: t.colors.primary,
      borderRadius: t.borderRadius.md,
      paddingVertical: t.spacing.md,
      alignItems: 'center',
    },
    saveDisabled: { opacity: 0.5 },
    saveText: { color: t.colors.background, fontWeight: '700' },
  });
