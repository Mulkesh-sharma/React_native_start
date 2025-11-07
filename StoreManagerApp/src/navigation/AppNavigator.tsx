import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from '../screens/BottomTabs';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import AdminScreen from '../screens/AdminScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import { Product } from '../context/StoreContext';

export type RootStackParamList = {
    Home: undefined;
    Products: undefined;
    ProductDetail: { product: { id: string; name: string; price: number } };
    Cart: undefined;
    Admin: undefined;
    Dashboard: undefined;
    AddProduct: undefined;
    EditProduct: { product: Product };
    MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
    <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
        }}
    >
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ headerShown: true, title: 'Product Details' }}
        />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{ headerShown: true, title: 'Add New Product' }}
        />
        <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={{ headerShown: true, title: 'Edit Product' }}
        />
    </Stack.Navigator>
);

export default AppNavigator;
