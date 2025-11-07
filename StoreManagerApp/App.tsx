import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ProductProvider } from './src/context/ProductContext';
import { StoreProvider } from './src/context/StoreContext';

const App = () => {
  return (
    <ProductProvider>
      <StoreProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </StoreProvider>
    </ProductProvider>
  );
};

export default App;
