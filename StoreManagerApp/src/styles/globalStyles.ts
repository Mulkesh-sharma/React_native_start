import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  scrollContent: {
    marginTop: 8,
    paddingVertical: 8,
    paddingBottom: 8, // Extra padding at the bottom for better scrolling
  },
  card: {
    backgroundColor: '#171a21',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  text: {
    color: '#b6c0cf',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Add more global styles as needed
});

export const colors = {
  background: '#0f1115',
  card: '#171a21',
  border: '#2a2f3a',
  text: '#ffffff',
  textSecondary: '#b6c0cf',
  primary: '#4f8cff',
  success: '#4f8cff',
  error: '#d32f2f',
  warning: '#ed6c02',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
