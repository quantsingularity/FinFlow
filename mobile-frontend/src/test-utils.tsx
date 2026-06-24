import React, { type ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { lightTheme } from "./theme";

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

// Renders a component with the providers the app relies on: Redux store,
// react-native-paper theme, and safe-area context.
export function renderWithProviders(ui: ReactElement, store: any) {
  return render(
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={metrics}>
        <PaperProvider theme={lightTheme}>{ui}</PaperProvider>
      </SafeAreaProvider>
    </Provider>,
  );
}
