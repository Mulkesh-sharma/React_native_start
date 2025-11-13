import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import AppHeader from '../../components/AppHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalStyles } from '../../styles/globalStyles';

const API_URL = "https://backend-api-rwpt.onrender.com/products";
const CACHE_DURATION = 10 * 60 * 1000; // 10 min

const AdminScreen = () => {
  const navigation = useNavigation<any>();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // ----------------------------------
  //  FETCH PRODUCTS WITH CACHING
  // ----------------------------------
  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);

      const cachedData = await AsyncStorage.getItem("products_cache");
      const cachedTime = await AsyncStorage.getItem("products_cache_timestamp");
      const now = Date.now();

      if (
        !forceRefresh &&
        cachedData &&
        cachedTime &&
        now - parseInt(cachedTime) < CACHE_DURATION
      ) {
        console.log("📦 AdminScreen using cached data");
        setProducts(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please login again",
        });
        navigation.navigate("Login");
        return;
      }

      console.log("🌐 AdminScreen fetching fresh data...");
      const response = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);

        // cache new data
        await AsyncStorage.setItem("products_cache", JSON.stringify(data.products));
        await AsyncStorage.setItem("products_cache_timestamp", now.toString());
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to load",
          text2: data?.message,
        });
      }

    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to fetch products",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ----------------------------------
  //  DELETE PRODUCT (With Toast)
  // ----------------------------------
  const handleDelete = (id: string) => {
    // Keep confirmation alert — good UX
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
                  text2: "Please login again.",
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
                });

                setProducts(prev => prev.filter(p => p._id !== id));

                // update cache too
                await AsyncStorage.setItem("products_cache", JSON.stringify(
                  products.filter(p => p._id !== id)
                ));
              } else {
                Toast.show({
                  type: "error",
                  text1: "Delete failed",
                  text2: data?.message,
                });
              }

            } catch (error) {
              console.log(error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Unable to delete product",
              });
            }
          }
        }
      ]
    );
  };

  // Load when visiting the screen
  useFocusEffect(
    useCallback(() => {
      fetchProducts(false);
    }, [])
  );

  // pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Admin" />

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={[globalStyles.scrollContent, { paddingBottom: 24 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <Text style={styles.title}>🛠️ Admin Panel</Text>

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="add-circle-outline" size={22} color="#ffffff" />
          <Text style={styles.addText}>Add New Product</Text>
        </TouchableOpacity>

        {/* Loader */}
        {loading && (
          <ActivityIndicator size="large" color="#4f8cff" style={{ marginTop: 16 }} />
        )}

        {/* Product List */}
        {!loading && (
          <FlatList
            data={products}
            keyExtractor={item => item._id}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products available</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <Text style={styles.qty}>Stock: {item.quantity}</Text>
                </View>

                <View style={styles.actions}>
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
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 16,
  },

  addButton: {
    flexDirection: "row",
    backgroundColor: "#4f8cff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1b5e20",
  },

  addText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
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

  actions: {
    flexDirection: "row",
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
