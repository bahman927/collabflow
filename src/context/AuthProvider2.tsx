

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  Tokens,
  User,
  SignupData,
  LoginData,
  AuthContextType,
  UpdateUserData,
} from "../types/auth";

import apiFetch from "../api/apiFetch2";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../api/config";

export interface ApiRequestInit extends RequestInit {
  auth?: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // Initialize tokens from localStorage only once.
  const [tokens, setTokensState] = useState<Tokens | null>(() => {
    const stored = localStorage.getItem("tokens");
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  // Prevent the login flow from triggering a second /users/me/ request.
  const skipNextLoadUser = useRef(false);

  // Stable setTokens function.
  const setTokens = useCallback((newTokens: Tokens | null) => {
    setTokensState(newTokens);

    if (newTokens) {
      localStorage.setItem("tokens", JSON.stringify(newTokens));
    } else {
      localStorage.removeItem("tokens");
    }
  }, []);

  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    navigate("/");
  }, [setTokens, navigate]);

  // API wrapper.
  const wrappedFetch = useCallback(
    <T,>(
      url: string,
      options: ApiRequestInit = {},
      tokenOverride?: Tokens
    ) => {
      return apiFetch<T>(
        url,
        options,
        () => tokenOverride ?? tokens,
        setTokens,
        logout
      );
    },
    [tokens, setTokens, logout]
  );

  // Login.
  const login = useCallback(
    async (data: LoginData) => {

      interface TokenResponse {
        access: string;
        refresh: string;
      }

      const tokenResult = await wrappedFetch<TokenResponse>(
        `${API_BASE_URL}/auth/token/`,
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

      // The login function fetches the user itself.
      // Prevent the tokens effect from fetching the user again.
      skipNextLoadUser.current = true;

      setTokens(newTokens);

      const me = await wrappedFetch<User>(
        `${API_BASE_URL}/users/me/`,
        {
          method: "GET",
          auth: true,
        },
        newTokens
      );

      setUser(me);

      return {
        user: me,
        tokens: newTokens,
      };
    },
    [wrappedFetch, setTokens]
  );

  // Update profile.
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
        `${API_BASE_URL}/users/me/`,
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

  // Signup.
  const signup = useCallback(
    async (data: SignupData) => {

      const formData = new FormData();

      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("full_name", data.full_name);

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      await wrappedFetch(API_BASE_URL + "/users/register/", {
        method: "POST",
        body: formData,
        auth: false,
      });

      return await login({
        email: data.email,
        password: data.password,
      });
    },
    [wrappedFetch, login]
  );

  // Load the current user when tokens are available.
  useEffect(() => {

    if (!tokens) {
      setUser(null);
      return;
    }

    // Login already fetched /users/me/.
    if (skipNextLoadUser.current) {
      skipNextLoadUser.current = false;
      return;
    }

    const loadUser = async () => {
      try {
        const me = await wrappedFetch<User>(
          `${API_BASE_URL}/users/me/`,
          {
            method: "GET",
            auth: true,
          }
        );

        setUser(me);

      } catch (err) {
        console.error("AuthProvider: /users/me/ failed", err);
      }
    };

    loadUser();

  }, [tokens, wrappedFetch]);

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




// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useEffect,
// } from "react";

// import {
//   Tokens,
//   User,
//   SignupData,
//   LoginData,
//   AuthContextType,
//   UpdateUserData
// } from "../types/auth";

// import apiFetch     from '../api/apiFetch2'
// import {useNavigate} from 'react-router'
// import { API_BASE_URL } from "../api/config";

// export interface ApiRequestInit extends RequestInit { auth?: boolean;}

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);
// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

// const [tokens, setTokensState] = useState<Tokens | null>(() => {
//   const stored = localStorage.getItem("tokens");

//   return stored ? JSON.parse(stored) : null;
// });

// const setTokens = (newTokens: Tokens | null) => {
//     setTokensState(newTokens);

//     if (newTokens) {
//       localStorage.setItem(
//         "tokens",
//         JSON.stringify(newTokens)
//       );
//     } else {
//       localStorage.removeItem("tokens");
//     }
//   };  
 
// const [user, setUser] = useState<User | null>(null);
// const navigate = useNavigate();

// const logout = useCallback(() => {
//     setTokens(null);
//     setUser(null);
  
//     localStorage.removeItem("tokens");
//     navigate("/")
//   }, []);

// useEffect(() => {
//     const stored = localStorage.getItem("tokens");
//     if (stored) {
//       setTokens(JSON.parse(stored));
//     }
//    }, []);

// const wrappedFetch = useCallback(
//   <T,>(
//     url: string,
//     options: ApiRequestInit = {},
//     tokenOverride?: Tokens
//   ) => {
//     return apiFetch<T>(
//       url,
//       options,
//       () => tokenOverride ?? tokens,
//       setTokens,
//       logout
//     );
//   },
//   [tokens, setTokens, logout]
// );

//  const login = useCallback(async (data: LoginData) => {
//     interface TokenResponse {
//       access: string;
//       refresh: string;
//     }

//     const tokenResult = await wrappedFetch<TokenResponse>(
//       `${API_BASE_URL}/auth/token/`,
//       {
//         method: "POST",
//         body: JSON.stringify(data),
//         auth: false,
//       }
//     );

//     const newTokens: Tokens = {
//       access: tokenResult.access,
//       refresh: tokenResult.refresh,
//     };

//     setTokens(newTokens);

//     const me = await wrappedFetch<User>(
//       `${API_BASE_URL}/users/me/`,
//       {
//         method: "GET",
//         auth: true,
//       },
//       newTokens
//     );

//     setUser(me);

//     return {
//       user: me,
//       tokens: newTokens,
//     };
//   }, [wrappedFetch, setTokens]);
   
// const updateUser = useCallback(
//   async (data: UpdateUserData): Promise<User> => {

//     const formData = new FormData();

//     if (data.full_name !== undefined) {
//       formData.append("full_name", data.full_name);
//     }

//     if (data.email !== undefined) {
//       formData.append("email", data.email);
//     }

//     if (data.avatar instanceof File) {
//       formData.append("avatar", data.avatar);
//     }

//     const updatedUser = await wrappedFetch<User>(
//       `${API_BASE_URL}/users/me/`,
//       {
//         method: "PATCH",
//         body: formData,
//         auth: true,
//       }
//     );

//     setUser(updatedUser);

//     return updatedUser;
//   },
//   [wrappedFetch]
// );
 


// const signup = useCallback(
//   async (data: SignupData) => {
    
//     const formData = new FormData();

//     formData.append("email", data.email);
//     formData.append("password", data.password);
//     formData.append("full_name", data.full_name);

//     if (data.avatar) {
//       formData.append("avatar", data.avatar);
//     }

//     await wrappedFetch(API_BASE_URL + "/users/register/", {
//       method: "POST",
//       body: formData,
//       auth: false,
//     });

//     return await login({
//       email: data.email,
//       password: data.password,
//     });
//   },
//   [wrappedFetch, login]
// );

   

//   useEffect(() => {
//   const stored = localStorage.getItem("tokens");

//   if (stored) {
//     setTokens(JSON.parse(stored));
//   }
//   }, []);

//   useEffect(() => {
//   if (!tokens) return;

//   const loadUser = async () => {
//     try {
//       // console.log("🔵 AuthProvider: loading current user");

//       const me = await wrappedFetch<User>(
//         API_BASE_URL + "/users/me/",
//         {
//           method: "GET",
//           auth: true,
//         }
//       );

//       // console.log("🟢 AuthProvider: current user loaded", me);

//       setUser(me);
//     } catch (err) {
//       console.error("🔴 AuthProvider: /users/me/ failed", err);

//       // TEMPORARILY DON'T LOGOUT
//       // logout();
//     }
//   };

//   loadUser();
// }, [tokens, wrappedFetch, logout]);

 

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         tokens,
//         setTokens,
//         isAuthenticated: !!user,
//         login,
//         signup,
//         logout,
//         apiFetch: wrappedFetch,
//         updateUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }

//   return context;
// };

