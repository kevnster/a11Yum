import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getThemeColors, Theme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useThemeStyles = () => {
  const [theme, setThemeState] = useState<Theme>('system');
  const systemColorScheme = useColorScheme();
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const colors = getThemeColors(isDark);

  return {
    theme,
    isDark,
    colors,
    setTheme,
    toggleTheme,
    // Helper function to get themed styles
    getThemedStyle: (lightStyle: any, darkStyle?: any) => {
      return isDark && darkStyle ? darkStyle : lightStyle;
    },
  };
};
