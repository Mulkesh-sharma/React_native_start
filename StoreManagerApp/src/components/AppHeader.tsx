import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

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
        onPress={() => navigation.navigate("ProfileMain")}
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
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    marginRight: spacing.sm,
  },

  titleText: {
    ...globalStyles.text,
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  profileBtn: {
    padding: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
});
