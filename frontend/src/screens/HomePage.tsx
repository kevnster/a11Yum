import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import Colors from '../constants/Colors';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: Colors.background.accent,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: Colors.primary.green,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  menuButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: Colors.semantic.error,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomePage;
