import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import config from './auth0-configuration';

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

  const onLogin = async (): Promise<void> => {
    try {
      await authorize();
      const credentials: Credentials = await getCredentials();
      Alert.alert('AccessToken: ' + credentials.accessToken);
    } catch (e) {
      console.log('Login error:', e);
      Alert.alert('Login Error', JSON.stringify(e));
    }
  };

  const loggedIn: boolean = user !== undefined && user !== null;

  const onLogout = async (): Promise<void> => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>a11Yum - Auth0 Login</Text>
      {user && <Text>You are logged in as {user.name}</Text>}
      {!user && <Text>You are not logged in</Text>}
      {error && <Text>{error.message}</Text>}
      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
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
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;


