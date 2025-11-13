import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import AppHeader from "../../components/AppHeader";
import { globalStyles } from "../../styles/globalStyles";
import { useStore } from "../../context/StoreContext";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { products, fetchProducts } = useStore();

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // -------------------------------------------------------
  // Load products on screen focus (HOOKS ALWAYS FIRST!)
  // -------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        setInitialLoading(true);
        await fetchProducts();
        if (active) setInitialLoading(false);
      };

      load();

      return () => {
        active = false;
      };
    }, [])
  );

  // -------------------------------------------------------
  // Pull-to-refresh
  // -------------------------------------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // -------------------------------------------------------
  // Featured products
  // -------------------------------------------------------
  const featured = products.slice(0, 4);

  return (
    <View style={styles.container}>
      <AppHeader isHome />

      {/* Loader BELOW header */}
      {initialLoading && (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>Loading products...</Text>
        </View>
      )}

      {/* Content */}
      {!initialLoading && (
        <ScrollView
          style={globalStyles.scrollView}
          contentContainerStyle={globalStyles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <FlatList
            data={featured}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("ProductDetail", { product: item })
                }
              >
                <Image
                  source={{
                    uri:
                      item.image ||
                      `https://via.placeholder.com/150x150.png?text=${item.name}`,
                  }}
                  style={styles.image}
                />

                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>

                <Text
                  style={[
                    styles.stock,
                    item.quantity < 5 ? styles.lowStock : styles.inStock,
                  ]}
                >
                  Stock: {item.quantity}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products available</Text>
            }
            ListFooterComponent={
              featured.length > 0 ? (
                <TouchableOpacity
                  style={styles.viewMore}
                  onPress={() => navigation.navigate("Products")}
                >
                  <Text style={styles.viewMoreText}>
                    View All Products →
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },

  loaderBox: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  loaderText: {
    color: "#b6c0cf",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#171a21",
    width: "48%",
    borderRadius: 16,
    padding: 8,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },

  image: {
    width: 140,
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#0f1115",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4f8cff",
  },

  stock: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  inStock: { color: "#4caf50" },
  lowStock: { color: "#ff5252" },

  emptyText: {
    textAlign: "center",
    color: "#b6c0cf",
    marginTop: 40,
  },

  viewMore: {
    backgroundColor: "#4f8cff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#1b5e20",
  },

  viewMoreText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});
