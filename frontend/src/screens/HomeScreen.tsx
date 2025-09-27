import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../css/HomeScreen.styles';
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



export default HomeScreen;
