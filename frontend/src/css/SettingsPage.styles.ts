// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  darkContainer: {
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary.orange,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#AAAAAA',
  },
  userSection: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1A1A1A',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    position: 'relative',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: Colors.neutral.mediumGray,
  },
  darkSeparator: {
    backgroundColor: '#333333',
  },
  logoutButton: {
    backgroundColor: Colors.semantic.error,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkLogoutButton: {
    backgroundColor: '#DC2626',
  },
  logoutButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
});

export default styles;