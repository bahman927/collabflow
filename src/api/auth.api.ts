// src/api/auth.api.ts
import { apiFetch } from "./client";
import type { AuthTokens } from "../types/authToken";
import type { User }       from "../types/user";

export const loginApi = (email: string, password: string) =>
  apiFetch<AuthTokens>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const meApi = (token: string) =>
  apiFetch<User>("/auth/me/", {}, token);
