import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppHeader from "../../components/AppHeader";

const API_URL = "https://backend-api-rwpt.onrender.com/products";
const CACHE_DURATION = 10 * 60 * 1000;

const ProductsScreen = () => {
  // -----------------------------------
  // ALL HOOKS MUST COME FIRST
  // -----------------------------------
  const navigation = useNavigation<any>();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // -----------------------------------
  // FETCH PRODUCTS (NO CONDITIONAL HOOKS!)
  // -----------------------------------
  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);

      const cached = await AsyncStorage.getItem("products_cache");
      const cachedTime = await AsyncStorage.getItem("products_cache_timestamp");
      const now = Date.now();

      // Use cache if valid
      if (
        !forceRefresh &&
        cached &&
        cachedTime &&
        now - Number(cachedTime) < CACHE_DURATION
      ) {
        setProducts(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Session expired",
        });
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        await AsyncStorage.setItem(
          "products_cache",
          JSON.stringify(data.products)
        );
        await AsyncStorage.setItem(
          "products_cache_timestamp",
          now.toString()
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to load products",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error loading products",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // -----------------------------------
  // useFocusEffect MUST BE OUTSIDE ANY CONDITIONS
  // -----------------------------------
  useFocusEffect(
    useCallback(() => {
      fetchProducts(false);
    }, [])
  );

  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
  };

  // -----------------------------------
  // DELETE PRODUCT (NO HOOKS HERE!)
  // -----------------------------------
  const handleDelete = (id: string) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${API_URL}/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await res.json();

            if (res.ok) {
              Toast.show({ type: "success", text1: "Product deleted" });

              const updated = products.filter((p) => p._id !== id);
              setProducts(updated);

              await AsyncStorage.setItem(
                "products_cache",
                JSON.stringify(updated)
              );
            } else {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: data?.message,
              });
            }
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Error deleting product",
            });
          }
        },
      },
    ]);
  };

  // -----------------------------------
  // RENDER — NO HOOKS BELOW THIS POINT
  // -----------------------------------
  return (
    <View style={styles.container}>
      <AppHeader title="Products" />

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.title}>All Products</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddProduct")}
            >
              <Ionicons name="add-circle-outline" size={22} color="#fff" />
              <Text style={styles.addText}>Add Product</Text>
            </TouchableOpacity>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#4f8cff"
                style={{ marginBottom: 20 }}
              />
            )}
          </>
        }
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
                onPress={() =>
                  navigation.navigate("EditProduct", { product: item })
                }
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
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No products found</Text>
          )
        }
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1115" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 16,
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#4f8cff",
    paddingVertical: 14,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#171a21",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2f3a",
    marginBottom: 12,
  },
  name: { color: "#fff", fontSize: 16, fontWeight: "600" },
  price: { color: "#4f8cff", fontSize: 15, fontWeight: "600" },
  qty: { color: "#b6c0cf", fontSize: 13 },
  actionRow: { flexDirection: "row", gap: 10, marginLeft: "auto" },
  actionBtn: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "rgba(79, 140, 255, 0.2)",
    borderColor: "rgba(79, 140, 255, 0.4)",
  },
  deleteBtn: {
    backgroundColor: "rgba(220, 53, 69, 0.2)",
    borderColor: "rgba(220, 53, 69, 0.4)",
  },
  emptyText: {
    textAlign: "center",
    color: "#b6c0cf",
    marginTop: 40,
    fontSize: 16,
  },
});
