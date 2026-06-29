import { createClientStore } from 'opticore-react-native';
import type { Preferences } from '../model/preferences';

/** Persisted-store key. */
const STORE_KEY = 'preferences';

interface PreferencesState extends Preferences {
  setPreferences: (prefs: Preferences) => void;
}

/**
 * User preferences — client state persisted across restarts via OptiCore's
 * `createClientStore` (same pattern as the saved-articles store).
 */
export const usePreferencesStore = createClientStore<PreferencesState>(
  {
    name: STORE_KEY,
    persist: true,
    partialize: (state) => ({ country: state.country, pageSize: state.pageSize }),
  },
  (set) => ({
    country: 'us',
    pageSize: 30,
    setPreferences: ({ country, pageSize }) => set({ country, pageSize }),
  })
);
