// 📁 contexts/AuthProvider.tsx (your existing code)
const BASE_URL = "http://localhost:8000"; // your backend
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

import apiFetch    from '../api/apiFetch2' 
import {useNavigate} from 'react-router'
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

  const [tokens, setTokens] = useState<Tokens | null>(() => {
  const stored = localStorage.getItem("tokens");
  return stored ? JSON.parse(stored) : null;
});
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    // isAuthenticated = false
  
    localStorage.removeItem("tokens");
    navigate("/")
  }, []);

 useEffect(() => {
    const stored = localStorage.getItem("tokens");
    if (stored) {
      setTokens(JSON.parse(stored));
    }
  }, []);

  // Your wrappedFetch passes the getter function to apiFetch
  const wrappedFetch = useCallback(
    <T,>(url: string, options: ApiRequestInit = {}) => {
      // IMPORTANT: Passing () => tokens (getter) not tokens directly
      return apiFetch<T>(url, options, () => tokens, setTokens, logout);
    },
    [tokens, logout]  // Recreated when tokens or logout change
  );

  const login = useCallback(async (data: LoginData) => {
    // Step 1: Get tokens (no auth needed)
    const tokenResult = await wrappedFetch<AuthResponse>(
      `${BASE_URL}/api/auth/token/`,
      {
        method: "POST",
        body: JSON.stringify(data),
        auth: false,  // ← No auth header for login
      }
    );
    //  console.log("tokenResult = ",tokenResult)
    // Step 2: Store tokens (triggers useEffect to save to localStorage)
    const newTokens = ({
      access: tokenResult.access,
      refresh: tokenResult.refresh,
    });

     setTokens({
          access: tokenResult.access,
          refresh: tokenResult.refresh,
        });
   

    // Step 3: Get user profile (NOW with auth)
  const me = await apiFetch<User>(
      `${BASE_URL}/api/users/me/`,
      { method: "GET", auth: true },
      () => ({
        access: tokenResult.access,
        refresh: tokenResult.refresh,
      }),
      setTokens,
      logout
   );


    setUser(me);
  }, [wrappedFetch]);

  const signup = useCallback(
    async (data: SignupData) => {
      
      try {
        await wrappedFetch(BASE_URL + "/api/users/register/", {
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

  // THIS is where tokens are saved
  useEffect(() => {
    if (tokens) {
      localStorage.setItem("tokens", JSON.stringify(tokens));
    } else {
      localStorage.removeItem("tokens");
    }
  }, [tokens]);  // ← Automatically runs when tokens change

  
  useEffect(() => {
    if (!tokens) return;

    const loadUser = async () => {
      try {
        const me = await wrappedFetch<User>(BASE_URL + "/api/users/me/", {
          method: "GET",
          auth: true,
        });
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


