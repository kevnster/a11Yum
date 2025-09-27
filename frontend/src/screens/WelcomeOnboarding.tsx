import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { UserStorage } from '../utils/UserStorage';
import { UserProfile } from '../services/Auth0Service';
import styles from '../css/WelcomeOnboarding.styles';

interface OnboardingData {
  dietaryNeeds: string[];
  cookingPreferences: string[];
  energyLevel: string;
  instructionStyle: string;
  kitchenTools: string[];
}

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ onComplete }) => {
  const { user } = useAuth0();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    dietaryNeeds: [],
    cookingPreferences: [],
    energyLevel: '',
    instructionStyle: '',
    kitchenTools: [],
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const dietaryOptions = [
    'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 
    'Nut Allergy', 'Shellfish Allergy', 'Kosher', 'Halal',
    'Low Sodium', 'Diabetic-Friendly', 'Keto', 'Paleo'
  ];

  const cookingPreferenceOptions = [
    'No fine chopping', 'One-handed techniques', 'Can be done while seated',
    'Minimal standing', 'Easy cleanup', 'One-pot meals',
    'Pre-cut ingredients OK', 'Simple techniques only'
  ];

  const energyLevelOptions = [
    { value: 'quick', label: 'Quick & simple (under 20 mins)', emoji: '⚡' },
    { value: 'moderate', label: 'I have some energy', emoji: '💪' },
    { value: 'project', label: 'Ready for a project!', emoji: '🚀' }
  ];

  const instructionStyleOptions = [
    { value: 'basic', label: 'Just the basics', emoji: '📝' },
    { value: 'detailed', label: 'Detailed step-by-step', emoji: '📋' },
    { value: 'visual', label: 'Include timers and photos', emoji: '📸' }
  ];

  const kitchenToolOptions = [
    'Air Fryer', 'Microwave', 'Food Processor', 'Blender',
    'Slow Cooker', 'Instant Pot', 'Stand Mixer', 'Immersion Blender',
    'Rice Cooker', 'Toaster Oven', 'Griddle', 'Waffle Maker'
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data
      const userProfile: UserProfile = {
        firstName: user?.given_name || '',
        lastName: user?.family_name || '',
        dietaryRestrictions: onboardingData.dietaryNeeds,
        accessibilityNeeds: [
          ...onboardingData.cookingPreferences,
          `Energy Level: ${onboardingData.energyLevel}`,
          `Instructions: ${onboardingData.instructionStyle}`
        ],
        favoriteCuisines: [], // We'll add this later
        profileSetupCompleted: true,
      };

      console.log('Onboarding data:', onboardingData);
      UserStorage.saveUserProfile(userProfile);
      UserStorage.markProfileSetupCompleted();
      
      Alert.alert(
        'Welcome to a11Yum! 🎉',
        'Your personalized recipe experience is ready. Let\'s start cooking!',
        [{ text: 'Let\'s Cook!', onPress: onComplete }]
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true; // Welcome step
      case 2: return true; // Dietary needs (optional)
      case 3: return true; // Cooking preferences (optional)
      case 4: return onboardingData.energyLevel !== '' && onboardingData.instructionStyle !== '';
      case 5: return true; // Kitchen tools (optional)
      default: return false;
    }
  };

  const renderStep1 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Welcome to a11Yum! 👋</Text>
      <Text style={styles.stepDescription}>
        Let's tailor your recipe experience. Tell us a bit about what you need in a recipe.
      </Text>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          We'll use this information to generate recipes that work perfectly for you and your kitchen.
        </Text>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Dietary Needs</Text>
      <Text style={styles.stepDescription}>
        Any specific dietary requirements? (Select all that apply)
      </Text>
      <View style={styles.optionsGrid}>
        {dietaryOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionChip,
              onboardingData.dietaryNeeds.includes(option) && styles.optionChipSelected
            ]}
            onPress={() => toggleArrayItem(
              onboardingData.dietaryNeeds,
              option,
              (items) => setOnboardingData({...onboardingData, dietaryNeeds: items})
            )}
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: onboardingData.dietaryNeeds.includes(option) }}
            accessibilityLabel={`${option} dietary requirement`}
          >
            <Text style={[
              styles.optionChipText,
              onboardingData.dietaryNeeds.includes(option) && styles.optionChipTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>How do you prefer to cook?</Text>
      <Text style={styles.stepDescription}>
        Select any cooking preferences that apply to you
      </Text>
      <View style={styles.optionsGrid}>
        {cookingPreferenceOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionChip,
              onboardingData.cookingPreferences.includes(option) && styles.optionChipSelected
            ]}
            onPress={() => toggleArrayItem(
              onboardingData.cookingPreferences,
              option,
              (items) => setOnboardingData({...onboardingData, cookingPreferences: items})
            )}
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: onboardingData.cookingPreferences.includes(option) }}
            accessibilityLabel={`${option} cooking preference`}
          >
            <Text style={[
              styles.optionChipText,
              onboardingData.cookingPreferences.includes(option) && styles.optionChipTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep4 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Energy & Instructions</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's your typical energy level for cooking?</Text>
        <View style={styles.buttonGroup}>
          {energyLevelOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.energyButton,
                onboardingData.energyLevel === option.value && styles.energyButtonSelected
              ]}
              onPress={() => setOnboardingData({...onboardingData, energyLevel: option.value})}
              accessible={true}
              accessibilityRole="radio"
              accessibilityState={{ checked: onboardingData.energyLevel === option.value }}
              accessibilityLabel={`Energy level: ${option.label}`}
            >
              <Text style={styles.energyEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.energyButtonText,
                onboardingData.energyLevel === option.value && styles.energyButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How do you like your instructions?</Text>
        <View style={styles.buttonGroup}>
          {instructionStyleOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.instructionButton,
                onboardingData.instructionStyle === option.value && styles.instructionButtonSelected
              ]}
              onPress={() => setOnboardingData({...onboardingData, instructionStyle: option.value})}
              accessible={true}
              accessibilityRole="radio"
              accessibilityState={{ checked: onboardingData.instructionStyle === option.value }}
              accessibilityLabel={`Instruction style: ${option.label}`}
            >
              <Text style={styles.instructionEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.instructionButtonText,
                onboardingData.instructionStyle === option.value && styles.instructionButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderStep5 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Kitchen Tools</Text>
      <Text style={styles.stepDescription}>
        What tools do you have? This helps us suggest recipes you can actually make.
      </Text>
      <View style={styles.optionsGrid}>
        {kitchenToolOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionChip,
              onboardingData.kitchenTools.includes(option) && styles.optionChipSelected
            ]}
            onPress={() => toggleArrayItem(
              onboardingData.kitchenTools,
              option,
              (items) => setOnboardingData({...onboardingData, kitchenTools: items})
            )}
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: onboardingData.kitchenTools.includes(option) }}
            accessibilityLabel={`${option} kitchen tool`}
          >
            <Text style={[
              styles.optionChipText,
              onboardingData.kitchenTools.includes(option) && styles.optionChipTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="a11Yum app logo"
        />
        <Text style={styles.appTitle}>a11Yum</Text>
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                step <= currentStep && styles.progressDotActive
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={!canProceed()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={currentStep === 5 ? "Complete setup" : "Next step"}
        >
          <Text style={[styles.nextButtonText, !canProceed() && styles.nextButtonTextDisabled]}>
            {currentStep === 5 ? 'Complete Setup' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeOnboarding;
