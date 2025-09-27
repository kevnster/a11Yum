// Navigation types
export type RootStackParamList = {
  Landing: undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  accessibilitySettings: AccessibilitySettings;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  budgetRange: {
    min: number;
    max: number;
  };
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  screenReader: boolean;
  voiceOver: boolean;
}

// Food/Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  accessibilityFeatures: AccessibilityFeature[];
  location: Location;
  rating: number;
  imageUrl?: string;
}

export interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  category: 'mobility' | 'vision' | 'hearing' | 'cognitive';
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props types
export interface BaseComponentProps {
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
