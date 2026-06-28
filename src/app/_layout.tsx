import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OptiCoreProvider, OptiCoreErrorBoundary, logger, useTheme } from 'opticore-react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { opticoreConfig } from '@/core/opticore.config';
import { queryClient } from '@/core/query/queryClient';
import { OfflineBanner } from '@/shared/components/OfflineBanner';

export default function RootLayout() {
  return (
    // OptiCore (transport + error handling) wraps React Query (server cache).
    <OptiCoreProvider config={opticoreConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Catches render-path errors anywhere in the tree and shows a fallback. */}
        <OptiCoreErrorBoundary onError={(error) => logger.error('Unhandled render error', error as Error)}>
          <AppShell />
        </OptiCoreErrorBoundary>
      </QueryClientProvider>
    </OptiCoreProvider>
  );
}

function AppShell() {
  const { colors, mode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        style={mode === 'dark' ? 'light' : 'dark'}
        backgroundColor={colors.card}
      />
      {/* Global offline banner (useConnectivity). */}
      <OfflineBanner />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
        }}
      >
        {/* Tabs own their headers; the article route sets its own title. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
