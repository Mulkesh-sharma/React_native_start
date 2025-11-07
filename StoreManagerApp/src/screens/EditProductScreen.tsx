import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStore, Product } from '../context/StoreContext';

const EditProductScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { updateProduct } = useStore();

    const product: Product = route.params.product;
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());

    const handleSave = () => {
        if (!name || !price) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        updateProduct(product.id, { ...product, name, price: parseFloat(price) });
        Alert.alert('Success', 'Product updated successfully');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Product</Text>

            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Product Name"
            />
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Price"
                keyboardType="numeric"
            />
            <Button title="Save Changes" onPress={handleSave} />
        </View>
    );
};

export default EditProductScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
});
