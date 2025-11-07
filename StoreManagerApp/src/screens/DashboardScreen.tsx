import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../context/StoreContext';

const DashboardScreen = () => {
    const { cart, products } = useStore();

    // Basic analytics
    const stats = useMemo(() => {
        const totalRevenue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalItemsSold = cart.reduce((sum, item) => sum + item.quantity, 0);
        const uniqueProducts = products.length;
        return { totalRevenue, totalItemsSold, uniqueProducts };
    }, [cart, products]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📊 Store Dashboard</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Total Products</Text>
                <Text style={styles.value}>{stats.uniqueProducts}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Items Sold</Text>
                <Text style={styles.value}>{stats.totalItemsSold}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Total Revenue</Text>
                <Text style={styles.value}>₹{stats.totalRevenue.toFixed(2)}</Text>
            </View>
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    card: {
        backgroundColor: '#f4f4f4',
        padding: 16,
        borderRadius: 10,
        marginBottom: 15,
    },
    label: { fontSize: 18, color: '#333' },
    value: { fontSize: 22, fontWeight: 'bold', color: 'green', marginTop: 5 },
});
