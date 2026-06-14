import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function ArticleDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: 'Article' }} />
      <Text style={styles.url}>{id}</Text>
      <Pressable style={styles.button} onPress={() => id && Linking.openURL(id)}>
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
