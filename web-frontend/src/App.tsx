import { lazy, Suspense, useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { AppLayout } from "./components/layout/AppLayout";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getUserSuccess, logout } from "./store/authSlice";
import * as authService from "./services/authService";

// Entry funnel loads eagerly; the authenticated app is code-split.
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Payments = lazy(() => import("./pages/Payments"));
const PaymentDetail = lazy(() => import("./pages/PaymentDetail"));
const Invoices = lazy(() => import("./pages/Invoices"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Accounting = lazy(() => import("./pages/Accounting"));
const Credit = lazy(() => import("./pages/Credit"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30_000 },
  },
});

// Routes available only when signed out (sign-in / sign-up). Authenticated
// users are sent to the dashboard.
function PublicOnly({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
}

function Bootstrap() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s) => ({
    token: s.auth.token,
    user: s.auth.user,
  }));

  // Restore the session: if a token exists but we have no user yet, fetch it.
  useEffect(() => {
    if (token && !user) {
      authService
        .getCurrentUser()
        .then((u) => dispatch(getUserSuccess(u)))
        .catch(() => dispatch(logout()));
    }
  }, [token, user, dispatch]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Bootstrap />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnly>
                  <Register />
                </PublicOnly>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnly>
                  <ForgotPassword />
                </PublicOnly>
              }
            />

            {/* Protected app */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payments/:id" element={<PaymentDetail />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/credit" element={<Credit />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}
