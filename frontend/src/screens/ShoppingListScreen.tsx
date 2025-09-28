import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Share
} from 'react-native';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { useSavedRecipes } from '../contexts/SavedRecipesContext';
import { ShoppingList, ShoppingItem, INGREDIENT_CATEGORIES } from '../types/ShoppingList';
import * as Haptics from 'expo-haptics';

const ShoppingListScreen: React.FC = () => {
  const { colors } = useThemeStyles();
  const { 
    shoppingLists, 
    currentList, 
    setCurrentList,
    createShoppingList,
    deleteShoppingList,
    addItem,
    removeItem,
    toggleItemChecked,
    generateListFromRecipes,
    shareList,
    clearCompletedItems
  } = useShoppingList();
  const { savedRecipes } = useSavedRecipes();

  const [showNewListModal, setShowNewListModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showRecipeSelectModal, setShowRecipeSelectModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);

  const handleHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCreateList = async () => {
    if (newListName.trim()) {
      handleHaptic();
      await createShoppingList(newListName.trim());
      setNewListName('');
      setShowNewListModal(false);
    }
  };

  const handleDeleteList = (listId: string) => {
    handleHaptic();
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteShoppingList(listId)
        }
      ]
    );
  };

  const handleAddItem = async () => {
    if (newItemName.trim() && currentList) {
      handleHaptic();
      await addItem(currentList.id, {
        name: newItemName.trim(),
        quantity: newItemQuantity.trim(),
        isChecked: false,
        category: INGREDIENT_CATEGORIES.OTHER
      });
      setNewItemName('');
      setNewItemQuantity('');
      setShowAddItemModal(false);
    }
  };

  const handleGenerateFromRecipes = async () => {
    if (selectedRecipes.length > 0) {
      handleHaptic();
      const list = await generateListFromRecipes(selectedRecipes, `Shopping List - ${new Date().toLocaleDateString()}`);
      setCurrentList(list.id);
      setSelectedRecipes([]);
      setShowRecipeSelectModal(false);
    }
  };

  const handleToggleRecipe = (recipeId: string) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const renderListSelector = () => (
    <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Shopping Lists</Text>
      
      {shoppingLists.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🛒</Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            No shopping lists yet
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listsScrollView}>
          {shoppingLists.map(list => (
            <TouchableOpacity
              key={list.id}
              style={[
                styles.listCard,
                { backgroundColor: currentList?.id === list.id ? colors.primary : colors.background },
                { borderColor: currentList?.id === list.id ? colors.primary : colors.border }
              ]}
              onPress={() => {
                handleHaptic();
                setCurrentList(list.id);
              }}
              onLongPress={() => handleDeleteList(list.id)}
            >
              <Text style={[
                styles.listName,
                { color: currentList?.id === list.id ? colors.background : colors.text }
              ]}>
                {list.name}
              </Text>
              <Text style={[
                styles.listItemCount,
                { color: currentList?.id === list.id ? colors.background : colors.textSecondary }
              ]}>
                {list.items.filter(item => !item.isChecked).length} items
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.listActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            handleHaptic();
            setShowNewListModal(true);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.background }]}>+ New List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.secondary, marginLeft: 8 }]}
          onPress={() => {
            handleHaptic();
            setShowRecipeSelectModal(true);
          }}
        >
          <Text style={[styles.actionButtonText, { color: colors.text }]}>From Recipes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderShoppingList = () => {
    if (!currentList) {
      return (
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Select a shopping list to get started
          </Text>
        </View>
      );
    }

    const groupedItems = currentList.items.reduce((groups, item) => {
      const category = item.category || INGREDIENT_CATEGORIES.OTHER;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, ShoppingItem[]>);

    return (
      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <View style={[styles.listHeader, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>{currentList.name}</Text>
            <Text style={[styles.listItemCount, { color: colors.textSecondary, marginTop: 4 }]}>
              {currentList.items.filter(item => !item.isChecked).length} of {currentList.items.length} items
            </Text>
          </View>
          <View style={styles.listHeaderActions}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.secondary }]}
              onPress={() => {
                handleHaptic();
                setShowAddItemModal(true);
              }}
            >
              <Text style={[styles.headerButtonText, { color: colors.text }]}>+ Add Item</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                handleHaptic();
                shareList(currentList.id, 'copy');
              }}
            >
              <Text style={[styles.headerButtonText, { color: colors.background }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {currentList.items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📝</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Your shopping list is empty
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.itemsContainer}>
            {Object.entries(groupedItems).map(([category, items]) => (
              <View key={category} style={styles.categorySection}>
                <View style={{ 
                  backgroundColor: `${colors.primary}10`, 
                  paddingHorizontal: 16, 
                  paddingVertical: 8, 
                  borderRadius: 8, 
                  marginBottom: 8 
                }}>
                  <Text style={[styles.categoryTitle, { color: colors.primary, marginBottom: 0 }]}>{category}</Text>
                </View>
                {items.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemRow, 
                      { 
                        borderBottomColor: index === items.length - 1 ? 'transparent' : colors.border,
                        backgroundColor: item.isChecked ? `${colors.textSecondary}05` : 'transparent'
                      }
                    ]}
                    onPress={() => {
                      handleHaptic();
                      toggleItemChecked(currentList.id, item.id);
                    }}
                    onLongPress={() => {
                      handleHaptic();
                      Alert.alert(
                        'Remove Item',
                        `Remove "${item.name}" from the list?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Remove',
                            style: 'destructive',
                            onPress: () => removeItem(currentList.id, item.id)
                          }
                        ]
                      );
                    }}
                  >
                    <View style={styles.itemContent}>
                      <View style={[
                        styles.checkbox,
                        { 
                          backgroundColor: item.isChecked ? colors.primary : colors.background,
                          borderColor: item.isChecked ? colors.primary : colors.border
                        }
                      ]}>
                        {item.isChecked && <Text style={[styles.checkmark, { color: colors.background }]}>✓</Text>}
                      </View>
                      
                      <View style={styles.itemDetails}>
                        <Text style={[
                          styles.itemName,
                          { 
                            color: item.isChecked ? colors.textSecondary : colors.text,
                            textDecorationLine: item.isChecked ? 'line-through' : 'none',
                            opacity: item.isChecked ? 0.7 : 1
                          }
                        ]}>
                          <Text style={{ fontFamily: 'Geist-Medium' }}>
                            {item.quantity && `${item.quantity} `}
                          </Text>
                          {item.name}
                        </Text>
                        {item.recipeName && (
                          <Text style={[styles.recipeTag, { color: colors.textSecondary }]}>
                            from {item.recipeName}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {currentList.items.some(item => item.isChecked) && (
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: colors.error }]}
                onPress={() => {
                  handleHaptic();
                  clearCompletedItems(currentList.id);
                }}
              >
                <Text style={[styles.clearButtonText, { color: colors.background }]}>
                  Clear Completed Items
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderListSelector()}
      {renderShoppingList()}

      {/* New List Modal */}
      <Modal visible={showNewListModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New List</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="List name..."
              placeholderTextColor={colors.textSecondary}
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => {
                  setNewListName('');
                  setShowNewListModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateList}
              >
                <Text style={[styles.modalButtonText, { color: colors.background }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Item Modal */}
      <Modal visible={showAddItemModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Item</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Item name..."
              placeholderTextColor={colors.textSecondary}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Quantity (optional)..."
              placeholderTextColor={colors.textSecondary}
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => {
                  setNewItemName('');
                  setNewItemQuantity('');
                  setShowAddItemModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleAddItem}
              >
                <Text style={[styles.modalButtonText, { color: colors.background }]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recipe Selection Modal */}
      <Modal visible={showRecipeSelectModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Recipes</Text>
            <FlatList
              data={savedRecipes}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.recipeItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleToggleRecipe(item.id)}
                >
                  <View style={[
                    styles.checkbox,
                    { 
                      backgroundColor: selectedRecipes.includes(item.id) ? colors.primary : colors.background,
                      borderColor: colors.primary 
                    }
                  ]}>
                    {selectedRecipes.includes(item.id) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.recipeItemText, { color: colors.text }]}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => {
                  setSelectedRecipes([]);
                  setShowRecipeSelectModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleGenerateFromRecipes}
                disabled={selectedRecipes.length === 0}
              >
                <Text style={[styles.modalButtonText, { color: colors.background }]}>
                  Generate ({selectedRecipes.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 12,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Geist-SemiBold',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Geist',
    textAlign: 'center',
    lineHeight: 24,
  },
  listsScrollView: {
    marginBottom: 20,
    paddingVertical: 4,
  },
  listCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listName: {
    fontSize: 15,
    fontFamily: 'Geist-SemiBold',
    marginBottom: 4,
  },
  listItemCount: {
    fontSize: 13,
    fontFamily: 'Geist',
    opacity: 0.8,
  },
  listActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontFamily: 'Geist-Medium',
    textAlign: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  listHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  headerButtonText: {
    fontSize: 13,
    fontFamily: 'Geist-Medium',
  },
  itemsContainer: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Geist-SemiBold',
    marginBottom: 12,
    paddingLeft: 4,
  },
  itemRow: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 44,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Geist-Bold',
  },
  itemDetails: {
    flex: 1,
    paddingTop: 2,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Geist',
    lineHeight: 22,
    marginBottom: 2,
  },
  recipeTag: {
    fontSize: 13,
    fontFamily: 'Geist',
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 4,
  },
  clearButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    fontSize: 15,
    fontFamily: 'Geist-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Geist-SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Geist',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Geist-Medium',
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  recipeItemText: {
    fontSize: 16,
    fontFamily: 'Geist',
    marginLeft: 16,
    flex: 1,
    lineHeight: 22,
  },
});

export default ShoppingListScreen;