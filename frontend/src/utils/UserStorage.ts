import { useAuth0 } from 'react-native-auth0';
import { UserProfile } from '../services/Auth0Service';

// Simple in-memory storage for now
// TODO: Replace with Auth0 Management API calls

let profileSetupCompleted = false;
let userProfile: UserProfile | null = null;

export const UserStorage = {
  // Check if user has completed profile setup
  hasCompletedProfileSetup(): boolean {
    return profileSetupCompleted;
  },

  // Mark profile setup as completed
  markProfileSetupCompleted(): void {
    profileSetupCompleted = true;
    console.log('Profile setup marked as completed');
  },

  // Reset profile setup (for testing)
  resetProfileSetup(): void {
    profileSetupCompleted = false;
    userProfile = null;
    console.log('Profile setup reset');
  },

  // Get user profile data
  getUserProfile(): UserProfile | null {
    return userProfile;
  },

  // Save user profile data
  saveUserProfile(profile: UserProfile): void {
    userProfile = profile;
    console.log('Profile saved locally:', profile);
    // TODO: Save to Auth0 user_metadata via Management API
  }
};
