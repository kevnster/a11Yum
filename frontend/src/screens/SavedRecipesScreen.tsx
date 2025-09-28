import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import RecipeCard from '../components/RecipeCard';
import styles from '../css/SavedRecipesScreen.styles';
import { Recipe, RecipeModel } from '../types/Recipe';
import { useSavedRecipes } from '../contexts/SavedRecipesContext';
import { useNavigation } from '../contexts/NavigationContext';
import RecipeDetailScreen from './RecipeDetailScreen';

const SavedRecipesScreen: React.FC = () => {
  const { savedRecipes, toggleFavorite, isLoading } = useSavedRecipes();
  const { setRecipeDetailState, setGoBackFunction } = useNavigation();

  // Recipe navigation state
  const [currentRecipeUrl, setCurrentRecipeUrl] = useState<string | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
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
    console.log('🔄 Navigating to saved recipe:', recipe.title);
    setCurrentRecipe(recipe);
    setCurrentRecipeUrl(`saved:${recipe.id}`);
    setRecipeDetailState(true, recipe.title, 'SavedRecipes');
    setGoBackFunction(handleBackToSaved);
  };

  const handleBackToSaved = () => {
    setCurrentRecipeUrl(null);
    setCurrentRecipe(null);
    setRecipeDetailState(false);
    setGoBackFunction(null);
  };

    const handleFavoritePress = (recipeId: string) => {
    const recipe = savedRecipes.find(r => r.id === recipeId);
    if (recipe) {
      Alert.alert(
        'Remove from Saved',
        'Are you sure you want to remove this recipe from your saved recipes?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              toggleFavorite(recipe);
            },
          },
        ]
      );
    }
  };

  const handleFilterPress = (tag: string) => {
    setFilterTag(filterTag === tag ? null : tag);
  };

  const hasSavedRecipes = savedRecipes.length > 0;

  // If we have a recipe selected, show the RecipeDetailScreen
  if (currentRecipeUrl && currentRecipe) {
    return (
      <RecipeDetailScreen 
        route={{ params: { url: currentRecipeUrl, recipe: currentRecipe } }} 
        navigation={{ goBack: handleBackToSaved }}
      />
    );
  }

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
      ) : isLoading ? (
        /* Loading State */
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={Colors.primary.orange} />
          <Text style={[styles.emptyStateTitle, { marginTop: 16 }]}>Loading your saved recipes...</Text>
        </View>
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

export default SavedRecipesScreen;
