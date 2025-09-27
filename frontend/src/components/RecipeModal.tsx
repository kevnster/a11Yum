import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet } from 'react-native';

interface CreateRecipeButtonProps {
  variant?: 'button' | 'link';
  buttonStyle?: any;
  textStyle?: any;
  label?: string;
}

export const CreateRecipeButton: React.FC<CreateRecipeButtonProps> = ({
  variant = 'button',
  buttonStyle,
  textStyle,
  label,
}) => {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      scale.setValue(0.96);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]).start();
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
    // ...hook into real create flow here...
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
                Generate a curated, accessibility-friendly version of a recipe.
              </Text>
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
              Generate a curated, accessibility-friendly version of a recipe.
            </Text>
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  message: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  buttons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btn: { flex: 1, paddingVertical: 10, marginHorizontal: 6, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#4CAF50' },
  secondary: { backgroundColor: '#ddd' },
  btnText: { color: '#fff', fontWeight: '600' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  linkText: { color: '#4CAF50', fontWeight: '700' },
});
