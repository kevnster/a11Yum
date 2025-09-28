export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  category?: string;
  isChecked: boolean;
  recipeId?: string; // Which recipe this ingredient comes from
  recipeName?: string;
  substitutions?: string[]; // Alternative ingredient suggestions
  notes?: string;
  createdAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  recipeIds?: string[]; // Track which recipes contributed to this list
  sharedWith?: string[]; // Email addresses of people this list is shared with
}

export interface ShoppingListContextType {
  shoppingLists: ShoppingList[];
  currentList: ShoppingList | null;
  
  // List management
  createShoppingList: (name: string, recipeIds?: string[]) => Promise<ShoppingList>;
  deleteShoppingList: (listId: string) => Promise<void>;
  setCurrentList: (listId: string | null) => void;
  
  // Item management
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'createdAt'>) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
  toggleItemChecked: (listId: string, itemId: string) => Promise<void>;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => Promise<void>;
  
  // Recipe integration
  generateListFromRecipes: (recipeIds: string[], listName?: string) => Promise<ShoppingList>;
  addRecipeToList: (listId: string, recipeId: string) => Promise<void>;
  
  // Sharing
  shareList: (listId: string, method: 'email' | 'text' | 'copy') => Promise<void>;
  
  // Utility
  clearCompletedItems: (listId: string) => Promise<void>;
  duplicateList: (listId: string, newName: string) => Promise<ShoppingList>;
}

// Common ingredient categories for organization
export const INGREDIENT_CATEGORIES = {
  PRODUCE: 'Produce',
  MEAT_SEAFOOD: 'Meat & Seafood',
  DAIRY_EGGS: 'Dairy & Eggs',
  PANTRY: 'Pantry',
  FROZEN: 'Frozen',
  BAKERY: 'Bakery',
  SPICES: 'Spices & Seasonings',
  BEVERAGES: 'Beverages',
  OTHER: 'Other'
} as const;

export type IngredientCategory = typeof INGREDIENT_CATEGORIES[keyof typeof INGREDIENT_CATEGORIES];

// Common ingredient substitutions
export const INGREDIENT_SUBSTITUTIONS: Record<string, string[]> = {
  'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
  'butter': ['margarine', 'coconut oil', 'vegetable oil', 'olive oil'],
  'eggs': ['flax eggs', 'chia eggs', 'applesauce', 'mashed banana'],
  'flour': ['almond flour', 'coconut flour', 'oat flour', 'rice flour'],
  'sugar': ['honey', 'maple syrup', 'stevia', 'coconut sugar'],
  'salt': ['sea salt', 'kosher salt', 'himalayan salt', 'herb salt'],
  'chicken': ['turkey', 'tofu', 'tempeh', 'mushrooms'],
  'beef': ['ground turkey', 'lentils', 'mushrooms', 'plant-based meat'],
  'cream': ['coconut cream', 'cashew cream', 'half-and-half', 'evaporated milk'],
  'cheese': ['nutritional yeast', 'cashew cheese', 'vegan cheese', 'tahini']
};