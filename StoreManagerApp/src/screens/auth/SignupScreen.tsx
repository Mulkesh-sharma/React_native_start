import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { signup } = useAuth();

  // ------------------------------
  // INPUT FIELDS
  // ------------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [mood, setMood] = useState<"idle" | "typing" | "cover">("idle");

  // ------------------------------
  // FIXED ANIMATION HOOKS
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
  // SIGNUP PROCESS
  // ------------------------------
  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    const res = await signup(name, email, password);

    if (res?.success) {
      alert("Account created!");
      navigation.navigate("Login");
    } else {
      alert(res.message || "Signup failed");
    }
  };

  // ------------------------------
  // MASCOT RENDERER
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
        return (
          <Ionicons name="glasses-outline" size={38} color="#4f8cff" />
        );
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
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.switchText}>
            Already have an account?
            <Text style={styles.link}> Login</Text>
          </Text>
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
  faceRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

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
