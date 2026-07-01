// apiFetch.ts
import { Tokens } from "../types/auth";
import { toast } from "react-hot-toast";


const BASE_URL = "http://localhost:8000";

export interface ApiRequestInit extends RequestInit {
  auth?: boolean; // default false
}

/**
 * Helper function to refresh tokens
 */
async function safeJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}


async function refreshAccessToken(
  refreshToken: string,
  setTokens: (t: Tokens | null) => void,
  logout: () => void
): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed - session is dead
      logout();
      return null;
    }

    const newTokens = await response.json();
    setTokens({
      access: newTokens.access,
      refresh: newTokens.refresh ?? refreshToken,
    });
    
    return newTokens.access;

  } catch (error) {
    console.error("Token refresh error:", error);
    logout();
    return null;
  }
}

/**
 * Main API fetch function with automatic authentication and token refresh
 */
export default async function apiFetch<T = any>(
  url: string,
  options: ApiRequestInit = {},
  getTokens: () => Tokens | null,
  setTokens: (t: Tokens | null) => void,
  logout: () => void
): Promise<T> {
  const tokens = getTokens();
  const requiresAuth = options.auth ?? false;
  
  // Prepare headers
   let  headers = new Headers(options.headers);
  
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  
  // Handle authentication header
  if (requiresAuth) {
    
    if (tokens?.access) {
      // We have an access token - use it
      headers.set("Authorization", `Bearer ${tokens.access}`);
    } else if (tokens?.refresh) {
      // No access token but have refresh token - try to refresh first
      const newAccessToken = await refreshAccessToken(
        tokens.refresh,
        setTokens,
        logout
      );
      if (newAccessToken) {
        headers.set("Authorization", `Bearer ${newAccessToken}`);
      } else {
        // Refresh failed
        toast.error("Session expired — please log in again.");
        logout();
        window.location.href = "/login";
        return Promise.reject(new Error("SESSION_EXPIRED"));
      }
    } else {
      // No tokens at all
      logout();
    }
  }
   
  const executeFetch = async () => {
    // console.log('options :', options, ' url : ', url, ' headers :', headers)
    try {
      return await fetch(url, {
        ...options,
        headers,
      });
    } catch (err: any) {
      console.error("Failed to create task:", err.message);
      throw err.message; 
    }
  };

// Make the request
    let response;

    try {
      response = await executeFetch();
    } catch (err) {
      throw new Error("Network error. Please check your connection.");
    }

  if (response.status === 401 && requiresAuth && tokens?.refresh) {
    console.log("Token expired, attempting refresh...");
    
    const newAccessToken = await refreshAccessToken(
      tokens.refresh,
      setTokens,
      logout
    );
    if (newAccessToken) {
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      // Retry the original request
      response = await executeFetch();
    } else {
      // Refresh failed
       return Promise.reject(new Error("Session expired. Please login again."));
    }
  }

  if (!response.ok) {
    let errorMessage = "Request failed";
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      
    }
    
    throw new Error(errorMessage);
  }
     
  const text = await response.text();

// No body → return null or [] depending on your API
if (!text.trim()) {
    return [] as T; // for list endpoints
}

try {
    return JSON.parse(text) as T;
} catch (e) {
    console.warn("Response not JSON, returning empty object");
    return {} as T;
}

  
  // try {
  //   return await response.json();
  //  } catch (e) {
  //     console.warn('Response not JSON, returning empty object');
  //     return {} as T;
  //  }

}