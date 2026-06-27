import React from 'react';
import { Stack } from 'expo-router';
import { OptiCoreProvider, OptiCoreErrorBoundary, logger } from 'opticore-react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { opticoreConfig } from '@/core/opticore.config';
import { queryClient } from '@/core/query/queryClient';

export default function RootLayout() {
  return (
    // OptiCore (transport + error handling) wraps React Query (server cache).
    <OptiCoreProvider config={opticoreConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Catches render-path errors anywhere in the tree and shows a fallback. */}
        <OptiCoreErrorBoundary onError={(error) => logger.error('Unhandled render error', error as Error)}>
          <Stack>
            {/* Tabs own their headers; the article route sets its own title. */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </OptiCoreErrorBoundary>
      </QueryClientProvider>
    </OptiCoreProvider>
  );
}
