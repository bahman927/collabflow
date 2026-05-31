 
// src/types/auth.ts

// --------------------
// User
// --------------------
export interface User {
  id: number
  email: string
  full_name: string;
  created_at: string;
}

// --------------------
// Tokens
// --------------------
export interface Tokens {
  access: string;       // access token (JWT)
  refresh: string;      // refresh token
}


// --------------------
// Signup
// --------------------
export interface SignupData {
  email: string
  full_name: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

// What backend returns after signup
export interface SignupResponse {
  user: User
  access: string
  refresh: string
}

// --------------------
// Login
// --------------------
export interface LoginResponse {
  user: User
  access: string
  refresh: string
}

export interface AuthResponse {
    access: string;
    refresh: string;
  };



