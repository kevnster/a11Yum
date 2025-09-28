import React from 'react';
import { Switch as RNSwitch, SwitchProps } from 'react-native';
import Colors from '../../src/constants/Colors';

interface CustomSwitchProps extends Omit<SwitchProps, 'value' | 'onValueChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

export const Switch: React.FC<CustomSwitchProps> = ({ 
  checked, 
  onCheckedChange, 
  value, 
  onValueChange,
  ...props 
}) => {
  const isOn = checked !== undefined ? checked : value;
  const handleChange = (newValue: boolean) => {
    onCheckedChange?.(newValue);
    onValueChange?.(newValue);
  };

  return (
    <RNSwitch
      value={isOn}
      onValueChange={handleChange}
      trackColor={{
        false: Colors.neutral.lightGray,
        true: Colors.primary.green,
      }}
      thumbColor={isOn ? Colors.background.primary : Colors.neutral.mediumGray}
      ios_backgroundColor={Colors.neutral.lightGray}
      {...props}
    />
  );
};

export default Switch;