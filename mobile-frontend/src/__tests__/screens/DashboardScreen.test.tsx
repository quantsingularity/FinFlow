import { waitFor } from "@testing-library/react-native";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import DashboardScreen from "../../screens/dashboard/DashboardScreen";
import { renderWithProviders } from "../../test-utils";

// The Dashboard fetches payments on mount; mock the API so tests are offline.
jest.mock("../../services/api", () => ({
  paymentsApi: {
    getPayments: jest.fn().mockResolvedValue({ data: [], status: 200 }),
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
  getParent: () => ({ navigate: jest.fn() }),
};
const mockStore = configureStore<any>([thunk as any]);

const state = {
  auth: {
    user: { id: "1", firstName: "John", email: "john@example.com" },
    token: "t",
    isLoading: false,
    error: null,
  },
};

describe("DashboardScreen", () => {
  it("renders the greeting and stat labels", async () => {
    const store = mockStore(state);
    store.dispatch = jest.fn();
    const { getByText, getAllByText } = renderWithProviders(
      <DashboardScreen navigation={mockNavigation} />,
      store,
    );
    expect(getByText("Welcome back,")).toBeTruthy();
    expect(getByText("John")).toBeTruthy();
    await waitFor(() =>
      expect(getAllByText("Payments").length).toBeGreaterThan(0),
    );
  });
});
