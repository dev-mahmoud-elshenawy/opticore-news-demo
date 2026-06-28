import type { CoreConfig } from 'opticore-react-native';
import { LogLevel } from 'opticore-react-native';
import { NEWS_API_KEY } from '@/shared/constants/env';

export const opticoreConfig: CoreConfig = {
  api: {
    baseURL: 'https://newsapi.org/v2',
    headers: { 'X-Api-Key': NEWS_API_KEY },
    timeout: 15000,
    // Errors are handled automatically: OptiCore throws an ApiError on any
    // non-2xx response (with the server's message), so repositories just map
    // the successful body to domain data.
  },
  logger: { level: LogLevel.INFO },
};
