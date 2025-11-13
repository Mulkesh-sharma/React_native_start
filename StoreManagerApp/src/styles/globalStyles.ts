import { StyleSheet } from "react-native";

export const colors = {
  // BASE THEME COLORS
  background: "#0f1115",
  surface: "#171a21",
  border: "#2a2f3a",

  text: "#ffffff",
  textSecondary: "#b6c0cf",

  primary: "#4f8cff",
  danger: "#ff4d4d",
  warning: "#ffcc00",

  overlay: "rgba(255,255,255,0.05)",
  inputBg: "#1d212a",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ------------------------------------------------------
// GLOBAL UI COMPONENT STYLES
// ------------------------------------------------------
export const globalStyles = StyleSheet.create({
  // SCREEN CONTAINER
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // SCROLL AREA
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },

  // CARD UI
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // TITLES
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  // TEXT
  text: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  // INPUT FIELD
  input: {
    width: "100%",
    padding: spacing.md,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    fontSize: 16,
  },

  // BUTTONS
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1b5e20",
    marginBottom: spacing.md,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // OUTLINE BUTTON
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },

  outlineButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  // DANGER BUTTON
  dangerButton: {
    backgroundColor: "rgba(255,77,77,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,77,77,0.4)",
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },

  dangerButtonText: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 16,
  },

  // CENTERED LOADER
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  loaderText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  // ROW
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
