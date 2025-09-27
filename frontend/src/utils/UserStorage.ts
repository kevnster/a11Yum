import { UserProfile } from '../services/Auth0Service';

// Persistent storage using AsyncStorage for offline support
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'user_profile';
const PROFILE_SETUP_KEY = 'profile_setup_completed';

export const UserStorage = {
  // Check if user has completed profile setup
  async hasCompletedProfileSetup(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(PROFILE_SETUP_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking profile setup status:', error);
      return false;
    }
  },

  // Mark profile setup as completed
  async markProfileSetupCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(PROFILE_SETUP_KEY, 'true');
      console.log('Profile setup marked as completed');
    } catch (error) {
      console.error('Error marking profile setup as completed:', error);
    }
  },

  // Reset profile setup (for testing)
  async resetProfileSetup(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PROFILE_SETUP_KEY);
      await AsyncStorage.removeItem(PROFILE_KEY);
      console.log('Profile setup reset');
    } catch (error) {
      console.error('Error resetting profile setup:', error);
    }
  },

  // Get user profile data
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileData = await AsyncStorage.getItem(PROFILE_KEY);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Save user profile data locally (as backup)
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      console.log('Profile saved locally:', profile);
    } catch (error) {
      console.error('Error saving user profile locally:', error);
    }
  }
};
