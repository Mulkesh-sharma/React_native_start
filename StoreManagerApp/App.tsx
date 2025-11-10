import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { StoreProvider } from "./src/context/StoreContext";

const App = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;
