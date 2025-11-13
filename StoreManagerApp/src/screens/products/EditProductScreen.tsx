import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";

const API_URL = "https://backend-api-rwpt.onrender.com/products";

const EditProductScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const product = route.params?.product || {};
  const productId = product._id || product.id;

  // Form values
  const [name, setName] = useState(String(product.name || ""));
  const [price, setPrice] = useState(String(product.price || ""));
  const [quantity, setQuantity] = useState(String(product.quantity || ""));

  // Loading & modal
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [editMode, setEditMode] = useState<"name" | "price" | "quantity" | "all">("all");

  // Apply selected option
  const selectMode = (mode: any) => {
    setEditMode(mode);
    setShowOptions(false);
  };

  // -----------------------------------
  // Update product API
  // -----------------------------------
  const handleUpdate = async () => {
    let updatedData: any = {};

    if (editMode === "name" || editMode === "all") updatedData.name = name.trim();
    if (editMode === "price" || editMode === "all") updatedData.price = Number(price);
    if (editMode === "quantity" || editMode === "all")
      updatedData.quantity = Number(quantity);

    if (Object.values(updatedData).some((v) => v === "" || v === undefined)) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter valid values",
      });
      return;
    }

    try {
      setLoading(true);

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

      const res = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: "Product Updated",
          text2: data?.message || "",
        });

        // Update cache
        const cached = await AsyncStorage.getItem("products_cache");
        if (cached) {
          const arr = JSON.parse(cached);
          const updated = arr.map((p: any) =>
            (p._id || p.id) === productId ? { ...p, ...updatedData } : p
          );
          await AsyncStorage.setItem("products_cache", JSON.stringify(updated));
        }

        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: data?.message || "",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* ---------------- OPTION MODAL ---------------- */}
        <Modal visible={showOptions} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>What do you want to edit?</Text>

              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => selectMode("name")}
              >
                <Text style={styles.optionText}>Name Only</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => selectMode("price")}
              >
                <Text style={styles.optionText}>Price Only</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => selectMode("quantity")}
              >
                <Text style={styles.optionText}>Quantity Only</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionBtn, { backgroundColor: "#4f8cff" }]}
                onPress={() => selectMode("all")}
              >
                <Text style={[styles.optionText, { color: "#fff" }]}>
                  Edit All Fields
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ---------------- SCREEN TITLE ---------------- */}
        <Text style={styles.title}>Edit Product</Text>

        {/* ---------------- CONDITIONAL INPUTS ---------------- */}
        {(editMode === "name" || editMode === "all") && (
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
        )}

        {(editMode === "price" || editMode === "all") && (
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#6b7280"
            value={String(price)}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        )}

        {(editMode === "quantity" || editMode === "all") && (
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            placeholderTextColor="#6b7280"
            value={String(quantity)}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        )}

        {/* ---------------- SAVE BUTTON ---------------- */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.saveContent}>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveText}>Save Changes</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProductScreen;

// ---------------------------------------------------------
// STYLES
// ---------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f1115",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 18,
    textAlign: "center",
    color: "#fff",
  },

  input: {
    backgroundColor: "#171a21",
    borderWidth: 1,
    borderColor: "#2a2f3a",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: "#fff",
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#4f8cff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#1b5e20",
  },

  saveContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },

  // ----------- MODAL -----------

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#171a21",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },

  optionBtn: {
    backgroundColor: "#222831",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  optionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
});
