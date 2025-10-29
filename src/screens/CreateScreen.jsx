import { StyleSheet, Text, View, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { getItems, getItemById, updateItem, deleteItem } from '../data/itemsData';

const CreateScreen = ({ onAddItem }) => {
    const [itemName, setItemName] = useState('');
    const [stock, setStock] = useState('');
    const [unit, setUnit] = useState('');
    const [allItems, setAllItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    // Load all items when component mounts
    useEffect(() => {
        setAllItems(getItems());
    }, []);

    const resetForm = () => {
        setItemName('');
        setStock('');
        setUnit('');
        setEditingItem(null);
    };

    const handleEdit = (itemId) => {
        const itemToEdit = getItemById(itemId);
        if (itemToEdit) {
            setItemName(itemToEdit.name);
            setStock(itemToEdit.stock.toString());
            setUnit(itemToEdit.unit);
            setEditingItem(itemToEdit);
        }
    };

    const handleDelete = (itemId) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const updatedItems = deleteItem(itemId);
                        setAllItems(updatedItems);
                        if (editingItem && editingItem.id === itemId) {
                            resetForm();
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

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

        if (editingItem) {
            // Update existing item
            const updatedItem = {
                ...editingItem,
                name: itemName.trim(),
                stock: parseInt(stock, 10),
                unit: unit.trim().toLowerCase()
            };
            updateItem(updatedItem);
            setAllItems(getItems()); // Update the items list after update
            Alert.alert('Success', 'Item updated successfully!');
        } else {
            // Add new item
            const newItem = {
                name: itemName.trim(),
                stock: parseInt(stock, 10),
                unit: unit.trim().toLowerCase()
            };
            onAddItem(newItem);
            setAllItems(getItems()); // Update the items list after add
            Alert.alert('Success', 'Item added successfully!');
        }
        
        resetForm();
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
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemNameText}>
                                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                    </Text>
                                    <Text style={styles.itemDetail}>
                                        {item.stock} {item.unit}
                                    </Text>
                                </View>
                                <View style={styles.actions}>
                                    <Pressable 
                                        style={[styles.button, styles.editButton]}
                                        onPress={() => handleEdit(item.id)}
                                    >
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </Pressable>
                                    <Pressable 
                                        style={[styles.button, styles.deleteButton]}
                                        onPress={() => handleDelete(item.id)}
                                    >
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </Pressable>
                                </View>
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
    itemInfo: {
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        marginLeft: 10,
        gap: 8,
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
        borderBottomColor: '#eee',
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
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        minWidth: 70,
    },
    editButton: {
        backgroundColor: '#2a5e8d',
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
})