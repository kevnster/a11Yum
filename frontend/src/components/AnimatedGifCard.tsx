import React, { useState } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '../hooks/useThemeStyles';

interface AnimatedGifCardProps {
  gifSource: any; // require('../assets/your-gif.gif')
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  style?: any;
}

const AnimatedGifCard: React.FC<AnimatedGifCardProps> = ({
  gifSource,
  title,
  description,
  width = 200,
  height = 200,
  style
}) => {
  const { colors } = useThemeStyles();
  const [gifLoaded, setGifLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
      )}
      
      <View style={[styles.gifContainer, { width, height }]}>
        {!hasError ? (
          <>
            <Image 
              source={gifSource}
              style={[styles.gif, { width, height }]}
              resizeMode="contain"
              onLoad={() => setGifLoaded(true)}
              onError={(error) => {
                console.log('GIF load error:', error);
                setHasError(true);
              }}
            />
            {!gifLoaded && (
              <ActivityIndicator 
                style={styles.loader}
                size="small"
                color={colors.primary}
              />
            )}
          </>
        ) : (
          <View style={[styles.errorContainer, { width, height }]}>
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>
              🎬
            </Text>
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>
              GIF not available
            </Text>
          </View>
        )}
      </View>

      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Geist-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  gifContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    borderRadius: 8,
  },
  loader: {
    position: 'absolute',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Geist',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Geist',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default AnimatedGifCard;