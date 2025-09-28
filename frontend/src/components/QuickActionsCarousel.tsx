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
import { useThemeStyles } from '../hooks/useThemeStyles';
import Colors from '../constants/Colors';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

interface QuickActionsCarouselProps {
  actions: QuickAction[];
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.42; // Two cards visible at once with some padding
const CARD_SPACING = 12;

export const QuickActionsCarousel: React.FC<QuickActionsCarouselProps> = ({ actions }) => {
  const { colors } = useThemeStyles();
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
      `Showing ${actions[index]?.title || 'item'} ${index + 1} of ${actions.length}`
    );
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < actions.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with navigation buttons */}
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: Colors.background.primary },
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            accessible={true}
            accessibilityLabel="Previous actions"
            accessibilityRole="button"
          >
            <Text style={[
              styles.navButtonText,
              { color: colors.text },
              currentIndex === 0 && styles.navButtonTextDisabled,
            ]}>
              ←
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: Colors.background.primary },
              currentIndex === actions.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === actions.length - 1}
            accessible={true}
            accessibilityLabel="Next actions"
            accessibilityRole="button"
          >
            <Text style={[
              styles.navButtonText,
              { color: colors.text },
              currentIndex === actions.length - 1 && styles.navButtonTextDisabled,
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
        accessibilityLabel="Quick actions carousel"
      >
        {actions.map((action, index) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionCard,
              { backgroundColor: Colors.background.primary },
              index === actions.length - 1 && styles.lastCard,
            ]}
            onPress={action.onPress}
            accessible={true}
            accessibilityLabel={`${action.title} button`}
            accessibilityRole="button"
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Page indicators */}
      <View style={styles.indicators}>
        {actions.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              { backgroundColor: Colors.text.secondary },
              index === currentIndex && [styles.indicatorActive, { backgroundColor: Colors.primary.orange }],
            ]}
            onPress={() => scrollToIndex(index)}
            accessible={true}
            accessibilityLabel={`Go to page ${index + 1}`}
            accessibilityRole="button"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Geist-SemiBold',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    opacity: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  actionCard: {
    width: CARD_WIDTH,
    height: 100,
    borderRadius: 12,
    padding: 16,
    marginRight: CARD_SPACING,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastCard: {
    marginRight: 20, // Extra margin for the last card
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Geist-Medium',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.4,
  },
  indicatorActive: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
});