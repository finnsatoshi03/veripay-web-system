import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Token refresh state management
let isRefreshing = false;
let refreshPromise: Promise<Session | null> | null = null;

// Queue for requests waiting for token refresh
let requestQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (token: string | null, error?: Error) => {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  requestQueue = [];
};

// Check if token is expired or about to expire (within 5 minutes)
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = payload.exp;
    const bufferTime = 5 * 60; // 5 minutes buffer

    return currentTime >= expirationTime - bufferTime;
  } catch {
    return true; // If we can't parse the token, consider it expired
  }
};

// Refresh the session and get new tokens
const refreshSession = async (): Promise<Session | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // First try the built-in refresh
      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data.session) {
        console.warn(
          "Built-in token refresh failed, trying edge function fallback:",
          error,
        );

        // Fallback to edge function refresh
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            const response = await fetch(
              `${supabaseUrl}/functions/v1/refresh-token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: supabaseAnonKey,
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
              },
            );

            if (response.ok) {
              const refreshData = await response.json();
              if (refreshData.session) {
                // Update stored tokens
                setAuthToken(refreshData.session.access_token);
                setRefreshToken(refreshData.session.refresh_token);

                // Create a session object
                const session: Session = {
                  access_token: refreshData.session.access_token,
                  refresh_token: refreshData.session.refresh_token,
                  expires_at: refreshData.session.expires_at,
                  expires_in: refreshData.session.expires_in,
                  token_type: refreshData.session.token_type,
                  user: refreshData.user,
                };

                return session;
              }
            }
          } catch (fallbackError) {
            console.error("Edge function refresh also failed:", fallbackError);
          }
        }

        // If both methods fail, clear tokens
        clearAuthToken();
        clearRefreshToken();
        throw new Error("Session refresh failed");
      }

      // Update stored tokens
      setAuthToken(data.session.access_token);
      setRefreshToken(data.session.refresh_token);

      return data.session;
    } catch (error) {
      console.error("Error refreshing session:", error);
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Enhanced custom fetch function with automatic token refresh
const customFetch = async (
  url: RequestInfo | URL,
  options: RequestInit = {},
): Promise<Response> => {
  const accessToken = localStorage.getItem("access_token");

  // Check if token needs refresh before making the request
  if (accessToken && isTokenExpired(accessToken)) {
    try {
      const session = await refreshSession();
      if (session) {
        processQueue(session.access_token);
      } else {
        processQueue(null, new Error("Failed to refresh token"));
      }
    } catch (error) {
      processQueue(null, error as Error);
      throw error;
    }
  }

  // Get the current token (might be refreshed)
  const currentToken = localStorage.getItem("access_token");

  // Create headers
  const headers = new Headers(options.headers);

  if (currentToken) {
    headers.set("Authorization", `Bearer ${currentToken}`);
  }

  if (supabaseAnonKey) {
    headers.set("apiKey", supabaseAnonKey);
  }

  const newOptions: RequestInit = {
    ...options,
    headers,
  };

  // Make the request
  const response = await fetch(url, newOptions);

  // Handle 401 responses with token refresh
  if (response.status === 401 && currentToken) {
    try {
      // If we're already refreshing, wait for it
      if (isRefreshing) {
        const newToken = await new Promise<string | null>((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        });

        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`);
          return fetch(url, { ...newOptions, headers });
        }
      } else {
        // Attempt to refresh the token
        const session = await refreshSession();
        if (session) {
          headers.set("Authorization", `Bearer ${session.access_token}`);
          processQueue(session.access_token);
          return fetch(url, { ...newOptions, headers });
        }
      }
    } catch (error) {
      console.error("Failed to refresh token on 401:", error);
      processQueue(null, error as Error);
      // Redirect to login or handle auth failure
      window.location.href = "/login";
    }
  }

  return response;
};

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

// Token management functions
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem("access_token", token);
  }
};

export const setRefreshToken = (token: string) => {
  if (token) {
    localStorage.setItem("refresh_token", token);
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

export const clearAuthToken = () => {
  localStorage.removeItem("access_token");
};

export const clearRefreshToken = () => {
  localStorage.removeItem("refresh_token");
};

export const clearAllTokens = () => {
  clearAuthToken();
  clearRefreshToken();
};

// Initialize session from stored tokens on app start
export const initializeSession = async () => {
  const accessToken = getAuthToken();
  const refreshToken = getRefreshToken();

  if (accessToken && refreshToken) {
    try {
      // Set the session with stored tokens
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.error("Failed to restore session:", error);
        clearAllTokens();
      }
    } catch (error) {
      console.error("Error initializing session:", error);
      clearAllTokens();
    }
  }
};
