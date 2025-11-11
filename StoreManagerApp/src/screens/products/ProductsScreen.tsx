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
import { globalStyles } from '../../styles/globalStyles';

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

      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
      >
        <Text style={styles.title}>All Products</Text>

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#ffffff" />
          <Text style={styles.addText}>Add Product</Text>
        </TouchableOpacity>

        {/* Loader */}
        {loadingProducts && (
          <ActivityIndicator
            size="large"
            color="#4f8cff"
            style={{ marginTop: 24 }}
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
                    <Ionicons name="create-outline" size={18} color="#4f8cff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ff5252" />
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
    backgroundColor: '#0f1115',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#ffffff',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1b5e20',
  },

  addText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '600' 
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#171a21',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2f3a',
    alignItems: 'center',
  },

  name: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#ffffff',
    marginBottom: 4,
  },
  
  price: { 
    fontSize: 15, 
    color: '#4f8cff', 
    fontWeight: '600',
  },
  
  qty: { 
    fontSize: 13, 
    color: '#b6c0cf', 
    marginTop: 2,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },

  actionBtn: {
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editBtn: { 
    backgroundColor: 'rgba(79, 140, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(79, 140, 255, 0.4)',
  },
  
  deleteBtn: { 
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.4)',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#b6c0cf',
    fontSize: 15,
  },
});
