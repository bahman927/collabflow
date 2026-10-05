 
// src/types/auth.ts
export interface ApiRequestInit extends RequestInit { auth?: boolean;}

// --------------------
// User
// --------------------
export interface User {
  id: number;
  email: string;
  full_name: string;

  workspace?: {
    id: number;
    name: string;
  };

  avatar?: string | null;
}

export interface UpdateUserData {
  full_name?: string;
  email?: string;
  avatar?: File | null;
}


// export interface User {
//   id: number
//   email: string
//   full_name: string;
//   avatar?: string | null;
//   created_at: string;
// }

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
  password: string
 full_name: string
}
 

export interface LoginData {
  email: string
  password: string
}

// What backend returns after signup
// export interface SignupResponse {
//   user: User
//   access: string
//   refresh: string
// }
// type SignupResponse = {
//   user: {
//     id: number;
//     email: string;
//     full_name: string;
//     avatar: string | null;
//   };
//   tokens: Tokens;
// };

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

export interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  setTokens: (tokens: Tokens | null) => void;
  isAuthenticated: boolean;
  login: (data: LoginData ) => Promise<{
          user: User;
          tokens: Tokens;
         }>;
  updateUser: (data: UpdateUserData) => Promise<User>;

  signup: (
    data: SignupData
  ) => Promise<{
    user: User;
    tokens: Tokens;
  }>;
  logout: () => void;
  apiFetch: <T>(
    url: string,
    options?: ApiRequestInit,
    tokenOverride?: Tokens
  ) => Promise<T>;
}



