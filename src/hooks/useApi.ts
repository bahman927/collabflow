// src/hooks/useApi.ts

import { useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiFetch, { ApiRequestInit } from '../api/ApiFetch2';

const BASE_URL = 'http://localhost:8000';

export function useApi() {
  const { tokens, setTokens, logout } = useAuth();

  const request = useCallback(
    <T = any>(endpoint: string, options: ApiRequestInit = {}) => {
      return apiFetch<T>(
        `${BASE_URL}${endpoint}`,
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
