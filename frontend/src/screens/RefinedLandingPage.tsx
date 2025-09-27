import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface RefinedLandingPageProps {
  onGetStarted: () => void;
}

const RefinedLandingPage: React.FC<RefinedLandingPageProps> = ({ onGetStarted }) => {
  const [currentText, setCurrentText] = useState('a11Yum');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Text animation cycle
    const textCycle = () => {
      const texts = ['a11Yum', 'Accessibility + Yum', 'a11Yum'];
      let index = 0;

      const cycle = () => {
        setCurrentText(texts[index]);
        index = (index + 1) % texts.length;
        setTimeout(cycle, 3000);
      };

      setTimeout(cycle, 2000);
    };

    textCycle();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Image
              source={require('../../assets/logo-removebg-preview.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title */}
          <View style={styles.titleSection}>
          <Text style={[styles.title, { fontFamily: 'Geist-Bold' }]}>{currentText}</Text>
          <Text style={[styles.subtitle, { fontFamily: 'Geist-SemiBold' }]}>
            Accessible Recipe Generation for Everyone
          </Text>
          <Text style={[styles.description, { fontFamily: 'Geist' }]}>
            Create personalized recipes tailored to your dietary needs,
            accessibility requirements, and cooking preferences.
          </Text>
          </View>
        </Animated.View>

        {/* Features Section */}
        <Animated.View 
          style={[
            styles.featuresSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { fontFamily: 'Geist-SemiBold' }]}>Why Choose a11Yum?</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>♿</Text>
              <Text style={[styles.featureTitle, { fontFamily: 'Geist-SemiBold' }]}>Accessible</Text>
              <Text style={[styles.featureDescription, { fontFamily: 'Geist' }]}>
                Designed with accessibility in mind for all users
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🍳</Text>
              <Text style={[styles.featureTitle, { fontFamily: 'Geist-SemiBold' }]}>Personalized</Text>
              <Text style={[styles.featureDescription, { fontFamily: 'Geist' }]}>
                Recipes tailored to your specific needs and preferences
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={[styles.featureTitle, { fontFamily: 'Geist-SemiBold' }]}>Quick</Text>
              <Text style={[styles.featureDescription, { fontFamily: 'Geist' }]}>
                Generate recipes in seconds, not minutes
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={[styles.featureTitle, { fontFamily: 'Geist-SemiBold' }]}>Smart</Text>
              <Text style={[styles.featureDescription, { fontFamily: 'Geist' }]}>
                AI-powered recommendations based on your profile
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA Section */}
        <Animated.View 
          style={[
            styles.ctaSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <Text style={[styles.getStartedButtonText, { fontFamily: 'Geist-SemiBold' }]}>
              Get Started
            </Text>
            <Text style={[styles.getStartedButtonSubtext, { fontFamily: 'Geist' }]}>
              Create your first recipe
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  logoContainer: {
    marginBottom: 30,
    shadowColor: Colors.primary.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 120,
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary.green,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: Colors.primary.orange,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: Colors.primary.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  getStartedButtonText: {
    color: Colors.text.inverse,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  getStartedButtonSubtext: {
    color: Colors.text.inverse,
    fontSize: 14,
    opacity: 0.9,
  },
});

export default RefinedLandingPage;
