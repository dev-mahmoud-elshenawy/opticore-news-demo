import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function ArticleDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // The list encodes the article URL before passing it as the route param.
  const url = id ? decodeURIComponent(id) : undefined;

  const openInBrowser = () => {
    if (!url) return;
    // openURL rejects on malformed/unhandleable URLs — swallow rather than crash.
    Linking.openURL(url).catch(() => undefined);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Article' }} />
      <Text style={styles.url}>{url}</Text>
      <Pressable style={styles.button} onPress={openInBrowser}>
        <Text style={styles.buttonText}>Open in browser</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  url: { fontSize: 14, color: '#333', marginBottom: 16 },
  button: { backgroundColor: '#111', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff' },
});
