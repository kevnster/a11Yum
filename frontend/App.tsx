import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import config from './auth0-configuration';
import HomePage from './src/screens/HomePage';
import WelcomeOnboarding from './src/screens/WelcomeOnboarding';
import LandingPage from './src/screens/LandingPage';
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

const Home: React.FC = () => {
  const { authorize, clearSession, user, error, getCredentials, isLoading } = useAuth0();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileSetupChecked, setProfileSetupChecked] = useState(false);

  // Check if user needs profile setup when they log in
  useEffect(() => {
    if (user && !profileSetupChecked) {
      const needsProfileSetup = !UserStorage.hasCompletedProfileSetup();
      setShowProfileSetup(needsProfileSetup);
      setProfileSetupChecked(true);
    }
  }, [user, profileSetupChecked]);

  const onLogin = async (): Promise<void> => {
    try {
      await authorize();
      const credentials: Credentials = await getCredentials();
      Alert.alert('Login Success!', 'Welcome to a11Yum');
    } catch (e: any) {
      console.log('Login error:', e);

      // Handle user cancellation gracefully
      if (e.code === 'USER_CANCELLED' || e.name === 'USER_CANCELLED') {
        console.log('User cancelled login');
        // Don't show any alert for cancellation
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
      // Reset profile setup check when logging out
      setProfileSetupChecked(false);
      setShowProfileSetup(false);
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  // If user is logged in, check if they need onboarding
  if (loggedIn) {
    if (showProfileSetup) {
      return <WelcomeOnboarding onComplete={handleProfileSetupComplete} />;
    }
    return <HomePage />;
  }

  // Show landing page for non-logged-in users
  return (
    <LandingPage onGetStarted={onLogin} />
  );
};

const App: React.FC = () => {
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
      <Home />
    </Auth0Provider>
  );
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


