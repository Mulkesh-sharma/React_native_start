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
import { globalStyles } from '../../styles/globalStyles';

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
        <ActivityIndicator size="large" color="#4f8cff" />
        <Text style={{ marginTop: 12, color: '#b6c0cf' }}>
          Loading Products...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Admin" />
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={[globalStyles.scrollContent, { paddingBottom: 24 }]}
      >
        <Text style={styles.title}>🛠️ Admin Panel</Text>

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#ffffff" />
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
                  <Ionicons name="create-outline" size={18} color="#4f8cff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(item._id || item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ff5252" />
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
    backgroundColor: "#0f1115",
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1115',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 16,
  },

  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
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

  actions: { 
    flexDirection: 'row', 
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
