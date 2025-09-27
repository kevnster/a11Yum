import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { UserStorage } from '../utils/UserStorage';
import { UserProfile } from '../services/Auth0Service';

interface ProfileData {
  firstName: string;
  lastName: string;
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  favoriteCuisines: string[];
}

const UserProfileSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { user } = useAuth0();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.given_name || '',
    lastName: user?.family_name || '',
    dietaryRestrictions: [],
    accessibilityNeeds: [],
    favoriteCuisines: [],
  });

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut Allergy', 'Shellfish Allergy', 'Kosher', 'Halal'
  ];

  const accessibilityOptions = [
    'Wheelchair Access', 'Visual Impairment', 'Hearing Impairment',
    'Mobility Assistance', 'Service Animal Friendly', 'Quiet Environment'
  ];

  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
    'American', 'Mediterranean', 'French', 'Korean', 'Vietnamese'
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile data and mark setup as completed
      const userProfile: UserProfile = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dietaryRestrictions: profileData.dietaryRestrictions,
        accessibilityNeeds: profileData.accessibilityNeeds,
        favoriteCuisines: profileData.favoriteCuisines,
        profileSetupCompleted: true,
      };
      
      console.log('Profile data:', userProfile);
      UserStorage.saveUserProfile(userProfile);
      UserStorage.markProfileSetupCompleted();
      Alert.alert('Profile Complete!', 'Welcome to a11Yum!', [
        { text: 'Continue', onPress: onComplete }
      ]);
    }
  };

  const handleSkip = () => {
    Alert.alert('Skip Profile Setup?', 'You can complete this later in settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Skip', onPress: onComplete }
    ]);
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepDescription}>Tell us a bit about yourself</Text>
      
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={profileData.firstName}
        onChangeText={(text) => setProfileData({...profileData, firstName: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={profileData.lastName}
        onChangeText={(text) => setProfileData({...profileData, lastName: text})}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Dietary Restrictions</Text>
      <Text style={styles.stepDescription}>Select any dietary restrictions or preferences</Text>
      
      <View style={styles.optionsContainer}>
        {dietaryOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              profileData.dietaryRestrictions.includes(option) && styles.optionButtonSelected
            ]}
            onPress={() => toggleArrayItem(
              profileData.dietaryRestrictions, 
              option, 
              (items) => setProfileData({...profileData, dietaryRestrictions: items})
            )}
          >
            <Text style={[
              styles.optionButtonText,
              profileData.dietaryRestrictions.includes(option) && styles.optionButtonTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Accessibility Needs</Text>
      <Text style={styles.stepDescription}>Help us find accessible restaurants for you</Text>
      
      <View style={styles.optionsContainer}>
        {accessibilityOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              profileData.accessibilityNeeds.includes(option) && styles.optionButtonSelected
            ]}
            onPress={() => toggleArrayItem(
              profileData.accessibilityNeeds, 
              option, 
              (items) => setProfileData({...profileData, accessibilityNeeds: items})
            )}
          >
            <Text style={[
              styles.optionButtonText,
              profileData.accessibilityNeeds.includes(option) && styles.optionButtonTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Favorite Cuisines</Text>
      <Text style={styles.stepDescription}>What types of food do you enjoy?</Text>
      
      <View style={styles.optionsContainer}>
        {cuisineOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              profileData.favoriteCuisines.includes(option) && styles.optionButtonSelected
            ]}
            onPress={() => toggleArrayItem(
              profileData.favoriteCuisines, 
              option, 
              (items) => setProfileData({...profileData, favoriteCuisines: items})
            )}
          >
            <Text style={[
              styles.optionButtonText,
              profileData.favoriteCuisines.includes(option) && styles.optionButtonTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to a11Yum!</Text>
        <Text style={styles.subtitle}>Let's set up your profile</Text>
        
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((step) => (
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

      <ScrollView style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === 4 ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    minWidth: '48%',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  optionButtonTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UserProfileSetup;
