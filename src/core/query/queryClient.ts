import { createQueryClient } from 'opticore-react-native';

/**
 * App-wide React Query client.
 *
 * `createQueryClient` (from OptiCore) bakes in error-aware retry (no retries on
 * actionable 4xx `ApiError`s) and a 5-minute `staleTime`. Anything you pass here
 * deep-merges on top and wins — so this is where you tune React Query per app.
 */
export const queryClient = createQueryClient({
  defaultOptions: {
    queries: {
      // --- app overrides (edit freely) ---
      gcTime: 10 * 60 * 1000, // keep unused data cached for 10 min
      refetchOnWindowFocus: false, // mobile: don't refetch on app refocus
      // staleTime / retry are inherited from the OptiCore defaults unless set here
    },
  },
});
