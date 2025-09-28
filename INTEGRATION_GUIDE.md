# a11Yum Recipe Frontend Implementation

## Overview
This document provides a comprehensive guide for integrating the Gemini API with the a11Yum recipe frontend. The frontend is now complete with placeholder data and ready for backend integration.

## 🏗️ Architecture

### Core Components
1. **HomeScreen** - Main interface with text input for recipe requests
2. **RecipeDetailScreen** - Displays recipes with accessibility alternatives
3. **GeminiService** - Handles API communication with Gemini AI
4. **Enhanced Recipe Types** - TypeScript interfaces with accessibility features

### Data Flow
```
User Input → GeminiService → Recipe Generation/URL Parsing → RecipeDetailScreen
```

## 📋 Required JSON Structure

The Gemini API should return recipes in the following exact format:

```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dietaryTags: string[];
  accessibilityTags: string[];
  servings: number;
  imageUrl?: string;
  sourceUrl?: string; // Original URL if parsed from web
  nutritionInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  ingredients: Ingredient[];
  tools: Tool[];
  steps: RecipeStep[];
  createdAt: string; // ISO date string
  isFavorite: boolean;
}
```

### Complete Example
See `example-recipe-structure.json` in the project root for a full example with:
- ✅ Ingredient alternatives (pre-chopped, allergy-friendly)
- ✅ Tool alternatives (microwave vs stovetop, safer options)
- ✅ Step alternatives (accessibility-aware methods)
- ✅ Safety warnings and tips
- ✅ Accessibility benefits explanations

## 🔧 Implementation Guide

### 1. API Integration
Replace the placeholder methods in `frontend/src/services/GeminiService.ts`:

```typescript
// Update this method with actual API calls
static async generateRecipe(query: string, userProfile?: any): Promise<GeminiResponse> {
  const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: this.buildRecipeGenerationPrompt(query, userProfile) }]
      }]
    })
  });
  
  const data = await response.json();
  const recipeJson = JSON.parse(data.candidates[0].content.parts[0].text);
  
  return {
    type: 'recipe',
    recipe: recipeJson,
    success: true
  };
}
```

### 2. User Profile Integration
The system can access user accessibility needs from their Auth0 profile:

```typescript
// Available user profile data:
{
  firstName: string;
  lastName: string;
  dietaryNeeds: string[];
  accessibilityNeeds: string[]; // e.g., ["epilepsy", "motor_difficulties"]
  cookingPreferences: string[];
  kitchenTools: string[];
  // ... more fields
}
```

### 3. Prompt Engineering
The service includes methods for building context-aware prompts:
- `buildRecipeGenerationPrompt()` - For text-based recipe creation
- `buildUrlParsingPrompt()` - For extracting recipes from URLs
- `buildAlternativePrompt()` - For generating step alternatives

### Key Prompt Requirements:
1. **Always include accessibility context** from user profile
2. **Request specific JSON format** matching the Recipe interface
3. **Emphasize alternatives** for each component (ingredients, tools, steps)
4. **Include safety considerations** and warnings
5. **Provide clear accessibility benefits** for each alternative

## 🎯 Core Features

### Input Processing
- **URL Detection**: Automatically detects recipe URLs vs text queries
- **User Context**: Incorporates accessibility needs and dietary preferences
- **Loading States**: Shows progress indicators during API calls

### Recipe Display
- **Comprehensive Layout**: Ingredients, tools, step-by-step instructions
- **Interactive Alternatives**: Tap buttons to switch to accessibility-friendly options
- **Visual Feedback**: Clear indicators when alternatives are active
- **Safety Warnings**: Prominent display of safety information

### Accessibility Features
- **Motor Difficulties**: Pre-chopped ingredients, easier tools
- **Vision Impairments**: Clear measurements, detailed descriptions
- **Seizure Safety**: Alternatives to stovetop/open flames
- **Cognitive Support**: Simplified instructions, clear steps

## 🔄 Testing the Integration

### 1. Test Recipe Generation
```typescript
const result = await GeminiService.generateRecipe(
  "I want to make pasta carbonara",
  { accessibilityNeeds: ["epilepsy", "motor_difficulties"] }
);
```

### 2. Test URL Parsing
```typescript
const result = await GeminiService.parseRecipeFromUrl(
  "https://example.com/recipe",
  userProfile
);
```

### 3. Validate Response Format
Ensure the API returns valid JSON matching the Recipe interface with:
- All required fields present
- Proper alternatives arrays
- Valid enum values for difficulty
- ISO date strings for timestamps

## 🚨 Critical Requirements

### For Recipe Generation Prompts:
1. **Always return valid JSON** matching the Recipe interface
2. **Include at least 2-3 alternatives** for ingredients/steps with accessibility needs
3. **Provide clear accessibility benefits** ("No chopping required", "Safer for seizure disorders")
4. **Include tool alternatives** (microwave vs stovetop, etc.)
5. **Add safety warnings** for potentially dangerous steps

### For URL Parsing:
1. **Extract all recipe components** (ingredients, instructions, time, etc.)
2. **Enhance with accessibility alternatives** even if not in original
3. **Preserve source URL** in the response
4. **Maintain original recipe integrity** while adding safe alternatives

## 🎨 UI States

### Loading States
- Input shows loading spinner in send button
- Recipe screen shows "Creating your accessibility-friendly recipe..."
- Proper error handling with user-friendly messages

### Error Handling
- Network errors show retry options
- Invalid JSON responses logged and handled gracefully
- Timeout handling for long API calls

### Success States
- Smooth navigation to recipe screen
- Alternatives clearly marked with accessibility benefits
- One-tap switching between original and alternative methods

## 🔗 API Configuration

Update these constants in `GeminiService.ts`:
```typescript
private static apiKey: string = 'YOUR_ACTUAL_GEMINI_API_KEY';
private static baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

## 📱 Current Status

✅ **Complete Frontend Implementation**
- Recipe display with full accessibility features
- Alternative step generation UI
- Loading states and error handling
- User profile integration ready

🔄 **Pending Backend Integration**
- Replace mock responses in GeminiService
- Connect to actual Gemini API
- Test with real recipe data

## 🚀 Next Steps

1. **Replace Mock Data**: Update GeminiService with real API calls
2. **Test Prompts**: Verify Gemini returns properly formatted JSON
3. **User Testing**: Test accessibility alternatives with real users
4. **Performance**: Optimize API response times and loading states

---

**Note**: The frontend is fully functional with comprehensive mock data. Simply replace the placeholder API calls in `GeminiService.ts` with actual Gemini API integration to complete the system.