import { useState } from 'react';
import { z, useFormState, logger, useTheme } from 'opticore-react-native';
import { usePreferencesStore } from '../store/preferencesStore';
import { PAGE_SIZE } from '../model/preferences';

/**
 * Form-input validation (string-typed fields → coerced to the domain `Preferences`
 * on save). This is a ViewModel concern, not the domain model.
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
 * ViewModel for the Settings screen (MVVM). The screen (View) binds only to what
 * this hook returns and never touches React Hook Form, the theme manager, or the
 * store directly. Bundles two OptiCore strengths — Forms (`useFormState` + Zod)
 * and theme control (`useTheme().setMode`) — and persists via `usePreferencesStore`.
 */
export function useSettingsScreen() {
  const { mode, setMode } = useTheme();
  const { country, pageSize, setPreferences } = usePreferencesStore();
  const [saved, setSaved] = useState(false);

  const { handleSubmit, setValue, watch, errors, isValid } = useFormState<PreferencesForm>({
    schema: preferencesForm,
    defaultValues: { country, pageSize: String(pageSize) },
    mode: 'onChange',
  });

  // `handleSubmit(onValid)` validates and runs onValid immediately, so call it on press.
  const submit = () =>
    handleSubmit((values) => {
      setPreferences({ country: values.country, pageSize: Number(values.pageSize) });
      logger.info('Preferences saved', { country: values.country, pageSize: values.pageSize });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });

  return {
    // theme
    mode,
    setMode,
    // form fields + validation (RHF specifics hidden behind a simple interface)
    fields: { country: watch('country'), pageSize: watch('pageSize') },
    errors: { country: errors.country?.message, pageSize: errors.pageSize?.message },
    setField: (name: keyof PreferencesForm, value: string) =>
      setValue(name, value, { shouldValidate: true }),
    canSave: isValid,
    saved,
    submit,
  };
}
