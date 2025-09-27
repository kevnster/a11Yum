// Simple theme management - no complex context providers
export type Theme = 'light' | 'dark' | 'system';

export const getThemeColors = (isDark: boolean) => ({
  // Background colors
  background: isDark ? '#0F172A' : '#F8FAFC', // dark slate vs light gray
  card: isDark ? '#1E293B' : '#FFFFFF', // darker card vs white
  surface: isDark ? '#334155' : '#F1F5F9', // muted surface

  // Text colors
  text: isDark ? '#F8FAFC' : '#0F172A', // light text vs dark text
  textSecondary: isDark ? '#94A3B8' : '#64748B', // muted text
  textMuted: isDark ? '#64748B' : '#94A3B8', // more muted

  // Brand colors (consistent across themes)
  primary: '#FF8C42', // brand orange
  primaryDark: '#E9731C', // darker orange
  secondary: '#8BC34A', // brand green
  secondaryDark: '#689F38', // darker green

  // UI colors
  border: isDark ? '#334155' : '#E2E8F0',
  borderLight: isDark ? '#475569' : '#CBD5E1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Interactive colors
  focus: '#FF8C42',
  hover: isDark ? '#334155' : '#F1F5F9',
  active: isDark ? '#475569' : '#E2E8F0',
});
