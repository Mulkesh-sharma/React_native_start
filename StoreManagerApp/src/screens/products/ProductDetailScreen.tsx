import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Product } from "../../context/StoreContext";
import { useStore } from "../../context/StoreContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppHeader from "../../components/AppHeader";
import { globalStyles } from "../../styles/globalStyles";

const ProductDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deleteProduct } = useStore();

  const product: Product = route.params.product;

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteProduct(product._id || product.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* App Header */}
      <AppHeader title="Product Details" />

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={[globalStyles.scrollContent, { padding: 16 }]}
      >
        {/* Title */}
        <Text style={styles.title}>{product.name}</Text>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>₹{product.price}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Quantity</Text>
            <Text style={[styles.value, product.quantity < 5 && styles.lowStock]}>
              {product.quantity}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.desc}>
          This item is part of your inventory system. You can edit any field
          (name, price, quantity) using the edit button below.
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Edit */}
          <TouchableOpacity
            style={[styles.btn, styles.editBtn]}
            onPress={() => navigation.navigate("EditProduct", { product })}
          >
            <Ionicons name="create-outline" size={18} color="#4f8cff" />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            style={[styles.btn, styles.deleteBtn]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#ff5252" />
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

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
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#171a21",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2f3a",
    marginBottom: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    color: "#b6c0cf",
    fontSize: 16,
    fontWeight: "500",
  },

  value: {
    color: "#4f8cff",
    fontSize: 18,
    fontWeight: "700",
  },

  lowStock: {
    color: "#ff5252",
  },

  desc: {
    color: "#b6c0cf",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "left",
    marginBottom: 25,
  },

  actions: {
    flexDirection: "row",
    gap: 16,
  },

  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },

  editBtn: {
    backgroundColor: "rgba(79, 140, 255, 0.15)",
    borderColor: "rgba(79, 140, 255, 0.3)",
  },

  deleteBtn: {
    backgroundColor: "rgba(255, 82, 82, 0.15)",
    borderColor: "rgba(255, 82, 82, 0.3)",
  },

  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
