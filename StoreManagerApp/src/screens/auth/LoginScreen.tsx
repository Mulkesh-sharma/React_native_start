import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AntIcon from "react-native-vector-icons/AntDesign";
import Toast from 'react-native-toast-message';
import { BASE_URL } from "../../utils/api";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login, googleLogin } = useAuth();

  // ----------------------
  // ALL HOOKS AT TOP (NO CONDITIONS)
  // ----------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<"idle" | "look" | "cover">("idle");

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log("FULL user Info:", userInfo);

      const idToken = userInfo?.data?.idToken;

      console.log("ID TOKEN:", idToken);

      if (!idToken) {
        Toast.show({
          type: "error",
          text1: "Google Login Failed",
          text2: "Could not read Google ID Token",
        });
        setLoading(false);
        return;
      }

      // Use AuthContext googleLogin!
      const res = await googleLogin(idToken);

      setLoading(false);

      if (!res?.success) {
        Toast.show({
          type: "error",
          text1: "Google Login Failed",
          text2: res?.message || "Backend error",
        });
        return;
      }

      // ❌ REMOVE ANY navigation.reset / navigation.navigate
      // Login flow auto-navigates because token changed in AuthContext.

    } catch (err: any) {
      console.log("Google login error:", err);
      Toast.show({
        type: "error",
        text1: "Google Login Failed",
        text2: err?.message,
      });
      setLoading(false);
    }
  };


  // ----------------------
  // RUN ENTRY ANIMATION
  // ----------------------
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
  }, [fadeAnim, slideAnim]);

  // ----------------------
  // EVENT HANDLERS
  // ----------------------
  const handleEmailChange = (t: string) => {
    setEmail(t);
    setMood(t.length > 0 ? "look" : "idle");
  };

  const handlePasswordFocus = () => setMood("cover");
  const handlePasswordBlur = () => setMood("idle");

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "All fields are required"
      });
      return;
    }

    setLoading(true);

    const res = await login(email, password);

    setLoading(false);

    if (!res?.success) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: res?.message || "Invalid email or password"
      });
    }
  };

  // ----------------------
  // FACE RENDERER (NO HOOKS)
  // ----------------------
  const renderFace = () => {
    if (mood === "cover") {
      return (
        <View style={styles.faceRow}>
          <Ionicons name="hand-left-outline" size={28} color="#4f8cff" />
          <Ionicons name="hand-right-outline" size={28} color="#4f8cff" />
        </View>
      );
    }

    if (mood === "look") {
      return (
        <View style={styles.faceRow}>
          <Ionicons name="eye-outline" size={28} color="#4f8cff" />
          <Ionicons
            name="arrow-forward-circle-outline"
            size={20}
            color="#4f8cff"
            style={{ marginLeft: 5 }}
          />
        </View>
      );
    }

    return (
      <View style={styles.faceRow}>
        <Ionicons name="happy-outline" size={36} color="#4f8cff" />
      </View>
    );
  };

  // ----------------------
  // UI
  // ----------------------
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Mascot */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>{renderFace()}</View>
        </View>

        <Text style={styles.heading}>Welcome Back 👋</Text>
        <Text style={styles.sub}>Login to manage your store</Text>

        {/* Email */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#9aa3b1" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7b8694"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={() => setMood("idle")}
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#9aa3b1" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7b8694"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9aa3b1"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={{ alignSelf: "flex-end", marginBottom: 10 }}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          disabled={loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Signup */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={{ marginTop: 16 }}
        >
          <Text style={styles.switchText}>
            Don't have an account?
            <Text style={styles.highlight}> Sign up</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <AntIcon name="google" size={20} color="#fff" />
          <Text style={styles.googleText}>Login with Google</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

// ---------------- STYLES ----------------
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
  avatarWrapper: { alignItems: "center", marginBottom: 20 },
  avatarCircle: {
    width: 105,
    height: 105,
    borderRadius: 60,
    backgroundColor: "rgba(79,140,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(79,140,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  faceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  sub: {
    textAlign: "center",
    color: "#b6c0cf",
    marginBottom: 24,
    marginTop: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f1115",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2a2f3a",
    marginBottom: 16,
  },
  forgotText: {
    color: "#4f8cff",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#fff",
  },
  button: {
    backgroundColor: "#4f8cff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  switchText: { textAlign: "center", color: "#b6c0cf", fontSize: 14 },
  highlight: { color: "#4f8cff", fontWeight: "700" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4437",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

});
