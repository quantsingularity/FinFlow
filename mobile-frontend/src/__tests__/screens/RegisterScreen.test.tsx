import { fireEvent } from "@testing-library/react-native";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import RegisterScreen from "../../screens/auth/RegisterScreen";
import { renderWithProviders } from "../../test-utils";

const mockNavigation = { navigate: jest.fn() };
const mockStore = configureStore<any>([thunk as any]);
const baseState = {
  auth: { user: null, token: null, isLoading: false, error: null },
};

describe("RegisterScreen", () => {
  let store: any;
  beforeEach(() => {
    store = mockStore(baseState);
    store.dispatch = jest.fn().mockImplementation(() => Promise.resolve());
    mockNavigation.navigate.mockClear();
  });

  it("renders the create-account heading and fields", () => {
    const { getByText, getAllByText } = renderWithProviders(
      <RegisterScreen navigation={mockNavigation} />,
      store,
    );
    expect(getByText("Create your account")).toBeTruthy();
    expect(getAllByText("Work email").length).toBeGreaterThan(0);
    expect(getAllByText("Confirm password").length).toBeGreaterThan(0);
  });

  it("renders a create-account button", () => {
    const { getByText } = renderWithProviders(
      <RegisterScreen navigation={mockNavigation} />,
      store,
    );
    expect(getByText("Create account")).toBeTruthy();
  });

  it("navigates to login when the sign-in link is pressed", () => {
    const { getByText } = renderWithProviders(
      <RegisterScreen navigation={mockNavigation} />,
      store,
    );
    fireEvent.press(getByText("Sign in"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
  });
});
