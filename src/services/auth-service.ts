import type { NewUser } from "@/types/api";
import { clearAuthToken, setAuthToken, supabase } from "./supabase";

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const { data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log(data);

    if (data.user) {
      const { user } = data;
      const { access_token } = data.session || {};

      if (access_token) {
        setAuthToken(access_token);
      }

      return user;
    }
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export const signInWithGoogle = async () => {
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

  console.log("Google OAuth URL:", data.url);
  return data; // Returns { provider, url }
};

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

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign-Out Error:", error.message);
    throw error;
  }
  clearAuthToken();
};

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
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating registration request:", error);
  }
};

export const processRegistrationRequest = async (
  requestId: number,
  newStatus: string,
) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "update-registration-status",
      {
        body: { id: requestId, status: newStatus },
      },
    );

    if (error) {
      console.error("Error fetching registration request:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Exception in getRegistrationRequest:", error);
    return null;
  }
};
