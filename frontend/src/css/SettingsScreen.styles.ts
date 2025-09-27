// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
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
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    height: 1,
    backgroundColor: Colors.neutral.mediumGray,
    marginHorizontal: 16,
  },
  actionsCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  logoutButton: {
    // Additional styling for logout button if needed
  },
  logoutButtonText: {
    color: Colors.semantic.error,
  },
  appInfoSection: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 50,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default styles;