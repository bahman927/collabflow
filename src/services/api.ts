const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ── Token Refresh Queue ─────────────────────────────
// Prevents multiple simultaneous refresh calls when
// several requests get 401 at the same time.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (
  error: unknown,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// ── Refresh Logic ───────────────────────────────────
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(
    `${BASE_URL}/api/auth/token/refresh/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    }
  );

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
}

// ── Logout ──────────────────────────────────────────
function forceLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}

// ── Core Request Function ───────────────────────────
// This is what every service file calls.
// Handles: base URL, auth header, JSON parsing,
//          automatic 401 retry with token refresh.

const SKIP_REFRESH_PATHS = [
  '/api/auth/login/',
  '/api/auth/signup/',
  '/api/auth/token/refresh/',
];

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  _isRetry = false
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    signal,
  } = options;

  // Build URL with query params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  // Build headers
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  const token = localStorage.getItem('access_token');
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  // ── Handle 204 No Content ──
  if (response.status === 204) {
    return undefined as T;
  }

  // ── Handle 401 — Token Refresh ──
  if (
    response.status === 401 &&
    !_isRetry &&
    !SKIP_REFRESH_PATHS.some((p) => endpoint.includes(p))
  ) {
    // If already refreshing, wait in queue
    if (isRefreshing) {
      const newToken = await new Promise<string>(
        (resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }
      );
      return request<T>(
        endpoint,
        {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        },
        true
      );
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      return request<T>(
        endpoint,
        {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        },
        true
      );
    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }

  // ── Handle other errors ──
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.error ||
      errorData?.detail ||
      errorData?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, errorData);
  }

  // ── Parse successful response ──
  return response.json();
}

// ── Custom Error Class ──────────────────────────────
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ── Public API ──────────────────────────────────────
// These are the methods your service files call.
const api = {
  get<T>(endpoint: string, params?: Record<string, string>, signal?: AbortSignal) {
    return request<T>(endpoint, { method: 'GET', params, signal });
  },

  post<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: 'POST', body });
  },

  patch<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: 'PATCH', body });
  },

  put<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: 'PUT', body });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};

export default api;
