import type { User } from "../types";
import api from "./api";

// Auth responses are unwrapped by the api response interceptor to the inner
// payload: { user, tokens: { accessToken, refreshToken } }.
export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};

// The gateway exposes no reliable profile endpoint, so the signed-in user is
// persisted at login and restored from local storage on reload.
export const getCurrentUser = async (): Promise<User> => {
  const raw = localStorage.getItem("user");
  if (!raw) throw new Error("No stored user");
  return JSON.parse(raw) as User;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const refreshToken = async (token: string) => {
  const response = await api.post("/auth/refresh-token", {
    refreshToken: token,
  });
  return response.data;
};
