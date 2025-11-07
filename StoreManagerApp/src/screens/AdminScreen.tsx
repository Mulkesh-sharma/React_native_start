import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Admin Panel - Manage Products</Text>
        </View>
    );
};

export default AdminScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18 },
});
