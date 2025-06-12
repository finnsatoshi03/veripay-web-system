import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase, clearAllTokens } from "@/services/supabase";
import { checkSession } from "@/services/auth-service";
import toast from "react-hot-toast";

type AuthUser = {
  id: string;
  email: string;
  role: string;
};

interface AuthState {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningOut: boolean;
  loadingTimeoutId: NodeJS.Timeout | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSigningOut: (isSigningOut: boolean) => void;
  clearAllData: () => void;
  handleSessionExpired: () => void;

  // Auth operations
  checkSession: () => Promise<void>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isSigningOut: false,
      loadingTimeoutId: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (isLoading) => {
        const state = get();

        // Clear existing timeout if any
        if (state.loadingTimeoutId) {
          clearTimeout(state.loadingTimeoutId);
        }

        if (isLoading) {
          // Set a timeout for 8 seconds (between 6-10 as requested)
          const timeoutId = setTimeout(() => {
            const currentState = get();
            if (currentState.isLoading) {
              currentState.handleSessionExpired();
            }
          }, 8000);

          set({ isLoading, loadingTimeoutId: timeoutId });
        } else {
          set({ isLoading, loadingTimeoutId: null });
        }
      },

      setSigningOut: (isSigningOut) => set({ isSigningOut }),

      clearAllData: () => {
        // Clear localStorage for both auth and user stores
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("user-storage");

        // Clear tokens
        clearAllTokens();

        toast.error("Session expired. Please log in again.", {
          duration: 5000,
          position: "top-center",
        });

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isSigningOut: false,
          loadingTimeoutId: null,
        });
      },

      handleSessionExpired: () => {
        const state = get();

        // Clear timeout if exists
        if (state.loadingTimeoutId) {
          clearTimeout(state.loadingTimeoutId);
        }

        // Clear all data
        state.clearAllData();

        // Show session expired toast
        toast.error("Session expired. Please log in again.", {
          duration: 5000,
          position: "top-center",
        });
      },

      // Auth operations
      checkSession: async () => {
        try {
          const state = get();
          state.setLoading(true);

          // Use the improved session check from auth service
          const session = await checkSession();

          if (session?.user) {
            const userData = session.user;
            const userRole = userData.user_metadata?.role || "USER";

            set({
              user: {
                id: userData.id,
                email: userData.email || "",
                role: userRole,
              },
              isAuthenticated: true,
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Error checking session:", error);
          const state = get();

          // Handle session errors by clearing data and showing expired message
          if (
            error instanceof Error &&
            (error.message.includes("session") ||
              error.message.includes("expired") ||
              error.message.includes("invalid"))
          ) {
            state.handleSessionExpired();
            return;
          }

          set({ user: null, isAuthenticated: false });
          clearAllTokens();
        } finally {
          const state = get();
          state.setLoading(false);
        }
      },

      signOut: async () => {
        try {
          set({ isSigningOut: true });

          const { error } = await supabase.auth.signOut();

          if (error) {
            // Handle specific session-related errors
            if (
              error.message.includes("session") ||
              error.message.includes("not found") ||
              error.message.includes("expired")
            ) {
              const state = get();
              state.handleSessionExpired();
              return { success: true }; // Treat as successful since we cleared everything
            }

            toast.error(`Sign out error: ${error.message}`);
            return { success: false, error: error.message };
          }

          // Clear all data on successful sign out
          const state = get();
          state.clearAllData();

          toast.success("Signed out successfully");
          return { success: true };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";

          // Handle session-related errors in catch block too
          if (
            errorMessage.includes("session") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("expired")
          ) {
            const state = get();
            state.handleSessionExpired();
            return { success: true }; // Treat as successful since we cleared everything
          }

          toast.error(`Unexpected error during sign out: ${errorMessage}`);
          set({ isSigningOut: false });
          return {
            success: false,
            error: errorMessage,
          };
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Setup auth listener with improved token handling
export const setupAuthListener = () => {
  const { setUser, setSigningOut, handleSessionExpired } =
    useAuthStore.getState();

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log(
        "Auth store - Auth state change:",
        event,
        session?.user?.email,
      );

      if (event === "SIGNED_IN" && session) {
        const userData = session.user;
        const userRole = userData.user_metadata?.role || "USER";

        setUser({
          id: userData.id,
          email: userData.email || "",
          role: userRole,
        });
        setSigningOut(false); // Ensure signing out state is cleared
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSigningOut(false); // Ensure signing out state is cleared
        clearAllTokens(); // Ensure tokens are cleared

        // Handle cases where session becomes null unexpectedly
        const currentState = useAuthStore.getState();
        if (currentState.isAuthenticated) {
          handleSessionExpired();
        }
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Auth store - Token refreshed successfully");
        // Token refresh is handled automatically by the supabase client
        // No need to update user state here as it remains the same
      }
    },
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
};
