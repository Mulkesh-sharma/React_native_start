import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Product } from '../../context/StoreContext';
import { useStore } from '../../context/StoreContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalStyles } from '../../styles/globalStyles';

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
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
      >
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
            <Ionicons name="create-outline" size={20} color="#4f8cff" />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.deleteBtn]}
            onPress={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ff5252" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color="#ff5252" />
                <Text style={styles.btnText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#0f1115' 
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 16,
    color: '#ffffff',
    textAlign: 'center',
  },

  infoCard: {
    backgroundColor: '#171a21',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },

  label: {
    fontSize: 15,
    color: '#b6c0cf',
    marginTop: 12,
    marginBottom: 4,
  },

  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4f8cff',
  },

  desc: {
    fontSize: 15,
    color: '#b6c0cf',
    marginBottom: 30,
    lineHeight: 22,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },

  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },

  editBtn: { 
    backgroundColor: 'rgba(79, 140, 255, 0.2)',
    borderColor: 'rgba(79, 140, 255, 0.4)',
  },
  
  deleteBtn: { 
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderColor: 'rgba(220, 53, 69, 0.4)',
  },

  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
