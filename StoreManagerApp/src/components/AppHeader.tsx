import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

interface Props {
  title?: string;        // screen name
  isHome?: boolean;      // is home screen?
}

const AppHeader = ({ title, isHome = false }: Props) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.headerContainer}>
      {/* LEFT SIDE */}
      <View style={styles.leftSection}>
        {!isHome && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <Text style={styles.titleText}>
          {isHome ? "Store Manager" : title}
        </Text>
      </View>

      {/* RIGHT SIDE - PROFILE BUTTON (VISIBLE EVERYWHERE) */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.profileBtn}
      >
        <Ionicons name="person-circle-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 6,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    marginRight: 12,
  },

  titleText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  profileBtn: {
    padding: 4,
  },
});
