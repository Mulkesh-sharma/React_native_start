import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import AdminScreen from '../screens/AdminScreen';

export type RootStackParamList = {
    Home: undefined;
    Products: undefined;
    Cart: undefined;
    Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Products" component={ProductListScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Admin" component={AdminScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
