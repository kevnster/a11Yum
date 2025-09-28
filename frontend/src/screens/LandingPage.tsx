import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  AccessibilityInfo,
  Image,
} from 'react-native';
import Colors from '../constants/Colors';
import styles from '../css/LandingPage.styles';

const { width, height } = Dimensions.get('window');

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [displayText, setDisplayText] = useState('a11Yum');
  const [showMouse, setShowMouse] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypedText, setCurrentTypedText] = useState('');
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize animated values with useRef to avoid React 19 issues
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const mouseXAnim = useRef(new Animated.Value(100)).current;
  const mouseYAnim = useRef(new Animated.Value(50)).current;
  const mouseFadeAnim = useRef(new Animated.Value(0)).current;
  const selectionAnim = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    // Start animations on mount - use useLayoutEffect to avoid React 19 scheduling issues
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

    // Continuous rotation for the logo
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Note: Removed blinking cursor animation as we now use mouse interaction

    // Smooth mouse interaction animation
    const startMouseAnimation = () => {
      const typingText = 'ccessibilit';
      
      const animateSequence = () => {
        // Clear any existing timeout
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        
        // Reset state
        setDisplayText('a11Yum');
        setCurrentTypedText('');
        setIsSelecting(false);
        setIsTyping(false);
        
        // Step 1: Mouse fades in from bottom right and moves to "11"
        setShowMouse(true);
        Animated.parallel([
          Animated.timing(mouseFadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(mouseXAnim, {
            toValue: 0, // Position over the "11"
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(mouseYAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          
          // Step 2: Mouse starts selecting (drag over "11")
          setIsSelecting(true);
          Animated.timing(selectionAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }).start(() => {
            
            // Step 3: Start typing "ccessibilit"
            setIsTyping(true);
            
            const typeCharacter = (index: number) => {
              if (index < typingText.length) {
                setCurrentTypedText(typingText.substring(0, index + 1));
                animationRef.current = setTimeout(() => typeCharacter(index + 1), 120);
              } else {
                // Typing complete
                setTimeout(() => {
                  // Step 4: Mouse fades out and moves away
                  Animated.parallel([
                    Animated.timing(mouseFadeAnim, {
                      toValue: 0,
                      duration: 800,
                      useNativeDriver: true,
                    }),
                    Animated.timing(mouseXAnim, {
                      toValue: 100,
                      duration: 1500,
                      useNativeDriver: true,
                    }),
                    Animated.timing(mouseYAnim, {
                      toValue: 50,
                      duration: 1500,
                      useNativeDriver: true,
                    }),
                  ]).start(() => {
                    setShowMouse(false);
                    
                    // Step 5: Reset after pause
                    setTimeout(() => {
                      setIsSelecting(false);
                      setIsTyping(false);
                      setCurrentTypedText('');
                      Animated.timing(selectionAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: false,
                      }).start(() => {
                        // Wait and repeat
                        animationRef.current = setTimeout(animateSequence, 3000);
                      });
                    }, 2000);
                  });
                }, 1000);
              }
            };
            
            typeCharacter(0);
          });
        });
      };
      
      // Start the animation after initial delay
      animationRef.current = setTimeout(animateSequence, 2000);
    };
    
    startMouseAnimation();

    // Announce page content for screen readers
    AccessibilityInfo.announceForAccessibility('Welcome to a11Yum - Accessible Recipe Generation');
  }, []);

  // Separate effect for mouse animation to avoid React 19 scheduling conflicts
  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleGetStarted = () => {
    // Add haptic feedback for accessibility
    AccessibilityInfo.announceForAccessibility('Starting recipe generation');
    onGetStarted();
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      accessible={true}
      accessibilityRole="main"
      accessibilityLabel="Landing page for a11Yum recipe generation app"
    >
      {/* Header Section */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="App header with logo and title"
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
          accessible={true}
          accessibilityLabel="a11Yum logo"
          accessibilityRole="image"
        >
          <Image
            source={require('../../assets/animated_logo.gif')}
            style={styles.logo}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="a11Yum app logo"
          />
        </Animated.View>
        
        <View style={styles.titleContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title} accessible={true} accessibilityRole="text">
              a
              {!isTyping && !isSelecting && (
                <Text style={styles.normalText}>11</Text>
              )}
              {isSelecting && !isTyping && (
                <Animated.View style={[
                  styles.selectionOverlay,
                  {
                    backgroundColor: selectionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['transparent', 'rgba(33, 150, 243, 0.3)'],
                    }),
                  }
                ]}>
                  <Text style={styles.selectedText}>11</Text>
                </Animated.View>
              )}
              {isTyping && (
                <Text style={styles.typedText}>{currentTypedText}</Text>
              )}
              Yum
            </Text>
            
            {showMouse && (
              <Animated.View style={[
                styles.mouseCursor,
                {
                  opacity: mouseFadeAnim,
                  transform: [
                    {
                      translateX: mouseXAnim,
                    },
                    {
                      translateY: mouseYAnim,
                    },
                  ],
                },
              ]}>
                <Text style={styles.mouseText}>↖</Text>
              </Animated.View>
            )}
          </View>
        </View>
        
        <Text style={styles.subtitle} accessible={true} accessibilityRole="text">
          Accessible Recipe Generation
        </Text>
      </Animated.View>

      {/* Simple CTA Section */}
      <Animated.View 
        style={[
          styles.ctaSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        accessible={true}
        accessibilityRole="region"
        accessibilityLabel="Get started section"
      >
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Get started with recipe generation"
          accessibilityHint="Tap to begin creating accessible recipes"
        >
          <Text style={styles.getStartedButtonText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

export default LandingPage;
