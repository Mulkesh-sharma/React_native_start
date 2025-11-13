import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
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
const CACHE_DURATION = 10 * 60 * 1000;

const DashboardScreen = () => {
  const navigation = useNavigation<any>();

  // HOOKS ALWAYS AT TOP (never conditional)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ---------------- FETCH PRODUCTS (WITH CACHE) ----------------
  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);

      const cached = await AsyncStorage.getItem("products_cache");
      const cachedTime = await AsyncStorage.getItem("products_cache_timestamp");
      const now = Date.now();

      if (!forceRefresh && cached && cachedTime && now - Number(cachedTime) < CACHE_DURATION) {
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

      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
        await AsyncStorage.setItem("products_cache", JSON.stringify(data.products));
        await AsyncStorage.setItem("products_cache_timestamp", now.toString());
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to load products",
        });
      }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: "Error loading dashboard",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load on focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts(false);
    }, [])
  );

  // Pull-to-Refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
  };

  // ------------------- DASHBOARD STATS -------------------
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((a, p) => a + (p.quantity || 0), 0);
    const totalValue = products.reduce((a, p) => a + p.price * (p.quantity || 0), 0);
    const lowStock = products.filter((p) => (p.quantity || 0) < 5).length;

    return { totalProducts, totalUnits, totalValue, lowStock };
  }, [products]);

  return (
    <View style={styles.container}>
      <AppHeader title="Dashboard" />

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* LOADING */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4f8cff" />
            <Text style={{ marginTop: 10, color: '#b6c0cf' }}>
              Loading Dashboard...
            </Text>
          </View>
        )}

        {/* DASHBOARD CONTENT */}
        {!loading && (
          <>
            <View style={styles.card}>
              <Ionicons name="cube-outline" size={28} color="#4f8cff" />
              <Text style={styles.label}>Total Products</Text>
              <Text style={styles.value}>{stats.totalProducts}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons name="layers-outline" size={28} color="#4caf50" />
              <Text style={styles.label}>Total Stock Units</Text>
              <Text style={styles.value}>{stats.totalUnits}</Text>
            </View>

            <View style={styles.card}>
              <Ionicons name="cash-outline" size={28} color="#ff9800" />
              <Text style={styles.label}>Total Inventory Value</Text>
              <Text style={styles.value}>₹{stats.totalValue.toFixed(2)}</Text>
            </View>

            <View style={[styles.card, styles.warningCard]}>
              <Ionicons name="alert-circle-outline" size={28} color="#ff5252" />
              <Text style={[styles.label, styles.warningText]}>Low Stock Items</Text>
              <Text style={[styles.value, styles.warningText]}>{stats.lowStock}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },

  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  card: {
    backgroundColor: '#171a21',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },

  warningCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },

  label: {
    fontSize: 14,
    color: '#b6c0cf',
    marginTop: 8,
  },

  warningText: { color: '#ffc107' },

  value: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6,
    color: '#4f8cff',
  },
});
