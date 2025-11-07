import { DefaultTheme, configureFonts } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',
    accent: '#69F0AE',
    background: '#f6f6f6',
    surface: '#ffffff',
    error: '#B00020',
    text: '#333333',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: '#00000080',
    notification: '#f50057',
    success: '#4caf50',
    warning: '#ff9800',
    info: '#2196f3',
  },
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
    },
  }),
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

export default theme;
