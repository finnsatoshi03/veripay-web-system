import type { NewUser } from "@/types/api";
import { clearAllTokens, setAuthToken, setRefreshToken } from "./supabase";
import { useUserStore } from "@/store/userStore";
import { createClient, FunctionsHttpError } from "@supabase/supabase-js";

// Create a separate Supabase client for anonymous requests (no auth headers)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const anonymousSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Import the main supabase client for authenticated requests
import { supabase } from "./supabase";

// ============================
// Authentication Methods
// ============================

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user && data.session) {
      const { user, session } = data;

      // Check if email is verified
      if (!user.email_confirmed_at) {
        // Sign out the user immediately
        await supabase.auth.signOut();
        throw new Error(
          "Please verify your email address before logging in. Check your inbox for a verification email.",
        );
      }

      const { access_token, refresh_token } = session;

      // Store both access and refresh tokens
      if (access_token) {
        setAuthToken(access_token);
      }
      if (refresh_token) {
        setRefreshToken(refresh_token);
      }

      // Get the role from user metadata
      const role = user.user_metadata?.role || "";

      // Get user details from database after successful authentication
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("identity_id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user from database:", userError);
        throw userError;
      }

      // Fetch complete user data using the userStore
      if (userData?.id) {
        const userStore = useUserStore.getState();
        // First set the role to ensure it's available
        userStore.setUser({ role });
        // Then fetch user data with the role
        await userStore.fetchUserData(userData.id, role);
      }

      return user;
    }

    throw new Error("Authentication failed: No user returned");
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        scopes: "email profile",
      },
    });

    if (error) {
      console.error("Google Sign-In Error:", error.message);
      throw error;
    }

    return data; // Returns { provider, url }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-Out Error:", error.message);
      throw error;
    }

    // Clear all stored tokens
    clearAllTokens();

    // Clear user state
    const userStore = useUserStore.getState();
    userStore.clearUser();
  } catch (error) {
    console.error("Sign-Out Error:", error);
    throw error;
  }
};

// ============================
// Auth State Management
// ============================

// Handle auth state changes (for OAuth token saving)
export const setupAuthListener = () => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      if (event === "SIGNED_IN" && session) {
        // Store both tokens
        setAuthToken(session.access_token);
        if (session.refresh_token) {
          setRefreshToken(session.refresh_token);
        }

        // When signed in via OAuth, we need to fetch user data
        try {
          // Get the role from user metadata
          const role = session.user.user_metadata?.role || "";

          // Get user database ID from identity_id
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("identity_id", session.user.id)
            .single();

          if (userError) {
            console.error("Error fetching user from database:", userError);
            return;
          }

          if (userData?.id) {
            const userStore = useUserStore.getState();
            userStore.setUser({ role });
            await userStore.fetchUserData(userData.id, role);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }

        console.log("Authenticated User:", {
          id: session.user.id,
          email: session.user.email,
          googleId:
            session.user.identities?.find((i) => i.provider === "google")
              ?.identity_data?.sub ?? null,
        });
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        clearAllTokens();

        // Clear user data
        const userStore = useUserStore.getState();
        userStore.clearUser();
      } else if (event === "TOKEN_REFRESHED" && session) {
        console.log("Token refreshed successfully");
        // Update stored tokens after refresh
        setAuthToken(session.access_token);
        if (session.refresh_token) {
          setRefreshToken(session.refresh_token);
        }
      }
    },
  );

  // Return unsubscribe function for cleanup
  return () => authListener.subscription.unsubscribe();
};

// ============================
// Session Management
// ============================

// Check if user has a valid session
export const checkSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error checking session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error checking session:", error);
    return null;
  }
};

// Manually refresh the session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }

    if (data.session) {
      setAuthToken(data.session.access_token);
      if (data.session.refresh_token) {
        setRefreshToken(data.session.refresh_token);
      }
    }

    return data.session;
  } catch (error) {
    console.error("Error refreshing session:", error);
    throw error;
  }
};

// ============================
// Registration Management
// ============================

export const createRegistrationRequest = async (employee: NewUser) => {
  try {
    const { data, error } = await anonymousSupabase.functions.invoke(
      "create-registration-request",
      {
        body: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
        },
      },
    );

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw new Error(errorMessage.error);
    }

    return data;
  } catch (error) {
    console.error("Error creating registration request:", error);
    throw error;
  }
};

// Use custom password reset edge function
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-password-reset",
      {
        body: { email },
      },
    );

    if (error) throw error;

    if (!data?.success) {
      throw new Error("Failed to send password reset email");
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Reset password with token
export const resetPasswordWithToken = async (
  accessToken: string,
  refreshToken: string,
  newPassword: string,
): Promise<void> => {
  try {
    // Set the session with the tokens from the URL
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) throw sessionError;

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) throw updateError;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Verify email with token hash
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    });

    if (error) {
      // Handle already confirmed emails gracefully
      if (
        error.message.includes("already confirmed") ||
        error.message.includes("already verified")
      ) {
        console.log("Email already verified");
        return; // Don't throw error for already verified emails
      }
      throw error;
    }

    console.log("Email verified successfully");
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

// Verify email with access and refresh tokens (from email link)
export const verifyEmailWithTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  try {
    // Set the session with the tokens from the URL
    const { data, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) throw sessionError;

    // Check if email is confirmed
    if (data.user?.email_confirmed_at) {
      console.log("Email verified successfully through token session");
    } else {
      throw new Error("Email verification failed");
    }
  } catch (error) {
    console.error("Error verifying email with tokens:", error);
    throw error;
  }
};

// Enhanced registration request with email verification
export const createRegistrationRequestWithVerification = async (
  employee: NewUser,
) => {
  try {
    const { data, error } = await anonymousSupabase.functions.invoke(
      "create-registration-request-with-verification",
      {
        body: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
        },
      },
    );

    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw new Error(errorMessage.error);
    }

    return data;
  } catch (error) {
    console.error("Error creating registration request:", error);
    throw error;
  }
};
