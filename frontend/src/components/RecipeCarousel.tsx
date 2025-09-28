import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Recipe } from '../types/Recipe';
import RecipeCard from './RecipeCard';
import { useThemeStyles } from '../hooks/useThemeStyles';

interface RecipeCarouselProps {
  recipes: Recipe[];
  onRecipePress: (recipe: Recipe) => void;
  onFavoritePress: (recipeId: string) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
}

const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_PADDING = 0; // No additional padding since RecipeCard has its own margins
const CARD_SPACING = 16; // Space between cards  
const RECIPE_CARD_MARGIN = 16; // RecipeCard's built-in marginHorizontal
const CARD_WIDTH = screenWidth; // Full width, let RecipeCard handle its own margins

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({
  recipes,
  onRecipePress,
  onFavoritePress,
  isLoading = false,
  emptyStateMessage = "No recent recipes yet. Generate your first recipe!",
}) => {
  const { colors } = useThemeStyles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary || '#ff6b35'} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading recent recipes...
        </Text>
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background || 'rgba(0,0,0,0.02)' }]}>
        <Text style={styles.emptyStateIcon}>📝</Text>
        <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
          {emptyStateMessage}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recipes.length === 1 ? (
        // Single recipe - no scrolling needed
        <View style={styles.singleCardContainer}>
          <RecipeCard
            recipe={recipes[0]}
            onPress={() => onRecipePress(recipes[0])}
            onFavoritePress={() => onFavoritePress(recipes[0].id)}
          />
        </View>
      ) : (
        // Multiple recipes - use scrollable carousel
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH}
          snapToAlignment="start"
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          scrollEventThrottle={16}
        >
          {recipes.map((recipe, index) => (
            <View key={`${recipe.id}-${index}`} style={styles.cardContainer}>
              <RecipeCard
                recipe={recipe}
                onPress={() => onRecipePress(recipe)}
                onFavoritePress={() => onFavoritePress(recipe.id)}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Pagination Dots */}
      {recipes.length > 1 && (
        <View style={styles.paginationContainer}>
          {recipes.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentIndex ? (colors.primary || '#ff6b35') : (colors.border || '#e0e0e0'),
                }
              ]}
              onPress={() => scrollToIndex(index)}
              accessibilityLabel={`Go to recipe ${index + 1}`}
            />
          ))}
        </View>
      )}

      {/* Recipe Counter */}
      {recipes.length > 1 && (
        <View style={styles.counterContainer}>
          <Text style={[styles.counterText, { color: colors.textSecondary }]}>
            {currentIndex + 1} of {recipes.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8, // Add top padding to prevent clipping
  },
  scrollContainer: {
    paddingHorizontal: 0,
    alignItems: 'flex-start', // Change to flex-start to prevent clipping
  },
  cardContainer: {
    width: CARD_WIDTH,
    justifyContent: 'flex-start', // Align to top to show title
    alignItems: 'center',
    paddingTop: 4, // Small padding to prevent clipping
  },
  singleCardContainer: {
    paddingHorizontal: 0,
    justifyContent: 'flex-start', // Align to top to show title
    alignItems: 'center',
    paddingTop: 4, // Small padding to prevent clipping
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: RECIPE_CARD_MARGIN,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  counterContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: RECIPE_CARD_MARGIN,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: RECIPE_CARD_MARGIN,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: RECIPE_CARD_MARGIN,
    marginHorizontal: RECIPE_CARD_MARGIN,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default RecipeCarousel;