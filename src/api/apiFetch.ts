// apiFetch.ts
import { Tokens } from "../types/auth";

const BASE_URL = "http://localhost:8000";

export interface ApiRequestInit extends RequestInit {
  auth?: boolean; // default false
}

/**
 * Helper function to refresh tokens
 */
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
  const headers = new Headers(options.headers);
  
  // Auto-add Content-Type for JSON bodies (skip for FormData)
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
        return Promise.reject(new Error("Not authenticated"));
      }
    } else {
      // No tokens at all
      logout();
      return Promise.reject(new Error("Not authenticated"));
    }
  }

  // Function to execute the actual fetch
  const executeFetch = () =>
    fetch(url, {
      ...options,
      headers,
    });

  // Make the request
  let response = await executeFetch();

  // If unauthorized and we have a refresh token (and haven't just tried to refresh)
  if (response.status === 401 && requiresAuth && tokens?.refresh) {
    console.log("Token expired, attempting refresh...");
    
    // Try to refresh the token
    const newAccessToken = await refreshAccessToken(
      tokens.refresh,
      setTokens,
      logout
    );
    
    if (newAccessToken) {
      // Update the authorization header with new token
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      // Retry the original request
      response = await executeFetch();
    } else {
      // Refresh failed
      return Promise.reject(new Error("Session expired. Please login again."));
    }
  }

  // Handle non-OK responses
  if (!response.ok) {
    let errorMessage = "Request failed";
    
    try {
      // Try to parse error response as JSON
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      // If not JSON, get as text
      errorMessage = await response.text();
    }
    
    throw new Error(errorMessage);
  }

  // Return successful response as JSON
  return response.json();
}





// const BASE_URL = "http://localhost:8000"; // your backend
// export interface ApiRequestInit extends RequestInit {
//   auth?: boolean; // default true
// }

// import  {Tokens} from "../types/auth"
// import {useNavigate}   from "react-router"

// export default async function apiFetch<T = any>(
//   url: string,
//   options: ApiRequestInit = {},
//   getTokens: () => Tokens | null,
//   setTokens: (t: Tokens | null) => void,
//   logout: () => void
// ): Promise<T> {
//   try {
//     const tokens = getTokens();
//     const requiresAuth = options.auth ?? false;

//     const headers = new Headers(options.headers);

//     // Auto JSON header
//     if (
//       options.body &&
//       !(options.body instanceof FormData) &&
//       !headers.has("Content-Type")
//     ) {
//       headers.set("Content-Type", "application/json");
//     }

//     // FIX: If auth is required but token is missing, handle the error before fetching
//   if (requiresAuth) {
//       if (tokens?.access) {
//         headers.set("Authorization", `Bearer ${tokens.access}`);
//       } else if (tokens?.refresh) {
//         // Access token missing → try refresh
//         const refreshRes = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refresh: tokens.refresh }),
//         });

//         if (!refreshRes.ok) {
//           logout(); // refresh token invalid → must logout
//           return Promise.reject("Session expired");
//         }

//         const newTokens = await refreshRes.json();
//         setTokens({
//           access: newTokens.access,
//           refresh: newTokens.refresh ?? tokens.refresh,
//         });

//         headers.set("Authorization", `Bearer ${newTokens.access}`);
//       } else {
//         // No access token AND no refresh token → must login
//         logout();
//         return Promise.reject("Not authenticated");
//       }
//   }

//   const doFetch = () =>
//       fetch(url, {
//         ...options,
//         headers,
//       });

//     // First attempt
//     let res = await doFetch();
//     console.log('headers and options = ',{headers, options, tokens, res})

//     // If unauthorized → try refresh
//     if (res.status === 401 && requiresAuth && tokens?.refresh) {
//       const refreshRes = await fetch( `${BASE_URL}/api/auth/token/refresh/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh: tokens.refresh }),
//       });

//       if (!refreshRes.ok) {
//         alert("Your session has expired. Please log in again.");
//         logout();
        
//       }

//       const newTokens = await refreshRes.json();

//       setTokens({
//         access: newTokens.access,
//         refresh: newTokens.refresh ?? tokens.refresh,
//       } );

//       headers.set("Authorization", `Bearer ${newTokens.access}`);
//       res = await doFetch();
//     }

//     if (!res.ok) {
//       let message = "Request failed";

//       try {
//         const data = await res.json();
//         message = data.detail || data.message || JSON.stringify(data);
//       } catch {
//         message = await res.text();
//       }

//       throw new Error(message || "Unexpected server error");
//     }

//     return res.json();
//   } catch (err: any) {
//     throw new Error(err.message || "Network error");
//   }
// }
