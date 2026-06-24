import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { Provider, useDispatch } from "react-redux";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { store } from "./src/store";
import { checkAuth } from "./src/store/slices/authSlice";
import { lightTheme, darkTheme } from "./src/theme";

function AppContent() {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    // Restore any stored session on startup.
    dispatch(checkAuth() as never);
  }, [dispatch]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <AppNavigator isDark={scheme === "dark"} />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
