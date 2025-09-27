import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Colors from '../constants/Colors';
import RecipeCard from '../components/RecipeCard';
import { Recipe, RecipeModel } from '../types/Recipe';

const SavedRecipesScreen: React.FC = () => {
  // Mock saved recipes data
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([
    new RecipeModel({
      title: 'Creamy Mushroom Risotto',
      description: 'Rich and creamy Italian risotto with assorted mushrooms and parmesan cheese',
      estimatedTime: 45,
      difficulty: 'Medium',
      dietaryTags: ['Vegetarian', 'Gluten-Free'],
      servings: 4,
      isFavorite: true,
    }),
    new RecipeModel({
      title: 'Quinoa Buddha Bowl',
      description: 'Nutritious bowl with quinoa, roasted vegetables, and tahini dressing',
      estimatedTime: 30,
      difficulty: 'Easy',
      dietaryTags: ['Vegan', 'Gluten-Free', 'High-Protein'],
      servings: 2,
      isFavorite: true,
    }),
    new RecipeModel({
      title: 'Spicy Thai Curry',
      description: 'Aromatic coconut curry with vegetables and your choice of protein',
      estimatedTime: 35,
      difficulty: 'Medium',
      dietaryTags: ['Dairy-Free', 'Spicy'],
      servings: 4,
      isFavorite: true,
    }),
  ]);

  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Get all unique dietary tags from saved recipes
  const allTags = Array.from(
    new Set(savedRecipes.flatMap(recipe => recipe.dietaryTags))
  ).sort();

  // Filter recipes based on selected tag
  const filteredRecipes = filterTag
    ? savedRecipes.filter(recipe => recipe.dietaryTags.includes(filterTag))
    : savedRecipes;

  const handleRecipePress = (recipe: Recipe) => {
    Alert.alert(
      recipe.title,
      `${recipe.description}\n\nTime: ${recipe.getTimeDisplay()}\nDifficulty: ${recipe.difficulty}\nServings: ${recipe.servings}`,
      [
        { text: 'Close' },
        { text: 'View Recipe', onPress: () => console.log('View recipe:', recipe.id) }
      ]
    );
  };

  const handleFavoritePress = (recipeId: string) => {
    setSavedRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      ).filter(recipe => recipe.isFavorite) // Remove from saved if unfavorited
    );
  };

  const handleFilterPress = (tag: string) => {
    setFilterTag(filterTag === tag ? null : tag);
  };

  const hasSavedRecipes = savedRecipes.length > 0;

  return (
    <ScrollView style={styles.container}>
      {hasSavedRecipes ? (
        <>
          {/* Filter Section */}
          <View style={styles.filtersSection}>
            <Text style={styles.filtersTitle}>Filter by dietary preference:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filterTag === null && styles.activeFilterChip
                ]}
                onPress={() => setFilterTag(null)}
              >
                <Text style={[
                  styles.filterChipText,
                  filterTag === null && styles.activeFilterChipText
                ]}>
                  All ({savedRecipes.length})
                </Text>
              </TouchableOpacity>
              
              {allTags.map(tag => {
                const count = savedRecipes.filter(recipe => recipe.dietaryTags.includes(tag)).length;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.filterChip,
                      filterTag === tag && styles.activeFilterChip
                    ]}
                    onPress={() => handleFilterPress(tag)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      filterTag === tag && styles.activeFilterChipText
                    ]}>
                      {tag} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Results Count */}
          <View style={styles.resultsSection}>
            <Text style={styles.resultsText}>
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
              {filterTag && ` with "${filterTag}"`}
            </Text>
          </View>

          {/* Recipes List */}
          <View style={styles.recipesContainer}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => handleRecipePress(recipe)}
                onFavoritePress={() => handleFavoritePress(recipe.id)}
              />
            ))}
          </View>
        </>
      ) : (
        /* Empty State */
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>📖</Text>
            <Text style={styles.emptyStateTitle}>No saved recipes yet</Text>
            <Text style={styles.emptyStateDescription}>
              When you find recipes you love, tap the heart icon to save them here for easy access.
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => {
                Alert.alert('Explore Recipes', 'Feature coming soon! You\'ll be able to browse and discover new recipes.');
              }}
            >
              <Text style={styles.emptyStateButtonText}>Explore Recipes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick Actions for Saved Recipes */}
      {hasSavedRecipes && (
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Recipe Collections</Text>
          <View style={styles.collectionsGrid}>
            <TouchableOpacity
              style={styles.collectionCard}
              onPress={() => Alert.alert('Quick Meals', 'Show recipes under 30 minutes')}
            >
              <Text style={styles.collectionIcon}>⚡</Text>
              <Text style={styles.collectionTitle}>Quick Meals</Text>
              <Text style={styles.collectionCount}>
                {savedRecipes.filter(r => r.estimatedTime <= 30).length} recipes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.collectionCard}
              onPress={() => Alert.alert('Favorites', 'Show your most loved recipes')}
            >
              <Text style={styles.collectionIcon}>❤️</Text>
              <Text style={styles.collectionTitle}>Favorites</Text>
              <Text style={styles.collectionCount}>
                {savedRecipes.filter(r => r.isFavorite).length} recipes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  filtersSection: {
    padding: 20,
    paddingBottom: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  filtersScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.neutral.mediumGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary.orange,
    borderColor: Colors.primary.orange,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  activeFilterChipText: {
    color: Colors.text.inverse,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  recipesContainer: {
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: 400,
  },
  emptyStateCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  collectionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collectionCard: {
    width: '48%',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collectionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});

export default SavedRecipesScreen;
