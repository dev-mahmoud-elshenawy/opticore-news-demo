import type { CoreConfig } from 'opticore-react-native';
import { LogLevel } from 'opticore-react-native';

export const opticoreConfig: CoreConfig = {
  api: {
    baseURL: 'https://newsapi.org/v2',
    headers: { 'X-Api-Key': process.env.EXPO_PUBLIC_NEWS_API_KEY ?? '' },
    timeout: 15000,
  },
  logger: { level: LogLevel.INFO },
};
