import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  Tokens,
  User,
  SignupData,
  LoginData,
  AuthResponse,
} from "../types/auth";

import apiFetch      from "../api/apiFetch2" 
import {useNavigate} from 'react-router'
import { API_BASE_URL } from "../api//config";

export interface ApiRequestInit extends RequestInit {
  auth?: boolean; // default true
}

export interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
   setTokens: (tokens: Tokens | null) => void;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  apiFetch: <T>(
    url: string,
    options?: ApiRequestInit
  ) => Promise<T>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [user, setUser] = useState<User | null>(null);

  let navigate = useNavigate()

  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem("tokens");
    navigate("/", {replace: true})
  }, [navigate]);

  // Persist tokens
  useEffect(() => {
    if (tokens) {
      localStorage.setItem("tokens", JSON.stringify(tokens));
    } else {
      localStorage.removeItem("tokens");
    }
  }, [tokens]);

  // Hydrate tokens on startup
  useEffect(() => {
    const stored = localStorage.getItem("tokens");
    if (stored) {
      setTokens(JSON.parse(stored));
    }
  }, []);

   // wrappedFetch binds apiFetch to React state
  const wrappedFetch = useCallback( <T,>(url: string, options: ApiRequestInit = {}) => {
          return apiFetch<T>(url, options, () => tokens, setTokens, logout);
       }, [tokens, logout]
  );

  const login = useCallback(
    async (data: LoginData) => {
      try {
        const tokenResult = await wrappedFetch<AuthResponse>(
          `${API_BASE_URL}/auth/token/`,
          {
            method: "POST",
            body: JSON.stringify(data),
            auth: false,
          }
        );

        setTokens({
          access: tokenResult.access,
          refresh: tokenResult.refresh,
        });


        const me = await wrappedFetch<User>(`${API_BASE_URL}/users/me/`, {
          method: "GET",
          auth: true,
        });

       
        setUser(me);
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    [wrappedFetch]
  );

  const signup = useCallback(
    async (data: SignupData) => {
      console.log("base_url in authProvider-signup :", API_BASE_URL)
      try {
        await wrappedFetch(API_BASE_URL + "/users/register/", {
          method: "POST",
          body: JSON.stringify(data),
          auth: false,
        });

        await login({ email: data.email, password: data.password });
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    [wrappedFetch, login]
  );

  // Hydrate user when tokens load
  useEffect(() => {
    if (!tokens) return;

    const loadUser = async () => {
      try {
       console.log("AUTH: loading /me");
       console.log("AUTH: tokens:", tokens);

        const me = await wrappedFetch<User>(API_BASE_URL + "/users/me/", {
          method: "GET",
          auth: true,
        });

       console.log("AUTH: /me returned:", me);
        setUser(me);
      } catch {
        logout();
      }
    };

    loadUser();
  }, [tokens, wrappedFetch, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        setTokens,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        apiFetch: wrappedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



