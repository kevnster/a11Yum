import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { user, clearSession } = useAuth0();
  const systemColorScheme = useColorScheme();
  
  // State for various settings
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [voiceAssistantEnabled, setVoiceAssistantEnabled] = useState(false);
  const [largeTextEnabled, setLargeTextEnabled] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);

  useEffect(() => {
    // Sync with system theme if user hasn't manually set it
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const handleHapticFeedback = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, currentValue: boolean) => {
    handleHapticFeedback();
    setter(!currentValue);
  };

  const handleLogout = async () => {
    handleHapticFeedback();
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

  const settingsData = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'dark-mode',
          label: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          value: isDarkMode,
          onToggle: () => handleToggle(setIsDarkMode, isDarkMode),
        },
        {
          id: 'high-contrast',
          label: 'High Contrast',
          description: 'Increase contrast for better visibility',
          value: highContrastEnabled,
          onToggle: () => handleToggle(setHighContrastEnabled, highContrastEnabled),
        },
        {
          id: 'large-text',
          label: 'Large Text',
          description: 'Use larger text sizes',
          value: largeTextEnabled,
          onToggle: () => handleToggle(setLargeTextEnabled, largeTextEnabled),
        },
      ],
    },
    {
      title: 'Notifications & Feedback',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive recipe suggestions and reminders',
          value: notificationsEnabled,
          onToggle: () => handleToggle(setNotificationsEnabled, notificationsEnabled),
        },
        {
          id: 'haptics',
          label: 'Haptic Feedback',
          description: 'Feel vibrations when interacting',
          value: hapticsEnabled,
          onToggle: () => handleToggle(setHapticsEnabled, hapticsEnabled),
        },
      ],
    },
    {
      title: 'Accessibility',
      items: [
        {
          id: 'voice-assistant',
          label: 'Voice Assistant',
          description: 'Enable voice commands and reading',
          value: voiceAssistantEnabled,
          onToggle: () => handleToggle(setVoiceAssistantEnabled, voiceAssistantEnabled),
        },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            handleHapticFeedback();
            onBack();
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>
      </View>

      {/* User Info */}
      <View style={[styles.userSection, isDarkMode && styles.darkCard]}>
        <Text style={[styles.userName, isDarkMode && styles.darkText]}>
          {user?.name || 'User'}
        </Text>
        <Text style={[styles.userEmail, isDarkMode && styles.darkSecondaryText]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>

      {/* Settings Sections */}
      {settingsData.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {section.title}
          </Text>
          <View style={[styles.sectionCard, isDarkMode && styles.darkCard]}>
            {section.items.map((item, itemIndex) => (
              <View key={item.id} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Label 
                    nativeID={item.id} 
                    htmlFor={item.id}
                    style={[styles.settingLabel, isDarkMode && styles.darkText]}
                    onPress={item.onToggle}
                  >
                    {item.label}
                  </Label>
                  <Text style={[styles.settingDescription, isDarkMode && styles.darkSecondaryText]}>
                    {item.description}
                  </Text>
                </View>
                <Switch
                  checked={item.value}
                  onCheckedChange={item.onToggle}
                  id={item.id}
                  nativeID={item.id}
                />
                {itemIndex < section.items.length - 1 && (
                  <View style={[styles.separator, isDarkMode && styles.darkSeparator]} />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} 
          onPress={handleLogout}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Logout from account"
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={[styles.appInfoText, isDarkMode && styles.darkSecondaryText]}>
          a11Yum v1.0.0
        </Text>
        <Text style={[styles.appInfoText, isDarkMode && styles.darkSecondaryText]}>
          Accessible Recipe Generation
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  darkContainer: {
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary.orange,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#AAAAAA',
  },
  userSection: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1A1A1A',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    position: 'relative',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: Colors.neutral.mediumGray,
  },
  darkSeparator: {
    backgroundColor: '#333333',
  },
  logoutButton: {
    backgroundColor: Colors.semantic.error,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkLogoutButton: {
    backgroundColor: '#DC2626',
  },
  logoutButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
});

export default SettingsPage;
