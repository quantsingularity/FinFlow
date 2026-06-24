import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  getUserSuccess,
  logout as logoutAction,
  clearError,
} from "../store/authSlice";
import * as authService from "../services/authService";
import { getErrorMessage } from "../lib/errors";
import type { User } from "../types";

interface AuthResult {
  token: string;
  user: User;
}

// Normalize varying backend auth payloads into { token, user }.
function normalize(data: Record<string, unknown>): AuthResult {
  const token = (data.token ||
    data.accessToken ||
    data.access_token ||
    "") as string;
  const rawUser = (data.user || data) as Record<string, unknown>;
  const user: User = {
    id: String(rawUser.id ?? rawUser._id ?? ""),
    email: String(rawUser.email ?? ""),
    role: (rawUser.role as User["role"]) ?? "USER",
  };
  return { token, user };
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (s) => s.auth,
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      dispatch(loginStart());
      try {
        const data = await authService.login(email, password);
        const { token, user } = normalize(data);
        if (!token) throw new Error("No session token returned by the server.");
        dispatch(loginSuccess({ token, user }));
        return true;
      } catch (err) {
        dispatch(
          loginFailure(getErrorMessage(err, "Invalid email or password.")),
        );
        return false;
      }
    },
    [dispatch],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      dispatch(registerStart());
      try {
        const data = await authService.register(email, password);
        const { token, user } = normalize(data);
        dispatch(registerSuccess());
        if (token) dispatch(loginSuccess({ token, user }));
        return true;
      } catch (err) {
        dispatch(
          registerFailure(
            getErrorMessage(err, "Could not create your account."),
          ),
        );
        return false;
      }
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    authService.logout();
    dispatch(logoutAction());
  }, [dispatch]);

  const hydrate = useCallback(async () => {
    try {
      const me = await authService.getCurrentUser();
      dispatch(getUserSuccess(me));
    } catch {
      dispatch(logoutAction());
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    hydrate,
    clearError: () => dispatch(clearError()),
  };
}
