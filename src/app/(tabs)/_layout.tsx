import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from 'opticore-react-native';
import { TABS } from '@/core/navigation/tabs';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.surface,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarButtonTestID: `tab-${tab.name}`,
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>{tab.icon}</Text>,
          }}
        />
      ))}
    </Tabs>
  );
}
