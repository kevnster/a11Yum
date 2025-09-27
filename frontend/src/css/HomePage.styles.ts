// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

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


export default styles;
