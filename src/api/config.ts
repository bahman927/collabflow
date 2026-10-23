
export const API_BASE_URL =
  // (import.meta.env.VITE_API_URL || "http://localhost:8000/api")
  // (import.meta.env.VITE_API_URL || "/api")
  ("http://localhost:8000/api" )
    .replace(/\/+$/, "");
    // console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    // console.log("VITE_API_URL:", VITE_API_URL);
    console.log("API_BASE_URL:", API_BASE_URL);
    console.log({
  api: import.meta.env.VITE_API_URL,
  mode: import.meta.env.MODE,
  base: API_BASE_URL,
  env:import.meta.env,
});