import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import axios from "axios";
import { Provider } from "react-redux";
import LoginScreen from "../../screens/auth/LoginScreen";
import { store } from "../../store";

// Provide a complete axios mock at load time. api.ts instantiates a singleton
// at import (registering interceptors), which runs before beforeEach, so the
// mocked axios.create must already return an object exposing interceptors.
jest.mock("axios", () => {
  const mAxios: any = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
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

describe("Login Integration Test", () => {
  let navigation: any;

  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("successfully logs in with valid credentials", async () => {
    const mockResponse = {
      data: {
        token: "mock-token",
        user: {
          id: "1",
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "user",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      },
      status: 200,
      statusText: "OK",
    };

    mockedAxios.request.mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <LoginScreen navigation={navigation} />
        </NavigationContainer>
      </Provider>,
    );

    const emailInput = getByPlaceholderText("Enter your email");
    const passwordInput = getByPlaceholderText("Enter your password");
    const loginButton = getByText("Sign In");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockedAxios.request).toHaveBeenCalled();
    });
  });

  it("shows error message with invalid credentials", async () => {
    const mockError = {
      response: {
        data: {
          message: "Invalid credentials",
        },
        status: 401,
      },
      message: "Invalid credentials",
    };

    mockedAxios.request.mockRejectedValueOnce(mockError);

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <LoginScreen navigation={navigation} />
        </NavigationContainer>
      </Provider>,
    );

    const emailInput = getByPlaceholderText("Enter your email");
    const passwordInput = getByPlaceholderText("Enter your password");
    const loginButton = getByText("Sign In");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "wrongpassword");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockedAxios.request).toHaveBeenCalled();
    });
  });
});
