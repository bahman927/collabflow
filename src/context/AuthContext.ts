import { createContext } from "react";
import type { User } from "../types/user";

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  setTokens: (tokens: Tokens) => void;
  login: (user: User, tokens: Tokens) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  apiFetch: <T>(url: string, options?: RequestInit) => Promise<T>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

 