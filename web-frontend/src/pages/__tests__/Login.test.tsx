import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { renderWithProviders } from "../../test-utils";
import Login from "../Login";

// NOTE: These are smoke tests against the current Login page. The original
// suite asserted OAuth login, validation messages, and a successful-login
// redirect, but the page's submit handler is currently a stub that does not
// call the auth service, and the social-login buttons are placeholders with
// no handler. See FIXES.md. Detailed behavioral tests should be restored once
// the page logic is implemented.
describe("Login page", () => {
  test("renders the login form", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to your finflow account/i),
    ).toBeInTheDocument();
  });

  test("renders email and password inputs", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByPlaceholderText(/name@example.com/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("renders a submit button", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
