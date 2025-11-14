// src/api/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://backend-api-rwpt.onrender.com/";

import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
//   androidClientId: "156860658060-qfhv47utc9ub56f9c1031hgmjqv6ddal.apps.googleusercontent.com",
  webClientId: "156860658060-e9fqfgs8nk48j2notdmqg7i66uq37juh.apps.googleusercontent.com",
  offlineAccess: false,
  forceCodeForRefreshToken: false,
  scopes: ["openid", "email", "profile"],
});
// Safe JSON parser
const safeJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("❌ JSON Parse Error:", text);
    return { success: false, message: "Invalid JSON returned from server" };
  }
};

// GET request (supports token)
export const apiGet = async (endpoint, tokenFromContext) => {
  try {
    const storedToken = await AsyncStorage.getItem("token");
    const token = tokenFromContext || storedToken;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return safeJson(res);
  } catch (err) {
    console.log("GET Error:", err);
    return { success: false, message: "Network error" };
  }
};

// POST / PUT / DELETE request
export const apiRequest = async (endpoint, method = "POST", data = {}) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    return safeJson(res);
  } catch (err) {
    console.log("Request Error:", err);
    return { success: false, message: "Network error" };
  }
};
