import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  style,
  textStyle 
}) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#000',
  },
  secondary: {
    backgroundColor: '#f1f5f9',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  defaultText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#0f172a',
  },
  outlineText: {
    color: '#0f172a',
  },
});