import React, { createContext, useContext, useState } from "react";

type AuthMode = "login" | "signup" | "forgotPassword" | null;

interface AuthModalContextType {
  authMode: AuthMode;
  openLogin: () => void;
  openSignup: () => void;
  openForgotPassword: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export const AuthModalProvider = ({children,}: {children: React.ReactNode;}) => {

  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const openLogin = () => setAuthMode("login");
  const openSignup = () => setAuthMode("signup");
  const openForgotPassword = () => setAuthMode("forgotPassword");
  const closeModal = () => setAuthMode(null);

  return (
    <AuthModalContext.Provider
      value={{ authMode, openLogin, openSignup, openForgotPassword, closeModal  }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }
  return context;
};