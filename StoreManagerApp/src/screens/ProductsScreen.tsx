import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProducts } from '../context/ProductContext';

type ProductsNavProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

const ProductsScreen = () => {
    const navigation = useNavigation<ProductsNavProp>();
    const { products, deleteProduct } = useProducts();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product List</Text>

            <View style={styles.addButton}>
                <Button
                    title="➕ Add Product"
                    onPress={() => navigation.navigate('AddProduct')}
                    color="#2e8b57"
                />
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>Price: ₹{item.price}</Text>
                        <Text>Stock: {item.quantity}</Text>
                        <Button
                            title="🗑 Delete"
                            color="#b22222"
                            onPress={() => deleteProduct(item.id)}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    addButton: { marginBottom: 12 },
    card: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
    },
    name: { fontSize: 16, fontWeight: '600' },
});

export default ProductsScreen;
