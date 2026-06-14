import React from 'react';
import { Stack } from 'expo-router';
import { NewsListScreen } from '../../src/features/news';

export default function NewsIndexRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Top Headlines' }} />
      <NewsListScreen />
    </>
  );
}
