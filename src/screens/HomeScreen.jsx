import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import AllItems from './AllItems';
import CreateScreen from './CreateScreen';
import { getItems, addOrUpdateItem, resetItems } from '../data/itemsData';

const HomeScreen = () => {
    const [view, setView] = useState(0);
    const [items, setItems] = useState([]);

    // Load items on component mount
    useEffect(() => {
        setItems(getItems());
    }, []);

    // Function to handle adding a new item
    const handleAddItem = (newItem) => {
        const updatedItems = addOrUpdateItem(newItem);
        setItems(updatedItems);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Dashboard</Text>
            <View style={styles.buttonContainer}>
                <Pressable 
                    style={[styles.button, view === 0 && { backgroundColor: "#194b02ff" }]} 
                    onPress={() => setView(0)}
                >
                    <Text style={styles.btnText}>All items</Text>
                </Pressable>
                <Pressable 
                    style={[styles.button, view === 1 && { backgroundColor: "#194b02ff" }]} 
                    onPress={() => setView(1)}
                >
                    <Text style={styles.btnText}>Low Stock</Text>
                </Pressable>
                <Pressable 
                    style={[styles.button, view === 2 && { backgroundColor: "#194b02ff" }]} 
                    onPress={() => setView(2)}
                >
                    <Text style={styles.btnText}>Create</Text>
                </Pressable>
            </View>

            {view === 0 && <AllItems data={items} />}
            {view === 1 && <AllItems data={items.filter(item => item.stock <= 3)} />}
            {view === 2 && <CreateScreen onAddItem={handleAddItem} />}
        </View>
    );
};

export default HomeScreen

const styles = StyleSheet.create({
container: {
  width: '100%',
  height: '100%',
  backgroundColor: '#ffffff',
  padding:"4%",
},

text: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#333333',
},
buttonContainer: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 20,
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
},
button: {
  backgroundColor: '#2a7905ff',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 5,
},
btnText: {
  color: '#ffffff',
  fontWeight: 'bold',
},
});