import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useProducts } from '../context/ProductContext';

const AddProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const { addProduct } = useProducts(); // ✅ get addProduct from context

    const handleAddProduct = () => {
        // Input validation
        if (!name || !price || !quantity) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        // Create new product
        const newProduct = {
            id: Date.now().toString(),
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
        };

        // Add to global context
        addProduct(newProduct);

        // Show confirmation
        Alert.alert('Success', `${name} added successfully!`);

        // Clear input fields
        setName('');
        setPrice('');
        setQuantity('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Product</Text>

            <TextInput
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.input}
            />

            <Button title="Save Product" onPress={handleAddProduct} color="#2e8b57" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
});

export default AddProductScreen;
