import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Label } from '../../components/ui/label';
import * as SwitchPrimitives from '@rn-primitives/switch';
import styles from '../css/SettingsScreen.styles';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';
import RefinedWelcomeOnboarding from './RefinedWelcomeOnboarding';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useAuth0Profile } from '../services/Auth0Service';
import { useAuth0Management } from '../services/Auth0ManagementService';

const SettingsScreen: React.FC = () => {
  const { user, clearSession } = useAuth0();
  const { theme, isDark, setTheme, colors } = useThemeStyles();
  const { getUserProfile } = useAuth0Profile();
  const { getUserProfile: getAuth0Profile } = useAuth0Management();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // User name state
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [voiceAssist, setVoiceAssist] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleHaptic = () => {
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };


  const handleLogout = () => {
    handleHaptic();
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearSession();
            } catch (e) {
              console.log('Logout cancelled');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    handleHaptic();
    setShowProfileEdit(true);
  };

  const handleProfileEditComplete = () => {
    setShowProfileEdit(false);
  };

  // Fetch user profile to get firstName and fullName (same pattern as HomeScreen)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        
        try {
          // Try to get profile from Auth0 Management API
          const auth0Profile = await getAuth0Profile();
          console.log('📋 Retrieved profile from Auth0 Management service:', auth0Profile);
          
          if (auth0Profile?.firstName && auth0Profile.firstName.trim().length > 0) {
            console.log('✅ Found firstName in Management service:', auth0Profile.firstName);
            setUserFirstName(auth0Profile.firstName);
            // Build full name
            const lastName = auth0Profile.lastName || user?.family_name || user?.name?.split(' ').slice(1).join(' ') || '';
            setUserFullName(`${auth0Profile.firstName} ${lastName}`.trim());
            return;
          }
        } catch (error) {
          console.log('❌ Error fetching from Management service:', error);
        }
        
        // Try different ways to access user_metadata
        console.log('🔍 Checking various user_metadata access patterns...');
        
        // Method 1: Direct user_metadata
        if (user.user_metadata?.firstName) {
          console.log('✅ Found firstName in user.user_metadata:', user.user_metadata.firstName);
          setUserFirstName(user.user_metadata.firstName);
          const lastName = user.user_metadata?.lastName || user?.family_name || user?.name?.split(' ').slice(1).join(' ') || '';
          setUserFullName(`${user.user_metadata.firstName} ${lastName}`.trim());
          return;
        }
        
        // Method 2: Check if it's under a different property
        if (user['https://myapp.example.com/user_metadata']?.firstName) {
          console.log('✅ Found firstName in custom claim:', user['https://myapp.example.com/user_metadata'].firstName);
          const firstName = user['https://myapp.example.com/user_metadata'].firstName;
          setUserFirstName(firstName);
          const lastName = user['https://myapp.example.com/user_metadata']?.lastName || user?.family_name || user?.name?.split(' ').slice(1).join(' ') || '';
          setUserFullName(`${firstName} ${lastName}`.trim());
          return;
        }
        
        // Method 3: Check raw user object for any firstName
        if (user.firstName) {
          console.log('✅ Found firstName directly in user object:', user.firstName);
          setUserFirstName(user.firstName);
          const lastName = user?.family_name || user?.name?.split(' ').slice(1).join(' ') || '';
          setUserFullName(`${user.firstName} ${lastName}`.trim());
          return;
        }
        
        // Fallback to Auth0 given_name (avoid name/nickname which might be email)
        if (user?.given_name && !user.given_name.includes('@')) {
          console.log('✅ Using Auth0 given_name:', user.given_name);
          setUserFirstName(user.given_name);
          const lastName = user?.family_name || user?.name?.split(' ').slice(1).join(' ') || '';
          setUserFullName(`${user.given_name} ${lastName}`.trim());
          return;
        }
        
        console.log('⚠️ No valid firstName found in user object');
        
        // Final attempt: Try to extract from email or name if it looks like a real name
        if (user.given_name && !user.given_name.includes('@') && user.given_name !== user.email) {
          console.log('✅ Using Auth0 given_name as fallback:', user.given_name);
          setUserFirstName(user.given_name);
          setUserFullName(user.given_name);
          return;
        }
        
        // Extract potential first name from email username (before @)
        if (user.email && user.email.includes('@')) {
          const emailUsername = user.email.split('@')[0];
          // Only use if it doesn't look like random characters
          if (emailUsername.length >= 2 && !emailUsername.includes('.') && isNaN(Number(emailUsername))) {
            console.log('✅ Using email username as firstName:', emailUsername);
            setUserFirstName(emailUsername);
            setUserFullName(emailUsername);
            return;
          }
        }
        
        console.log('⚠️ No valid firstName found, using default');
        setUserFirstName(null);
        setUserFullName(null);
      }
    };

    fetchUserProfile();
  }, [user, getAuth0Profile]);

  // Show profile editing screen if requested
  if (showProfileEdit) {
    return <RefinedWelcomeOnboarding onComplete={handleProfileEditComplete} isEditing={true} />;
  }

  const settingSections = [
    {
      title: 'Appearance',
      settings: [
        {
          id: 'dark-mode',
          label: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          checked: isDark,
          onCheckedChange: (checked: boolean) => {
            handleHaptic();
            setTheme(checked ? 'dark' : 'light');
          },
        },
        {
          id: 'large-text',
          label: 'Large Text',
          description: 'Increase text size for better readability',
          checked: largeText,
          onCheckedChange: (checked: boolean) => {
            handleHaptic();
            setLargeText(checked);
          },
        },
        {
          id: 'high-contrast',
          label: 'High Contrast',
          description: 'Enhance contrast for better visibility',
          checked: highContrast,
          onCheckedChange: (checked: boolean) => {
            handleHaptic();
            setHighContrast(checked);
          },
        },
      ],
    },
    {
      title: 'Notifications & Feedback',
      settings: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Recipe reminders and cooking tips',
          checked: notifications,
          onCheckedChange: (checked: boolean) => {
            handleHaptic();
            setNotifications(checked);
          },
        },
        {
          id: 'haptics',
          label: 'Haptic Feedback',
          description: 'Vibration feedback for interactions',
          checked: haptics,
          onCheckedChange: (checked: boolean) => {
            handleHaptic();
            setHaptics(checked);
          },
        },
      ],
    },
    {
      title: 'Accessibility',
      settings: [
        {
          id: 'voice-assist',
          label: 'Voice Assistant',
          description: 'Voice commands and audio guidance',
          checked: voiceAssist,
          onCheckedChange: (checked: boolean) => {
            handleHaptic();
            setVoiceAssist(checked);
          },
        },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* User Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {(userFirstName || 'User').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { fontFamily: 'Geist-SemiBold', color: colors.text }]}>
            {userFullName || userFirstName || 'User'}
          </Text>
          <Text style={[styles.userEmail, { fontFamily: 'Geist', color: colors.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Geist-SemiBold', color: colors.text }]}>{section.title}</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            {section.settings.map((setting, settingIndex) => (
              <View key={setting.id}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Label
                      nativeID={setting.id}
                      style={[styles.settingLabel, { fontFamily: 'Geist-Medium', color: colors.text }]}
                    >
                      {setting.label}
                    </Label>
                    <Text style={[styles.settingDescription, { fontFamily: 'Geist', color: colors.textSecondary }]}>
                      {setting.description}
                    </Text>
                  </View>
                  <SwitchPrimitives.Root
                    checked={setting.checked}
                    onCheckedChange={setting.onCheckedChange}
                    id={setting.id}
                    nativeID={setting.id}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: setting.checked ? colors.primary : colors.border,
                      justifyContent: 'center',
                      alignItems: setting.checked ? 'flex-end' : 'flex-start',
                      paddingHorizontal: 2,
                    }}
                  >
                    <SwitchPrimitives.Thumb
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: Colors.background.primary,
                      }}
                    />
                  </SwitchPrimitives.Root>
                </View>
                {settingIndex < section.settings.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontFamily: 'Geist-SemiBold', color: colors.text }]}>Account</Text>
        <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditProfile}
          >
            <Text style={[styles.actionButtonText, { fontFamily: 'Geist-Medium', color: colors.text }]}>Edit Profile</Text>
            <Text style={styles.actionButtonIcon}>👤</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              handleHaptic();
              Alert.alert('Export Data', 'Feature coming soon! You\'ll be able to export your recipes and preferences.');
            }}
          >
            <Text style={[styles.actionButtonText, { fontFamily: 'Geist-Medium', color: colors.text }]}>Export Data</Text>
            <Text style={styles.actionButtonIcon}>📤</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              handleHaptic();
              Alert.alert('Help & Support', 'Feature coming soon! Access help documentation and contact support.');
            }}
          >
            <Text style={[styles.actionButtonText, { fontFamily: 'Geist-Medium', color: colors.text }]}>Help & Support</Text>
            <Text style={styles.actionButtonIcon}>❓</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText, { fontFamily: 'Geist-Medium', color: colors.error }]}>Logout</Text>
            <Text style={styles.actionButtonIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfoSection}>
        <Text style={[styles.appInfoTitle, { fontFamily: 'Geist-Bold', color: colors.primary }]}>a11Yum</Text>
        <Text style={[styles.appInfoText, { fontFamily: 'Geist', color: colors.textSecondary }]}>Version 1.0.0</Text>
        <Text style={[styles.appInfoText, { fontFamily: 'Geist', color: colors.textSecondary }]}>Accessible Recipe Generation</Text>
        <Text style={[styles.appInfoSubtext, { fontFamily: 'Geist', color: colors.textSecondary }]}>
          Made with ❤️ for everyone who loves to cook
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
