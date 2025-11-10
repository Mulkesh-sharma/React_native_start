// src/api/api.js

import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://backend-api-rwpt.onrender.com/"; // ← Your backend

/**
 * Safely parses JSON to avoid "<" errors
 */
const safeJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("❌ JSON Parse Error:", text);
    return { error: "Invalid JSON from server", raw: text };
  }
};

/**
 * GET request
 */
export const apiGet = async (endpoint) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    return safeJson(res);
  } catch (err) {
    console.log("GET Error:", err);
    return { error: "Network error" };
  }
};

/**
 * POST / PUT / DELETE with Authorization header
 */
export const apiRequest = async (endpoint, method = "POST", data = {}) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // ✅ FIXED
      },
      body: JSON.stringify(data),
    });

    return safeJson(res);
  } catch (err) {
    console.log("Request Error:", err);
    return { error: "Network error" };
  }
};
