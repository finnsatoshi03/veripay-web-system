import type { NewUser, RegistrationReqeust } from "@/types/api";
import { clearAuthToken, setAuthToken, supabase } from "./supabase";

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

    if (data.user) {
      const { user } = data;
      const { access_token } = data.session || {};

      if (access_token) {
        setAuthToken(access_token);
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

    clearAuthToken();
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
    (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setAuthToken(session.access_token); // Save token
        console.log("Authenticated User:", {
          id: session.user.id,
          email: session.user.email,
          googleId:
            session.user.identities?.find((i) => i.provider === "google")
              ?.identity_data?.sub ?? null,
        });
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        clearAuthToken();
      }
    },
  );

  // Return unsubscribe function for cleanup
  return () => authListener.subscription.unsubscribe();
};

// ============================
// Registration Management
// ============================

export const createRegistrationRequest = async (employee: NewUser) => {
  try {
    const { data, error } = await supabase
      .from("registration_requests")
      .insert({
        first_name: employee.firstName,
        last_name: employee.lastName,
        email: employee.email,
      });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating registration request:", error);
    throw error;
  }
};

export const processRegistrationRequest = async (
  requestId: number,
  newStatus: string,
) => {
  try {
    let query = supabase
      .from("registration_requests")
      .select("*")
      .eq("id", requestId);

    if (newStatus) {
      query = query.eq("status", newStatus);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("Error fetching registration request:", error);
      throw error;
    }

    return data as RegistrationReqeust;
  } catch (error) {
    console.error("Exception in getRegistrationRequest:", error);
    throw error;
  }
};
