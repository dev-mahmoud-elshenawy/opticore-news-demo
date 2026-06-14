import React from 'react';
import { Stack } from 'expo-router';
import { OptiCoreProvider } from 'opticore-react-native';
import { opticoreConfig } from '@/core/opticore.config';

export default function RootLayout() {
  return (
    <OptiCoreProvider config={opticoreConfig}>
      <Stack />
    </OptiCoreProvider>
  );
}
