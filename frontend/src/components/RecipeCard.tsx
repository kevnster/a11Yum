import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Recipe } from '../types/Recipe';
import styles from '../css/RecipeCard.styles';

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

export default RecipeCard;
