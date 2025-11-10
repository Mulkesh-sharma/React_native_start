import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Product } from '../../context/StoreContext';
import { useStore } from '../../context/StoreContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deleteProduct } = useStore();

  const [loading, setLoading] = useState(false);

  const product: Product = route.params.product;
  const productId = product._id || product.id;

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);

            const res = await deleteProduct(productId);

            setLoading(false);

            if (res?.message) {
              Alert.alert('Deleted', res.message);
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>

      {/* Product Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>₹{product.price}</Text>

        <Text style={styles.label}>Quantity:</Text>
        <Text style={styles.value}>{product.quantity}</Text>
      </View>

      <Text style={styles.desc}>
        This is a sample product description. You can edit or delete this
        product using the options below.
      </Text>

      {/* Action Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, styles.editBtn]}
          onPress={() => navigation.navigate('EditProduct', { product })}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.deleteBtn]}
          onPress={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },

  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  label: {
    fontSize: 15,
    color: '#555',
    marginTop: 10,
  },

  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007bff',
  },

  desc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 30,
    lineHeight: 20,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  editBtn: { backgroundColor: '#007bff' },
  deleteBtn: { backgroundColor: '#dc3545' },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
