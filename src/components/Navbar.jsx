// src/components/Navbar.jsx
import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Navbar = () => (
  <View style={styles.nav}>
    <Text style={styles.title}>Inventory App</Text>
  </View>
);

export default Navbar;

const styles = StyleSheet.create({
  nav: { padding: 16, backgroundColor: "#2a7905" },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
