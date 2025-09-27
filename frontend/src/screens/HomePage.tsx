import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import styles from '../css/HomePage.styles';

const HomePage: React.FC = () => {
  const { user, clearSession } = useAuth0();

  const handleLogout = async () => {
    try {
      await clearSession();
      Alert.alert('Logged out successfully!');
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to a11Yum!</Text>
        <Text style={styles.subtitle}>Accessible Recipe Generation</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Hello, {user?.name || 'User'}!</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>What would you like to cook?</Text>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>🍳 Generate Recipe</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>♿ Accessibility Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>📚 My Recipe Collection</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>⚙️ Profile Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomePage;
