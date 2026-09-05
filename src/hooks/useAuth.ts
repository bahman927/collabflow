import { useContext }           from "react";
import  {AuthContext}           from "../context/AuthProvider2";
import  { AuthContextType }     from "../types/auth";


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
  }

  
