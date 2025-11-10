import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";

// AUTH SCREENS
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";

// TABS
import BottomTabs from "../screens/navigation/BottomTabs";

// PRODUCT SCREENS
import ProductsScreen from "../screens/products/ProductsScreen";
import ProductDetailScreen from "../screens/products/ProductDetailScreen";
import AddProductScreen from "../screens/products/AddProductScreen";
import EditProductScreen from "../screens/products/EditProductScreen";

// ADMIN
import AdminScreen from "../screens/admin/AdminScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";

import { Product } from "../context/StoreContext";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;

  MainTabs: undefined;

  Products: undefined;
  ProductDetail: { product: Product };
  AddProduct: undefined;
  EditProduct: { product: Product };

  Admin: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />

          <Stack.Screen
            name="Products"
            component={ProductsScreen}
            options={{ headerShown: true, title: "Products" }}
          />

          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ headerShown: true, title: "Product Details" }}
          />

          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{ headerShown: true, title: "Add Product" }}
          />

          <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={{ headerShown: true, title: "Edit Product" }}
          />

          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{ headerShown: true, title: "Admin Panel" }}
          />

          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: true, title: "Dashboard" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
