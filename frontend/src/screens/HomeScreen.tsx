import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../css/HomeScreen.styles';
import RecipeCard from '../components/RecipeCard';
import { Recipe, RecipeModel } from '../types/Recipe';

const HomeScreen: React.FC = () => {
  const { user, clearSession } = useAuth0();
  const insets = useSafeAreaInsets();
  
  // Modal state for cross-platform alerts
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | null>(null);
  // Animated modal controls (faster transitions)
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.96)).current;
  
  useEffect(() => {
    if (modalVisible) {
      // quick pop-in
      modalOpacity.setValue(0);
      modalScale.setValue(0.96);
      Animated.parallel([
        Animated.timing(modalOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(modalScale, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [modalVisible]);

  const showModal = (title: string, message: string, onConfirm?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOnConfirm(() => onConfirm || null);
    setModalVisible(true);
  };

  const closeModal = (callConfirm = false) => {
    // animate out quickly then hide
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(modalScale, { toValue: 0.96, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setModalVisible(false);
      if (callConfirm && modalOnConfirm) modalOnConfirm();
      setModalOnConfirm(null);
    });
  };
  
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
    showModal(
      'Create Recipe',
      'Generate a curated, accessibility-friendly version of a recipe.'
    );
  };

  const handleRecipePress = (recipe: Recipe) => {
    showModal(
      recipe.title,
      `Estimated time: ${recipe.getTimeDisplay()}\nDifficulty: ${recipe.difficulty}`
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
    showModal('Quick Action', `${action} feature coming soon!`);
  };

  return (
    <>
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

    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={() => closeModal(false)}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: modalOpacity, transform: [{ scale: modalScale }] },
          ]}
        >
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => closeModal(true)}
              accessible={true}
              accessibilityLabel="Confirm"
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => closeModal(false)}
              accessible={true}
              accessibilityLabel="Cancel"
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
    </>
  );
};

export default HomeScreen;