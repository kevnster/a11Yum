// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  filtersSection: {
    padding: 20,
    paddingBottom: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  filtersScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.neutral.mediumGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary.orange,
    borderColor: Colors.primary.orange,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  activeFilterChipText: {
    color: Colors.text.inverse,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  recipesContainer: {
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: 400,
  },
  emptyStateCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  collectionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collectionCard: {
    width: '48%',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collectionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});

export default styles;