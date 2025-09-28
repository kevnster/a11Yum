import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from 'react-native-auth0';
import { Recipe } from '../types/Recipe';
import { useAuth0Management } from '../services/Auth0ManagementService';

interface RecentRecipesContextType {
  recentRecipes: Recipe[];
  addRecentRecipe: (recipe: Recipe) => Promise<void>;
  isLoading: boolean;
  clearRecentRecipes: () => Promise<void>;
}

const RecentRecipesContext = createContext<RecentRecipesContextType | undefined>(undefined);

// Static cache to prevent multiple concurrent requests
let recentRecipesCache: Recipe[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const RecentRecipesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading: auth0Loading } = useAuth0();
  const { saveRecentRecipes, getRecentRecipes } = useAuth0Management();
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recent recipes when user is available
  useEffect(() => {
    let isMounted = true;
    
    const loadRecentRecipes = async () => {
      if (user && !auth0Loading && isMounted) {
        try {
          console.log('🔄 Loading recent recipes from Auth0...');
          setIsLoading(true);
          
          // Use cache if available and fresh
          const now = Date.now();
          if (recentRecipesCache && (now - lastFetchTime) < CACHE_DURATION) {
            console.log('🎯 Using cached recent recipes');
            if (isMounted) {
              setRecentRecipes(recentRecipesCache);
              setIsLoading(false);
            }
            return;
          }
          
          const recipes = await getRecentRecipes();
          
          // Update cache
          recentRecipesCache = recipes;
          lastFetchTime = now;
          
          if (isMounted) {
            setRecentRecipes(recipes);
            console.log('✅ Loaded', recipes.length, 'recent recipes');
          }
        } catch (error) {
          console.error('❌ Error loading recent recipes:', error);
          if (isMounted) {
            // On error, use cache if available, otherwise empty array
            setRecentRecipes(recentRecipesCache || []);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (!user && !auth0Loading && isMounted) {
        // User is not logged in, clear recent recipes and cache
        recentRecipesCache = null;
        setRecentRecipes([]);
        setIsLoading(false);
      }
    };

    loadRecentRecipes();
    
    return () => {
      isMounted = false;
    };
  }, [user?.sub, auth0Loading]); // Only depend on user.sub, not the entire user object or getRecentRecipes function

  // Add a new recipe to recent recipes (maintains max 5, newest first)
  const addRecentRecipe = async (recipe: Recipe): Promise<void> => {
    try {
      console.log('🔄 Adding recipe to recent list:', recipe.title);
      
      // Create new list with the new recipe at the front
      // Remove any existing instance of this recipe first (by ID)
      const filteredRecipes = recentRecipes.filter(r => r.id !== recipe.id);
      const updatedRecipes = [recipe, ...filteredRecipes].slice(0, 5); // Keep max 5
      
      // Update local state immediately for responsiveness
      setRecentRecipes(updatedRecipes);
      
      // Save to Auth0 in background with timeout/debouncing
      setTimeout(async () => {
        try {
          const success = await saveRecentRecipes(updatedRecipes);
          if (!success) {
            console.error('❌ Failed to save recent recipes to Auth0');
          } else {
            console.log('✅ Recent recipe added and saved to Auth0');
          }
        } catch (error) {
          console.error('❌ Error saving recent recipes to Auth0:', error);
        }
      }, 1000); // Debounce by 1 second
    } catch (error) {
      console.error('❌ Error adding recent recipe:', error);
    }
  };

  // Clear all recent recipes
  const clearRecentRecipes = async (): Promise<void> => {
    try {
      console.log('🔄 Clearing all recent recipes...');
      
      // Update local state immediately
      setRecentRecipes([]);
      
      // Save to Auth0
      const success = await saveRecentRecipes([]);
      if (!success) {
        console.error('❌ Failed to clear recent recipes in Auth0');
      } else {
        console.log('✅ Recent recipes cleared and saved to Auth0');
      }
    } catch (error) {
      console.error('❌ Error clearing recent recipes:', error);
    }
  };

  return (
    <RecentRecipesContext.Provider 
      value={{
        recentRecipes,
        addRecentRecipe,
        isLoading,
        clearRecentRecipes,
      }}
    >
      {children}
    </RecentRecipesContext.Provider>
  );
};

export const useRecentRecipes = (): RecentRecipesContextType => {
  const context = useContext(RecentRecipesContext);
  if (context === undefined) {
    throw new Error('useRecentRecipes must be used within a RecentRecipesProvider');
  }
  return context;
};