import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import styles from '../css/SettingsScreen.styles';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';

const SettingsScreen: React.FC = () => {
  const { user, clearSession } = useAuth0();
  
  // Settings state
  const [darkMode, setDarkMode] = useState(false);
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

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    handleHaptic();
    setter(!value);
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

  const settingSections = [
    {
      title: 'Appearance',
      settings: [
        {
          id: 'dark-mode',
          label: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          value: darkMode,
          onToggle: () => handleToggle(setDarkMode, darkMode),
        },
        {
          id: 'large-text',
          label: 'Large Text',
          description: 'Increase text size for better readability',
          value: largeText,
          onToggle: () => handleToggle(setLargeText, largeText),
        },
        {
          id: 'high-contrast',
          label: 'High Contrast',
          description: 'Enhance contrast for better visibility',
          value: highContrast,
          onToggle: () => handleToggle(setHighContrast, highContrast),
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
          value: notifications,
          onToggle: () => handleToggle(setNotifications, notifications),
        },
        {
          id: 'haptics',
          label: 'Haptic Feedback',
          description: 'Vibration feedback for interactions',
          value: haptics,
          onToggle: () => handleToggle(setHaptics, haptics),
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
          value: voiceAssist,
          onToggle: () => handleToggle(setVoiceAssist, voiceAssist),
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || '👤'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
      </View>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.settingsCard}>
            {section.settings.map((setting, settingIndex) => (
              <View key={setting.id}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Label
                      nativeID={setting.id}
                      style={styles.settingLabel}
                      onPress={setting.onToggle}
                    >
                      {setting.label}
                    </Label>
                    <Text style={styles.settingDescription}>
                      {setting.description}
                    </Text>
                  </View>
                  <Switch
                    checked={setting.value}
                    onCheckedChange={setting.onToggle}
                    id={setting.id}
                    nativeID={setting.id}
                  />
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
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              handleHaptic();
              Alert.alert('Export Data', 'Feature coming soon! You\'ll be able to export your recipes and preferences.');
            }}
          >
            <Text style={styles.actionButtonText}>Export Data</Text>
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
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Text style={styles.actionButtonIcon}>❓</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
            <Text style={styles.actionButtonIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfoSection}>
        <Text style={styles.appInfoTitle}>a11Yum</Text>
        <Text style={styles.appInfoText}>Version 1.0.0</Text>
        <Text style={styles.appInfoText}>Accessible Recipe Generation</Text>
        <Text style={styles.appInfoSubtext}>
          Made with ❤️ for everyone who loves to cook
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
