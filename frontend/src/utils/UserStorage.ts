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
  },

  // Validate if profile completion is accurate by checking Auth0 metadata
  // Returns an object with validation result and auth0Profile data
  async validateProfileCompletion(getUserProfileFromAuth0: () => Promise<UserProfile | null>): Promise<{
    isValid: boolean;
    shouldShowOnboarding: boolean;
    auth0Profile: UserProfile | null;
  }> {
    try {
      const localCompleted = await this.hasCompletedProfileSetup();
      console.log('📋 Local profile setup completed:', localCompleted);

      // Get Auth0 profile data
      const auth0Profile = await getUserProfileFromAuth0();
      console.log('🔍 Auth0 profile data:', auth0Profile);

      // If local storage says completed but Auth0 profile is missing or incomplete, reset local storage
      if (localCompleted) {
        const hasRequiredAuth0Data = auth0Profile && 
          auth0Profile.firstName && 
          auth0Profile.firstName.trim().length > 0;

        if (!hasRequiredAuth0Data) {
          console.log('⚠️  Local storage says complete but Auth0 profile is missing/incomplete. Resetting local storage...');
          await this.resetProfileSetup();
          return {
            isValid: false,
            shouldShowOnboarding: true,
            auth0Profile: auth0Profile
          };
        }

        // Both local and Auth0 show completion
        return {
          isValid: true,
          shouldShowOnboarding: false,
          auth0Profile: auth0Profile
        };
      }

      // Local storage says not completed
      return {
        isValid: true,
        shouldShowOnboarding: true,
        auth0Profile: auth0Profile
      };

    } catch (error) {
      console.error('❌ Error validating profile completion:', error);
      // On error, fall back to local storage check
      const localCompleted = await this.hasCompletedProfileSetup();
      return {
        isValid: false,
        shouldShowOnboarding: !localCompleted,
        auth0Profile: null
      };
    }
  }
};
