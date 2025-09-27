export const Colors = {
  // Primary colors
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  
  // Secondary colors
  secondary: '#FF6F00',
  secondaryLight: '#FF9800',
  secondaryDark: '#E65100',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#666666',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#666666',
  textDisabled: '#9E9E9E',
} as const;

export type ColorKey = keyof typeof Colors;
