import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../context/StoreContext';
import AppHeader from '../../components/AppHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AdminScreen = () => {
  const navigation = useNavigation<any>();
  const { products, deleteProduct, loading } = useStore();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteProduct(id);
            Alert.alert(
              'Deleted',
              res?.message || 'Product deleted successfully',
            );
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: '#555' }}>
          Loading Products...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Admin" />
      <ScrollView>
        <Text style={styles.title}>🛠️ Admin Panel</Text>

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.addText}>Add New Product</Text>
        </TouchableOpacity>

        {/* Product List */}
        <FlatList
          data={products}
          keyExtractor={item => item._id || item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products available</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.qty}>Stock: {item.quantity}</Text>
              </View>

              <View style={styles.actions}>
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
                  onPress={() => handleDelete(item._id || item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 16,
  },

  addButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },

  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  name: { fontSize: 16, fontWeight: '700', color: '#333' },
  price: { fontSize: 14, color: '#007bff', marginTop: 2 },
  qty: { fontSize: 12, color: '#666', marginTop: 2 },

  actions: { flexDirection: 'row', gap: 10 },

  actionBtn: {
    padding: 10,
    borderRadius: 50,
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
