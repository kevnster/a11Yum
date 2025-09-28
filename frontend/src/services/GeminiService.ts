import { Recipe } from '../types/Recipe';

export interface GeminiResponse {
  type: 'recipe' | 'url_parsing';
  recipe: Recipe;
  success: boolean;
  error?: string;
}

export class GeminiService {
  private static apiKey: string = 'YOUR_GEMINI_API_KEY'; // Replace with actual API key
  private static baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  /**
   * Analyzes user input to determine if it's a URL or recipe request
   * @param input - User's text input
   * @returns Promise<{ isUrl: boolean, url?: string }>
   */
  static analyzeInput(input: string): { isUrl: boolean, url?: string } {
    // Simple URL detection - can be enhanced
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = input.match(urlRegex);
    
    if (match && match.length > 0) {
      return { isUrl: true, url: match[0] };
    }
    
    return { isUrl: false };
  }

  /**
   * Generates a recipe from user's text query using Gemini AI
   * @param query - User's recipe request
   * @param userProfile - User's accessibility needs and preferences
   * @returns Promise<GeminiResponse>
   */
  static async generateRecipe(query: string, userProfile?: any): Promise<GeminiResponse> {
    try {
      // TODO: Replace with actual Gemini API call
      // This is a placeholder implementation
      
      const prompt = this.buildRecipeGenerationPrompt(query, userProfile);
      
      // Placeholder response - replace with actual API call
      const mockResponse = await this.getMockRecipeResponse(query);
      
      return {
        type: 'recipe',
        recipe: mockResponse,
        success: true
      };
      
      /* 
      // Actual implementation would be:
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
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
      */
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      return {
        type: 'recipe',
        recipe: {} as Recipe,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Parses a recipe URL and extracts recipe data using Gemini AI
   * @param url - Recipe URL to parse
   * @param userProfile - User's accessibility needs and preferences
   * @returns Promise<GeminiResponse>
   */
  static async parseRecipeFromUrl(url: string, userProfile?: any): Promise<GeminiResponse> {
    try {
      const prompt = this.buildUrlParsingPrompt(url, userProfile);
      
      // Placeholder response - replace with actual API call
      const mockResponse = await this.getMockUrlParseResponse(url);
      
      return {
        type: 'url_parsing',
        recipe: mockResponse,
        success: true
      };
      
    } catch (error) {
      console.error('Error parsing recipe from URL:', error);
      return {
        type: 'url_parsing',
        recipe: {} as Recipe,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generates an alternative for a specific recipe step
   * @param step - Original recipe step
   * @param accessibilityNeeds - User's specific accessibility requirements
   * @returns Promise<StepAlternative>
   */
  static async generateStepAlternative(step: any, accessibilityNeeds: string[]): Promise<any> {
    try {
      const prompt = this.buildAlternativePrompt(step, accessibilityNeeds);
      
      // TODO: Replace with actual Gemini API call
      // Return mock alternative for now
      return {
        id: `alt-${Date.now()}`,
        instruction: `Alternative method for: ${step.instruction}`,
        reason: "Accessibility-friendly alternative",
        accessibilityBenefit: "Easier and safer method",
        timeAdjustment: 0
      };
      
    } catch (error) {
      console.error('Error generating step alternative:', error);
      throw error;
    }
  }

  private static buildRecipeGenerationPrompt(query: string, userProfile?: any): string {
    const accessibilityContext = userProfile?.accessibilityNeeds ? 
      `User has the following accessibility needs: ${userProfile.accessibilityNeeds.join(', ')}. ` : '';
    
    const dietaryContext = userProfile?.dietaryNeeds ? 
      `User dietary requirements: ${userProfile.dietaryNeeds.join(', ')}. ` : '';

    return `
Create a detailed recipe based on this request: "${query}"

${accessibilityContext}${dietaryContext}

Please return the response in the exact JSON format shown in the example below. Include comprehensive accessibility alternatives for each step, especially considering:
- Motor skill limitations (pre-chopped ingredients, easier tools)
- Vision impairments (clear measurements, safety warnings)
- Seizure disorders (alternatives to stovetop/open flames)
- Cognitive support (simplified instructions, clear steps)

Return ONLY valid JSON matching the Recipe interface structure with ingredients, tools, and steps arrays containing proper alternatives.

Example format: [Include the structure from example-recipe-structure.json]
`;
  }

  private static buildUrlParsingPrompt(url: string, userProfile?: any): string {
    const accessibilityContext = userProfile?.accessibilityNeeds ? 
      `User has the following accessibility needs: ${userProfile.accessibilityNeeds.join(', ')}. ` : '';

    return `
Parse the recipe from this URL: ${url}

${accessibilityContext}

Please extract the recipe information and enhance it with accessibility alternatives for users with different needs. Return the response in the exact JSON format matching the Recipe interface.

Focus on providing alternatives for:
- Chopping/knife work (suggest pre-chopped alternatives)
- Hot surfaces/stovetop (suggest microwave or cold alternatives)
- Fine motor skills (easier tools and techniques)
- Safety concerns (clear warnings and safer methods)

Return ONLY valid JSON matching the Recipe interface structure.
`;
  }

  private static buildAlternativePrompt(step: any, accessibilityNeeds: string[]): string {
    return `
Generate an accessibility-friendly alternative for this recipe step:
"${step.instruction}"

User accessibility needs: ${accessibilityNeeds.join(', ')}

Provide an alternative instruction that addresses these specific needs while achieving the same cooking result. Consider:
- Safety improvements
- Easier techniques
- Alternative tools
- Different cooking methods

Return a JSON object with: instruction, reason, accessibilityBenefit, and timeAdjustment fields.
`;
  }

  // Mock responses for development - remove when connecting to actual API
  private static async getMockRecipeResponse(query: string): Promise<Recipe> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `generated-${Date.now()}`,
      title: `Recipe for: ${query}`,
      description: `A delicious recipe generated from your request: "${query}"`,
      estimatedTime: 30,
      difficulty: "Medium",
      dietaryTags: ["Customizable"],
      accessibilityTags: ["Generated with Accessibility"],
      servings: 4,
      ingredients: [
        {
          id: "ing-1",
          name: "Main ingredient",
          amount: "1",
          unit: "cup",
          alternatives: [{
            id: "alt-1",
            name: "Alternative ingredient",
            amount: "1",
            unit: "cup",
            reason: "Easier to find",
            accessibilityBenefit: "No special preparation needed"
          }]
        }
      ],
      tools: [
        {
          id: "tool-1",
          name: "Basic cooking pot",
          required: true,
          alternatives: [{
            id: "tool-alt-1",
            name: "Microwave-safe bowl",
            reason: "No stovetop required",
            accessibilityBenefit: "Safer for those with mobility issues"
          }]
        }
      ],
      steps: [
        {
          id: "step-1",
          stepNumber: 1,
          instruction: "Prepare your ingredients as listed above.",
          estimatedTime: 5,
          difficulty: "Easy",
          alternatives: [{
            id: "step-alt-1",
            instruction: "Use pre-prepared ingredients to save time and effort.",
            reason: "Reduces preparation work",
            accessibilityBenefit: "No chopping or complex prep required",
            timeAdjustment: -3
          }]
        }
      ],
      createdAt: new Date(),
      isFavorite: false
    };
  }

  private static async getMockUrlParseResponse(url: string): Promise<Recipe> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: `parsed-${Date.now()}`,
      title: "Parsed Recipe from URL",
      description: `Recipe extracted and enhanced from ${url}`,
      estimatedTime: 45,
      difficulty: "Medium",
      dietaryTags: ["Original Recipe Enhanced"],
      accessibilityTags: ["URL Parsed", "Accessibility Enhanced"],
      servings: 4,
      sourceUrl: url,
      ingredients: [
        {
          id: "ing-1",
          name: "Parsed ingredient 1",
          amount: "2",
          unit: "cups",
          alternatives: [{
            id: "alt-1",
            name: "Pre-chopped version",
            amount: "2",
            unit: "cups",
            reason: "No knife work required",
            accessibilityBenefit: "Eliminates chopping for those with limited dexterity"
          }]
        }
      ],
      tools: [
        {
          id: "tool-1",
          name: "Standard cooking equipment",
          required: true,
          alternatives: [{
            id: "tool-alt-1",
            name: "Alternative cooking method",
            reason: "Safer cooking option",
            accessibilityBenefit: "Reduces risk of burns or accidents"
          }]
        }
      ],
      steps: [
        {
          id: "step-1",
          stepNumber: 1,
          instruction: "Follow the original recipe instructions with safety enhancements.",
          estimatedTime: 10,
          difficulty: "Easy",
          alternatives: [{
            id: "step-alt-1",
            instruction: "Use the accessibility-friendly version of this step.",
            reason: "Enhanced for accessibility",
            accessibilityBenefit: "Safer and easier to perform",
            timeAdjustment: 0
          }]
        }
      ],
      createdAt: new Date(),
      isFavorite: false
    };
  }
}

export default GeminiService;