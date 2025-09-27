import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import RecipeCard from '../components/RecipeCard';
import { Recipe, RecipeModel } from '../types/Recipe';

const HomeScreen: React.FC = () => {
  const { user, clearSession } = useAuth0();
  const insets = useSafeAreaInsets();
  
  // Mock data - replace with actual recipe storage later
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([
    // Example recipe for testing
    // new RecipeModel({
    //   title: 'Easy Pasta Carbonara',
    //   description: 'A classic Italian pasta dish with eggs, cheese, and pancetta',
    //   estimatedTime: 25,
    //   difficulty: 'Easy',
    //   dietaryTags: ['Vegetarian-Friendly'],
    //   servings: 4,
    //   isFavorite: true,
    // })
  ]);

  const hasGeneratedRecipes = recentRecipes.length > 0;

  const handleCreateRecipe = () => {
    Alert.alert(
      'Create Recipe',
      'Recipe generation coming soon! This will take you to an AI-powered recipe creator.',
      [{ text: 'OK' }]
    );
  };

  const handleRecipePress = (recipe: Recipe) => {
    Alert.alert(
      recipe.title,
      `Estimated time: ${recipe.getTimeDisplay()}\nDifficulty: ${recipe.difficulty}`,
      [{ text: 'Close' }]
    );
  };

  const handleFavoritePress = (recipeId: string) => {
    setRecentRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `${action} feature coming soon!`);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name?.split(' ')[0] || 'Chef'}! 👋
        </Text>
        <Text style={styles.welcomeSubtext}>
          What delicious creation are we making today?
        </Text>
      </View>

      {/* Main Action Section */}
      {!hasGeneratedRecipes ? (
        <View style={styles.emptyStateSection}>
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>🍳</Text>
            <Text style={styles.emptyStateTitle}>Ready to cook something amazing?</Text>
            <Text style={styles.emptyStateDescription}>
              Let's create your first personalized recipe based on your preferences and dietary needs.
            </Text>
            <TouchableOpacity 
              style={styles.createRecipeButton}
              onPress={handleCreateRecipe}
            >
              <Text style={styles.createRecipeButtonText}>✨ Create Your First Recipe</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Recipes</Text>
            <TouchableOpacity onPress={handleCreateRecipe}>
              <Text style={styles.createNewText}>+ Create New</Text>
            </TouchableOpacity>
          </View>
          
          {recentRecipes.slice(0, 3).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => handleRecipePress(recipe)}
              onFavoritePress={() => handleFavoritePress(recipe.id)}
            />
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('Random Recipe')}
          >
            <Text style={styles.quickActionIcon}>🎲</Text>
            <Text style={styles.quickActionText}>Random Recipe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('Meal Planner')}
          >
            <Text style={styles.quickActionIcon}>📅</Text>
            <Text style={styles.quickActionText}>Meal Planner</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('Grocery List')}
          >
            <Text style={styles.quickActionIcon}>🛒</Text>
            <Text style={styles.quickActionText}>Grocery List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('Kitchen Timer')}
          >
            <Text style={styles.quickActionIcon}>⏰</Text>
            <Text style={styles.quickActionText}>Kitchen Timer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Tip */}
      <View style={styles.tipSection}>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Today's Cooking Tip</Text>
            <Text style={styles.tipText}>
              Always taste as you go! Seasoning throughout the cooking process creates more balanced flavors than adding everything at the end.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  welcomeSection: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  emptyStateSection: {
    padding: 20,
  },
  emptyStateCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 24,
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
  createRecipeButton: {
    backgroundColor: Colors.primary.orange,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: Colors.primary.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createRecipeButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  createNewText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.orange,
  },
  quickActionsSection: {
    padding: 20,
    paddingTop: 10,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  tipSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  tipCard: {
    backgroundColor: Colors.background.accent,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.orange,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});

export default HomeScreen;
