import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Product } from '../../context/StoreContext';
import AppHeader from '../../components/AppHeader';
import { useStore } from '../../context/StoreContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deleteProduct } = useStore();

  const product: Product = route.params.product;

  const handleDelete = () => {
    deleteProduct(product._id || product.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Product Details" />

      <ScrollView>
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>₹{product.price}</Text>

          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{product.quantity}</Text>
        </View>

        <Text style={styles.desc}>
          This is a basic product description. You can update product details
          using the Edit option below.
        </Text>

        {/* Buttons */}
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
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1,
    backgroundColor: '#fff' },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },

  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 6,
  },

  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },

  desc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 25,
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
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  editBtn: {
    backgroundColor: '#007bff',
  },

  deleteBtn: {
    backgroundColor: '#dc3545',
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
