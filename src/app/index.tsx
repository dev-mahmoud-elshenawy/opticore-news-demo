import { Redirect } from 'expo-router';
import { Routes } from '@/core/navigation/routes';

export default function Index() {
  return <Redirect href={Routes.headlines} />;
}
