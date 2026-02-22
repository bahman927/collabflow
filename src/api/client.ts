// src/api/client.ts
import { API_BASE_URL } from "../app/config";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = { message: "Unknown API error" };
    }
    throw error;
  }

  return res.json();
}
