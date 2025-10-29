export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export const ICON_COLORS = {
  primary: '#d4af37',
  secondary: '#1a1a1a',
  muted: '#666666',
  light: '#999999',
  success: '#27ae60',
  error: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  white: '#ffffff',
} as const;

export type IconColor = keyof typeof ICON_COLORS;
