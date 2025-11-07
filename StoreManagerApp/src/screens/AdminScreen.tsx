import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useStore } from '../context/StoreContext';

const AdminScreen = () => {
    const { products, addProduct } = useStore();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleAdd = () => {
        if (!name || !price) return alert('Enter both name and price');
        addProduct(name, parseFloat(price));
        setName('');
        setPrice('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Panel 🛠️</Text>

            <TextInput
                style={styles.input}
                placeholder="Product Name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
            />
            <Button title="Add Product" onPress={handleAdd} />

            <FlatList
                data={products}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.product}>
                        {item.name} - ₹{item.price}
                    </Text>
                )}
                style={{ marginTop: 20 }}
            />
        </View>
    );
};

export default AdminScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        color: '#000',
    },
    product: { fontSize: 16, padding: 8, backgroundColor: '#f3f3f3', marginBottom: 5 },
});
