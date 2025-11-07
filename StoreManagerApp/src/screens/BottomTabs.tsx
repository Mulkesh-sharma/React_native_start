import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import AdminScreen from '../screens/AdminScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 65,
                    borderTopWidth: 0.4,
                    borderColor: '#ccc',
                    elevation: 10,
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: '#999',
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
                    if (route.name === 'Home') iconName = 'home-outline';
                    else if (route.name === 'Products') iconName = 'pricetags-outline';
                    else if (route.name === 'Admin') iconName = 'settings-outline';
                    return <Ionicons name={iconName} color={color} size={22} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Products" component={ProductsScreen} />
            <Tab.Screen name="Admin" component={AdminScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabs;
