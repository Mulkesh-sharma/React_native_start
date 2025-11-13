import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import AppHeader from '../../components/AppHeader';
import { globalStyles } from '../../styles/globalStyles';

const API_URL = "https://backend-api-rwpt.onrender.com/products";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // -----------------------------
  // FETCH PRODUCTS WITH CACHE
  // -----------------------------
  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);

      const cachedProducts = await AsyncStorage.getItem("products_cache");
      const cachedTime = await AsyncStorage.getItem("products_cache_timestamp");
      const now = Date.now();

      // Use cache if not expired & not forced
      if (
        !forceRefresh &&
        cachedProducts &&
        cachedTime &&
        now - parseInt(cachedTime) < CACHE_DURATION
      ) {
        console.log("📦 Using cached products for HomeScreen");
        setProducts(JSON.parse(cachedProducts));
        setLoading(false);
        return;
      }

      // API call
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Unauthorized",
          text2: "Please login again",
        });
        navigation.navigate("Login");
        return;
      }

      console.log("🌐 Fetching fresh products for HomeScreen...");
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);

        // Save cache
        await AsyncStorage.setItem("products_cache", JSON.stringify(data.products));
        await AsyncStorage.setItem("products_cache_timestamp", now.toString());
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to load products",
          text2: data?.message || "Something went wrong",
        });
      }

    } catch (error) {
      console.log(error);
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

  // Load on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts(false);
    }, [])
  );

  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(true); // force fresh API call
  };

  const featured = products.slice(0, 4);

  return (
    <View style={styles.container}>
      <AppHeader isHome />

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Loader */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#4f8cff"
            style={{ marginTop: 20 }}
          />
        )}

        {/* Product Grid */}
        {!loading && (
          <FlatList
            data={featured}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
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
                  <Text style={styles.viewMoreText}>View All Products →</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        )}

      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  card: {
    backgroundColor: '#171a21',
    width: '48%',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  image: {
    width: 140,
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#0f1115',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ffffff',
  },
  price: {
    fontSize: 16,
    color: '#4f8cff',
    fontWeight: '700',
    marginTop: 2,
  },
  stock: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  inStock: { color: '#4caf50' },
  lowStock: { color: '#ff5252' },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#b6c0cf',
    fontSize: 15,
  },
  viewMore: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1b5e20',
  },
  viewMoreText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
