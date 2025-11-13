import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalStyles } from '../../styles/globalStyles';

const API_URL = 'https://backend-api-rwpt.onrender.com/products';

const EditProductScreen = () => {
  // --- hooks (always at top) ---
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // product passed from previous screen
  const product = route.params?.product || {};
  const productId = product._id || product.id;

  // form state
  const [name, setName] = useState<string>(String(product.name || ''));
  const [price, setPrice] = useState<string>(String(product.price ?? ''));
  const [quantity, setQuantity] = useState<string>(String(product.quantity ?? ''));
  const [loading, setLoading] = useState<boolean>(false);

  // --- update product handler ---
  const handleUpdate = async () => {
    // basic validations
    if (!name.trim() || !price.toString().trim() || !quantity.toString().trim()) {
      Toast.show({ type: 'error', text1: 'Validation', text2: 'All fields are required.' });
      return;
    }

    const priceNum = Number(price);
    const qtyNum = Number(quantity);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(qtyNum) || qtyNum < 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation',
        text2: 'Enter a valid price (> 0) and quantity (≥ 0).',
      });
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({ type: 'error', text1: 'Unauthorized', text2: 'Please login again.' });
        navigation.navigate('Login');
        return;
      }

      // make API request (PUT)
      const res = await fetch(`${API_URL}/${productId}`, {
        method: 'PUT', // or PATCH depending on your backend
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          price: priceNum,
          quantity: qtyNum,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Toast.show({ type: 'success', text1: 'Product updated', text2: data?.message || '' });

        // --- Update local cache so all screens see the new values immediately ---
        try {
          const cached = await AsyncStorage.getItem('products_cache');
          if (cached) {
            const arr = JSON.parse(cached);
            const updated = arr.map((p: any) =>
              (p._id || p.id) === productId
                ? { ...p, name: name.trim(), price: priceNum, quantity: qtyNum }
                : p
            );
            await AsyncStorage.setItem('products_cache', JSON.stringify(updated));
          } else {
            // no cache present — optionally leave it empty (screens will fetch on focus)
          }
          // also remove timestamp so next fetch will refresh if desired:
          // await AsyncStorage.removeItem('products_cache_timestamp');
        } catch (cacheErr) {
          console.log('Cache update error', cacheErr);
        }

        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update failed',
          text2: data?.message || 'Could not update product.',
        });
      }
    } catch (err) {
      console.log('Update error', err);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Edit Product</Text>

        <TextInput
          style={styles.input}
          placeholder="Product Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#6b7280"
          value={String(price)}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Quantity"
          placeholderTextColor="#6b7280"
          value={String(quantity)}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.saveContent}>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveText}>Save Changes</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f1115',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 18,
    textAlign: 'center',
    color: '#fff',
  },

  input: {
    backgroundColor: '#171a21',
    borderWidth: 1,
    borderColor: '#2a2f3a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: '#fff',
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1b5e20',
  },

  saveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  saveText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});
