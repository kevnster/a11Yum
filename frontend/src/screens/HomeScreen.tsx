import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../css/HomeScreen.styles';
import RecipeCard from '../components/RecipeCard';
import { CreateRecipeButton } from '../components/RecipeModal';
import LLMInput from '../components/LLMInput';
import { Recipe, RecipeModel } from '../types/Recipe';
import { useThemeStyles } from '../hooks/useThemeStyles';
import RecipeDetailScreen from './RecipeDetailScreen';
import { useAuth0Profile } from '../services/Auth0Service';
import { useAuth0Management } from '../services/Auth0ManagementService';
import GeminiService from '../services/GeminiService';
import { useSavedRecipes } from '../contexts/SavedRecipesContext';

const HomeScreen: React.FC = () => {
  const { user, clearSession } = useAuth0();
  const { colors } = useThemeStyles();
  const insets = useSafeAreaInsets();
  const { getUserProfile } = useAuth0Profile();
  const { getUserProfile: getAuth0Profile } = useAuth0Management();
  const { savedRecipes: contextSavedRecipes, toggleFavorite } = useSavedRecipes();
  
  // Recipe navigation state
  const [currentRecipeUrl, setCurrentRecipeUrl] = useState<string | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [isProcessingRecipe, setIsProcessingRecipe] = useState(false);
  
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


  // Fetch user profile to get firstName
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        
        try {
          // Try to get profile from Auth0 Management API
          const auth0Profile = await getAuth0Profile();
          console.log('📋 Retrieved profile from Auth0 Management service:', auth0Profile);
          
          if (auth0Profile?.firstName && auth0Profile.firstName.trim().length > 0) {
            console.log('✅ Found firstName in Management service:', auth0Profile.firstName);
            setUserFirstName(auth0Profile.firstName);
            return;
          }
        } catch (error) {
          console.log('❌ Error fetching from Management service:', error);
        }
        
        // Try different ways to access user_metadata
        console.log('🔍 Checking various user_metadata access patterns...');
        console.log('🔍 Full user object structure:', JSON.stringify(user, null, 2));
        console.log('🔍 Available user properties:', Object.keys(user));
        console.log('🔍 user.user_metadata exists?', !!user.user_metadata);
        
        // Method 1: Direct user_metadata
        if (user.user_metadata?.firstName) {
          console.log('✅ Found firstName in user.user_metadata:', user.user_metadata.firstName);
          setUserFirstName(user.user_metadata.firstName);
          return;
        }
        
        // Method 2: Check if it's under a different property
        if (user['https://myapp.example.com/user_metadata']?.firstName) {
          console.log('✅ Found firstName in custom claim:', user['https://myapp.example.com/user_metadata'].firstName);
          setUserFirstName(user['https://myapp.example.com/user_metadata'].firstName);
          return;
        }
        
        // Method 3: Check raw user object for any firstName
        if (user.firstName) {
          console.log('✅ Found firstName directly in user object:', user.firstName);
          setUserFirstName(user.firstName);
          return;
        }
        
        // Fallback to Auth0 given_name (avoid name/nickname which might be email)
        if (user?.given_name && !user.given_name.includes('@')) {
          console.log('✅ Using Auth0 given_name:', user.given_name);
          setUserFirstName(user.given_name);
          return;
        }
        
        console.log('⚠️ No valid firstName found in user object');
        
        // Final attempt: Try to extract from email or name if it looks like a real name
        if (user.given_name && !user.given_name.includes('@') && user.given_name !== user.email) {
          console.log('✅ Using Auth0 given_name as fallback:', user.given_name);
          setUserFirstName(user.given_name);
          return;
        }
        
        // Extract potential first name from email username (before @)
        if (user.email && user.email.includes('@')) {
          const emailUsername = user.email.split('@')[0];
          // Only use if it doesn't look like random characters
          if (emailUsername.length >= 2 && !emailUsername.includes('.') && isNaN(Number(emailUsername))) {
            console.log('✅ Using email username as firstName:', emailUsername);
            setUserFirstName(emailUsername);
            return;
          }
        }
        
        console.log('⚠️ No valid firstName found, using default');
        setUserFirstName(null);
      }
    };

    fetchUserProfile();
  }, [user]);

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
  
  // Use context for saved recipes
  const recentRecipes = contextSavedRecipes.slice(0, 3); // Show only recent 3
  const hasGeneratedRecipes = recentRecipes.length > 0;

  const handleRecipePress = (recipe: Recipe) => {
    console.log('🔄 Navigating to recipe:', recipe.title);
    setCurrentRecipe(recipe);
    setCurrentRecipeUrl(`saved:${recipe.id}`);
  };

  const handleFavoritePress = (recipeId: string) => {
    const recipe = contextSavedRecipes.find(r => r.id === recipeId);
    if (recipe) {
      toggleFavorite(recipe);
    }
  };

  const handleQuickAction = (action: string) => {
    showModal('Quick Action', `${action} feature coming soon!`);
  };

  const handleRecipeCreate = (url: string) => {
    setCurrentRecipeUrl(url);
  };

  const handleBackToHome = () => {
    setCurrentRecipeUrl(null);
    setCurrentRecipe(null);
  };

  const handleLLMMessage = async (message: string) => {
    console.log('User message:', message);
    setIsProcessingRecipe(true);
    
    try {
      // Analyze if input is URL or text query
      const analysis = GeminiService.analyzeInput(message);
      
      if (analysis.isUrl && analysis.url) {
        console.log('Processing recipe URL:', analysis.url);
        // Handle URL parsing
        const result = await GeminiService.parseRecipeFromUrl(analysis.url);
        
        if (result.success) {
          setCurrentRecipe(result.recipe);
          setCurrentRecipeUrl(analysis.url);
        } else {
          showModal('Error', result.error || 'Failed to parse recipe from URL');
        }
      } else {
        console.log('Generating recipe from query:', message);
        // Handle text-based recipe generation
        const result = await GeminiService.generateRecipe(message);
        
        if (result.success) {
          setCurrentRecipe(result.recipe);
          setCurrentRecipeUrl(`generated:${message}`);
        } else {
          showModal('Error', result.error || 'Failed to generate recipe');
        }
      }
    } catch (error) {
      console.error('Error processing LLM message:', error);
      showModal('Error', 'Something went wrong while processing your request');
    } finally {
      setIsProcessingRecipe(false);
    }
  };

  const handleMicrophonePress = () => {
    console.log('Microphone pressed');
    // TODO: Implement voice input functionality
    showModal('Voice Input', 'Voice input functionality coming soon!');
  };

  // If we have a recipe, show the RecipeDetailScreen
  if (currentRecipeUrl && (currentRecipe || isProcessingRecipe)) {
    return (
      <RecipeDetailScreen 
        route={{ params: { url: currentRecipeUrl, recipe: currentRecipe || undefined } }} 
        navigation={{ goBack: handleBackToHome }}
      />
    );
  }

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          { paddingTop: insets.top - 10, backgroundColor: colors.background }
        ]}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[
            styles.welcomeText,
            { fontFamily: 'Geist-SemiBold', color: colors.text }
          ]}>
            Welcome back, {userFirstName || 'Chef'}! 👋
          </Text>
          <Text style={[
            styles.welcomeSubtext,
            { fontFamily: 'Geist', color: colors.textSecondary }
          ]}>
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
              Tell me what you're craving or share a recipe URL!
            </Text>
            <View style={styles.llmInputContainer}>
              <LLMInput
                placeholder="I want to make pasta with chicken..."
                onSend={handleLLMMessage}
                onMicrophonePress={handleMicrophonePress}
                loading={isProcessingRecipe}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.recipesSection}>
          {/* LLM Input for existing users */}
          <View style={[styles.llmInputContainer, { paddingHorizontal: 20, marginBottom: 16 }]}>
            <LLMInput
              placeholder="Create another recipe or ask for cooking tips..."
              onSend={handleLLMMessage}
              onMicrophonePress={handleMicrophonePress}
              loading={isProcessingRecipe}
            />
          </View>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Recipes</Text>
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



      {/* Today's Tip */}
      <View style={styles.tipSection}>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { fontFamily: 'Geist-SemiBold' }]}>Today's Cooking Tip</Text>
            <Text style={[styles.tipText, { fontFamily: 'Geist' }]}>
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