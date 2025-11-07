import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useStore } from '../context/StoreContext';

const ProductListScreen = () => {
    const { products, addToCart } = useStore();

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>${item.price}</Text>
                        <Button title="Add to Cart" onPress={() => addToCart(item)} />
                    </View>
                )}
            />
        </View>
    );
};

export default ProductListScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    card: { backgroundColor: '#eee', padding: 12, marginBottom: 10, borderRadius: 8 },
    name: { fontSize: 16, fontWeight: '600' },
});
