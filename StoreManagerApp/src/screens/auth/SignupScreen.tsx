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

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { signup, googleLogin } = useAuth();

  // ------------------------------
  // INPUT STATES
  // ------------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [mood, setMood] = useState<"idle" | "typing" | "cover">("idle");

  // NEW ⭐ Loader
  const [loading, setLoading] = useState(false);

  // ------------------------------
  // ANIMATION VALUES (useRef fix)
  // ------------------------------
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



  // ------------------------------
  // INPUT EVENTS
  // ------------------------------
  const handleEmailTyping = (t: string) => {
    setEmail(t);
    setMood(t.length > 0 ? "typing" : "idle");
  };

  const handlePwdFocus = () => setMood("cover");
  const handlePwdBlur = () => setMood("idle");

  // ------------------------------
  // SIGNUP PROCESS (with loader)
  // ------------------------------
  const handleSignup = async () => {
    if (!name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "All fields are required"
      });
      return;
    }

    setLoading(true);

    const res = await signup(name, email, password);

    setLoading(false);

    if (res?.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created!"
      });
      navigation.navigate("Login");
    } else {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: res.message || "An error occurred during signup"
      });
    }
  };

  // ------------------------------
  // MASCOT REACTIONS
  // ------------------------------
  const renderMascot = () => {
    switch (mood) {
      case "cover":
        return (
          <View style={styles.faceRow}>
            <Ionicons name="hand-left-outline" size={28} color="#4f8cff" />
            <Ionicons name="hand-right-outline" size={28} color="#4f8cff" />
          </View>
        );

      case "typing":
        return <Ionicons name="glasses-outline" size={38} color="#4f8cff" />;

      default:
        return <Ionicons name="happy-outline" size={38} color="#4f8cff" />;
    }
  };

  // ------------------------------
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
          <View style={styles.avatarCircle}>{renderMascot()}</View>
        </View>

        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.sub}>Your store, your control</Text>

        {/* FULL NAME */}
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={18} color="#9aa3b1" />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* EMAIL */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={18} color="#9aa3b1" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={handleEmailTyping}
            keyboardType="email-address"
            onBlur={() => setMood("idle")}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color="#9aa3b1" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            onFocus={handlePwdFocus}
            onBlur={handlePwdBlur}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9aa3b1"
            />
          </TouchableOpacity>
        </View>

        {/* SIGNUP BUTTON */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* GO TO LOGIN */}
        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.switchText}>
            Already have an account?
            <Text style={styles.link}> Login</Text>
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

// ------------------------------
// STYLES
// ------------------------------
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
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "rgba(79,140,255,0.12)",
    borderWidth: 2,
    borderColor: "rgba(79,140,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  faceRow: { flexDirection: "row", gap: 6 },

  heading: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
  },

  sub: {
    textAlign: "center",
    color: "#b6c0cf",
    marginBottom: 26,
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
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  switchText: { textAlign: "center", color: "#b6c0cf", fontSize: 14 },

  link: { color: "#4f8cff", fontWeight: "700" },
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
