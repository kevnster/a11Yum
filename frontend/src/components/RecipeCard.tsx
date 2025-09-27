import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Recipe } from '../types/Recipe';
import Colors from '../constants/Colors';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress, onFavoritePress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <CardHeader style={styles.cardHeader}>
          {recipe.imageUrl && (
            <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
          )}
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>
                {recipe.title}
              </Text>
              <TouchableOpacity 
                onPress={onFavoritePress}
                style={styles.favoriteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.favoriteIcon}>
                  {recipe.isFavorite ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {recipe.description}
            </Text>
          </View>
        </CardHeader>
        
        <CardContent style={styles.cardContent}>
          {/* Time and Difficulty Row */}
          <View style={styles.infoRow}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeIcon}>⏱️</Text>
              <Text style={styles.timeText}>{recipe.getTimeDisplay()}</Text>
            </View>
            
            <Badge 
              variant="secondary" 
              style={[
                styles.difficultyBadge, 
                { backgroundColor: `${recipe.getDifficultyColor()}20` }
              ]}
            >
              <Text style={[
                styles.difficultyText, 
                { color: recipe.getDifficultyColor() }
              ]}>
                {recipe.difficulty}
              </Text>
            </Badge>
          </View>

          {/* Dietary Tags */}
          {recipe.dietaryTags.length > 0 && (
            <View style={styles.tagsContainer}>
              {recipe.dietaryTags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" style={styles.dietaryBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </Badge>
              ))}
              {recipe.dietaryTags.length > 3 && (
                <Text style={styles.moreTagsText}>
                  +{recipe.dietaryTags.length - 3} more
                </Text>
              )}
            </View>
          )}

          {/* Servings */}
          <View style={styles.servingsContainer}>
            <Text style={styles.servingsIcon}>👥</Text>
            <Text style={styles.servingsText}>
              Serves {recipe.servings}
            </Text>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
  },
  recipeImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.neutral.lightGray,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  dietaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderColor: Colors.neutral.mediumGray,
  },
  tagText: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingsIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  servingsText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
});

export default RecipeCard;
