// src/services/userService.ts

import {ApiRequestInit}  from "../context/AuthProvider";

// src/services/userService.ts


export const userService = {
  // SIGNUP
  signup(data: { email: string; password: string; full_name: string }) {
    return {
      action:"signup",
      url: "/api/users/register/",
      options: {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          email: data.email,
          full_name: data.full_name,
          password: data.password,
         })
        
      } as ApiRequestInit,
    };
  },

  // LOGIN
  login(data: { email: string; password: string }) {
    return {
      action:"login",
      url: "/api/users/login/",
      options: {
        method: "POST",
        body: JSON.stringify(data),
        auth: false,
      } as ApiRequestInit,
    };
  },

  // REFRESH TOKEN
  refresh(refreshToken: string) {
    return {
      action: "refresh",
      url: "/api/users/refresh/",
      options: {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
        auth: false,
      } as ApiRequestInit,
    };
  },

  // LOGOUT
  logout() {
    return {
      url: "/api/users/logout/",
      options: {
        method: "POST",
        auth: true,
      } as ApiRequestInit,
    };
  },

  // GET CURRENT USER
  getCurrentUser() {
    return {
      action:"me",
      url: "/api/users/me/",
      options: {
        method: "GET",
        auth: true,
      } as ApiRequestInit,
    };
  },
};
