import type { NewUser } from "@/types/api";
import { clearAuthToken, setAuthToken, supabase } from "./supabase";
import { useUserStore } from "@/store/userStore";

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

    clearAuthToken();

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
      if (event === "SIGNED_IN" && session) {
        setAuthToken(session.access_token); // Save token

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

          // Fetch complete user data
          if (userData?.id) {
            const userStore = useUserStore.getState();
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
        clearAuthToken();

        // Clear user data
        const userStore = useUserStore.getState();
        userStore.clearUser();
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
    const { data, error } = await supabase.functions.invoke(
      "update-registration-status",
      {
        body: { id: requestId, status: newStatus },
      },
    );

    if (error) {
      console.error("Error fetching registration request:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Exception in getRegistrationRequest:", error);
    throw error;
  }
};
