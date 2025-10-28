import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';

const AllItems = ({ data }) => {
  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No items found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Item</Text>
        <Text style={[styles.headingText, styles.quantityText]}>Quantity</Text>
      </View>
      
      <FlatList 
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View 
            style={[
              styles.itemContainer, 
              { backgroundColor: item.stock <= 7 ? '#fff3f3' : '#f8fff8' }
            ]}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.quantityContainer}>
                <Text 
                  style={[
                    styles.stockText,
                    item.stock <= 7 && styles.lowStockText
                  ]}
                >
                  {item.stock}
                </Text>
                <Text style={styles.unitText}>
                  {item.unit.toLowerCase() === 'liters' ? 'Ltrs' : item.unit}
                </Text>
              </View>
            </View>
            {item.stock <= 7 && (
              <Text style={styles.warningText}>Low Stock!</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AllItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#f5f7fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  headingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: 0.2,
  },
  quantityText: {
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
    letterSpacing: 0.1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10b981',
    marginRight: 6,
    minWidth: 24,
    textAlign: 'right',
  },
  lowStockText: {
    color: '#ef4444',
  },
  unitText: {
    fontSize: 13,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    width: 40,
    textAlign: 'right',
    fontWeight: '500',
  },
  warningText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    paddingLeft: 2,
    letterSpacing: 0.2,
  },
});