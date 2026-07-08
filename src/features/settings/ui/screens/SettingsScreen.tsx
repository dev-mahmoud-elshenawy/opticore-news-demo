import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ThemeMode } from 'opticore-react-native';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';
import { TextField } from '@/shared/components/TextField';
import { useSettingsScreen } from '../../hooks/useSettingsScreen';

const MODES: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export function SettingsScreen() {
  const styles = useStyles(createStyles);
  const { mode, setMode, field, canSave, saved, save } = useSettingsScreen();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Appearance — theme mode */}
      <Text style={styles.heading}>Appearance</Text>
      <View style={styles.segment}>
        {MODES.map((m) => {
          const active = mode === m.value;
          return (
            <Pressable
              key={m.value}
              testID={`theme-mode-${m.value}`}
              style={[styles.segmentItem, active && styles.segmentItemActive]}
              onPress={() => setMode(m.value)}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Feed preferences — validated form via the shared TextField */}
      <Text style={styles.heading}>Feed preferences</Text>

      <TextField testID="settings-country" label="Country (2-letter code)" autoCapitalize="none" placeholder="us" {...field('country')} />

      <TextField testID="settings-pagesize" label="Search page size" keyboardType="number-pad" placeholder="30" {...field('pageSize')} />

      <Pressable testID="settings-save" style={[styles.save, !canSave && styles.saveDisabled]} disabled={!canSave} onPress={() => void save()}>
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
