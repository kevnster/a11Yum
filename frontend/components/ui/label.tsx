import React from 'react';
import { Text, TextStyle } from 'react-native';
import Colors from '../../src/constants/Colors';

interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  nativeID?: string;
}

export const Label: React.FC<LabelProps> = ({ children, style, nativeID }) => {
  return (
    <Text
      nativeID={nativeID}
      style={[
        {
          fontSize: 14,
          fontWeight: '500',
          color: Colors.text.primary,
          marginBottom: 4,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default Label;