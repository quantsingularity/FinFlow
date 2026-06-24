import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import axios from "axios";
import { Provider } from "react-redux";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "../../screens/auth/LoginScreen";
import { store } from "../../store";
import { lightTheme } from "../../theme";

// api.ts builds an axios singleton at import (registering interceptors), so the
// mocked axios.create must already expose interceptors.
jest.mock("axios", () => {
  const mAxios: any = {
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    request: jest.fn(),
  };
  mAxios.create = jest.fn(() => mAxios);
  return { __esModule: true, default: mAxios };
});
const mockedAxios = axios as jest.Mocked<typeof axios>;

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function renderLogin(navigation: any) {
  return render(
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={metrics}>
        <PaperProvider theme={lightTheme}>
          <NavigationContainer>
            <LoginScreen navigation={navigation} />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>,
  );
}

describe("Login integration", () => {
  let navigation: any;
  beforeEach(() => {
    navigation = { navigate: jest.fn() };
  });
  afterEach(() => jest.clearAllMocks());

  it("dispatches a login request with valid credentials", async () => {
    mockedAxios.request.mockResolvedValueOnce({
      data: {
        token: "mock-token",
        user: { id: "1", email: "test@example.com", role: "user" },
      },
      status: 200,
      statusText: "OK",
    });
    const { getByTestId, getByText } = renderLogin(navigation);
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");
    fireEvent.press(getByText("Sign in"));
    await waitFor(() => expect(mockedAxios.request).toHaveBeenCalled());
  });

  it("handles invalid credentials without crashing", async () => {
    mockedAxios.request.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" }, status: 401 },
      message: "Invalid credentials",
    });
    const { getByTestId, getByText } = renderLogin(navigation);
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "wrongpassword");
    fireEvent.press(getByText("Sign in"));
    await waitFor(() => expect(mockedAxios.request).toHaveBeenCalled());
  });
});
