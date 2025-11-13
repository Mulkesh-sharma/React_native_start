import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [mood, setMood] = useState<"idle" | "typing">("idle");

  // --------------------------
  // SAFE FIXED ANIMATIONS
  // --------------------------
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // --------------------------
  // MASCOT LOGIC
  // --------------------------
  const renderMascot = () => {
    switch (mood) {
      case "typing":
        return (
          <Ionicons name="glasses-outline" size={40} color="#4f8cff" />
        );
      default:
        return (
          <Ionicons name="help-circle-outline" size={44} color="#4f8cff" />
        );
    }
  };

  // --------------------------
  // RESET PASSWORD REQUEST
  // --------------------------
  const handleSendLink = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      const res = await fetch(
        "https://backend-api-rwpt.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert(
          "Email Sent",
          data?.message || "Reset link sent to your email!"
        );
        navigation.goBack();
      } else {
        Alert.alert("Error", data?.message || "Failed to send reset link");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  // --------------------------
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>{renderMascot()}</View>
        </View>

        <Text style={styles.heading}>Forgot Password?</Text>
        <Text style={styles.sub}>
          Enter your registered email to receive a reset link
        </Text>

        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={18} color="#9aa3b1" />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#777"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setMood(t.length > 0 ? "typing" : "idle");
            }}
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSendLink}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 18 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.switchText}>
            Back to <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// --------------------------
// STYLES
// --------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#171a21",
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },

  // Mascot
  avatarWrapper: { alignItems: "center", marginBottom: 20 },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "rgba(79,140,255,0.12)",
    borderWidth: 2,
    borderColor: "rgba(79,140,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
  },
  sub: {
    textAlign: "center",
    color: "#b6c0cf",
    marginBottom: 26,
    fontSize: 14,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f1115",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2a2f3a",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    color: "#fff",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#4f8cff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  switchText: {
    textAlign: "center",
    color: "#b6c0cf",
    fontSize: 14,
  },

  link: {
    color: "#4f8cff",
    fontWeight: "700",
  },
});
