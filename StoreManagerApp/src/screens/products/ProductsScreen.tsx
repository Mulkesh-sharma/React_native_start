import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";

import AppHeader from "../../components/AppHeader";
import { useStore } from "../../context/StoreContext";

const ProductsScreen = () => {
  const navigation = useNavigation<any>();
  const { products, fetchProducts, deleteProduct } = useStore();

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // -------------------------------------------------------
  // Load products ONCE when screen is focused
  // -------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadProducts = async () => {
        try {
          setInitialLoading(true);
          await fetchProducts();
        } finally {
          if (mounted) setInitialLoading(false);
        }
      };

      loadProducts();

      return () => {
        mounted = false;
      };
    }, [])
  );

  // -------------------------------------------------------
  // Pull-to-refresh
  // -------------------------------------------------------
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  // -------------------------------------------------------
  // Delete product
  // -------------------------------------------------------
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
            Toast.show({ type: "info", text1: "Deleting product..." });

            const res = await deleteProduct(id);
            if (res?.deleted) {
              Toast.show({ type: "success", text1: "Product deleted" });
            } else {
              Toast.show({ type: "error", text1: "Delete failed" });
            }
          },
        },
      ]
    );
  };

  // -------------------------------------------------------
  // Initial Loading (Appears BELOW AppHeader)
  // -------------------------------------------------------
  if (initialLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Products" />

        <View style={styles.loadingBelowHeader}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading Products...</Text>
        </View>
      </View>
    );
  }

  // -------------------------------------------------------
  // Main UI
  // -------------------------------------------------------
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
          <Text style={styles.emptyText}>No products found</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

export default ProductsScreen;

// -------------------------------------------------------
// STYLES
// -------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },

  // Loader BELOW AppHeader
  loadingBelowHeader: {
    flex: 1,
    backgroundColor: "#0f1115",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },

  loadingText: { color: "#b6c0cf", marginTop: 8 },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#4f8cff",
    borderRadius: 12,
    marginBottom: 14,
  },

  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#171a21",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },

  name: { color: "#fff", fontSize: 16, fontWeight: "600" },

  price: { color: "#4f8cff", fontSize: 15, fontWeight: "700", marginTop: 3 },

  qty: { color: "#b6c0cf", fontSize: 13, marginTop: 3 },

  actionRow: { flexDirection: "row", gap: 8, marginLeft: "auto" },

  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  editBtn: {
    backgroundColor: "rgba(79,140,255,0.2)",
    borderColor: "rgba(79,140,255,0.4)",
  },

  deleteBtn: {
    backgroundColor: "rgba(220,53,69,0.2)",
    borderColor: "rgba(220,53,69,0.4)",
  },

  emptyText: {
    color: "#b6c0cf",
    textAlign: "center",
    marginTop: 40,
  },
});
