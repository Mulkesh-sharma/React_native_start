import { StyleSheet, Text, View, TextInput, Pressable, Alert, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { getItems } from '../data/itemsData';

const CreateScreen = ({ onAddItem }) => {
    const [itemName, setItemName] = useState('');
    const [stock, setStock] = useState('');
    const [unit, setUnit] = useState('');
    const [allItems, setAllItems] = useState([]);

    // Load all items when component mounts
    useEffect(() => {
        setAllItems(getItems());
    }, []);

    const handleSubmit = () => {
        // Basic validation
        if (!itemName.trim()) {
            Alert.alert('Error', 'Please enter an item name');
            return;
        }
        if (!stock || isNaN(parseInt(stock)) || parseInt(stock) <= 0) {
            Alert.alert('Error', 'Please enter a valid stock quantity');
            return;
        }
        if (!unit.trim()) {
            Alert.alert('Error', 'Please enter a unit');
            return;
        }

        // Create new item object
        const newItem = {
            name: itemName.trim(),
            stock: parseInt(stock, 10),
            unit: unit.trim().toLowerCase()
        };

            // Call the parent component's handler
        onAddItem(newItem);
        
        // Update the items list
        const updatedItems = getItems();
        setAllItems(updatedItems);

        // Reset form
        setItemName('');
        setStock('');
        setUnit('');

        // Show success message
        Alert.alert('Success', 'Item added successfully!');
    };

    return (
        <View style={styles.container}>
            <TextInput 
                placeholder="Enter Item Name" 
                style={styles.input}
                value={itemName} 
                onChangeText={setItemName}
                autoCapitalize="words"
            />
            <TextInput
                placeholder="Enter item Stock"
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Enter item Unit (e.g., kg, liters)"
                style={styles.input}
                value={unit}
                onChangeText={setUnit}
                autoCapitalize="none"
            />

            <Pressable 
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Add Item</Text>
            </Pressable>
            
            <View style={styles.itemsContainer}>
                <Text style={styles.sectionTitle}>All Items ({allItems.length})</Text>
                <ScrollView style={styles.scrollView}>
                    {allItems.length > 0 ? (
                        allItems.map((item) => (
                            <View key={item.id.toString()} style={styles.itemRow}>
                                <Text style={styles.itemNameText}>
                                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                </Text>
                                <Text style={styles.itemDetail}>
                                    {item.stock} {item.unit}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noItemsText}>No items added yet</Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

export default CreateScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    itemsContainer: {
        marginTop: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scrollView: {
        flexGrow: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2a7905ff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemNameText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    itemDetail: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        fontWeight: '500',
    },
    noItemsText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
        fontStyle: 'italic',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2a7905ff',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 5,
        elevation: 2,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
})