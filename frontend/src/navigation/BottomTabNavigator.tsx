import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SavedRecipesScreen from '../screens/SavedRecipesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar icon component
const TabIcon = ({ name, color, size, focused }: { name: string; color: string; size: number; focused: boolean }) => {
  return (
    <View style={[styles.tabIconContainer, focused && styles.activeTabIcon]}>
      <Ionicons name={name as any} size={size} color={color} />
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
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SavedRecipes') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <TabIcon name={iconName} color={color} size={size} focused={focused} />;
        },
        tabBarActiveTintColor: Colors.primary.orange,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopColor: Colors.neutral.mediumGray,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
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
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'a11Yum',
        }}
      />
      <Tab.Screen 
        name="SavedRecipes" 
        component={SavedRecipesScreen}
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
          headerTitle: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTabIcon: {
    backgroundColor: `${Colors.primary.orange}20`,
  },
});

export default BottomTabNavigator;
