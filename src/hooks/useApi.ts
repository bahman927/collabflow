// src/hooks/useApi.ts

import { useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiFetch, { ApiRequestInit } from '../api/apiFetch2';

import { API_BASE_URL } from "../api/config";

export function useApi() {
  const { tokens, setTokens, logout } = useAuth();

  const request = useCallback(
    <T = any>(endpoint: string, options: ApiRequestInit = {}) => {
      return apiFetch<T>(
        `${API_BASE_URL}${endpoint}`,
        { auth: true, ...options },
        () => tokens,
        setTokens,
        logout
      );
    },
    [tokens, setTokens, logout]
  );

  return { request };
}
