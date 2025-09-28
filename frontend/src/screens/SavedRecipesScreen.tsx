import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, FlatList, TouchableWithoutFeedback } from 'react-native';
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
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Get all unique dietary tags from saved recipes
  const allTags = Array.from(
    new Set(savedRecipes.flatMap(recipe => recipe.dietaryTags))
  ).sort();

  // Filter recipes based on selected tag and search query
  const filteredRecipes = useMemo(() => {
    let recipes = savedRecipes;
    
    // Apply tag filter
    if (filterTag) {
      recipes = recipes.filter(recipe => recipe.dietaryTags.includes(filterTag));
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      recipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => 
          ingredient.name.toLowerCase().includes(query)
        ) ||
        recipe.dietaryTags.some(tag => 
          tag.toLowerCase().includes(query)
        ) ||
        recipe.accessibilityTags.some(tag => 
          tag.toLowerCase().includes(query)
        )
      );
    }
    
    return recipes;
  }, [savedRecipes, filterTag, searchQuery]);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    savedRecipes.forEach(recipe => {
      // Add matching recipe titles
      if (recipe.title.toLowerCase().includes(query)) {
        suggestions.add(recipe.title);
      }
      
      // Add matching ingredients
      recipe.ingredients.forEach(ingredient => {
        if (ingredient.name.toLowerCase().includes(query)) {
          suggestions.add(ingredient.name);
        }
      });
      
      // Add matching dietary tags
      recipe.dietaryTags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag);
        }
      });
      
      // Add matching accessibility tags
      recipe.accessibilityTags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
  }, [searchQuery, savedRecipes]);

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

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(text.length > 0);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
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
    <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
      <ScrollView style={styles.container}>
      {hasSavedRecipes ? (
        <>
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search recipes, ingredients, or dietary tags..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearchChange}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSearch}
                >
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {searchSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

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
              {searchQuery && ` matching "${searchQuery}"`}
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
    </TouchableWithoutFeedback>
  );
};

export default SavedRecipesScreen;
