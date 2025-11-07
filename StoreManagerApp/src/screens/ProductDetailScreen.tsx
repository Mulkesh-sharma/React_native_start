import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useStore } from '../context/StoreContext';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = () => {
    const route = useRoute<ProductDetailRouteProp>();
    const { product } = route.params;
    const { addToCart } = useStore();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>💰 ₹{product.price}</Text>
            <Text style={styles.desc}>This is a detailed description for {product.name}.</Text>
            <Button title="Add to Cart" onPress={() => addToCart(product)} />
        </View>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    price: { fontSize: 18, marginBottom: 10 },
    desc: { fontSize: 16, marginBottom: 20 },
});
