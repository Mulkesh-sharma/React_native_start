# ===========================
# React Native Core
# ===========================
-keep class com.facebook.** { *; }
-dontwarn com.facebook.**

# ===========================
# Hermes Engine (if enabled)
# ===========================
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**

# ===========================
# React Native Gesture Handler / Reanimated
# ===========================
-keep class com.swmansion.** { *; }
-dontwarn com.swmansion.**

# ===========================
# OkHttp / Networking
# ===========================
-dontwarn okhttp3.**
-dontwarn okio.**

# ===========================
# Google libraries (Gson, Play Services, Firebase)
# ===========================
-keep class com.google.** { *; }
-dontwarn com.google.**

# ===========================
# Keep Your App Classes
# ===========================
-keep class com.storemanagerapp.** { *; }

# ===========================
# Prevent stripping annotations
# ===========================
-keepattributes *Annotation*

# ===========================
# Prevent removing Serializable classes
# ===========================
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
}

# ===========================
# Misc RN required rules
# ===========================
-dontwarn javax.annotation.**
-keep class androidx.** { *; }
-dontwarn androidx.**

# Keep R8 from stripping native JNI interfaces
-keep class com.facebook.react.bridge.** { *; }

# ===========================
# Optimize but KEEP stability
# ===========================
-dontoptimize
