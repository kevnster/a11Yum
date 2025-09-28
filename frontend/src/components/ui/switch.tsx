import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native';

interface SwitchProps extends RNSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onCheckedChange, 
  value, 
  onValueChange,
  ...props 
}) => {
  const isControlled = checked !== undefined;
  const switchValue = isControlled ? checked : value;
  const handleValueChange = isControlled ? onCheckedChange : onValueChange;

  return (
    <RNSwitch
      value={switchValue}
      onValueChange={handleValueChange}
      trackColor={{ false: '#e2e8f0', true: '#10b981' }}
      thumbColor={switchValue ? '#ffffff' : '#f3f4f6'}
      ios_backgroundColor="#e2e8f0"
      {...props}
    />
  );
};