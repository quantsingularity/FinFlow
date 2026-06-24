import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";

// The app opens on the public Home (landing) page at "/". From there a visitor
// can sign in or create an account; protected routes redirect to /login.
test("renders the landing page at the root route", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  expect(
    await screen.findByRole("heading", {
      name: /every financial move, in one place/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getAllByRole("link", { name: /get started/i }).length,
  ).toBeGreaterThan(0);
});
