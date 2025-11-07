import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../context/StoreContext';
import Ionicons from 'react-native-vector-icons/Ionicons';



const HomeScreen = () => {
    const { products } = useStore();
    const navigation = useNavigation();

    const featuredProducts = products.slice(0, 4);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>🛍️ Store Manager</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                    <Ionicons name="cart-outline" size={26} color="#007bff" />
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Your shop at a glance</Text>

            {/* Featured Products */}
            <FlatList
                data={featuredProducts}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    >
                        <Image
                            source={{
                                uri: `https://via.placeholder.com/150x150.png?text=${item.name}`,
                            }}
                            style={styles.image}
                        />
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>₹{item.price}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No products available</Text>
                }
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.viewMoreBtn}
                        onPress={() => navigation.navigate('Products')}
                    >
                        <Text style={styles.viewMoreText}>View All Products →</Text>
                    </TouchableOpacity>
                }
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdfdfd', padding: 16 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007bff',
    },
    subtitle: {
        textAlign: 'center',
        color: '#555',
        marginBottom: 16,
        fontSize: 14,
    },
    card: {
        backgroundColor: '#fff',
        width: '48%',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    image: { width: 100, height: 100, borderRadius: 10, marginBottom: 8 },
    name: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
    price: { color: '#007bff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 30 },
    viewMoreBtn: {
        marginTop: 10,
        paddingVertical: 12,
        backgroundColor: '#007bff',
        borderRadius: 10,
        alignItems: 'center',
    },
    viewMoreText: { color: '#fff', fontWeight: 'bold' },
});
