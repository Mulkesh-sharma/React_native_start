import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏪 Welcome to Store Manager</Text>
            <Button title="View Products" onPress={() => navigation.navigate('Products')} />
            <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
            <Button title="Admin Panel" onPress={() => navigation.navigate('Admin')} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, marginBottom: 20 },
});
