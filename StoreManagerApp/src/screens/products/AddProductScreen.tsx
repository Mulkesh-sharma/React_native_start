import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../context/StoreContext';
import { globalStyles } from '../../styles/globalStyles';

const AddProductScreen = () => {
  const navigation = useNavigation<any>();
  const { addProduct } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name || !price || !quantity) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const priceNum = Number(price);
    const qtyNum = Number(quantity);

    if (isNaN(priceNum) || isNaN(qtyNum) || priceNum <= 0 || qtyNum <= 0) {
      Alert.alert('Error', 'Enter valid Price & Quantity');
      return;
    }

    setLoading(true);
    const res = await addProduct(name, priceNum, qtyNum);
    setLoading(false);

    if (res?.message) {
      Alert.alert('Success', res.message);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to add product');
    }

    setName('');
    setPrice('');
    setQuantity('');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
      >
        <Text style={styles.title}>Add New Product</Text>

        <TextInput
          placeholder="Product Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Price"
          placeholderTextColor="#6b7280"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Quantity"
          placeholderTextColor="#6b7280"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveText}>Add Product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f1115',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 24,
    textAlign: 'center',
    color: '#ffffff',
  },

  input: {
    backgroundColor: '#171a21',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
    fontSize: 16,
    color: '#ffffff',
  },

  saveBtn: {
    backgroundColor: '#4f8cff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1b5e20',
  },

  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
