import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text } from "react-native";

import HomeScreen from "../home/HomeScreen";
import ProductsScreen from "../products/ProductsScreen";
import AdminScreen from "../admin/AdminScreen";
import DashboardScreen from "../dashboard/DashboardScreen";

import { useAuth } from "../../context/AuthContext";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          borderTopWidth: 0.4,
        },

        tabBarIcon: ({ color }) => {
          let icon = "home-outline";

          if (route.name === "Home") icon = "home-outline";
          else if (route.name === "Products") icon = "pricetags-outline";
          else if (route.name === "Dashboard") icon = "stats-chart-outline";
          else if (route.name === "Admin") icon = "settings-outline";
          else if (route.name === "Logout") icon = "log-out-outline";

          return <Ionicons name={icon} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Admin" component={AdminScreen} />

      {/* LOGOUT BUTTON */}
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            logout();
          },
        })}
        options={{
          tabBarLabel: () => (
            <Text style={{ color: "red", fontWeight: "bold" }}>Logout</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
