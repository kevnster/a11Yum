import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet, TextInput } from 'react-native';
import styles from '../css/RecipeModal.styles';

interface CreateRecipeButtonProps {
  variant?: 'button' | 'link';
  buttonStyle?: any;
  textStyle?: any;
  label?: string;
  onCreate?: (url: string) => void; // optional callback to create/open a unique screen for the provided URL
}

export const CreateRecipeButton: React.FC<CreateRecipeButtonProps> = ({
  variant = 'button',
  buttonStyle,
  textStyle,
  label,
  onCreate,
}) => {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      scale.setValue(0.96);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]).start();
    } else {
      // clear input when modal closed
      setUrlInput('');
      setUrlError(null);
    }
  }, [visible]);

  const open = () => setVisible(true);
  const close = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
    ]).start(() => setVisible(false));
  };

  const createFlow = () => {
    const url = urlInput.trim();
    if (!url) {
      setUrlError('Please enter a recipe URL');
      return;
    }
    if (onCreate) onCreate(url);
    close();
  };

  if (variant === 'link') {
    return (
      <>
        <TouchableOpacity onPress={open}>
          <Text style={textStyle || styles.linkText}>{label || '+ Create New'}</Text>
        </TouchableOpacity>

        <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
              <Text style={styles.title}>Create Recipe</Text>
              <Text style={styles.message}>
                Paste a recipe URL to create a unique, curated recipe.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="https://www.allrecipes.com/recipe/12345/..."
                value={urlInput}
                onChangeText={(t) => { setUrlInput(t); setUrlError(null); }}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {urlError ? <Text style={styles.errorText}>{urlError}</Text> : null}

              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.btn, styles.primary]} onPress={createFlow}>
                  <Text style={styles.btnText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={close}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <>
      <TouchableOpacity style={buttonStyle || styles.button} onPress={open}>
        <Text style={textStyle || styles.buttonText}>{label || '✨ Create Your First Recipe'}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
            <Text style={styles.title}>Create Recipe</Text>
            <Text style={styles.message}>
              Paste a recipe URL to create a unique, curated recipe.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="https://www.allrecipes.com/recipe/12345/..."
              value={urlInput}
              onChangeText={(t) => { setUrlInput(t); setUrlError(null); }}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {urlError ? <Text style={styles.errorText}>{urlError}</Text> : null}

            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.btn, styles.primary]} onPress={createFlow}>
                <Text style={styles.btnText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={close}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};