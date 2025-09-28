import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { Recipe, RecipeStep, Ingredient, Tool, StepAlternative } from '../types/Recipe';

interface RecipeDetailScreenProps {
  route: {
    params: {
      url?: string;
      recipe?: Recipe;
    };
  };
  navigation: any;
}

// Mock data for demonstration - this will be replaced with actual API data
const mockRecipe: Recipe = {
  id: "recipe-12345",
  title: "Accessible Spaghetti Carbonara",
  description: "A creamy, delicious pasta dish with accessibility alternatives for every step",
  estimatedTime: 25,
  difficulty: "Medium",
  dietaryTags: ["Vegetarian Option Available", "Contains Dairy", "Contains Eggs"],
  accessibilityTags: ["No-Chop Options", "Alternative Cooking Methods", "One-Pot Option"],
  servings: 4,
  imageUrl: "https://example.com/carbonara.jpg",
  sourceUrl: "https://example.com/original-recipe",
  nutritionInfo: {
    calories: 450,
    protein: "18g",
    carbs: "52g",
    fat: "18g"
  },
  ingredients: [
    {
      id: "ing-1",
      name: "Spaghetti pasta",
      amount: "400",
      unit: "g",
      notes: "Long pasta works best",
      alternatives: [
        {
          id: "alt-1",
          name: "Short pasta (penne, rigatoni)",
          amount: "400",
          unit: "g",
          reason: "Easier to eat for those with motor difficulties",
          accessibilityBenefit: "No twirling required, easier to scoop"
        }
      ]
    },
    {
      id: "ing-2",
      name: "Bacon",
      amount: "200",
      unit: "g",
      notes: "Diced into small pieces",
      alternatives: [
        {
          id: "alt-2",
          name: "Pre-diced pancetta",
          amount: "200",
          unit: "g",
          reason: "No chopping required",
          accessibilityBenefit: "Eliminates knife work for those with limited mobility"
        }
      ]
    },
    {
      id: "ing-3",
      name: "Large eggs",
      amount: "3",
      unit: "whole",
      alternatives: [
        {
          id: "alt-3",
          name: "Pasteurized liquid eggs",
          amount: "150",
          unit: "ml",
          reason: "No cracking required, safer for immunocompromised",
          accessibilityBenefit: "No shell fragments risk, easier to measure"
        }
      ]
    }
  ],
  tools: [
    {
      id: "tool-1",
      name: "Large pot for pasta",
      required: true,
      safetyNotes: ["Handle hot water carefully", "Use pot holders"],
      alternatives: [
        {
          id: "tool-alt-1",
          name: "Electric kettle + large bowl",
          reason: "Safer than stovetop boiling",
          accessibilityBenefit: "Reduces risk for those with seizure disorders or mobility issues"
        }
      ]
    },
    {
      id: "tool-2",
      name: "Large frying pan",
      required: true,
      alternatives: [
        {
          id: "tool-alt-2",
          name: "Microwave-safe dish",
          reason: "No stovetop required",
          accessibilityBenefit: "Safer for those uncomfortable with open flames or hot surfaces"
        }
      ]
    }
  ],
  steps: [
    {
      id: "step-1",
      stepNumber: 1,
      instruction: "Bring a large pot of salted water to boil. Add spaghetti and cook according to package directions until al dente.",
      estimatedTime: 10,
      difficulty: "Easy",
      safetyWarnings: ["Handle boiling water carefully", "Watch for steam"],
      requiredTools: ["tool-1"],
      alternatives: [
        {
          id: "step-alt-1",
          instruction: "Boil water in electric kettle. Place spaghetti in large bowl, pour over boiling water, cover tightly and let sit for 15-18 minutes until tender.",
          reason: "Avoids stovetop use",
          accessibilityBenefit: "Safer for those with seizure disorders or fear of open flames",
          toolChanges: {
            add: ["tool-alt-1"],
            remove: ["tool-1"]
          },
          timeAdjustment: 8
        }
      ],
      tips: ["Add salt to water for better flavor", "Stir occasionally to prevent sticking"]
    },
    {
      id: "step-2",
      stepNumber: 2,
      instruction: "While pasta cooks, dice the bacon into small pieces and cook in a large frying pan over medium heat until crispy, about 5-6 minutes.",
      estimatedTime: 6,
      difficulty: "Medium",
      safetyWarnings: ["Watch for hot grease splatter", "Keep pan handle turned inward"],
      requiredTools: ["tool-2"],
      alternatives: [
        {
          id: "step-alt-2",
          instruction: "Place pre-diced pancetta in microwave-safe dish and microwave on high for 2-3 minutes until crispy, stirring halfway through.",
          reason: "No chopping or stovetop required",
          accessibilityBenefit: "Eliminates knife work and hot grease splatter risk",
          toolChanges: {
            add: ["tool-alt-2"],
            remove: ["tool-2"]
          },
          timeAdjustment: -3
        }
      ]
    }
  ],
  createdAt: new Date(),
  isFavorite: false
};

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { url, recipe } = route.params;
  const { colors } = useThemeStyles();
  const insets = useSafeAreaInsets();
  
  // Use passed recipe or mock data
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(recipe || mockRecipe);
  const [activeAlternatives, setActiveAlternatives] = useState<{[stepId: string]: string}>({});
  const [isLoading, setIsLoading] = useState(!recipe); // Show loading if no recipe passed

  useEffect(() => {
    if (recipe) {
      setCurrentRecipe(recipe);
      setIsLoading(false);
    }
  }, [recipe]);

  const handleAlternativeSelect = (stepId: string, alternativeId: string) => {
    const step = currentRecipe.steps.find(s => s.id === stepId);
    const alternative = step?.alternatives?.find(alt => alt.id === alternativeId);
    
    if (!step || !alternative) return;

    Alert.alert(
      "Use Alternative Method?",
      `${alternative.accessibilityBenefit}\n\nThis will change the step to: "${alternative.instruction}"`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Use Alternative", 
          onPress: () => {
            setActiveAlternatives(prev => ({
              ...prev,
              [stepId]: alternativeId
            }));
          }
        }
      ]
    );
  };

  const getActiveInstruction = (step: RecipeStep): string => {
    const activeAltId = activeAlternatives[step.id];
    if (activeAltId) {
      const alternative = step.alternatives?.find(alt => alt.id === activeAltId);
      return alternative?.instruction || step.instruction;
    }
    return step.instruction;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrowText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Recipe</Text>
        <TouchableOpacity onPress={() => setCurrentRecipe(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}>
          <Text style={styles.favoriteIcon}>{currentRecipe.isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          /* Loading State */
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary || '#FF6B35'} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Creating your accessibility-friendly recipe...
            </Text>
            <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>
              We're adding alternatives and safety tips for you! 🍳
            </Text>
          </View>
        ) : (
          <>
        {/* Recipe Header */}
        <View style={styles.recipeHeader}>
          <Text style={[styles.recipeTitle, { color: colors.text }]}>{currentRecipe.title}</Text>
          <Text style={[styles.recipeDescription, { color: colors.textSecondary }]}>
            {currentRecipe.description}
          </Text>
          
          <View style={styles.recipeMetrics}>
            <View style={[styles.metric, { backgroundColor: colors.card || '#F5F5F5' }]}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Time</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{currentRecipe.estimatedTime} min</Text>
            </View>
            <View style={[styles.metric, { backgroundColor: colors.card || '#F5F5F5' }]}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Difficulty</Text>
              <Text style={[styles.metricValue, { color: getDifficultyColor(currentRecipe.difficulty) }]}>
                {currentRecipe.difficulty}
              </Text>
            </View>
            <View style={[styles.metric, { backgroundColor: colors.card || '#F5F5F5' }]}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Serves</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{currentRecipe.servings}</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {currentRecipe.accessibilityTags.map((tag, index) => (
              <View key={index} style={[styles.accessibilityTag, { backgroundColor: '#E8F5E8' }]}>
                <Text style={[styles.tagText, { color: '#2E7D32' }]}>♿ {tag}</Text>
              </View>
            ))}
            {currentRecipe.dietaryTags.map((tag, index) => (
              <View key={index} style={[styles.dietaryTag, { backgroundColor: '#E3F2FD' }]}>
                <Text style={[styles.tagText, { color: '#1565C0' }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tools Required */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔧 Tools Required</Text>
          {currentRecipe.tools.map((tool) => (
            <View key={tool.id} style={[styles.toolItem, { backgroundColor: colors.card || '#F5F5F5' }]}>
              <Text style={[styles.toolName, { color: colors.text }]}>{tool.name}</Text>
              {tool.required && <Text style={styles.requiredBadge}>Required</Text>}
              {tool.alternatives && tool.alternatives.length > 0 && (
                <Text style={[styles.alternativeHint, { color: colors.textSecondary }]}>
                  💡 Alternative: {tool.alternatives[0].name}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🛒 Ingredients</Text>
          {currentRecipe.ingredients.map((ingredient) => (
            <View key={ingredient.id} style={[styles.ingredientItem, { backgroundColor: colors.card || '#F5F5F5' }]}>
              <Text style={[styles.ingredientText, { color: colors.text }]}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </Text>
              {ingredient.notes && (
                <Text style={[styles.ingredientNotes, { color: colors.textSecondary }]}>
                  {ingredient.notes}
                </Text>
              )}
              {ingredient.alternatives && ingredient.alternatives.length > 0 && (
                <Text style={[styles.alternativeHint, { color: colors.textSecondary }]}>
                  💡 {ingredient.alternatives[0].accessibilityBenefit}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>👩‍🍳 Instructions</Text>
          {currentRecipe.steps.map((step) => (
            <View key={step.id} style={[styles.stepContainer, { backgroundColor: colors.card || '#F5F5F5' }]}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepInstruction, { color: colors.text }]}>
                    {getActiveInstruction(step)}
                  </Text>
                  {step.estimatedTime && (
                    <Text style={[styles.stepTime, { color: colors.textSecondary }]}>
                      ⏱️ ~{step.estimatedTime} minutes
                    </Text>
                  )}
                  {step.safetyWarnings && step.safetyWarnings.length > 0 && (
                    <View style={styles.safetyWarnings}>
                      {step.safetyWarnings.map((warning, index) => (
                        <Text key={index} style={styles.safetyWarning}>⚠️ {warning}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              
              {step.alternatives && step.alternatives.length > 0 && !activeAlternatives[step.id] && (
                <View style={styles.alternativesSection}>
                  <Text style={[styles.alternativesTitle, { color: colors.textSecondary }]}>
                    Need an alternative? We've got you covered:
                  </Text>
                  {step.alternatives.map((alternative) => (
                    <TouchableOpacity
                      key={alternative.id}
                      style={styles.alternativeButton}
                      onPress={() => handleAlternativeSelect(step.id, alternative.id)}
                    >
                      <Text style={styles.alternativeButtonText}>
                        💡 {alternative.accessibilityBenefit}
                      </Text>
                      <Text style={styles.alternativeReason}>
                        {alternative.reason}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {activeAlternatives[step.id] && (
                <View style={styles.activeAlternativeIndicator}>
                  <Text style={styles.activeAlternativeText}>
                    ✅ Using accessibility-friendly alternative
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveAlternatives(prev => {
                        const newAlts = { ...prev };
                        delete newAlts[step.id];
                        return newAlts;
                      });
                    }}
                  >
                    <Text style={styles.revertButton}>↩️ Use original method</Text>
                  </TouchableOpacity>
                </View>
              )}

              {step.tips && step.tips.length > 0 && (
                <View style={styles.tipsSection}>
                  {step.tips.map((tip, index) => (
                    <Text key={index} style={[styles.tip, { color: colors.textSecondary }]}>
                      💡 {tip}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* URL Info */}
        {url && (
          <View style={styles.section}>
            <View style={[styles.urlContainer, { backgroundColor: colors.card || '#F5F5F5' }]}>
              <Text style={[styles.urlLabel, { color: colors.textSecondary }]}>Original Recipe:</Text>
              <Text style={[styles.urlText, { color: colors.text }]}>{url}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
        </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backArrow: {
    padding: 8,
  },
  backArrowText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  favoriteIcon: {
    fontSize: 24,
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  recipeHeader: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  recipeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accessibilityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  dietaryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toolItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  requiredBadge: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  alternativeHint: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  stepContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  stepTime: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  safetyWarnings: {
    marginBottom: 8,
  },
  safetyWarning: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 4,
  },
  alternativesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  alternativesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  alternativeButton: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  alternativeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  alternativeReason: {
    fontSize: 13,
    color: '#388E3C',
  },
  activeAlternativeIndicator: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeAlternativeText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    flex: 1,
  },
  revertButton: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  tipsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tip: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  urlContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  urlText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default RecipeDetailScreen;