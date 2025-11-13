import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/AppHeader';
import { globalStyles } from '../../styles/globalStyles';
import Toast from 'react-native-toast-message';

const API_URL = 'https://backend-api-rwpt.onrender.com/products';

const ProductsScreen = () => {
  const navigation = useNavigation<any>();

  // ---------- STATE ----------
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ---------- FETCH PRODUCTS WITH AUTH ----------
  const CACHE_DURATION = 10 * 60 * 1000; // 10 min

  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);

      // Load cached data
      const cachedData = await AsyncStorage.getItem("products_cache");
      const cachedTime = await AsyncStorage.getItem("products_cache_timestamp");

      const now = Date.now();

      // Use cached data if:
      // - cache exists
      // - cache time is valid
      // - NOT force refresh
      if (
        !forceRefresh &&
        cachedData &&
        cachedTime &&
        now - parseInt(cachedTime) < CACHE_DURATION
      ) {
        console.log("📦 Using cached products");
        setProducts(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // Otherwise make API request
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please login again.",
        });
        navigation.navigate("Login");
        return;
      }

      console.log("🌐 Fetching fresh products from API...");
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data?.products || []);

        // Save to cache
        await AsyncStorage.setItem(
          "products_cache",
          JSON.stringify(data?.products || [])
        );

        // Save timestamp
        await AsyncStorage.setItem(
          "products_cache_timestamp",
          now.toString()
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data?.message || "Failed to fetch products",
        });
      }

    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };


  // Auto fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts(false); // use cache by default
    }, [])
  );


  // ---------- DELETE PRODUCT WITH AUTH ----------
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");

              if (!token) {
                Toast.show({
                  type: "error",
                  text1: "Unauthorized",
                  text2: "Please login again"
                });
                navigation.navigate("Login");
                return;
              }

              const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              const data = await response.json();

              if (response.ok) {
                Toast.show({
                  type: "success",
                  text1: "Deleted",
                  text2: data?.message || "Product deleted"
                });
                setProducts(prev => prev.filter(p => p._id !== id));
              } else {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: data?.message || "Failed to delete"
                });
              }

            } catch (error) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Something went wrong while deleting"
              });
            }
          },
        },
      ]
    );
  };

  // ---------- RENDER ----------
  return (
    <View style={styles.container}>
      <AppHeader title="Products" />

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
      >
        <Text style={styles.title}>All Products</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="add-circle-outline" size={22} color="#ffffff" />
          <Text style={styles.addText}>Add Product</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#4f8cff" style={{ marginTop: 24 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item._id}
            refreshing={loading}
            onRefresh={() => fetchProducts(true)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("ProductDetail", { product: item })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <Text style={styles.qty}>Stock: {item.quantity}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => navigation.navigate("EditProduct", { product: item })}
                  >
                    <Ionicons name="create-outline" size={18} color="#4f8cff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(item._id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ff5252" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No products found</Text>}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ProductsScreen;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#ffffff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4f8cff",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1b5e20",
  },
  addText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#171a21",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2f3a",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: "#4f8cff",
    fontWeight: "600",
  },
  qty: {
    fontSize: 13,
    color: "#b6c0cf",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
  },
  actionBtn: {
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: "rgba(79, 140, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(79, 140, 255, 0.4)",
  },
  deleteBtn: {
    backgroundColor: "rgba(220, 53, 69, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(220, 53, 69, 0.4)",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#b6c0cf",
    fontSize: 15,
  },
});
