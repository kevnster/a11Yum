import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types/Recipe';
import { useAuth0 } from 'react-native-auth0';
import { useAuth0Management } from '../services/Auth0ManagementService';

interface SavedRecipesContextType {
  savedRecipes: Recipe[];
  addToSaved: (recipe: Recipe) => void;
  removeFromSaved: (recipeId: string) => void;
  toggleFavorite: (recipe: Recipe) => void;
  isRecipeSaved: (recipeId: string) => boolean;
  isLoading: boolean;
}

const SavedRecipesContext = createContext<SavedRecipesContextType | undefined>(undefined);

export const SavedRecipesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const { user } = useAuth0();
  const { saveSavedRecipes, getSavedRecipes } = useAuth0Management();

  // Load saved recipes from Auth0 when user logs in (only once per session)
  useEffect(() => {
    const loadSavedRecipes = async () => {
      if (user && !hasLoadedOnce) {
        console.log('🔄 Loading saved recipes from Auth0...');
        setIsLoading(true);
        setHasLoadedOnce(true);
        try {
          const recipes = await getSavedRecipes();
          console.log('✅ Loaded saved recipes:', recipes.length);
          setSavedRecipes(recipes);
        } catch (error) {
          console.error('❌ Error loading saved recipes:', error);
          // Reset the flag on error so it can retry
          setHasLoadedOnce(false);
        } finally {
          setIsLoading(false);
        }
      } else if (!user) {
        // Clear recipes when user logs out
        setSavedRecipes([]);
        setHasLoadedOnce(false);
      }
    };

    loadSavedRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hasLoadedOnce]); // Only depend on user and hasLoadedOnce

  // Save to Auth0 whenever savedRecipes changes (with rate limit protection)
  const saveToAuth0 = async (updatedRecipes: Recipe[]) => {
    if (user) {
      console.log('💾 Saving recipes to Auth0...');
      try {
        const success = await saveSavedRecipes(updatedRecipes);
        if (success) {
          console.log('✅ Recipes saved to Auth0 successfully');
        } else {
          console.log('⚠️ Could not save to Auth0 (likely rate limited), recipes saved locally');
        }
      } catch (error) {
        console.error('❌ Error saving recipes to Auth0:', error);
        console.log('⚠️ Recipes saved locally only');
      }
    }
  };

  const addToSaved = async (recipe: Recipe) => {
    await toggleFavorite({ ...recipe, isFavorite: false });
  };

  const removeFromSaved = async (recipeId: string) => {
    const recipe = savedRecipes.find(r => r.id === recipeId);
    if (recipe) {
      await toggleFavorite({ ...recipe, isFavorite: true });
    }
  };

  // Debounce timer for API calls
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const toggleFavorite = async (recipe: Recipe) => {
    console.log('💝 Toggling favorite for recipe:', recipe.title, 'Current status:', recipe.isFavorite);
    
    if (recipe.isFavorite) {
      // Remove from saved if currently favorited
      console.log('➖ Removing from saved recipes');
      const updatedRecipes = savedRecipes.filter(r => r.id !== recipe.id);
      setSavedRecipes(updatedRecipes);
      
      // Debounce the Auth0 save to prevent rapid API calls
      if (saveTimeout) clearTimeout(saveTimeout);
      const newTimeout = setTimeout(() => saveToAuth0(updatedRecipes), 1000);
      setSaveTimeout(newTimeout);
    } else {
      // Add to saved if not currently favorited
      console.log('➕ Adding to saved recipes');
      const updatedRecipes = (() => {
        const exists = savedRecipes.find(r => r.id === recipe.id);
        if (exists) {
          return savedRecipes.map(r => r.id === recipe.id ? { ...recipe, isFavorite: true } : r);
        } else {
          return [...savedRecipes, { ...recipe, isFavorite: true }];
        }
      })();
      
      setSavedRecipes(updatedRecipes);
      
      // Debounce the Auth0 save to prevent rapid API calls
      if (saveTimeout) clearTimeout(saveTimeout);
      const newTimeout = setTimeout(() => saveToAuth0(updatedRecipes), 1000);
      setSaveTimeout(newTimeout);
    }
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some(r => r.id === recipeId);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const value = {
    savedRecipes,
    addToSaved,
    removeFromSaved,
    toggleFavorite,
    isRecipeSaved,
    isLoading,
  };

  return (
    <SavedRecipesContext.Provider value={value}>
      {children}
    </SavedRecipesContext.Provider>
  );
};

export const useSavedRecipes = () => {
  const context = useContext(SavedRecipesContext);
  if (context === undefined) {
    throw new Error('useSavedRecipes must be used within a SavedRecipesProvider');
  }
  return context;
};