import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { renderWithProviders } from "../../test-utils";
import Login from "../Login";

describe("Login page", () => {
  test("renders the login form heading and subtext", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to your finflow account/i),
    ).toBeInTheDocument();
  });

  test("renders email and password inputs", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByPlaceholderText(/name@example.com/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("renders a sign-in button and links to register and reset", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create an account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });
});
