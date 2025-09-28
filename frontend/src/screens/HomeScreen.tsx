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

const HomeScreen: React.FC = () => {
  const { user, clearSession } = useAuth0();
  const { colors } = useThemeStyles();
  const insets = useSafeAreaInsets();
  const { getUserProfile } = useAuth0Profile();
  const { getUserProfile: getAuth0Profile } = useAuth0Management();
  
  // Recipe navigation state
  const [currentRecipeUrl, setCurrentRecipeUrl] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  
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

  // Helper function to get Management API token
  const getManagementToken = async (): Promise<string> => {
    const response = await fetch(`https://dev-jhskl14nw5eonveg.us.auth0.com/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 'qtnrl9hS8FVSFqCxngFlRuG5210Qg7Kr',
        client_secret: 'VqT5D3DBYcHLCPayCRnUFjElOinxWNnmrUATk8dKM6OHBQeHpBtYbbmhzupm699T',
        audience: 'https://dev-jhskl14nw5eonveg.us.auth0.com/api/v2/',
        grant_type: 'client_credentials'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get management token');
    }
    
    const data = await response.json();
    return data.access_token;
  };

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

  const handleRecipePress = (recipe: Recipe) => {
    const recipeModel = new RecipeModel(recipe);
    showModal(
      recipe.title,
      `Estimated time: ${recipeModel.getTimeDisplay()}\nDifficulty: ${recipe.difficulty}`
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

  const handleRecipeCreate = (url: string) => {
    setCurrentRecipeUrl(url);
  };

  const handleBackToHome = () => {
    setCurrentRecipeUrl(null);
  };

  const handleLLMMessage = (message: string) => {
    console.log('User message:', message);
    // TODO: Process the LLM message and generate recipe
    // For now, we'll just navigate to a recipe screen with the message as a URL
    setCurrentRecipeUrl(`llm-query:${message}`);
  };

  const handleMicrophonePress = () => {
    console.log('Microphone pressed');
    // TODO: Implement voice input functionality
    showModal('Voice Input', 'Voice input functionality coming soon!');
  };

  // If we have a recipe URL, show the RecipeDetailScreen
  if (currentRecipeUrl) {
    return (
      <RecipeDetailScreen 
        route={{ params: { url: currentRecipeUrl } }} 
        navigation={{ goBack: handleBackToHome }}
      />
    );
  }

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: colors.background }
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
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Recipes</Text>
          </View>
          
          {/* LLM Input for existing users */}
          <View style={[styles.llmInputContainer, { paddingHorizontal: 20, marginBottom: 16 }]}>
            <LLMInput
              placeholder="Create another recipe or ask for cooking tips..."
              onSend={handleLLMMessage}
              onMicrophonePress={handleMicrophonePress}
            />
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