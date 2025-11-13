import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';

// AUTH SCREENS
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// TABS
import BottomTabs from '../screens/navigation/BottomTabs';

// PRODUCT SCREENS
import ProductsScreen from '../screens/products/ProductsScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import AddProductScreen from '../screens/products/AddProductScreen';
import EditProductScreen from '../screens/products/EditProductScreen';

// ADMIN
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProfileScreen from '../screens/admin/ProfileScreen';

import { Product } from '../context/StoreContext';
import ProfileScreenMain from '../screens/admin/ProfileScreenMain';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;

  MainTabs: undefined;

  Products: undefined;
  ProductDetail: { product: Product };
  AddProduct: undefined;
  EditProduct: { product: Product };
  Profile: undefined;
  Dashboard: undefined;
  ProfileMain: undefined;
  ForgotPassword: undefined;
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
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />

          <Stack.Screen
            name="Products"
            component={ProductsScreen}
          />

          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
          />

          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
          />

          <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
          />

          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
          <Stack.Screen
            name="ProfileMain"
            component={ProfileScreenMain}
          />
          
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
