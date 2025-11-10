import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../home/HomeScreen';
import ProductsScreen from '../products/ProductsScreen';
import AdminScreen from '../admin/AdminScreen';
import DashboardScreen from '../dashboard/DashboardScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4f8cff',
        tabBarInactiveTintColor: '#b6c0cf',
        tabBarStyle: {
          backgroundColor: '#171a21',
          height: 65,
          borderTopWidth: 1,
          borderTopColor: '#2a2f3a',
          paddingBottom: 16,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIcon: ({ color }) => {
          let icon = "home-outline";

          if (route.name === "Home") icon = "home-outline";
          else if (route.name === "Products") icon = "pricetags-outline";
          else if (route.name === "Dashboard") icon = "stats-chart-outline";
          else if (route.name === "Admin") icon = "settings-outline";

          return <Ionicons name={icon} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Admin" component={AdminScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
