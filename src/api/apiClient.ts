import { refreshToken } from "../services/authService";
import type { Tokens } from "../types/auth";


export const apiFetch = async <T>(
  url: string,
  options: RequestInit = {},
  tokens: { access: string; refresh: string } | null,
  setTokens: (tokens: any) => void,
  logout: () => void
): Promise<T> => {
  const makeRequest = async (accessToken: string) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  try {
    // 🔹 1. First request
    let response = await makeRequest(tokens?.access || "");

    // 🔹 2. If unauthorized → try refresh
    if (response.status === 401 && tokens?.refresh) {
      const refreshResponse = await fetch("/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: tokens.refresh,
        }),
      });

      if (!refreshResponse.ok) {
        logout();
        throw new Error("Session expired");
      }

      const newTokens = await refreshResponse.json();

      // 🔹 3. Save new tokens
      setTokens(newTokens);

      // 🔹 4. Retry original request
      response = await makeRequest(newTokens.access);
    }

    // 🔹 5. Final check
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // 🔹 6. Return typed JSON
    return (await response.json()) as T;

  } catch (error) {
    console.error("apiFetch error:", error);
    throw error;
  }
};