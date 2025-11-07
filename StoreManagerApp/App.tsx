import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { StoreProvider } from './src/context/StoreContext';

const App = () => {
  return (
    <StoreProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;
