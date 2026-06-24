import { fireEvent } from "@testing-library/react-native";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import LoginScreen from "../../screens/auth/LoginScreen";
import { renderWithProviders } from "../../test-utils";

const mockNavigation = { navigate: jest.fn() };
const mockStore = configureStore<any>([thunk as any]);

const baseState = {
  auth: { user: null, token: null, isLoading: false, error: null },
};

describe("LoginScreen", () => {
  let store: any;
  beforeEach(() => {
    store = mockStore(baseState);
    store.dispatch = jest.fn().mockImplementation(() => Promise.resolve());
    mockNavigation.navigate.mockClear();
  });

  it("renders the heading and form fields", () => {
    const { getByText, getAllByText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} />,
      store,
    );
    expect(getByText("Welcome back")).toBeTruthy();
    // Paper TextInput renders its label as text
    expect(getAllByText("Email").length).toBeGreaterThan(0);
    expect(getAllByText("Password").length).toBeGreaterThan(0);
  });

  it("renders sign-in and links to register and reset", () => {
    const { getByText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} />,
      store,
    );
    expect(getByText("Sign in")).toBeTruthy();
    expect(getByText("Create an account")).toBeTruthy();
    expect(getByText("Forgot password?")).toBeTruthy();
  });

  it("navigates to register when the link is pressed", () => {
    const { getByText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} />,
      store,
    );
    fireEvent.press(getByText("Create an account"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("Register");
  });
});
