import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useStore } from '../context/StoreContext';

const CartScreen = () => {
    const { cart, removeFromCart, clearCart } = useStore();

    return (
        <View style={styles.container}>
            {cart.length === 0 ? (
                <Text style={styles.empty}>Your cart is empty 🛒</Text>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text>{item.name} × {item.quantity}</Text>
                                <Button title="Remove" onPress={() => removeFromCart(item.id)} />
                            </View>
                        )}
                    />
                    <Button title="Clear Cart" onPress={clearCart} />
                </>
            )}
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    empty: { textAlign: 'center', marginTop: 50, fontSize: 18 },
    card: { backgroundColor: '#eee', padding: 10, marginBottom: 10, borderRadius: 8 },
});
