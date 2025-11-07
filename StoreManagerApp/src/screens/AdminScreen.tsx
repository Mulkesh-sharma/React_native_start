import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../context/StoreContext';

const AdminScreen = () => {
    const { products, deleteProduct } = useStore();
    const navigation = useNavigation<any>();

    const handleDelete = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => deleteProduct(id), style: 'destructive' },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Panel 🛠️</Text>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Text style={styles.addText}>➕ Add New Product</Text>
            </TouchableOpacity>

            <FlatList
                data={products}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>₹{item.price}</Text>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('EditProduct', { product: item })}
                                style={[styles.button, { backgroundColor: '#007bff' }]}
                            >
                                <Text style={styles.btnText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={[styles.button, { backgroundColor: '#dc3545' }]}
                            >
                                <Text style={styles.btnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                style={{ marginTop: 10 }}
            />
        </View>
    );
};

export default AdminScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    addButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    addText: { color: '#fff', fontWeight: 'bold' },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    name: { fontSize: 16, fontWeight: '600' },
    actions: { flexDirection: 'row', gap: 8 },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    btnText: { color: '#fff', fontWeight: 'bold' },
});
