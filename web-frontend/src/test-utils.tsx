import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "./store";

// Renders a component with the providers the app relies on: the Redux store,
// a TanStack Query client, and a router. Use for component-level tests.
export function renderWithProviders(
  ui: ReactElement,
  { route = "/" }: { route?: string } = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper });
}
