import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, FAB, ActivityIndicator, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data - in a real app, this would come from an API
const MOCK_PRODUCTS = [
  { id: '1', name: 'Wireless Earbuds', sku: 'WE-1001', price: 79.99, stock: 45, category: 'Electronics' },
  { id: '2', name: 'Smart Watch', sku: 'SW-2002', price: 199.99, stock: 12, category: 'Electronics' },
  { id: '3', name: 'Bluetooth Speaker', sku: 'BS-3003', price: 59.99, stock: 28, category: 'Electronics' },
  { id: '4', name: 'Laptop Backpack', sku: 'LB-4004', price: 49.99, stock: 35, category: 'Accessories' },
  { id: '5', name: 'Wireless Mouse', sku: 'WM-5005', price: 29.99, stock: 0, category: 'Accessories' },
];

const ProductsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setFilteredProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const renderProductItem = ({ item }) => (
    <Card style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
      <Card.Content>
        <View style={styles.productHeader}>
          <Title style={styles.productName}>{item.name}</Title>
          <View style={[styles.stockBadge, { 
            backgroundColor: item.stock === 0 ? '#FFEBEE' : item.stock < 10 ? '#FFF8E1' : '#E8F5E9',
            borderColor: item.stock === 0 ? '#EF9A9A' : item.stock < 10 ? '#FFE082' : '#A5D6A7'
          }]}>
            <Paragraph style={[styles.stockText, { 
              color: item.stock === 0 ? '#C62828' : item.stock < 10 ? '#F57F17' : '#2E7D32'
            }]}>
              {item.stock === 0 ? 'Out of Stock' : `${item.stock} in Stock`}
            </Paragraph>
          </View>
        </View>
        <Paragraph style={styles.productSku}>SKU: {item.sku}</Paragraph>
        <View style={styles.productFooter}>
          <Paragraph style={styles.productCategory}>{item.category}</Paragraph>
          <Title style={styles.productPrice}>${item.price.toFixed(2)}</Title>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        icon="magnify"
      />

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="package-variant-remove" size={64} color="#BDBDBD" />
          <Title style={styles.emptyStateTitle}>No products found</Title>
          <Paragraph style={styles.emptyStateText}>
            {searchQuery ? 'Try a different search term' : 'Add your first product to get started'}
          </Paragraph>
          {!searchQuery && (
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('AddProduct')}
              style={styles.addButton}
            >
              Add Product
            </Button>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddProduct')}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  productCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  productSku: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#616161',
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  listContainer: {
    paddingBottom: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 24,
  },
  addButton: {
    width: '70%',
  },
});

export default ProductsScreen;
