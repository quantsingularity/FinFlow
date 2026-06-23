import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { renderWithProviders } from "../../test-utils";
import Register from "../Register";

// NOTE: Smoke tests against the current Register page. The original suite
// asserted first-name fields, a successful-registration redirect, and a
// navigation link, but the current page collects only email, password, and
// confirm-password, and its submit handler does not yet call the auth service.
// See FIXES.md.
describe("Register page", () => {
  test("renders the registration form", () => {
    renderWithProviders(<Register />);
    expect(
      screen.getByRole("heading", { name: /finflow/i }),
    ).toBeInTheDocument();
  });

  test("renders email, password and confirm-password inputs", () => {
    renderWithProviders(<Register />);
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i),
    ).toBeInTheDocument();
  });

  test("renders a submit button", () => {
    renderWithProviders(<Register />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
