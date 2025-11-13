import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles/globalStyles";

const STORE_TYPES = [
  "Groceries Store",
  "Dairy",
  "Pharmacy",
  "Bakery",
  "Stationery",
  "Electronics",
  "Other",
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, token, refreshProfile, setUserLocally, logout } = useAuth();

  // ---------------- FORM STATE ----------------
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    storeName: user?.storeName || "",
    ownerName: user?.ownerName || "",
    storeType: user?.storeType || "",
  });

  const [saving, setSaving] = useState(false);
  const [typePickerOpen, setTypePickerOpen] = useState(false);

  // Password modal
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  // Animation for premium effects
  const fadeAnim = useState(new Animated.Value(0))[0];
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  // ---------------- UPDATE FIELD ----------------
  const updateField = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  // ---------------- SAVE PROFILE ----------------
  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        "https://backend-api-rwpt.onrender.com/auth/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUserLocally(data.user);
        refreshProfile();
        Toast.show({ type: "success", text1: "Profile Updated Successfully" });
      } else {
        Toast.show({ type: "error", text1: "Update Failed", text2: data?.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Network Error" });
    }
    setSaving(false);
  };

  // ---------------- CHANGE PASSWORD ----------------
  const changePassword = async () => {
    if (!oldPwd || !newPwd) {
      Toast.show({ type: "error", text1: "Please fill both fields" });
      return;
    }

    try {
      const res = await fetch(
        "https://backend-api-rwpt.onrender.com/auth/change-password",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        Toast.show({ type: "success", text1: "Password Updated" });
        setPwdModalOpen(false);
        setOldPwd("");
        setNewPwd("");
      } else {
        Toast.show({ type: "error", text1: "Failed", text2: data?.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Password Update Error" });
    }
  };

  return (
    <Animated.View
      style={[styles.container, { paddingTop: insets.top + 10, opacity: fadeAnim }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* HEADER */}
          <View style={styles.headerCard}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={50} color={colors.primary} />
            </View>
            <Text style={styles.headerName}>{form.name}</Text>
            <Text style={styles.headerEmail}>{form.email}</Text>
          </View>

          {/* PERSONAL INFO */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Info</Text>

            <Field label="Full Name" value={form.name} onChangeText={(t) => updateField("name", t)} />
            <Field label="Email" value={form.email} keyboardType="email-address"
              onChangeText={(t) => updateField("email", t)} />
            <Field label="Phone" value={form.phone} keyboardType="phone-pad"
              onChangeText={(t) => updateField("phone", t)} />

            <Pressable style={styles.pwdBtn} onPress={() => setPwdModalOpen(true)}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.primary} />
              <Text style={styles.pwdBtnText}>Change Password</Text>
            </Pressable>
          </View>

          {/* STORE INFO */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Store Details</Text>

            <Field label="Store Name" value={form.storeName} onChangeText={(t) => updateField("storeName", t)} />
            <Field label="Owner Name" value={form.ownerName} onChangeText={(t) => updateField("ownerName", t)} />

            <Pressable style={styles.selector} onPress={() => setTypePickerOpen(true)}>
              <Text style={styles.selectorLabel}>Store Type</Text>
              <Text style={styles.selectorValue}>
                {form.storeType || "Select Type"}
              </Text>
            </Pressable>
          </View>

          {/* SAVE BTN */}
          <Pressable style={styles.saveBtn} onPress={saveProfile} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Changes</Text>}
          </Pressable>

          {/* LOGOUT */}
          <Pressable style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* TYPE PICKER */}
      <Modal visible={typePickerOpen} transparent animationType="slide">
        <Pressable style={styles.backdrop} onPress={() => setTypePickerOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Select Store Type</Text>

          {STORE_TYPES.map((t) => (
            <Pressable
              key={t}
              style={styles.sheetItem}
              onPress={() => {
                updateField("storeType", t);
                setTypePickerOpen(false);
              }}
            >
              <Text style={styles.sheetText}>{t}</Text>
              {form.storeType === t && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      </Modal>

      {/* PASSWORD MODAL */}
      <Modal visible={pwdModalOpen} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setPwdModalOpen(false)} />

        <View style={styles.passwordCard}>
          <Text style={styles.modalTitle}>Change Password</Text>

          <Field label="Old Password" secureTextEntry value={oldPwd} onChangeText={setOldPwd} />
          <Field label="New Password" secureTextEntry value={newPwd} onChangeText={setNewPwd} />

          <Pressable style={styles.modalBtn} onPress={changePassword}>
            <Text style={styles.modalBtnText}>Update Password</Text>
          </Pressable>
        </View>
      </Modal>
    </Animated.View>
  );
}

// ---------------- FIELD COMPONENT ----------------
const Field = ({ label, ...props }: any) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput {...props} style={styles.input} placeholderTextColor="#6b7280" />
  </View>
);

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1115" },
  scroll: { padding: 16, paddingBottom: 50 },

  headerCard: {
    alignItems: "center",
    marginBottom: 22,
    paddingTop: 6,
  },

  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#171a21",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(79,140,255,0.3)",
  },

  headerName: {
    marginTop: 12,
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  headerEmail: { color: "#b6c0cf", marginTop: 4 },

  card: {
    backgroundColor: "#171a21",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },

  cardTitle: { fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 14 },

  label: { color: "#b6c0cf", marginBottom: 6 },

  input: {
    backgroundColor: "#0f1115",
    padding: 14,
    borderRadius: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },

  pwdBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79,140,255,0.12)",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(79,140,255,0.35)",
  },
  pwdBtnText: { color: "#4f8cff", marginLeft: 10, fontWeight: "600" },

  selector: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#0f1115",
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },
  selectorLabel: { color: "#b6c0cf", marginBottom: 6 },
  selectorValue: { color: "#fff", fontWeight: "600" },

  saveBtn: {
    backgroundColor: "#4f8cff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  logoutBtn: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  logoutText: { color: "#171a21", fontWeight: "700", fontSize: 16 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    backgroundColor: "#171a21",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  sheetTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 16 },
  sheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2a2f3a",
  },
  sheetText: { color: "#fff" },

  passwordCard: {
    backgroundColor: "#171a21",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2f3a",
    position: "absolute",
    top: "25%",
    left: 20,
    right: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  modalBtn: {
    marginTop: 14,
    padding: 14,
    backgroundColor: "#4f8cff",
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "700" },
});
