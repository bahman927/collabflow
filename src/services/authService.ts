import type { Tokens } from "../types/auth";

//const API_BASE = "http://localhost:8000/api";
const TOKEN_KEY = "tokens";

// =============================================
//                  Signup
// =============================================
export async function signup(email: string, password: string) {
  const res = await fetch("/api/users/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return res.json();
}

// ========================
// 🔐 LOGIN
// ========================
export const loginRequest = async (
  username: string,
  password: string
): Promise<Tokens> => {
  const response = await fetch("/api/auth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.detail || "Login failed");
  }

  const tokens: Tokens = await response.json();

  // ✅ store tokens
  setTokens(tokens);

  return tokens;
};


// ========================
// 🔄 REFRESH TOKEN
// ========================
export const refreshToken = async (refresh: string) => {
  const response = await fetch("/api/auth/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json(); // { access }
};


// ========================
// 💾 TOKEN STORAGE
// ========================
export const getTokens = (): Tokens | null => {
  const stored = localStorage.getItem(TOKEN_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setTokens = (tokens: Tokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};


// ========================
// 🚪 LOGOUT
// ========================
export const logoutUser = () => {
  clearTokens();
};