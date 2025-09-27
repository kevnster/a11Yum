export interface Recipe {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[]; // e.g., ['Vegan', 'Gluten-Free']
  ingredients: string[];
  instructions: string[];
  servings: number;
  imageUrl?: string;
  createdAt: Date;
  isFavorite: boolean;
}

export class RecipeModel implements Recipe {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[];
  ingredients: string[];
  instructions: string[];
  servings: number;
  imageUrl?: string;
  createdAt: Date;
  isFavorite: boolean;

  constructor(data: Partial<Recipe>) {
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.title = data.title || '';
    this.description = data.description || '';
    this.estimatedTime = data.estimatedTime || 30;
    this.difficulty = data.difficulty || 'Medium';
    this.dietaryTags = data.dietaryTags || [];
    this.ingredients = data.ingredients || [];
    this.instructions = data.instructions || [];
    this.servings = data.servings || 4;
    this.imageUrl = data.imageUrl;
    this.createdAt = data.createdAt || new Date();
    this.isFavorite = data.isFavorite || false;
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
