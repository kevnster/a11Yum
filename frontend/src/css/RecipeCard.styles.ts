// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

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
})

export default styles;
