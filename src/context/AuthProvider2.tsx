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
  AuthContextType,
  UpdateUserData
} from "../types/auth";

import apiFetch      from "../api/ApiFetch2"
import {useNavigate} from 'react-router'

export interface ApiRequestInit extends RequestInit { auth?: boolean;}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

const [tokens, setTokensState] = useState<Tokens | null>(() => {
  const stored = localStorage.getItem("tokens");

  return stored ? JSON.parse(stored) : null;
});

const setTokens = (newTokens: Tokens | null) => {
  setTokensState(newTokens);

  if (newTokens) {
    localStorage.setItem(
      "tokens",
      JSON.stringify(newTokens)
    );
  } else {
    localStorage.removeItem("tokens");
  }
};  

//   const [tokens, setTokens] = useState<Tokens | null>(() => {
//   const stored = localStorage.getItem("tokens");
//   return stored ? JSON.parse(stored) : null;
// });
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
   
const updateUser = useCallback(
  async (data: UpdateUserData): Promise<User> => {

    const formData = new FormData();

    if (data.full_name !== undefined) {
      formData.append("full_name", data.full_name);
    }

    if (data.email !== undefined) {
      formData.append("email", data.email);
    }

    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    const updatedUser = await wrappedFetch<User>(
      `${BASE_URL}/api/users/me/`,
      {
        method: "PATCH",
        body: formData,
        auth: true,
      }
    );

    setUser(updatedUser);

    return updatedUser;
  },
  [wrappedFetch]
);

  // const updateUser = useCallback(

  //   async (data: UpdateUserData): Promise<User> => {

  //     const updatedUser = await wrappedFetch<User>(
  //       `${BASE_URL}/api/users/me/`,
  //       {
  //         method: "PATCH",
  //         body: JSON.stringify(data),
  //         auth: true,
  //       }
  //     );

  //     setUser(updatedUser);

  //     return updatedUser;
  //   },
  //   [wrappedFetch]
  // );

 

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

   

  useEffect(() => {
  const stored = localStorage.getItem("tokens");

  if (stored) {
    setTokens(JSON.parse(stored));
  }
  }, []);

  useEffect(() => {
  if (!tokens) return;

  const loadUser = async () => {
    try {
      // console.log("🔵 AuthProvider: loading current user");

      const me = await wrappedFetch<User>(
        BASE_URL + "/api/users/me/",
        {
          method: "GET",
          auth: true,
        }
      );

      // console.log("🟢 AuthProvider: current user loaded", me);

      setUser(me);
    } catch (err) {
      console.error("🔴 AuthProvider: /users/me/ failed", err);

      // TEMPORARILY DON'T LOGOUT
      // logout();
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
        updateUser,
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

