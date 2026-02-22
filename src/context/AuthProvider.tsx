import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your user object
export interface User {
  id: number;
  name: string;
  role: "Owner" | "Member" | "Viewer";
}

// Context value type
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



// // src/context/AuthProvider.tsx
// import { useState, useEffect, useContext } from "react";
// import type { ReactNode } from "react";
// import { AuthContext } from "../context/AuthContext";
// import type { AuthContextType } from "../context/AuthContext";

// import type { User } from "../types/user";

// interface Props {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: Props) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Derived boolean from user state
//   const isAuthenticated: AuthContextType["isAuthenticated"] = !!user;

//   // Simulate fetching current user from API
//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       try {
//         // Replace with real API call
//         const token = localStorage.getItem("token");
//         if (token) {
//           // Example: fetch user info
//           const demoUser: User = { id: 1, name: "Demo User", email:"bahman@gmail.com" };
//           setUser(demoUser);
//         } else {
//           setUser(null);
//         }
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Login function
//   const login: AuthContextType["login"] = (token) => {
//     localStorage.setItem("token", token);
//     // Example: set a demo user
//     setUser({ id: 1, name: "Demo User", email:"bahman@gmail.com" });
//   };

//   // Logout function
//   const logout: AuthContextType["logout"] = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, logout, isAuthenticated, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };