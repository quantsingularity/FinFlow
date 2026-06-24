import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { renderWithProviders } from "../../test-utils";
import Dashboard from "../Dashboard";

// Smoke tests: the Dashboard reads data via TanStack Query and renders KPIs,
// a revenue chart, and recent activity with loading/empty/error states.
describe("Dashboard page", () => {
  test("renders the welcome heading", () => {
    renderWithProviders(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
  });

  test("renders the primary stat cards", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/revenue \(settled\)/i)).toBeInTheDocument();
    expect(screen.getByText(/outstanding/i)).toBeInTheDocument();
  });
});
