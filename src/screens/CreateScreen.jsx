import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';

const CreateScreen = ({ onAddItem }) => {
    const [itemName, setItemName] = useState('');
    const [stock, setStock] = useState('');
    const [unit, setUnit] = useState('');

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
        </View>
    );
};

export default CreateScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2a7905ff',
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
})