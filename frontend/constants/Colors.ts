const palette = {
  navy900: '#0B1120',
  navy800: '#111827',
  navy700: '#1A2235',
  navy600: '#243047',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  purple500: '#8B5CF6',
  green500: '#22C55E',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: 'rgba(255, 255, 255, 0.08)',
  borderFocus: '#3B82F6',
  error: '#EF4444',
  errorBg: 'rgba(239, 68, 68, 0.12)',
} as const;

export default {
  light: {
    text: palette.navy900,
    background: '#F8FAFC',
    tint: palette.blue500,
    tabIconDefault: palette.textMuted,
    tabIconSelected: palette.blue500,
    ...palette,
  },
  dark: {
    text: palette.textPrimary,
    background: palette.navy900,
    tint: palette.blue500,
    tabIconDefault: palette.textMuted,
    tabIconSelected: palette.blue500,
    ...palette,
  },
};

export type ColorScheme = 'light' | 'dark';
