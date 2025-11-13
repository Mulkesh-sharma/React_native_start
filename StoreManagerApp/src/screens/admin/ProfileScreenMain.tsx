import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { colors, spacing, globalStyles } from "../../styles/globalStyles";

export default function ProfileScreenMain() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // --------------------------------------------------
  // AUTH CONTEXT DATA
  // --------------------------------------------------
  const { user, logout } = useAuth();

  const userProfile = {
    name: user?.name || "",
    email: user?.email || "",
    storeName: user?.storeName || "",
    ownerName: user?.ownerName || user?.name || "",
    storeType: user?.storeType || "",
    phone: user?.phone || "",
  };

  // --------------------------------------------------
  // ANIMATED AVATAR GLOW
  // --------------------------------------------------
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleEditProfile = () => navigation.navigate("Profile");
  const handleLogout = () => logout();

  return (
    <View style={globalStyles.container}>
      <AppHeader title="Profile" />

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: 40,
        }}
      >
        {/* HEADER CARD */}
        <View style={styles.heroCard}>
          <Animated.View
            style={[
              styles.avatarGlow,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.avatarCircle}>
              <Icon name="user" size={50} color={colors.primary} />
            </View>
          </Animated.View>

          <Text style={styles.storeName}>
            {userProfile.storeName || "No Store Name"}
          </Text>

          <Text style={styles.subInfo}>
            {(userProfile.storeType || "No type") +
              " • " +
              (userProfile.ownerName || "No Owner")}
          </Text>

          <Pressable style={styles.editProfileBtn} onPress={handleEditProfile}>
            <Icon name="edit-3" size={18} color="#4f8cff" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Business Information</Text>

          <InfoRow label="Store Name" value={userProfile.storeName} />
          <InfoRow label="Owner Name" value={userProfile.ownerName} />
          <InfoRow label="Store Type" value={userProfile.storeType} />
          <InfoRow label="Email" value={userProfile.email} />
          <InfoRow label="Phone" value={userProfile.phone || "Not provided"} />
        </View>

        {/* LOGOUT BUTTON */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "-"}</Text>
  </View>
);

const styles = StyleSheet.create({
  heroCard: {
    padding: spacing.lg,
    borderRadius: 18,
    marginBottom: spacing.md,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },

  avatarGlow: {
    padding: 4,
    borderRadius: 80,
    backgroundColor: "rgba(79,140,255,0.15)",
  },

  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#171a21",
    borderWidth: 2,
    borderColor: "rgba(79,140,255,0.4)",
  },

  storeName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: spacing.md,
  },

  subInfo: {
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.md,
  },

  editProfileBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(79,140,255,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(79,140,255,0.4)",
  },

  editProfileText: {
    color: "#4f8cff",
    marginLeft: 8,
    fontWeight: "600",
  },

  infoCard: {
    padding: spacing.lg,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  infoLabel: {
    color: colors.textSecondary,
    flex: 1,
  },

  infoValue: {
    flex: 1,
    textAlign: "right",
    color: "#fff",
    fontWeight: "600",
  },

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error,
  },

  logoutText: {
    color: colors.error,
    fontWeight: "700",
    marginLeft: 8,
  },
});
