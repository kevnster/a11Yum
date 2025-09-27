import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
import config from './auth0-configuration';
import { useThemeStyles } from './src/hooks/useThemeStyles';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import HomeScreen from './src/screens/HomeScreen';
import RefinedWelcomeOnboarding from './src/screens/RefinedWelcomeOnboarding';
import RefinedLandingPage from './src/screens/RefinedLandingPage';
import { UserStorage } from './src/utils/UserStorage';

interface User {
  name?: string;
  email?: string;
  [key: string]: any;
}

interface Credentials {
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
}

interface HomeProps {
  onUserLogout?: () => void;
}

const Home: React.FC<HomeProps> = ({ onUserLogout }) => {
  const { authorize, clearSession, user, error, getCredentials, isLoading } = useAuth0();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileSetupChecked, setProfileSetupChecked] = useState(false);
  const [userLoggedOut, setUserLoggedOut] = useState(false);

  // Check if user needs profile setup when they log in
  useEffect(() => {
    const checkProfileSetup = async () => {
      if (user && !profileSetupChecked) {
        const hasCompleted = await UserStorage.hasCompletedProfileSetup();
        setShowProfileSetup(!hasCompleted);
        setProfileSetupChecked(true);
      }
    };
    
    checkProfileSetup();
  }, [user, profileSetupChecked]);

  const onLogin = async (): Promise<void> => {
    try {
      console.log('Attempting login...');
      await authorize({
        scope: 'openid profile email',
      });
      const credentials: Credentials = await getCredentials();
      // Reset logout state when successfully logging in
      setUserLoggedOut(false);
      Alert.alert('Login Success!', 'Welcome to a11Yum');
    } catch (e: any) {
      console.log('Login error:', e);

      // Handle user cancellation gracefully
      if (e.code === 'USER_CANCELLED' || e.name === 'USER_CANCELLED') {
        console.log('User cancelled login');
        return;
      }

      // For network errors or other issues, don't show alert
      // Just log and return to prevent automatic re-attempts
      if (e.message && e.message.includes('network')) {
        console.log('Network error during login, not showing alert');
        return;
      }

      // Show simple error for other issues
      Alert.alert('Login Failed', 'Please try again');
    }
  };

  const loggedIn: boolean = user !== undefined && user !== null;

  const onLogout = async (): Promise<void> => {
    try {
      await clearSession();
      // Reset all states when logging out
      setProfileSetupChecked(false);
      setShowProfileSetup(false);
      setUserLoggedOut(true);
      // Notify parent component that user has logged out
      onUserLogout?.();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  const handleProfileSetupComplete = async () => {
    console.log('Profile setup completed, hiding onboarding...');
    setShowProfileSetup(false);
    setProfileSetupChecked(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  // If user has explicitly logged out, always show landing page
  if (userLoggedOut) {
    return <RefinedLandingPage onGetStarted={onLogin} />;
  }

  // If user is logged in, check if they need onboarding
  if (loggedIn && !userLoggedOut) {
    if (showProfileSetup) {
      return <RefinedWelcomeOnboarding onComplete={handleProfileSetupComplete} />;
    }
    // Use simple screen for web, navigation for mobile
    if (Platform.OS === 'web') {
      return <HomeScreen />;
    }

    return (
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    );
  }

  // Show landing page for non-logged-in users
  return (
    <RefinedLandingPage onGetStarted={onLogin} />
  );
};

const App: React.FC = () => {
  const [userLoggedOut, setUserLoggedOut] = useState(false);

  return (
    <SafeAreaProvider>
      <Auth0Provider
        domain={config.domain}
        clientId={config.clientId}
        >
          <AppContent onUserLogout={() => setUserLoggedOut(true)} />
          <PortalHost />
        </Auth0Provider>
    </SafeAreaProvider>
  );
};

// Component that handles theme-based StatusBar styling and contains the main app
const AppContent: React.FC<{ onUserLogout: () => void }> = ({ onUserLogout }) => {
  const { colors } = useThemeStyles();

  useEffect(() => {
    // Update StatusBar based on theme
    StatusBar.setBarStyle(colors.text === '#F8FAFC' ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.card);
    }
  }, [colors]);

  return <Home onUserLogout={onUserLogout} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  debugInfo: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    minWidth: 250,
  },
  debugText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  errorText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
});

export default App;


