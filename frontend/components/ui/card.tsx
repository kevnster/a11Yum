import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import Colors from '../../src/constants/Colors';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.background.accent,
          borderRadius: 12,
          padding: 16,
          shadowColor: Colors.neutral.darkGray,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View
      style={[
        {
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors.neutral.lightGray,
          marginBottom: 12,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[{}, style]} {...props}>
      {children}
    </View>
  );
};

export default Card;