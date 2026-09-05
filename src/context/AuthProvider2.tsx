// 📁 contexts/AuthProvider.tsx (your existing code)
const BASE_URL = "http://localhost:8000"; 
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
  AuthContextType
} from "../types/auth";

import apiFetch      from "../api/apiFetch2"
import {useNavigate} from 'react-router'

export interface ApiRequestInit extends RequestInit { auth?: boolean;}

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
 

  const wrappedFetch = useCallback( <T,>
      (url: string,
       options: ApiRequestInit = {},
       tokenOverride?: Tokens) => {
      return apiFetch<T>(
        url,
        options,
        () => tokenOverride ?? tokens,
        setTokens,
        logout);
    },
    [tokens, logout]  
  );

  const login = useCallback(async (data: LoginData) => {

    interface TokenResponse {
     access: string;
     refresh: string;
    }

    const tokenResult = await wrappedFetch<TokenResponse>(
        `${BASE_URL}/api/auth/token/`,
        {
          method: "POST",
          body: JSON.stringify(data),
          auth: false,
        }
    );

    const newTokens: Tokens = {
      access: tokenResult.access,
      refresh: tokenResult.refresh,
    };

      setTokens(newTokens);

      const me = await apiFetch<User>(
      `${BASE_URL}/api/users/me/`,
      {
        method: "GET",
        auth: true,
      },
      () => newTokens,
      setTokens,
      logout
    );
      
      setUser(me);

    return {
          user: me,
          tokens: newTokens,
        };
      },
      [wrappedFetch, logout]
    );

 

  const signup = useCallback(
    async (data: SignupData) => {
      
      try {
        await wrappedFetch(BASE_URL + "/api/users/register/", {
          method: "POST",
          body: JSON.stringify(data),
          auth: false,
        });

        // await login({ email: data.email, password: data.password });

      } catch (err: any) {
        throw err;
      }
      
       return await login({
          email: data.email,
          password: data.password,
        });
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
        // setUser,
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

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

