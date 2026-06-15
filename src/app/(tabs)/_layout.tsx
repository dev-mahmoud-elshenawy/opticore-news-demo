import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { TABS } from '@/core/navigation/tabs';

export default function TabsLayout() {
  return (
    <Tabs>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>{tab.icon}</Text>,
          }}
        />
      ))}
    </Tabs>
  );
}
