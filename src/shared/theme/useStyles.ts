import { useMemo } from 'react';
import { useTheme, type ThemeHookReturn } from 'opticore-react-native';

/** Theme tokens passed to style factories (colors, spacing, typography, borderRadius). */
export type AppTheme = ThemeHookReturn;

/**
 * Build a memoized StyleSheet from the core theme tokens.
 *
 * Components define a token-driven `createStyles(theme)` factory (no hardcoded
 * colors/spacing) and call `useStyles(createStyles)`. Styles recompute only when
 * the theme changes, so light/dark switches are automatic.
 */
export function useStyles<T>(factory: (theme: AppTheme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme]);
}
