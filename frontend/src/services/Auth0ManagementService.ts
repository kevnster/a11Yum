import { useAuth0 } from 'react-native-auth0';
import { UserProfile } from './Auth0Service';
import { Recipe } from '../types/Recipe';

// Auth0 Management API configuration
const AUTH0_DOMAIN = 'dev-jhskl14nw5eonveg.us.auth0.com';
const MANAGEMENT_API_AUDIENCE = `https://${AUTH0_DOMAIN}/api/v2/`;

// Management API credentials
const MANAGEMENT_CLIENT_ID = 'qtnrl9hS8FVSFqCxngFlRuG5210Qg7Kr';
const MANAGEMENT_CLIENT_SECRET = 'VqT5D3DBYcHLCPayCRnUFjElOinxWNnmrUATk8dKM6OHBQeHpBtYbbmhzupm699T';

// Token caching to prevent rate limits
interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export const useAuth0Management = () => {
  const { user } = useAuth0();

  // Get Management API access token using Client Credentials flow with caching
  const getManagementToken = async (): Promise<string | null> => {
    try {
      // Check if we have a valid cached token
      const now = Date.now();
      if (tokenCache && tokenCache.expiresAt > now) {
        console.log('🎯 Using cached management token');
        return tokenCache.token;
      }

      console.log('🔄 Requesting new management token with client credentials...');
      
      const requestBody = {
        client_id: MANAGEMENT_CLIENT_ID,
        client_secret: MANAGEMENT_CLIENT_SECRET,
        audience: MANAGEMENT_API_AUDIENCE,
        grant_type: 'client_credentials'
      };
      
      const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Token response status:', response.status);

      if (response.ok) {
        const tokenData = await response.json();
        
        // Cache the token (Auth0 tokens typically expire in 24 hours, we'll cache for 23 hours)
        const expiresIn = tokenData.expires_in || 86400; // Default to 24 hours
        tokenCache = {
          token: tokenData.access_token,
          expiresAt: now + (expiresIn - 3600) * 1000 // Refresh 1 hour before expiry
        };
        
        console.log('✅ Got and cached management token successfully');
        return tokenData.access_token;
      } else {
        const error = await response.text();
        console.error('❌ Failed to get management token:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        });
        
        // If rate limited, return null and let the app handle gracefully
        if (response.status === 429) {
          console.log('⚠️ Rate limited - using local fallback if available');
        }
        
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting management token:', error);
      return null;
    }
  };

  // Save user profile to Auth0 user_metadata
  const saveUserProfile = async (profileData: UserProfile): Promise<boolean> => {
    if (!user) {
      console.error('❌ No user found');
      return false;
    }

    try {
      console.log('🔄 Starting Auth0 profile save process...');
      console.log('👤 User ID (sub):', user.sub);
      console.log('👤 User email:', user.email);
      console.log('📋 Profile data to save:', JSON.stringify(profileData, null, 2));
      
      const token = await getManagementToken();
      if (!token) {
        console.error('❌ Could not get management token');
        return false;
      }

      console.log('✅ Got management token, making API request...');

      // Structure the metadata according to Auth0 best practices
      // Using user_metadata for user preferences that can be edited by users
      const requestBody = {
        user_metadata: {
          // User preferences from onboarding
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dietaryRestrictions: profileData.dietaryRestrictions,
          accessibilityNeeds: profileData.accessibilityNeeds,
          favoriteCuisines: profileData.favoriteCuisines,
          
          // App-specific metadata
          profileSetupCompleted: profileData.profileSetupCompleted,
          onboarding_completed_at: new Date().toISOString(),
          app_version: '1.0.0'
        }
      };
      
      console.log('📤 Making PATCH request to:', `https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`);
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));      const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Profile saved to Auth0 successfully!', responseData);
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Error saving profile to Auth0:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        });
        
        // If user doesn't exist (404), it means they were deleted
        // The user should log out and log back in to recreate their profile
        if (response.status === 404) {
          console.error('🚨 USER NOT FOUND: The user account was deleted from Auth0.');
          console.error('💡 SOLUTION: Please log out and log back in to recreate your account.');
          console.error('🔍 User ID that failed:', user.sub);
        }
        
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
        console.log('📥 Received user data from Auth0:');
        console.log('- user_metadata:', JSON.stringify(userData.user_metadata, null, 2));
        console.log('- app_metadata:', JSON.stringify(userData.app_metadata, null, 2));
        
        const metadata = userData.user_metadata || {};
        
        return {
          firstName: metadata.firstName || user.given_name || '',
          lastName: metadata.lastName || user.family_name || '',
          dietaryRestrictions: metadata.dietaryRestrictions || [],
          accessibilityNeeds: metadata.accessibilityNeeds || [],
          favoriteCuisines: metadata.favoriteCuisines || [],
          profileSetupCompleted: metadata.profileSetupCompleted || false,
        };
      } else {
        const error = await response.text();
        console.error('❌ Error fetching user profile from Auth0:', {
          status: response.status,
          error: error
        });
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // Test function to verify M2M setup and required scopes
  const testAuth0Connection = async (): Promise<boolean> => {
    try {
      console.log('🧪 =============================================================');
      console.log('🧪 TESTING AUTH0 MANAGEMENT API SETUP');
      console.log('🧪 =============================================================');
      
      // Step 1: Test token acquisition
      console.log('🔑 Step 1: Testing Management API token...');
      const token = await getManagementToken();
      
      if (!token) {
        console.error('❌ FAILED: Could not get management token');
        console.error('🔧 SOLUTION: Check your M2M app client_id and client_secret');
        return false;
      }
      console.log('✅ SUCCESS: Got management token');

      if (!user) {
        console.error('❌ FAILED: No user logged in');
        return false;
      }

      // Step 2: Test reading user data (requires read:users scope)
      console.log('📖 Step 2: Testing read:users scope...');
      const readResponse = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!readResponse.ok) {
        const error = await readResponse.text();
        console.error('❌ FAILED: Cannot read user data');
        console.error('📊 Status:', readResponse.status);
        console.error('🔧 SOLUTION: Add "read:users" scope to your M2M app');
        console.error('💡 Error details:', error);
        return false;
      }
      
      const userData = await readResponse.json();
      console.log('✅ SUCCESS: Can read user data');
      console.log('👤 Current user_metadata:', userData.user_metadata);

      // Step 3: Test updating user metadata (requires update:users scope)
      console.log('✏️  Step 3: Testing update:users scope...');
      const testMetadata = {
        user_metadata: {
          ...userData.user_metadata,
          test_connection: true,
          test_timestamp: new Date().toISOString()
        }
      };

      const updateResponse = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMetadata)
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        console.error('❌ FAILED: Cannot update user metadata');
        console.error('📊 Status:', updateResponse.status);
        console.error('🔧 SOLUTION: Add "update:users" scope to your M2M app');
        console.error('💡 Error details:', error);
        return false;
      }

      console.log('✅ SUCCESS: Can update user metadata');
      console.log('🧪 =============================================================');
      console.log('🎉 ALL TESTS PASSED! Your Auth0 setup is working correctly!');
      console.log('🧪 =============================================================');
      return true;

    } catch (error) {
      console.error('❌ FAILED: Unexpected error during Auth0 test');
      console.error('💡 Error:', error);
      return false;
    }
  };

  // Save saved recipes to Auth0 user_metadata
  const saveSavedRecipes = async (savedRecipes: Recipe[]): Promise<boolean> => {
    if (!user) {
      console.error('❌ No user found');
      return false;
    }

    try {
      console.log('🔄 Saving saved recipes to Auth0...');
      console.log('📋 Number of recipes to save:', savedRecipes.length);
      
      const token = await getManagementToken();
      if (!token) {
        console.error('❌ Could not get management token');
        return false;
      }

      // Save only the essential recipe data to minimize metadata size
      const recipesToSave = savedRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        estimatedTime: recipe.estimatedTime,
        difficulty: recipe.difficulty,
        dietaryTags: recipe.dietaryTags,
        accessibilityTags: recipe.accessibilityTags || [],
        servings: recipe.servings,
        isFavorite: recipe.isFavorite,
        createdAt: recipe.createdAt,
        // Include ingredients and steps for full recipe functionality
        ingredients: recipe.ingredients,
        tools: recipe.tools,
        steps: recipe.steps
      }));

      const requestBody = {
        user_metadata: {
          savedRecipes: recipesToSave,
          savedRecipesUpdatedAt: new Date().toISOString()
        }
      };
      
      console.log('📤 Making PATCH request to save recipes...');
      
      const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        console.log('✅ Saved recipes updated in Auth0 successfully!');
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Error saving recipes to Auth0:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving recipes:', error);
      return false;
    }
  };

  // Get saved recipes from Auth0 user_metadata
  const getSavedRecipes = async (): Promise<Recipe[]> => {
    try {
      if (!user?.sub) {
        return [];
      }

      const token = await getManagementToken();
      if (!token) {
        return [];
      }

      const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const metadata = userData.user_metadata || {};
        
        console.log('📥 Retrieved saved recipes from Auth0:', metadata.savedRecipes?.length || 0, 'recipes');
        
        return metadata.savedRecipes || [];
      } else {
        const error = await response.text();
        console.error('❌ Error fetching saved recipes from Auth0:', {
          status: response.status,
          error: error
        });
        return [];
      }
    } catch (error) {
      console.error('❌ Error getting saved recipes:', error);
      return [];
    }
  };

  // Save recent recipes to Auth0 user_metadata (last 5 generated recipes)
  const saveRecentRecipes = async (recipes: Recipe[]): Promise<boolean> => {
    if (!user) {
      console.error('❌ No user found for recent recipes');
      return false;
    }

    try {
      console.log('🔄 Saving recent recipes to Auth0...');
      
      // Keep only the last 5 recipes
      const recentRecipes = recipes.slice(-5);
      console.log('📥 Saving', recentRecipes.length, 'recent recipes');
      
      const token = await getManagementToken();
      if (!token) {
        console.error('❌ Could not get management token for recent recipes');
        return false;
      }

      const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user.sub)}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_metadata: {
            recentRecipes: recentRecipes,
          }
        }),
      });

      if (response.ok) {
        console.log('✅ Recent recipes saved to Auth0 successfully');
        return true;
      } else if (response.status === 429) {
        console.warn('⏳ Rate limit hit saving recent recipes, will retry later');
        return false;
      } else {
        const error = await response.text();
        console.error('❌ Error saving recent recipes to Auth0:', {
          status: response.status,
          error: error
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving recent recipes:', error);
      return false;
    }
  };

  // Get recent recipes from Auth0 user_metadata
  const getRecentRecipes = async (): Promise<Recipe[]> => {
    if (!user) {
      console.error('❌ No user found for recent recipes');
      return [];
    }

    try {
      console.log('🔄 Fetching recent recipes from Auth0...');
      
      const token = await getManagementToken();
      if (!token) {
        console.error('❌ Could not get management token for recent recipes');
        return [];
      }

      const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user.sub)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const metadata = userData.user_metadata || {};
        
        console.log('📥 Retrieved recent recipes from Auth0:', metadata.recentRecipes?.length || 0, 'recipes');
        
        return metadata.recentRecipes || [];
      } else if (response.status === 429) {
        console.warn('⏳ Rate limit hit fetching recent recipes, returning empty array');
        return [];
      } else {
        const error = await response.text();
        console.error('❌ Error fetching recent recipes from Auth0:', {
          status: response.status,
          error: error
        });
        return [];
      }
    } catch (error) {
      console.error('❌ Error getting recent recipes:', error);
      return [];
    }
  };

  return {
    saveUserProfile,
    getUserProfile,
    saveSavedRecipes,
    getSavedRecipes,
    saveRecentRecipes,
    getRecentRecipes,
  };
};
