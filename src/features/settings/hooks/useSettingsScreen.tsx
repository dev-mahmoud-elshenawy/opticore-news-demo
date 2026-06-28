import { useState } from 'react';
import { z, api, useFormState, logger, useTheme } from 'opticore-react-native';
import { usePreferencesStore } from '../store/preferencesStore';
import { PAGE_SIZE } from '../model/preferences';

/**
 * Form-input validation (string-typed fields → coerced to the domain `Preferences`
 * on save). A ViewModel concern, not the domain model.
 */
const preferencesForm = z.object({
  country: z.string().length(2, 'Use a 2-letter country code (e.g. us, gb)'),
  pageSize: z
    .string()
    .regex(/^\d+$/, 'Numbers only')
    .refine(
      (v) => Number(v) >= PAGE_SIZE.min && Number(v) <= PAGE_SIZE.max,
      `Between ${PAGE_SIZE.min} and ${PAGE_SIZE.max}`
    ),
});

type PreferencesForm = z.infer<typeof preferencesForm>;

/**
 * ViewModel for the Settings screen (MVVM). Uses OptiCore's forms facade
 * (`field` + `submit`) and theme control (`useTheme().setMode`); persists via
 * `usePreferencesStore`. The View binds only to what this returns.
 */
export function useSettingsScreen() {
  const { mode, setMode } = useTheme();
  const { country, pageSize, setPreferences } = usePreferencesStore();
  const [saved, setSaved] = useState(false);

  const { field, submit, isValid } = useFormState<PreferencesForm>({
    schema: preferencesForm,
    defaultValues: { country, pageSize: String(pageSize) },
    mode: 'onChange',
  });

  const save = () =>
    submit((values) => {
      setPreferences({ country: values.country, pageSize: Number(values.pageSize) });
      // Dynamic global header sent on every request afterwards (no getInstance).
      api.setHeader('X-Preferred-Country', values.country);
      logger.info('Preferences saved', { country: values.country, pageSize: values.pageSize });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });

  return { mode, setMode, field, canSave: isValid, save, saved };
}
