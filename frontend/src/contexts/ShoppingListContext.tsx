import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingList, ShoppingItem, ShoppingListContextType, INGREDIENT_CATEGORIES, INGREDIENT_SUBSTITUTIONS, IngredientCategory } from '../types/ShoppingList';
import { Recipe } from '../types/Recipe';
import { useSavedRecipes } from './SavedRecipesContext';
import { Alert, Share } from 'react-native';

// Simple UUID generator
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const SHOPPING_LISTS_KEY = '@a11yum_shopping_lists';

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

interface ShoppingListProviderProps {
  children: ReactNode;
}

export const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [currentList, setCurrentListState] = useState<ShoppingList | null>(null);
  const { savedRecipes } = useSavedRecipes();

  // Load shopping lists from storage
  useEffect(() => {
    loadShoppingLists();
  }, []);

  // Save to storage whenever lists change
  useEffect(() => {
    saveShoppingLists();
  }, [shoppingLists]);

  const loadShoppingLists = async () => {
    try {
      const storedLists = await AsyncStorage.getItem(SHOPPING_LISTS_KEY);
      if (storedLists) {
        const parsed = JSON.parse(storedLists);
        // Convert date strings back to Date objects
        const listsWithDates = parsed.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          updatedAt: new Date(list.updatedAt),
          items: list.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt)
          }))
        }));
        setShoppingLists(listsWithDates);
      }
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  };

  const saveShoppingLists = async () => {
    try {
      await AsyncStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(shoppingLists));
    } catch (error) {
      console.error('Error saving shopping lists:', error);
    }
  };

  const createShoppingList = async (name: string, recipeIds?: string[]): Promise<ShoppingList> => {
    const newList: ShoppingList = {
      id: generateUUID(),
      name,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isCompleted: false,
      recipeIds: recipeIds || []
    };

    setShoppingLists(prev => [...prev, newList]);
    return newList;
  };

  const deleteShoppingList = async (listId: string): Promise<void> => {
    setShoppingLists(prev => prev.filter(list => list.id !== listId));
    if (currentList?.id === listId) {
      setCurrentListState(null);
    }
  };

  const setCurrentList = (listId: string | null): void => {
    if (listId) {
      const list = shoppingLists.find(l => l.id === listId);
      setCurrentListState(list || null);
    } else {
      setCurrentListState(null);
    }
  };

  const updateShoppingList = (listId: string, updater: (list: ShoppingList) => ShoppingList) => {
    setShoppingLists(prev => prev.map(list => 
      list.id === listId ? updater(list) : list
    ));
  };

  const addItem = async (listId: string, itemData: Omit<ShoppingItem, 'id' | 'createdAt'>): Promise<void> => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: generateUUID(),
      createdAt: new Date()
    };

    updateShoppingList(listId, list => ({
      ...list,
      items: [...list.items, newItem],
      updatedAt: new Date()
    }));
  };

  const removeItem = async (listId: string, itemId: string): Promise<void> => {
    updateShoppingList(listId, list => ({
      ...list,
      items: list.items.filter(item => item.id !== itemId),
      updatedAt: new Date()
    }));
  };

  const toggleItemChecked = async (listId: string, itemId: string): Promise<void> => {
    updateShoppingList(listId, list => ({
      ...list,
      items: list.items.map(item => 
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      ),
      updatedAt: new Date()
    }));
  };

  const updateItem = async (listId: string, itemId: string, updates: Partial<ShoppingItem>): Promise<void> => {
    updateShoppingList(listId, list => ({
      ...list,
      items: list.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ),
      updatedAt: new Date()
    }));
  };

  // Extract ingredients from recipe and categorize them
  const extractIngredientsFromRecipe = (recipe: Recipe): Omit<ShoppingItem, 'id' | 'createdAt'>[] => {
    return recipe.ingredients.map(ingredient => {
      // Handle both old string format and new Ingredient object format
      const ingredientText = typeof ingredient === 'string' ? ingredient : ingredient.name;
      const parts = ingredientText.trim().split(' ');
      let quantity = typeof ingredient === 'string' ? '' : ingredient.amount || '';
      let unit = typeof ingredient === 'string' ? '' : ingredient.unit || '';
      let name = ingredientText;
      
      // Try to parse quantity (first word if it's a number or fraction)
      if (parts.length > 0 && /^[\d\/\.\s]+/.test(parts[0])) {
        quantity = parts[0];
        if (parts.length > 1 && /^(cup|cups|tsp|tbsp|oz|lb|g|kg|ml|l)s?$/i.test(parts[1])) {
          unit = parts[1];
          name = parts.slice(2).join(' ');
        } else {
          name = parts.slice(1).join(' ');
        }
      }

      // Categorize ingredient
      const lowerName = name.toLowerCase();
      let category: IngredientCategory = INGREDIENT_CATEGORIES.OTHER;
      
      if (/chicken|beef|pork|fish|salmon|shrimp|turkey/.test(lowerName)) {
        category = INGREDIENT_CATEGORIES.MEAT_SEAFOOD;
      } else if (/milk|cheese|butter|yogurt|cream|egg/.test(lowerName)) {
        category = INGREDIENT_CATEGORIES.DAIRY_EGGS;
      } else if (/tomato|onion|garlic|carrot|potato|lettuce|spinach|pepper/.test(lowerName)) {
        category = INGREDIENT_CATEGORIES.PRODUCE;
      } else if (/flour|sugar|salt|oil|vinegar|rice|pasta|beans/.test(lowerName)) {
        category = INGREDIENT_CATEGORIES.PANTRY;
      } else if (/pepper|oregano|basil|thyme|cumin|paprika/.test(lowerName)) {
        category = INGREDIENT_CATEGORIES.SPICES;
      }

      // Get substitutions
      const substitutions = Object.keys(INGREDIENT_SUBSTITUTIONS).find(key => 
        lowerName.includes(key.toLowerCase())
      );

      return {
        name: name || ingredientText,
        quantity,
        unit,
        category,
        isChecked: false,
        recipeId: recipe.id,
        recipeName: recipe.title,
        substitutions: substitutions ? INGREDIENT_SUBSTITUTIONS[substitutions] : undefined
      };
    });
  };

  const generateListFromRecipes = async (recipeIds: string[], listName?: string): Promise<ShoppingList> => {
    const recipes = savedRecipes.filter(recipe => recipeIds.includes(recipe.id));
    const name = listName || `Shopping List - ${new Date().toLocaleDateString()}`;
    
    const newList = await createShoppingList(name, recipeIds);
    
    // Extract ingredients from all recipes
    const allIngredients: Omit<ShoppingItem, 'id' | 'createdAt'>[] = [];
    recipes.forEach(recipe => {
      const ingredients = extractIngredientsFromRecipe(recipe);
      allIngredients.push(...ingredients);
    });

    // Combine similar ingredients
    const combinedIngredients = combineIngredients(allIngredients);
    
    // Add all ingredients to the list
    for (const ingredient of combinedIngredients) {
      await addItem(newList.id, ingredient);
    }

    return newList;
  };

  // Helper function to combine similar ingredients
  const combineIngredients = (ingredients: Omit<ShoppingItem, 'id' | 'createdAt'>[]): Omit<ShoppingItem, 'id' | 'createdAt'>[] => {
    const combined: { [key: string]: Omit<ShoppingItem, 'id' | 'createdAt'> } = {};
    
    ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase().trim();
      if (combined[key]) {
        // Combine quantities if they have the same unit
        if (combined[key].unit === ingredient.unit && combined[key].quantity && ingredient.quantity) {
          const qty1 = parseFloat(combined[key].quantity) || 0;
          const qty2 = parseFloat(ingredient.quantity) || 0;
          combined[key].quantity = (qty1 + qty2).toString();
        }
        // Add recipe names
        if (ingredient.recipeName && !combined[key].recipeName?.includes(ingredient.recipeName)) {
          combined[key].recipeName = `${combined[key].recipeName}, ${ingredient.recipeName}`;
        }
      } else {
        combined[key] = { ...ingredient };
      }
    });
    
    return Object.values(combined);
  };

  const addRecipeToList = async (listId: string, recipeId: string): Promise<void> => {
    const recipe = savedRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const ingredients = extractIngredientsFromRecipe(recipe);
    const combinedIngredients = combineIngredients(ingredients);
    
    for (const ingredient of combinedIngredients) {
      await addItem(listId, ingredient);
    }

    updateShoppingList(listId, list => ({
      ...list,
      recipeIds: [...(list.recipeIds || []), recipeId]
    }));
  };

  const shareList = async (listId: string, method: 'email' | 'text' | 'copy'): Promise<void> => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) return;

    const shareText = formatListForSharing(list);
    
    try {
      await Share.share({
        message: shareText,
        title: list.name
      });
    } catch (error) {
      console.error('Error sharing list:', error);
      Alert.alert('Error', 'Failed to share shopping list');
    }
  };

  const formatListForSharing = (list: ShoppingList): string => {
    let text = `${list.name}\n\n`;
    
    const categories = [...new Set(list.items.map(item => item.category))];
    categories.forEach(category => {
      if (category) {
        text += `${category}:\n`;
        const categoryItems = list.items.filter(item => item.category === category);
        categoryItems.forEach(item => {
          const checkMark = item.isChecked ? '✓' : '○';
          const quantity = item.quantity && item.unit ? `${item.quantity} ${item.unit} ` : item.quantity ? `${item.quantity} ` : '';
          text += `  ${checkMark} ${quantity}${item.name}\n`;
        });
        text += '\n';
      }
    });

    text += `Generated by a11Yum - Accessible Recipe App`;
    return text;
  };

  const clearCompletedItems = async (listId: string): Promise<void> => {
    updateShoppingList(listId, list => ({
      ...list,
      items: list.items.filter(item => !item.isChecked),
      updatedAt: new Date()
    }));
  };

  const duplicateList = async (listId: string, newName: string): Promise<ShoppingList> => {
    const originalList = shoppingLists.find(l => l.id === listId);
    if (!originalList) throw new Error('List not found');

    const newList = await createShoppingList(newName, originalList.recipeIds);
    
    // Add all items from original list
    for (const item of originalList.items) {
      await addItem(newList.id, {
        ...item,
        isChecked: false // Reset checked status for duplicated items
      });
    }

    return newList;
  };

  const value: ShoppingListContextType = {
    shoppingLists,
    currentList,
    createShoppingList,
    deleteShoppingList,
    setCurrentList,
    addItem,
    removeItem,
    toggleItemChecked,
    updateItem,
    generateListFromRecipes,
    addRecipeToList,
    shareList,
    clearCompletedItems,
    duplicateList
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};