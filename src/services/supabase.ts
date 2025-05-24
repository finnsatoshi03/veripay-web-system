import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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
