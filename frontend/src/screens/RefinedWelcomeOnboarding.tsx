import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { UserStorage } from '../utils/UserStorage';
import { UserProfile } from '../services/Auth0Service';
import { useAuth0Management } from '../services/Auth0ManagementService';
import { useAuth0Profile } from '../services/Auth0Service';
import Colors from '../constants/Colors';
import { Progress } from '../components/ui/progress';

interface OnboardingData {
  firstName: string;
  lastName: string;
  dietaryNeeds: string[];
  cookingPreferences: string[];
  energyLevel: string;
  instructionStyle: string;
  kitchenTools: string[];
  accessibilityNeeds: string[];
  favoriteCuisines: string[];
}

interface RefinedWelcomeOnboardingProps {
  onComplete: () => void;
  isEditing?: boolean;
}

const RefinedWelcomeOnboarding: React.FC<RefinedWelcomeOnboardingProps> = ({ onComplete, isEditing = false }) => {
  const { user } = useAuth0();
  const { saveUserProfile } = useAuth0Management();
  const { getUserProfile } = useAuth0Profile();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    dietaryNeeds: [],
    cookingPreferences: [],
    energyLevel: '',
    instructionStyle: '',
    kitchenTools: [],
    accessibilityNeeds: [],
    favoriteCuisines: [],
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  // Load existing profile data when in editing mode
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (isEditing && user) {
        try {
          const existingProfile = await getUserProfile();
          if (existingProfile) {
            // Parse existing profile data to populate form
            const energyMatch = existingProfile.accessibilityNeeds.find(need =>
              need.includes('Energy Level:')
            );
            const instructionMatch = existingProfile.accessibilityNeeds.find(need =>
              need.includes('Instructions:')
            );

            setOnboardingData({
              firstName: existingProfile.firstName || '',
              lastName: existingProfile.lastName || '',
              dietaryNeeds: existingProfile.dietaryRestrictions,
              cookingPreferences: existingProfile.accessibilityNeeds.filter(need =>
                !need.includes('Energy Level:') && !need.includes('Instructions:')
              ),
              energyLevel: energyMatch ? energyMatch.split(': ')[1] : '',
              instructionStyle: instructionMatch ? instructionMatch.split(': ')[1] : '',
              kitchenTools: existingProfile.favoriteCuisines,
              accessibilityNeeds: [],
              favoriteCuisines: [],
            });
          }
        } catch (error) {
          console.error('Error loading existing profile:', error);
        }
      }
    };

    loadExistingProfile();
  }, [isEditing, user, getUserProfile]);

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleNext = async () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data
      const userProfile: UserProfile = {
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName || user?.family_name || user?.name?.split(' ').slice(1).join(' ') || '',
        dietaryRestrictions: onboardingData.dietaryNeeds,
        accessibilityNeeds: [
          ...onboardingData.cookingPreferences,
          ...onboardingData.accessibilityNeeds,
          `Energy Level: ${onboardingData.energyLevel}`,
          `Instructions: ${onboardingData.instructionStyle}`,
          `Kitchen Tools: ${onboardingData.kitchenTools.join(', ')}`
        ],
        favoriteCuisines: onboardingData.favoriteCuisines,
        profileSetupCompleted: true,
      };

      try {
        // Test Auth0 connection in console logs
        
        // Save to Auth0 first, then local storage as backup
        const auth0Success = await saveUserProfile(userProfile);
        if (auth0Success) {
          console.log('✅ Profile saved to Auth0 successfully');
        } else {
          console.log('❌ Failed to save to Auth0, using local storage');
        }
        
        // Always save locally as backup
        await UserStorage.saveUserProfile(userProfile);
        await UserStorage.markProfileSetupCompleted();
        
        onComplete();
      } catch (error) {
        console.error('Error saving profile:', error);
        // Still save locally even if Auth0 fails
        await UserStorage.saveUserProfile(userProfile);
        await UserStorage.markProfileSetupCompleted();
        onComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Welcome step
      case 2:
        return onboardingData.firstName.trim().length > 0; // First name (required)
      case 3:
        return true; // Dietary needs (optional)
      case 4:
        return true; // Cooking preferences (optional)
      case 5:
        return onboardingData.energyLevel && onboardingData.instructionStyle;
      case 6:
        return true; // Kitchen tools (optional)
      case 7:
        return true; // Accessibility needs (optional)
      case 8:
        return true; // Favorite cuisines (optional)
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>
              {isEditing ? 'Update Your Preferences 👋' : 'Welcome to a11Yum! 👋'}
            </Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              {isEditing
                ? 'Update your cooking preferences and dietary needs to get better recipe recommendations.'
                : "Let's personalize your cooking experience. We'll ask you a few quick questions to create recipes that work perfectly for you."
              }
            </Text>
            <View style={styles.welcomeFeatures}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={[styles.featureText, { fontFamily: 'Geist-Medium' }]}>Personalized recipes</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>♿</Text>
                <Text style={[styles.featureText, { fontFamily: 'Geist-Medium' }]}>Accessibility focused</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={[styles.featureText, { fontFamily: 'Geist-Medium' }]}>Quick & easy</Text>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>Tell us your name 👋</Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              We'd love to personalize your experience. What should we call you?
            </Text>
            <View style={styles.nameInputContainer}>
              <TextInput
                style={[styles.nameInput, { fontFamily: 'Geist' }]}
                placeholder="First name"
                placeholderTextColor="#8E8E93"
                value={onboardingData.firstName}
                onChangeText={(text) => setOnboardingData({...onboardingData, firstName: text})}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={30}
              />
              <TextInput
                style={[styles.nameInput, { fontFamily: 'Geist', marginTop: 12 }]}
                placeholder="Last name (optional)"
                placeholderTextColor="#8E8E93"
                value={onboardingData.lastName}
                onChangeText={(text) => setOnboardingData({...onboardingData, lastName: text})}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={30}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>Dietary Preferences 🥗</Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              Any dietary restrictions or preferences we should know about?
            </Text>
            <View style={styles.optionsGrid}>
              {['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionChip,
                    onboardingData.dietaryNeeds.includes(item) && styles.optionChipSelected,
                  ]}
                  onPress={() => toggleArrayItem(onboardingData.dietaryNeeds, item, (items) => 
                    setOnboardingData({...onboardingData, dietaryNeeds: items})
                  )}
                >
                  <Text style={[
                    styles.optionChipText,
                    onboardingData.dietaryNeeds.includes(item) && styles.optionChipTextSelected,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>Cooking Preferences 👨‍🍳</Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              What cooking techniques work best for you?
            </Text>
            <View style={styles.optionsGrid}>
              {['One-handed cooking', 'Seated cooking', 'Minimal chopping', 'Batch cooking', 'Quick meals', 'Slow cooking'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionChip,
                    onboardingData.cookingPreferences.includes(item) && styles.optionChipSelected,
                  ]}
                  onPress={() => toggleArrayItem(onboardingData.cookingPreferences, item, (items) => 
                    setOnboardingData({...onboardingData, cookingPreferences: items})
                  )}
                >
                  <Text style={[
                    styles.optionChipText,
                    onboardingData.cookingPreferences.includes(item) && styles.optionChipTextSelected,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>Energy & Instructions ⚡</Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              How much time and energy do you typically have for cooking?
            </Text>
            
            <View style={styles.radioGroup}>
              <Text style={styles.radioGroupTitle}>Energy Level:</Text>
              {[
                { label: 'Quick & Simple (under 20 mins)', value: 'quick' },
                { label: 'I have some energy (20-45 mins)', value: 'medium' },
                { label: 'Ready for a project! (45+ mins)', value: 'high' }
              ].map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.radioOption,
                    onboardingData.energyLevel === item.value && styles.radioOptionSelected,
                  ]}
                  onPress={() => setOnboardingData({...onboardingData, energyLevel: item.value})}
                >
                  <Text style={[
                    styles.radioOptionText,
                    onboardingData.energyLevel === item.value && styles.radioOptionTextSelected,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.radioGroup}>
              <Text style={styles.radioGroupTitle}>Instruction Style:</Text>
              {[
                { label: 'Just the basics', value: 'basic' },
                { label: 'Detailed step-by-step', value: 'detailed' },
                { label: 'Include timers and tips', value: 'visual' }
              ].map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.radioOption,
                    onboardingData.instructionStyle === item.value && styles.radioOptionSelected,
                  ]}
                  onPress={() => setOnboardingData({...onboardingData, instructionStyle: item.value})}
                >
                  <Text style={[
                    styles.radioOptionText,
                    onboardingData.instructionStyle === item.value && styles.radioOptionTextSelected,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>Kitchen Tools & Appliances 🍳</Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              What cooking equipment and tools do you have available? This helps us recommend recipes you can actually make.
            </Text>
            <View style={styles.optionsGrid}>
              {['Stovetop', 'Oven', 'Microwave', 'Air Fryer', 'Slow Cooker', 'Instant Pot', 'Blender', 'Food Processor', 'Stand Mixer', 'Hand Mixer', 'Toaster', 'Grill', 'Rice Cooker', 'Pressure Cooker', 'Immersion Blender', 'Coffee Maker'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionChip,
                    onboardingData.kitchenTools.includes(item) && styles.optionChipSelected,
                  ]}
                  onPress={() => toggleArrayItem(onboardingData.kitchenTools, item, (items) => 
                    setOnboardingData({...onboardingData, kitchenTools: items})
                  )}
                >
                  <Text style={[
                    styles.optionChipText,
                    onboardingData.kitchenTools.includes(item) && styles.optionChipTextSelected,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>Accessibility Preferences ♿</Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              Help us create recipes and cooking instructions that work best for your needs.
            </Text>
            <View style={styles.optionsGrid}>
              {['Visual Impairment Support', 'Large Text Instructions', 'Audio Recipe Reading', 'Limited Mobility Adaptations', 'One-Handed Techniques', 'Voice Commands Preferred', 'Simple Step Instructions', 'Extra Time Needed'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionChip,
                    onboardingData.accessibilityNeeds.includes(item) && styles.optionChipSelected,
                  ]}
                  onPress={() => toggleArrayItem(onboardingData.accessibilityNeeds, item, (items) => 
                    setOnboardingData({...onboardingData, accessibilityNeeds: items})
                  )}
                >
                  <Text style={[
                    styles.optionChipText,
                    onboardingData.accessibilityNeeds.includes(item) && styles.optionChipTextSelected,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { fontFamily: 'Geist-Bold' }]}>Favorite Cuisines 🌍</Text>
            <Text style={[styles.stepDescription, { fontFamily: 'Geist' }]}>
              What types of cuisine do you enjoy? This helps us recommend recipes you'll love.
            </Text>
            <View style={styles.optionsGrid}>
              {['Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'American', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Middle Eastern'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionChip,
                    onboardingData.favoriteCuisines.includes(item) && styles.optionChipSelected,
                  ]}
                  onPress={() => toggleArrayItem(onboardingData.favoriteCuisines, item, (items) => 
                    setOnboardingData({...onboardingData, favoriteCuisines: items})
                  )}
                >
                  <Text style={[
                    styles.optionChipText,
                    onboardingData.favoriteCuisines.includes(item) && styles.optionChipTextSelected,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appTitle, { fontFamily: 'Geist-Bold' }]}>a11Yum</Text>
        <Text style={[styles.modeTitle, { fontFamily: 'Geist-SemiBold' }]}>
          {isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}
        </Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress
            value={(currentStep / 8) * 100}
            style={styles.progressBar}
          />
          <Text style={[styles.progressText, { fontFamily: 'Geist-Medium' }]}>
            {currentStep} of 8
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderStep()}
        </Animated.View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={[
            styles.nextButtonText,
            !canProceed() && styles.nextButtonTextDisabled,
            { fontFamily: 'Geist-SemiBold' }
          ]}>
            {currentStep === 8 ? (isEditing ? 'Update Profile' : 'Complete Setup') : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  modeTitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    width: '80%',
    height: 6,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContent: {
    paddingBottom: 20,
  },
  stepContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  welcomeFeatures: {
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  nameInputContainer: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  nameInput: {
    backgroundColor: Colors.background.accent,
    borderWidth: 1,
    borderColor: Colors.neutral.mediumGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text.primary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionChip: {
    backgroundColor: Colors.background.accent,
    borderWidth: 1,
    borderColor: Colors.neutral.mediumGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    width: '48%',
  },
  optionChipSelected: {
    backgroundColor: Colors.primary.orange,
    borderColor: Colors.primary.orange,
  },
  optionChipText: {
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: Colors.text.inverse,
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  radioOption: {
    backgroundColor: Colors.background.accent,
    borderWidth: 1,
    borderColor: Colors.neutral.mediumGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  radioOptionSelected: {
    backgroundColor: Colors.primary.green,
    borderColor: Colors.primary.green,
  },
  radioOptionText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  radioOptionTextSelected: {
    color: Colors.text.inverse,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: Colors.primary.orange,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: Colors.neutral.mediumGray,
  },
  nextButtonText: {
    fontSize: 16,
    color: Colors.text.inverse,
    fontWeight: 'bold',
  },
  nextButtonTextDisabled: {
    color: Colors.text.secondary,
  },
});

export default RefinedWelcomeOnboarding;
