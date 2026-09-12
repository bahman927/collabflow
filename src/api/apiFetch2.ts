// apiFetch2.ts

import { Tokens } from "../types/auth";
import { toast } from "react-hot-toast";
import { ApiError } from "./apiError";

const BASE_URL = "http://localhost:8000";

export interface ApiRequestInit extends RequestInit {
  auth?: boolean;
}


// --------------------------------------------------
// Safely parse JSON
// --------------------------------------------------

async function safeJson<T>(
  response: Response
): Promise<T | null> {

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


// --------------------------------------------------
// Refresh access token
// --------------------------------------------------

async function refreshAccessToken(
  refreshToken: string,
  setTokens: (t: Tokens | null) => void,
  logout: () => void
): Promise<string | null> {

  try {

    const response = await fetch(
      `${BASE_URL}/api/auth/token/refresh/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      logout();
      return null;
    }

    const newTokens = await response.json();

    setTokens({
      access: newTokens.access,
      refresh:
        newTokens.refresh ?? refreshToken,
    });

    return newTokens.access;

  } catch (error) {

    console.error(
      "Token refresh error:",
      error
    );

    logout();

    return null;
  }
}


// ==================================================
// MAIN API FETCH
// ==================================================

export default async function apiFetch<T = any>(
  url: string,
  options: ApiRequestInit = {},
  getTokens: () => Tokens | null,
  setTokens: (t: Tokens | null) => void,
  logout: () => void
): Promise<T> {


  // ------------------------------------------------
  // 1. Determine authentication requirement
  // ------------------------------------------------

  const requiresAuth =
    options.auth ?? false;


  // ------------------------------------------------
  // 2. Get CURRENT tokens
  // ------------------------------------------------

  let tokens = getTokens();
  // console.log("tokens.access in ApiFetch2.ts : ", tokens?.access )

  // ------------------------------------------------
  // 3. Prepare headers
  // ------------------------------------------------

  const headers = new Headers(
    options.headers
  );


  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {

    headers.set(
      "Content-Type",
      "application/json"
    );
  }


  // ------------------------------------------------
  // 4. Add authentication
  // ------------------------------------------------

  if (requiresAuth) {

    if (tokens?.access) {

      headers.set(
        "Authorization",
        `Bearer ${tokens.access}`
      );

    }

    else if (tokens?.refresh) {

      const newAccessToken =
        await refreshAccessToken(
          tokens.refresh,
          setTokens,
          logout
        );

      if (!newAccessToken) {

        toast.error(
          "Session expired — please log in again."
        );

        logout();

        window.location.href =
          "/login";

        throw new Error(
          "SESSION_EXPIRED"
        );
      }

      headers.set(
        "Authorization",
        `Bearer ${newAccessToken}`
      );

      // IMPORTANT:
      // Keep local variable synchronized
      tokens = getTokens();
    }

    else {

      // logout();

      throw new Error(
        "AUTH_REQUIRED"
      );
    }
  }


  // ------------------------------------------------
  // 5. Function that performs the actual request
  // ------------------------------------------------

  const executeFetch = async () => {

    try {

      return await fetch(
        url,
        {
          ...options,
          headers,
        }
      );

    } catch (error) {

      console.error(
        "Network error:",
        error
      );

      throw new Error(
        "Network error. Please check your connection."
      );
    }
  };


  // ------------------------------------------------
  // 6. First request
  // ------------------------------------------------

  let response =
    await executeFetch();

  // ------------------------------------------------
  // 7. Access token expired?
  // ------------------------------------------------

  if (
    response.status === 401 &&
    requiresAuth &&
    tokens?.refresh
  ) {

    // console.log(
    //   "Token expired, attempting refresh..."
    // );

    const newAccessToken =
      await refreshAccessToken(
        tokens.refresh,
        setTokens,
        logout
      );

    if (!newAccessToken) {

      toast.error(
        "Session expired — please log in again."
      );

      logout();

      window.location.href =
        "/login";

      throw new Error(
        "SESSION_EXPIRED"
      );
    }


    // ------------------------------------------------
    // Update Authorization header
    // ------------------------------------------------

    headers.set(
      "Authorization",
      `Bearer ${newAccessToken}`
    );


    // ------------------------------------------------
    // Retry original request ONCE
    // ------------------------------------------------

    response =
      await executeFetch();
  }


  // ------------------------------------------------
  // 8. Handle HTTP errors centrally
  // ------------------------------------------------
  if (!response.ok) {
    const data = await safeJson<any>(response);

    let message = "Something went wrong.";

    if (data?.error) {
      message = data.error;

    } else if (data?.detail) {
      message = data.detail;

    } else if (data?.message) {
      message = data.message;

    } else {
      // DRF validation errors
      const firstField = Object.keys(data || {})[0];

      if (firstField) {
        const fieldError = data[firstField];

        if (Array.isArray(fieldError)) {
          message = fieldError[0];
        } else {
          message = String(fieldError);
        }
      }
    }

    throw new ApiError(
      message,
      response.status,
      data
    );
  }


  // ------------------------------------------------
  // 9. No content
  // ------------------------------------------------

  if (response.status === 204) {

    return undefined as T;
  }


  // ------------------------------------------------
  // 10. Parse successful response
  // ------------------------------------------------

  const data =
    await safeJson<T>(response);


  if (data === null) {

    return undefined as T;
  }


  return data;
}


 