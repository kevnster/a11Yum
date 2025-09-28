import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { useNavigation } from '../contexts/NavigationContext';
import { useNavigation as useReactNavigation } from '@react-navigation/native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SavedRecipesScreen from '../screens/SavedRecipesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Wrapper components that handle dynamic headers
const HomeWrapper: React.FC = () => {
  const { currentRecipeTitle, goBackFromRecipe, setActiveTab, isRecipeDetailForTab } = useNavigation();
  const navigation = useReactNavigation();
  
  const isShowingRecipe = isRecipeDetailForTab('Home');

  useEffect(() => {
    setActiveTab('Home');
  }, [setActiveTab]);

  useEffect(() => {
    console.log('🔧 HomeWrapper: updating header', { isShowingRecipe, currentRecipeTitle, hasGoBackFunction: !!goBackFromRecipe });
    navigation.setOptions({
      headerTitle: isShowingRecipe && currentRecipeTitle 
        ? (currentRecipeTitle.length > 20 ? currentRecipeTitle.substring(0, 20) + '...' : currentRecipeTitle)
        : 'a11Yum',
      headerLeft: isShowingRecipe && goBackFromRecipe 
        ? () => (
            <TouchableOpacity 
              onPress={() => {
                console.log('🔧 HomeWrapper: back button pressed');
                goBackFromRecipe();
              }} 
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <Text style={[styles.backArrow, { color: Colors.primary.orange }]}>←</Text>
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [isShowingRecipe, currentRecipeTitle, goBackFromRecipe, navigation]);

  return <HomeScreen />;
};

const SavedWrapper: React.FC = () => {
  const { currentRecipeTitle, goBackFromRecipe, setActiveTab, isRecipeDetailForTab } = useNavigation();
  const navigation = useReactNavigation();
  
  const isShowingRecipe = isRecipeDetailForTab('SavedRecipes');

  useEffect(() => {
    setActiveTab('SavedRecipes');
  }, [setActiveTab]);

  useEffect(() => {
    console.log('🔧 SavedWrapper: updating header', { isShowingRecipe, currentRecipeTitle, hasGoBackFunction: !!goBackFromRecipe });
    navigation.setOptions({
      headerTitle: isShowingRecipe && currentRecipeTitle 
        ? (currentRecipeTitle.length > 20 ? currentRecipeTitle.substring(0, 20) + '...' : currentRecipeTitle)
        : 'Saved Recipes',
      headerLeft: isShowingRecipe && goBackFromRecipe 
        ? () => (
            <TouchableOpacity 
              onPress={() => {
                console.log('🔧 SavedWrapper: back button pressed');
                goBackFromRecipe();
              }} 
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <Text style={[styles.backArrow, { color: Colors.primary.orange }]}>←</Text>
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [isShowingRecipe, currentRecipeTitle, goBackFromRecipe, navigation]);

  return <SavedRecipesScreen />;
};

const Tab = createBottomTabNavigator();

// Custom tab bar icon component
const TabIcon = ({ name, color, size, focused }: { name: string; color: string; size: number; focused: boolean }) => {
  const getEmoji = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return '🏠';
      case 'heart':
        return '❤️';
      case 'settings':
        return '⚙️';
      default:
        return '❓';
    }
  };

  return (
    <View style={[styles.tabIconContainer, focused && styles.activeTabIcon]}>
      <Text style={{
        fontSize: 16,
        opacity: focused ? 1 : 0.7,
        color: color,
        textAlign: 'center',
        lineHeight: 18,
        includeFontPadding: false,
        textAlignVertical: 'center',
        minHeight: 18,
        marginTop: 2
      }}>
        {getEmoji(name)}
      </Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'SavedRecipes') {
            iconName = 'heart';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else {
            iconName = 'help-circle';
          }

          return <TabIcon name={iconName} color={color} size={22} focused={focused} />;
        },
        tabBarActiveTintColor: Colors.primary.orange,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopColor: Colors.neutral.mediumGray,
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 12,
          height: 92,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: Colors.background.primary,
          borderBottomColor: Colors.neutral.mediumGray,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: Colors.text.primary,
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: Colors.primary.orange,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeWrapper}
        options={{
          title: 'Home',
          headerTitle: 'a11Yum',
        }}
      />
      <Tab.Screen 
        name="SavedRecipes" 
        component={SavedWrapper}
        options={{
          title: 'Saved',
          headerTitle: 'Saved Recipes',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    minHeight: 40,
    minWidth: 40,
    position: 'relative',
  },
  activeTabIcon: {
    backgroundColor: `${Colors.primary.orange}15`,
  },
  backButton: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BottomTabNavigator;
