import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import Colors from '../constants/Colors';

interface FeatureAction {
  id: string;
  title: string;
  icon: string;
  description?: string;
  onPress: () => void;
}

interface FeaturesCarouselProps {
  features: FeatureAction[];
  showDescriptions?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85; // Larger cards for landing page
const CARD_SPACING = 16;

export const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({ 
  features, 
  showDescriptions = false 
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    const x = index * (CARD_WIDTH + CARD_SPACING);
    scrollViewRef.current?.scrollTo({ x, animated: true });
    setCurrentIndex(index);
    
    // Announce for accessibility
    AccessibilityInfo.announceForAccessibility(
      `Showing ${features[index]?.title || 'feature'} ${index + 1} of ${features.length}`
    );
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with navigation buttons */}
      <View style={styles.header}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            accessible={true}
            accessibilityLabel="Previous feature"
            accessibilityRole="button"
          >
            <Text style={[
              styles.navButtonText,
              currentIndex === 0 && styles.navButtonTextDisabled,
            ]}>
              ←
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === features.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === features.length - 1}
            accessible={true}
            accessibilityLabel="Next feature"
            accessibilityRole="button"
          >
            <Text style={[
              styles.navButtonText,
              currentIndex === features.length - 1 && styles.navButtonTextDisabled,
            ]}>
              →
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        accessible={true}
        accessibilityLabel="Features carousel"
      >
        {features.map((feature, index) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              styles.featureCard,
              index === features.length - 1 && styles.lastCard,
            ]}
            onPress={feature.onPress}
            accessible={true}
            accessibilityLabel={`${feature.title} feature${feature.description ? `: ${feature.description}` : ''}`}
            accessibilityRole="button"
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>
              {feature.title}
            </Text>
            {showDescriptions && feature.description && (
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Page indicators */}
      <View style={styles.indicators}>
        {features.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.indicatorActive,
            ]}
            onPress={() => scrollToIndex(index)}
            accessible={true}
            accessibilityLabel={`Go to ${features[index]?.title} feature`}
            accessibilityRole="button"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  navButtonTextDisabled: {
    opacity: 0.5,
  },
  scrollContent: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
  },
  featureCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 24,
    marginRight: CARD_SPACING,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lastCard: {
    marginRight: (screenWidth - CARD_WIDTH) / 2,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text.primary,
    fontFamily: 'Geist-SemiBold',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text.secondary,
    fontFamily: 'Geist',
    lineHeight: 22,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.secondary,
    opacity: 0.4,
  },
  indicatorActive: {
    backgroundColor: Colors.primary.orange,
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
});