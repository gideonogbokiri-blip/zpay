import { Platform, StyleSheet } from 'react-native';

export const palette = {
  black: '#000000',
  zpayBackground: '#0a0f14',
  zpaySurface: '#111820',
  zpaySurfaceElevated: '#151e28',
  zpaySurfaceRaised: '#121a23',
  zpayAccent: '#00e5ff',
  zpayAccentDark: '#00b8cc',
  zpayBrandBlue: '#9BB8F5',
  zpayBrandLavender: '#B8B0F2',
  white: '#FFFFFF',
  gray50: '#F5F6F8',
  gray100: '#EAECEF',
  gray200: '#D6D9DD',
  gray400: '#8b9aab',
  gray500: '#5A6066',
  gray600: '#3A3F43',
  gray700: '#2A2E31',
  gray800: '#1F2325',
  gray900: '#141718',
  green: '#00c853',
  greenDark: '#00a843',
  red: '#ff4d6a',
  redDark: '#cc3d55',
  amber: '#FFB020',
  infoBlue: '#4DABF7',
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
} as const;

export const Radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

export const IconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 44,
} as const;

export const TouchTarget = {
  min: 44,
  standard: 48,
  large: 56,
} as const;

export const BorderWidth = {
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
  medium: 2,
} as const;

export const MaxContentWidth = 800;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

export const FontSize = {
  caption: 12,
  small: 14,
  body: 16,
  bodyLarge: 18,
  title: 22,
  heading: 26,
  display: 34,
  amount: 36,
} as const;

export const LineHeight = {
  caption: 16,
  small: 20,
  body: 24,
  bodyLarge: 26,
  title: 28,
  heading: 34,
  display: 40,
  amount: 44,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const FontFamily = Platform.select({
  ios: {
    sans: 'System',
    mono: 'Menlo',
  },
  android: {
    sans: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'Inter, System, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'monospace',
  },
}) as { sans: string; mono: string };

export const Shadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
});

export type ThemeColor =
  | 'background'
  | 'surface'
  | 'surfaceElevated'
  | 'input'
  | 'accent'
  | 'accentSoft'
  | 'brand'
  | 'text'
  | 'textSecondary'
  | 'textMuted'
  | 'success'
  | 'successSoft'
  | 'danger'
  | 'dangerSoft'
  | 'warning'
  | 'info'
  | 'border'
  | 'tabInactive';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  input: string;
  accent: string;
  accentSoft: string;
  brand: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  info: string;
  border: string;
  tabInactive: string;
}

export const darkColors: ThemeColors = {
  background: palette.zpayBackground,
  surface: palette.zpaySurface,
  surfaceElevated: palette.zpaySurfaceElevated,
  input: palette.gray800,
  accent: palette.zpayAccent,
  accentSoft: 'rgba(0, 229, 255, 0.15)',
  brand: palette.zpayBrandBlue,
  text: palette.white,
  textSecondary: palette.gray100,
  textMuted: palette.gray400,
  success: palette.green,
  successSoft: 'rgba(0, 200, 83, 0.15)',
  danger: palette.red,
  dangerSoft: 'rgba(255, 77, 106, 0.15)',
  warning: palette.amber,
  info: palette.infoBlue,
  border: 'rgba(255, 255, 255, 0.06)',
  tabInactive: palette.gray400,
};

export const lightColors: ThemeColors = {
  background: palette.white,
  surface: palette.gray50,
  surfaceElevated: palette.white,
  input: palette.gray50,
  accent: palette.zpayAccentDark,
  accentSoft: 'rgba(0, 184, 204, 0.14)',
  brand: palette.zpayBrandBlue,
  text: palette.gray900,
  textSecondary: palette.gray500,
  textMuted: palette.gray400,
  success: palette.greenDark,
  successSoft: 'rgba(0, 168, 67, 0.12)',
  danger: palette.redDark,
  dangerSoft: 'rgba(204, 61, 85, 0.10)',
  warning: palette.amber,
  info: palette.infoBlue,
  border: 'rgba(20, 23, 24, 0.10)',
  tabInactive: palette.gray400,
};