import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistStorage } from 'opticore-react-native';
import type { Preferences } from '../model/preferences';

/** Persisted-store key. */
const STORE_KEY = 'preferences';

interface PreferencesState extends Preferences {
  setPreferences: (prefs: Preferences) => void;
}

/**
 * User preferences — client state persisted across restarts via OptiCore's
 * `createPersistStorage` (same pattern as the saved-articles store).
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      country: 'us',
      pageSize: 30,
      setPreferences: ({ country, pageSize }) => set({ country, pageSize }),
    }),
    {
      name: STORE_KEY,
      storage: createPersistStorage<PreferencesState>(),
      partialize: (state) =>
        ({ country: state.country, pageSize: state.pageSize }) as PreferencesState,
    }
  )
);
