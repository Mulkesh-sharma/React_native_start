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
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { globalStyles } from "../../styles/globalStyles";

const API_URL = "https://backend-api-rwpt.onrender.com/products";

const AddProductScreen = () => {
  const navigation = useNavigation<any>();

  // ------------- HOOKS (always at top) ----------------
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------- ADD PRODUCT ---------------------------
  const handleAdd = async () => {
    if (!name || !price || !quantity) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "All fields are required",
      });
      return;
    }

    const priceNum = Number(price);
    const qtyNum = Number(quantity);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(qtyNum) || qtyNum <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Enter valid price & quantity",
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

      // Send POST request
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          price: priceNum,
          quantity: qtyNum,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Product Added",
          text2: `${name} has been added`,
        });

        // ---------------------------
        // Clear cache so all screens reload fresh data
        // ---------------------------
        await AsyncStorage.removeItem("products_cache");
        await AsyncStorage.removeItem("products_cache_timestamp");

        // Reset input fields
        setName("");
        setPrice("");
        setQuantity("");

        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Add Product",
          text2: data?.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to add product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add New Product</Text>

        <TextInput
          placeholder="Product Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Price"
          placeholderTextColor="#6b7280"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Quantity"
          placeholderTextColor="#6b7280"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveText}>Add Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f1115",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 24,
    textAlign: "center",
    color: "#ffffff",
  },

  input: {
    backgroundColor: "#171a21",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2f3a",
    fontSize: 16,
    color: "#ffffff",
  },

  saveBtn: {
    backgroundColor: "#4f8cff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#1b5e20",
  },

  saveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
