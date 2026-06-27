import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLifecycle } from 'opticore-react-native/hooks';
import { logger } from 'opticore-react-native';

/**
 * Renderless component: when the app returns to the foreground (OptiCore's
 * `useLifecycle`), invalidate React Query so screens refresh with fresh news.
 */
export function ForegroundRefetch() {
  const appState = useLifecycle();
  const queryClient = useQueryClient();
  const previous = useRef(appState);

  useEffect(() => {
    if (previous.current !== 'active' && appState === 'active') {
      logger.info('App resumed — refetching active queries');
      void queryClient.invalidateQueries();
    }
    previous.current = appState;
  }, [appState, queryClient]);

  return null;
}
