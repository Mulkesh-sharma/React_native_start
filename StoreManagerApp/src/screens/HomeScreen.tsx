import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeNavProp>();

    return (
        <View style={styles.container}>
            <Button title="View Products" onPress={() => navigation.navigate('Products')} />
            <View style={{ height: 10 }} />
            <Button title="View Cart" onPress={() => navigation.navigate('Cart')} />
            <View style={{ height: 10 }} />
            <Button title="Admin Panel" onPress={() => navigation.navigate('Admin')} />
            <View style={{ height: 10 }} />
            <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
});
