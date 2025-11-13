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
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import AppHeader from "../../components/AppHeader";
import { globalStyles } from "../../styles/globalStyles";

const API_URL = "https://backend-api-rwpt.onrender.com/products";

const AddProductScreen = () => {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name || !price || !quantity) {
      return Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "All fields are required",
      });
    }

    const priceNum = Number(price);
    const qtyNum = Number(quantity);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(qtyNum) || qtyNum <= 0) {
      return Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Enter valid price & quantity",
      });
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Toast.show({ type: "error", text1: "Unauthorized", text2: "Please login again" });
        navigation.navigate("Login");
        return;
      }

      const res = await fetch(API_URL, {
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

      const data = await res.json();

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: "Product Added",
          text2: `${name} has been added`,
        });

        await AsyncStorage.removeItem("products_cache");
        await AsyncStorage.removeItem("products_cache_timestamp");

        setName("");
        setPrice("");
        setQuantity("");

        navigation.goBack();
      } else {
        Toast.show({ type: "error", text1: "Failed to Add", text2: data?.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Error", text2: "Unable to add product" });
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

        {/* Custom header */}
        <AppHeader title="Add Product" />

        {/* Scroll wrapper */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
        >
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
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
  },

  scrollArea: {
    flex: 1,
    paddingHorizontal: 16, // ← restore padding
    paddingTop: 10,
  },

  scrollContent: {
    paddingBottom: 40,
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
