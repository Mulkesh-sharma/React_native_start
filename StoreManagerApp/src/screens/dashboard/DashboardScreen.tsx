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
import { globalStyles } from '../../styles/globalStyles';

const DashboardScreen = () => {
  const { products } = useStore();

  // 🔄 Show loading when fetching
  if (!products) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: '#b6c0cf' }}>
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
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
      >

        {/* Total Products */}
        <View style={styles.card}>
          <Ionicons name="cube-outline" size={28} color="#4f8cff" />
          <Text style={styles.label}>Total Products</Text>
          <Text style={styles.value}>{stats.totalProducts}</Text>
        </View>

        {/* Total Stock Units */}
        <View style={styles.card}>
          <Ionicons name="layers-outline" size={28} color="#4caf50" />
          <Text style={styles.label}>Total Stock Units</Text>
          <Text style={styles.value}>{stats.totalUnits}</Text>
        </View>

        {/* Inventory Value */}
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={28} color="#ff9800" />
          <Text style={styles.label}>Total Inventory Value</Text>
          <Text style={styles.value}>₹{stats.totalValue.toFixed(2)}</Text>
        </View>

        {/* Low Stock Items */}
        <View style={[styles.card, styles.warningCard]}>
          <Ionicons name="alert-circle-outline" size={28} color="#ff5252" />
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
    backgroundColor: '#0f1115', 
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1115',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
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
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },

  label: {
    fontSize: 14,
    color: '#b6c0cf',
    marginTop: 8,
  },

  warningText: {
    color: '#ffc107',
  },

  value: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6,
    color: '#4f8cff',
  },
});
