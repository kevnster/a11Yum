import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Label } from '../../components/ui/label';
import * as SwitchPrimitives from '@rn-primitives/switch';
import styles from '../css/SettingsScreen.styles';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';
import RefinedWelcomeOnboarding from './RefinedWelcomeOnboarding';
import { useThemeStyles } from '../hooks/useThemeStyles';

const SettingsScreen: React.FC = () => {
  const { user, clearSession } = useAuth0();
  const { theme, isDark, setTheme, colors } = useThemeStyles();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

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
            {(user?.given_name || user?.name || user?.nickname || 'User').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { fontFamily: 'Geist-SemiBold', color: colors.text }]}>
            {user?.given_name || user?.name || user?.nickname || 'User'}
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
                      onPress={() => setting.onCheckedChange(!setting.checked)}
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
