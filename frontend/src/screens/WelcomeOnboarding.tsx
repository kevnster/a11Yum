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
          source={require('../../assets/logo.png')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  welcomeCard: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionChip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    minWidth: '48%',
    alignItems: 'center',
  },
  optionChipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionChipText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  optionChipTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
  },
  energyButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  energyButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  energyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  energyButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  energyButtonTextSelected: {
    color: '#1976D2',
    fontWeight: '500',
  },
  instructionButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  instructionButtonSelected: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9C27B0',
  },
  instructionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  instructionButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  instructionButtonTextSelected: {
    color: '#7B1FA2',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
});

export default WelcomeOnboarding;
