import { useEffect, useState } from 'react';
import { z, useFormState, storage, logger, useTheme } from 'opticore-react-native';
import { usePreferencesStore } from '../store/preferencesStore';

/** Secure-storage key for the newsapi key. */
const API_KEY_STORAGE = 'news_api_key';

/** Zod schema — showcases length, regex, and refine validation. */
const schema = z.object({
  country: z.string().length(2, 'Use a 2-letter country code (e.g. us, gb)'),
  pageSize: z
    .string()
    .regex(/^\d+$/, 'Numbers only')
    .refine((v) => Number(v) >= 1 && Number(v) <= 100, 'Between 1 and 100'),
  apiKey: z.string().optional(),
});

type PreferencesForm = z.infer<typeof schema>;

/**
 * Settings screen logic — bundles three OptiCore strengths:
 * - Forms: `useFormState` + Zod validation
 * - Secure storage: the API key is read/written via `storage.secure` (Keychain/Keystore)
 * - Theme control: `useTheme().setMode` for the light/dark/system toggle
 */
export function useSettingsScreen() {
  const theme = useTheme();
  const { country, pageSize, setPreferences } = usePreferencesStore();
  const [saved, setSaved] = useState(false);

  const { handleSubmit, setValue, watch, errors, isValid } = useFormState<PreferencesForm>({
    schema,
    defaultValues: { country, pageSize: String(pageSize), apiKey: '' },
    mode: 'onChange',
  });

  // Load the stored API key from secure storage into the form on mount.
  useEffect(() => {
    storage.secure.get<string>(API_KEY_STORAGE).then((key) => {
      if (key) setValue('apiKey', key);
    });
  }, [setValue]);

  // `handleSubmit(onValid)` validates and runs onValid immediately, so call it
  // on press (not at render).
  const submit = () =>
    handleSubmit(async (values) => {
      setPreferences({ country: values.country, pageSize: Number(values.pageSize) });
      if (values.apiKey) {
        await storage.secure.set(API_KEY_STORAGE, values.apiKey);
      }
      logger.info('Preferences saved', { country: values.country, pageSize: values.pageSize });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });

  return {
    theme,
    values: {
      country: watch('country'),
      pageSize: watch('pageSize'),
      apiKey: watch('apiKey') ?? '',
    },
    setValue,
    errors,
    isValid,
    submit,
    saved,
  };
}
