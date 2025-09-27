import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type LandingPageNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

interface LandingPageProps {
  onGetStarted?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const navigation = useNavigation<LandingPageNavigationProp>();
  
  // Get safe area insets - simplified for web compatibility
  const insets = Platform.OS === 'web' 
    ? { top: 0, bottom: 0, left: 0, right: 0 }
    : { top: 20, bottom: 0, left: 0, right: 0 }; // Default mobile padding

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.logo}>a11Yum</Text>
          <Text style={styles.tagline}>Accessible Food for Everyone</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Discover Accessible{'\n'}Dining Experiences
            </Text>
            <Text style={styles.heroSubtitle}>
              Find restaurants, cafes, and food services that prioritize accessibility and inclusivity for all diners.
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>♿</Text>
            </View>
            <Text style={styles.featureTitle}>Wheelchair Accessible</Text>
            <Text style={styles.featureDescription}>
              Find venues with proper accessibility features
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>👁️</Text>
            </View>
            <Text style={styles.featureTitle}>Visual Accessibility</Text>
            <Text style={styles.featureDescription}>
              Menus and information in accessible formats
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>👂</Text>
            </View>
            <Text style={styles.featureTitle}>Hearing Friendly</Text>
            <Text style={styles.featureDescription}>
              Quiet spaces and visual communication options
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.ctaSubtext}>
            Join thousands of users finding accessible dining
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Making dining accessible for everyone, everywhere.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  hero: {
    marginBottom: 48,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  features: {
    marginBottom: 48,
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  ctaButton: {
    backgroundColor: '#3182CE',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#3182CE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  ctaSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LandingPage;
