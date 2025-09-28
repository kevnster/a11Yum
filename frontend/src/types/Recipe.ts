// Enhanced interfaces for accessibility-aware recipes
export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit?: string;
  notes?: string;
  alternatives?: IngredientAlternative[];
}

export interface IngredientAlternative {
  id: string;
  name: string;
  amount: string;
  unit?: string;
  reason: string; // Why this is an alternative (e.g., "Pre-chopped option", "Allergy-friendly")
  accessibilityBenefit?: string; // e.g., "No chopping required", "Easier to handle"
}

export interface Tool {
  id: string;
  name: string;
  required: boolean;
  alternatives?: ToolAlternative[];
  safetyNotes?: string[];
}

export interface ToolAlternative {
  id: string;
  name: string;
  reason: string;
  accessibilityBenefit?: string;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  estimatedTime?: number; // in minutes
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  safetyWarnings?: string[];
  alternatives?: StepAlternative[];
  requiredTools?: string[]; // Tool IDs
  tips?: string[];
}

export interface StepAlternative {
  id: string;
  instruction: string;
  reason: string; // Why this is an alternative
  accessibilityBenefit?: string; // Specific accessibility benefit
  toolChanges?: { // Tools that need to be added/removed
    add?: string[];
    remove?: string[];
  };
  timeAdjustment?: number; // Time difference in minutes
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[]; // e.g., ['Vegan', 'Gluten-Free']
  accessibilityTags: string[]; // e.g., ['No-Chop', 'One-Pot', 'No-Hot-Surfaces']
  ingredients: Ingredient[];
  tools: Tool[];
  steps: RecipeStep[];
  servings: number;
  imageUrl?: string;
  createdAt: Date;
  isFavorite: boolean;
  nutritionInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  sourceUrl?: string; // Original recipe URL if parsed from web
}

export class RecipeModel implements Recipe {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[];
  accessibilityTags: string[];
  ingredients: Ingredient[];
  tools: Tool[];
  steps: RecipeStep[];
  servings: number;
  imageUrl?: string;
  createdAt: Date;
  isFavorite: boolean;
  nutritionInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  sourceUrl?: string;

  constructor(data: Partial<Recipe>) {
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.title = data.title || '';
    this.description = data.description || '';
    this.estimatedTime = data.estimatedTime || 30;
    this.difficulty = data.difficulty || 'Medium';
    this.dietaryTags = data.dietaryTags || [];
    this.accessibilityTags = data.accessibilityTags || [];
    this.ingredients = data.ingredients || [];
    this.tools = data.tools || [];
    this.steps = data.steps || [];
    this.servings = data.servings || 4;
    this.imageUrl = data.imageUrl;
    this.createdAt = data.createdAt || new Date();
    this.isFavorite = data.isFavorite || false;
    this.nutritionInfo = data.nutritionInfo;
    this.sourceUrl = data.sourceUrl;
  }

  // Get difficulty color for styling
  getDifficultyColor(): string {
    switch (this.difficulty) {
      case 'Easy':
        return '#4CAF50'; // Green
      case 'Medium':
        return '#FF9800'; // Orange
      case 'Hard':
        return '#F44336'; // Red
      default:
        return '#757575'; // Gray
    }
  }

  // Get estimated time display
  getTimeDisplay(): string {
    if (this.estimatedTime < 60) {
      return `${this.estimatedTime} min`;
    }
    const hours = Math.floor(this.estimatedTime / 60);
    const minutes = this.estimatedTime % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  // Toggle favorite status
  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }
}
