import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  style?: any;
  trackColor?: string;
  fillColor?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  style,
  trackColor = '#E5E5E5',
  fillColor = '#FF6B35',
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor }, style]}>
      <View
        style={[
          styles.progressFill,
          {
            backgroundColor: fillColor,
            width: `${clampedValue}%`,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
});

export default Progress;