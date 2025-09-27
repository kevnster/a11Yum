import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStyles } from '../hooks/useThemeStyles';

interface RecipeDetailScreenProps {
  route: {
    params: {
      url: string;
    };
  };
  navigation: any;
}

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { url } = route.params;
  const { colors } = useThemeStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrowText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Recipe</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Recipe Screen</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This is a blank recipe screen where you can add your recipe content.
        </Text>
        
        <View style={[styles.urlContainer, { backgroundColor: colors.card || '#F5F5F5' }]}>
          <Text style={[styles.urlLabel, { color: colors.textSecondary }]}>Recipe URL:</Text>
          <Text style={[styles.urlText, { color: colors.text }]}>{url}</Text>
        </View>

        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          You can now build out this screen with your recipe content, ingredients, instructions, and more!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backArrow: {
    padding: 8,
  },
  backArrowText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40, // To balance the back button
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  urlContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  urlText: {
    fontSize: 14,
    lineHeight: 20,
  },
  instruction: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default RecipeDetailScreen;