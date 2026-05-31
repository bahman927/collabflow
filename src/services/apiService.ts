// src/services/apiService.ts

export class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {}

  setTokens(access: string | null, refresh: string | null) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  /**
   * Core fetch wrapper used by all providers
   */
  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
   const headers: Record<string, string> = {
  "Content-Type": "application/json",
  ...(options.headers as Record<string, string>),
};


    // Attach access token if available
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized → try refresh
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshTokens();
      if (!refreshed) {
        throw new Error("Unauthorized: token refresh failed");
      }

      // Retry original request with new token
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${this.accessToken}`,
      };

      const retryResponse = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text();
        throw new Error(errorText || "API request failed after retry");
      }

      return retryResponse.json() as Promise<T>;
    }

    // Normal error handling
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "API request failed");
    }

    return response.json() as Promise<T>;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshTokens(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch("/api/auth/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();

      this.accessToken = data.access;
      this.refreshToken = data.refresh ?? this.refreshToken;

      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const apiService = new ApiService();
