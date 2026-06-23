import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";

// Unauthenticated users are redirected to the login route by ProtectedRoute,
// so a bare render of App should surface the login screen.
test("renders the app and redirects unauthenticated users to login", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
});
