import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useStore } from '../../context/StoreContext';
import AppHeader from '../../components/AppHeader';

const ProductsScreen = () => {
  const navigation = useNavigation<any>();
  const { products, deleteProduct, loadingProducts } = useStore();

  // Delete product handler
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteProduct(id);
            Alert.alert('Deleted', res?.message || 'Product deleted');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="Products" />

      <ScrollView>
        <Text style={styles.title}>All Products</Text>

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.addText}>Add Product</Text>
        </TouchableOpacity>

        {/* Loader */}
        {loadingProducts && (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={{ marginTop: 20 }}
          />
        )}

        {/* Product List */}
        {!loadingProducts && (
          <FlatList
            data={products}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ProductDetail', { product: item })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <Text style={styles.qty}>Stock: {item.quantity}</Text>
                </View>

                {/* Edit/Delete Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() =>
                      navigation.navigate('EditProduct', { product: item })
                    }
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products found</Text>
            }
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ProductsScreen;

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff' },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007bff',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 16,
  },

  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  name: { fontSize: 16, fontWeight: '700', color: '#222' },
  price: { fontSize: 14, color: '#007bff', marginTop: 2 },
  qty: { fontSize: 12, color: '#666', marginTop: 4 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  actionBtn: {
    padding: 8,
    borderRadius: 8,
  },

  editBtn: { backgroundColor: '#007bff' },
  deleteBtn: { backgroundColor: '#dc3545' },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
});
