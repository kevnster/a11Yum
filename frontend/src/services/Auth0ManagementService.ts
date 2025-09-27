import { useAuth0 } from 'react-native-auth0';
import { UserProfile } from './Auth0Service';

// Auth0 Management API configuration
const AUTH0_DOMAIN = 'dev-jhskl14nw5eonveg.us.auth0.com';
const MANAGEMENT_API_AUDIENCE = `https://${AUTH0_DOMAIN}/api/v2/`;

export const useAuth0Management = () => {
  const { user, getCredentials } = useAuth0();

  // Get Management API access token
  const getManagementToken = async (): Promise<string | null> => {
    try {
      const credentials = await getCredentials({
        audience: MANAGEMENT_API_AUDIENCE,
        scope: 'read:current_user update:current_user_metadata'
      });
      return credentials.accessToken;
    } catch (error) {
      console.error('Error getting management token:', error);
      return null;
    }
  };

  // Save user profile to Auth0 user_metadata
  const saveUserProfile = async (profileData: UserProfile): Promise<boolean> => {
    try {
      if (!user?.sub) {
        console.error('No user ID available');
        return false;
      }

      const token = await getManagementToken();
      if (!token) {
        console.error('No management token available');
        return false;
      }

      const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_metadata: profileData
        })
      });

      if (response.ok) {
        console.log('Profile saved to Auth0 successfully');
        return true;
      } else {
        const error = await response.text();
        console.error('Error saving profile to Auth0:', error);
        return false;
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };

  // Get user profile from Auth0 user_metadata
  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      if (!user?.sub) {
        return null;
      }

      const token = await getManagementToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const metadata = userData.user_metadata || {};
        
        return {
          firstName: metadata.firstName || user.given_name,
          lastName: metadata.lastName || user.family_name,
          dietaryRestrictions: metadata.dietaryRestrictions || [],
          accessibilityNeeds: metadata.accessibilityNeeds || [],
          favoriteCuisines: metadata.favoriteCuisines || [],
          profileSetupCompleted: metadata.profileSetupCompleted || false,
        };
      } else {
        console.error('Error fetching user profile from Auth0');
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  return {
    saveUserProfile,
    getUserProfile,
  };
};
