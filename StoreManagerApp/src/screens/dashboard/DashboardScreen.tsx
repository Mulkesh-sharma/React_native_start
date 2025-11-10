import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useStore } from '../../context/StoreContext';
import AppHeader from '../../components/AppHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DashboardScreen = () => {
  const { products } = useStore();

  // 🔄 Show loading when fetching
  if (!products) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: '#555' }}>
          Loading Dashboard...
        </Text>
      </View>
    );
  }

  // 📊 Inventory Analytics
  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalUnits = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

    const totalValue = products.reduce(
      (sum, p) => sum + p.price * (p.quantity || 0),
      0,
    );

    const lowStock = products.filter(p => (p.quantity || 0) < 5).length;

    return { totalProducts, totalUnits, totalValue, lowStock };
  }, [products]);

  return (
    <View style={styles.container}>
      <AppHeader title="Dashboard" />
      <ScrollView>

        {/* Total Products */}
        <View style={styles.card}>
          <Ionicons name="cube-outline" size={28} color="#007bff" />
          <Text style={styles.label}>Total Products</Text>
          <Text style={styles.value}>{stats.totalProducts}</Text>
        </View>

        {/* Total Stock Units */}
        <View style={styles.card}>
          <Ionicons name="layers-outline" size={28} color="#28a745" />
          <Text style={styles.label}>Total Stock Units</Text>
          <Text style={styles.value}>{stats.totalUnits}</Text>
        </View>

        {/* Inventory Value */}
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={28} color="#ff9900" />
          <Text style={styles.label}>Total Inventory Value</Text>
          <Text style={styles.value}>₹{stats.totalValue.toFixed(2)}</Text>
        </View>

        {/* Low Stock Items */}
        <View style={[styles.card, styles.warningCard]}>
          <Ionicons name="alert-circle-outline" size={28} color="#d9534f" />
          <Text style={[styles.label, styles.warningText]}>
            Low Stock Items
          </Text>
          <Text style={[styles.value, styles.warningText]}>
            {stats.lowStock}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff' 
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111',
  },

  card: {
    backgroundColor: '#f8f9fa',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  warningCard: {
    backgroundColor: '#fff3cd',
  },

  label: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
  },

  warningText: {
    color: '#d9534f',
  },

  value: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 6,
    color: '#007bff',
  },
});
