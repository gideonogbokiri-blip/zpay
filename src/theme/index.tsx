import '@/global.css';

import { createContext, useContext, type PropsWithChildren } from 'react';

import { darkColors, lightColors, type ThemeColors } from './tokens';

export type ThemeVariant = 'dark' | 'light';

export const themes: Record<ThemeVariant, ThemeColors> = {
  dark: darkColors,
  light: lightColors,
};

interface ThemeContextValue {
  variant: ThemeVariant;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  variant: 'dark',
  colors: darkColors,
});

export interface ThemeProviderProps extends PropsWithChildren {
  variant?: ThemeVariant;
}

export function ThemeProvider({ variant = 'dark', children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ variant, colors: themes[variant] }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeColors {
  return useContext(ThemeContext).colors;
}

export function useThemeVariant(): ThemeVariant {
  return useContext(ThemeContext).variant;
}