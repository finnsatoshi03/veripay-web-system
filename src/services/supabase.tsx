import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const token = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkR5dHZpKzNVd2Zwb1hDU1QiLCJ0eXAiOiJKV1QifQ.eyJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0NzgzODI1NX1dLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwiYXVkIjoiYXV0aGVudGljYXRlZCIsImVtYWlsIjoiam9obnN1dHRvbkBnbWFpbC5jb20iLCJleHAiOjE3NDc4NDE4NTUsImlhdCI6MTc0NzgzODI1NSwiaXNfYW5vbnltb3VzIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9xY3VsZGVmcGVrdGVncGJsdHJubC5zdXBhYmFzZS5jby9hdXRoL3YxIiwicGhvbmUiOiIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInNlc3Npb25faWQiOiIwZmZkOWI5OC1lOGU1LTQ4NDAtOTcyMi0zZGEyMmVkY2UyNTUiLCJzdWIiOiJiOGY1NWM1NC1kNTllLTRlOWItOWExNy03N2U5ODA0MTE1MDciLCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiam9obnN1dHRvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJyb2xlIjoiSFIiLCJzdWIiOiJiOGY1NWM1NC1kNTllLTRlOWItOWExNy03N2U5ODA0MTE1MDcifSwidmVyaXBheV91c2VyX2lkIjoyNywidmVyaXBheV91c2VyX3JvbGUiOiJIUiJ9.nwp616Z1n2CpCLOHO5CzwV-XaKC91LUBvZ94DKE96-0"
// Custom fetch function to include the access token in the headers
const customFetch = (
  url: RequestInfo | URL,
  options: RequestInit = {},
): Promise<Response> => {
  // Get the access token from localStorage
  const accessToken = localStorage.getItem("access_token");

  // Create a new Headers instance
  const headers = new Headers(options.headers);

  // Add authorization token if available
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Add the API key with the correct case
  if (supabaseAnonKey) {
    headers.set("apiKey", supabaseAnonKey);
  }

  // Create new options with updated headers
  const newOptions: RequestInit = {
    ...options,
    headers,
  };

  return fetch(url, newOptions);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
  },
});

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem("access_token", token);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem("access_token");
};
