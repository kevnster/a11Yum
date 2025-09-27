import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
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
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    height: 1,
    backgroundColor: Colors.neutral.mediumGray,
    marginHorizontal: 16,
  },
  actionsCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  logoutButton: {
    // Additional styling for logout button if needed
  },
  logoutButtonText: {
    color: Colors.semantic.error,
  },
  appInfoSection: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 50,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SettingsScreen;
