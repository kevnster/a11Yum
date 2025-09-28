import { useAuth0 } from 'react-native-auth0';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  favoriteCuisines: string[];
  profileSetupCompleted: boolean;
}

export const useAuth0Profile = () => {
  const { user, getCredentials } = useAuth0();

  // Get user profile from Auth0 user metadata
  const getUserProfile = (): UserProfile => {
    if (!user) {
      return {
        dietaryRestrictions: [],
        accessibilityNeeds: [],
        favoriteCuisines: [],
        profileSetupCompleted: false,
      };
    }

    // Auth0 stores custom data in user_metadata or app_metadata
    // Try multiple access patterns for user_metadata
    const metadata = user.user_metadata || user['https://a11yum.com/user_metadata'] || user['user_metadata'] || {};
    
    console.log('🔍 Auth0Service - Full user object:', JSON.stringify(user, null, 2));
    console.log('🔍 Auth0Service - Extracted metadata:', metadata);
    
    return {
      firstName: metadata.firstName || user.given_name,
      lastName: metadata.lastName || user.family_name,
      dietaryRestrictions: metadata.dietaryRestrictions || [],
      accessibilityNeeds: metadata.accessibilityNeeds || [],
      favoriteCuisines: metadata.favoriteCuisines || [],
      profileSetupCompleted: metadata.profileSetupCompleted || false,
    };
  };

  // Update user profile in Auth0 (requires Management API)
  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      // Note: This requires Auth0 Management API setup
      // For now, we'll use local storage and show how to integrate later
      console.log('Profile update (would save to Auth0):', profileData);
      
      // TODO: Implement Auth0 Management API call
      // const credentials = await getCredentials();
      // await fetch(`https://${domain}/api/v2/users/${user.sub}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${managementApiToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     user_metadata: profileData
      //   })
      // });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return {
    getUserProfile,
    updateUserProfile,
  };
};
