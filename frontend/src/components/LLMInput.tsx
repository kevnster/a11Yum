import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useThemeStyles } from '../hooks/useThemeStyles';

interface LLMInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  onMicrophonePress?: () => void;
  disabled?: boolean;
  maxLength?: number;
  loading?: boolean;
}

export const LLMInput: React.FC<LLMInputProps> = ({
  placeholder = "Ask me anything about recipes...",
  onSend,
  onMicrophonePress,
  disabled = false,
  maxLength = 500,
  loading = false,
}) => {
  const { colors } = useThemeStyles();
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const borderColorAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderColorAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderColorAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSend = () => {
    if (inputText.trim() && onSend && !loading) {
      onSend(inputText.trim());
      setInputText('');
      Keyboard.dismiss();
    }
  };

  const handleMicrophone = () => {
    if (onMicrophonePress) {
      onMicrophonePress();
    }
  };

  const borderColor = borderColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border || '#E5E5E5', colors.primary || '#FF6B35'],
  });

  const hasText = inputText.trim().length > 0;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderColor: borderColor,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          maxLength={maxLength}
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={hasText ? handleSend : undefined}
        />

        {/* Right side buttons */}
        <View style={styles.buttonContainer}>
          {hasText ? (
            /* Send Button */
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: colors.primary || '#FF6B35',
                  opacity: loading ? 0.7 : 1,
                },
              ]}
              onPress={handleSend}
              disabled={disabled || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <SendIcon color="white" />
              )}
            </TouchableOpacity>
          ) : (
            /* Microphone Button */
            <TouchableOpacity
              style={[
                styles.micButton,
                {
                  backgroundColor: colors.card || '#F5F5F5',
                },
              ]}
              onPress={handleMicrophone}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <MicrophoneIcon color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Loading indicator text */}
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color={colors.primary || '#FF6B35'} />
          <Text
            style={[
              styles.loadingText,
              {
                color: colors.primary || '#FF6B35',
              },
            ]}
          >
            Agent is thinking...
          </Text>
        </View>
      )}

      {/* Character count */}
      {isFocused && !loading && (
        <View style={styles.characterCount}>
          <Text
            style={[
              styles.characterCountText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {inputText.length}/{maxLength}
          </Text>
        </View>
      )}
    </View>
  );
};

// Send Icon Component
const SendIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.sendIconArrow, { borderLeftColor: color }]} />
  </View>
);

// Microphone Icon Component
const MicrophoneIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.micIconBody, { backgroundColor: color }]} />
    <View style={[styles.micIconBase, { backgroundColor: color }]} />
    <View style={[styles.micIconStand, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
    maxHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 80,
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginRight: 8,
  },
  characterCountText: {
    fontSize: 12,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  // Icon styles
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Send icon (arrow)
  sendIconArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderLeftColor: 'white',
    borderTopWidth: 6,
    borderTopColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  // Microphone icon
  micIconBody: {
    width: 8,
    height: 12,
    borderRadius: 4,
    marginBottom: 2,
  },
  micIconBase: {
    width: 12,
    height: 2,
    borderRadius: 1,
    marginBottom: 1,
  },
  micIconStand: {
    width: 2,
    height: 4,
    borderRadius: 1,
  },
});

export default LLMInput;