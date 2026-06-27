import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useConnectivity } from 'opticore-react-native/hooks';
import { useStyles, type AppTheme } from '@/shared/theme/useStyles';

/**
 * Global "you're offline" banner driven by OptiCore's `useConnectivity` hook.
 * Renders nothing while connected (or unknown).
 */
export function OfflineBanner() {
  const { isConnected } = useConnectivity();
  const styles = useStyles(createStyles);

  if (isConnected !== false) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You&apos;re offline — content may be out of date</Text>
    </View>
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    banner: { backgroundColor: t.colors.error, paddingVertical: t.spacing.xs, paddingHorizontal: t.spacing.md },
    text: { color: t.colors.background, textAlign: 'center', fontSize: 12 },
  });
