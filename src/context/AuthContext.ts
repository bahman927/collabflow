// src/context/AuthContext.ts
import { createContext } from "react";
import type  { User } from "../types/user";

// Define the interface for context
export interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; // optional, useful if fetching user from API
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: false,
});
