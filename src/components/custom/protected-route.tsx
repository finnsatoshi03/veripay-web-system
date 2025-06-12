import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { ProfileCompletionDialog } from "@/features/profile/components/profile-completion-dialog";
import { FingerprintSetupDialog } from "./fingerprint/fingerprint-setup-dialog";
import { useFingerprintStatus } from "@/features/auth/mutations/fingerprint-service";
import { Loader } from "./loader";
import { toast } from "react-hot-toast";

type ProtectedRouteProps = {
  allowedRoles?: string[];
  requireCompleteProfile?: boolean;
};

export const ProtectedRoute = ({
  allowedRoles,
  requireCompleteProfile = true,
}: ProtectedRouteProps) => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    clearAllData,
  } = useAuthStore();
  const {
    id: userId,
    employeeId,
    profile,
    isLoading: userLoading,
    fetchUserData,
  } = useUserStore();

  const isPaymentOverdue = false;

  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showFingerprintDialog, setShowFingerprintDialog] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Fetch fingerprint status
  const { data: fingerprintStatus, isLoading: fingerprintLoading } =
    useFingerprintStatus(employeeId);

  // Handle timeout for infinite loading states
  useEffect(() => {
    if (!authLoading) return;

    const timeoutId = setTimeout(() => {
      // Clear localStorage and auth data if loading persists for 5 seconds
      clearAllData();
      toast.error("Session expired. Please log in again.", {
        duration: 5000,
        position: "top-center",
      });
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [authLoading, clearAllData]);

  // Check if profile is incomplete
  const isProfileIncomplete = () => {
    if (!profile) return true;

    const requiredFields = [
      "first_name",
      "last_name",
      "contact_number",
      "address",
      "birth_date",
      "gender",
    ];

    return requiredFields.some(
      (field) => !profile[field as keyof typeof profile],
    );
  };

  // Check if fingerprint setup is required
  const isFingerprintSetupRequired = () => {
    if (!fingerprintStatus) return true; // No record means setup required

    // Check if setup is already in progress from settings page
    if (localStorage.getItem("fingerprint-setup-in-progress") === "true") {
      return false; // Don't show dialog if settings page is handling it
    }

    // If user has skipped, don't require setup
    if (
      fingerprintStatus.status === "skipped" &&
      fingerprintStatus.result === "skipped_by_user"
    ) {
      return false;
    }

    // If status is 'done', setup is complete
    if (fingerprintStatus.status === "done") {
      return false;
    }

    // All other cases require setup (including pending, null status and failed cases)
    return true;
  };

  useEffect(() => {
    if (isAuthenticated && user && !userLoading && !hasAttemptedFetch) {
      setHasAttemptedFetch(true);
      fetchUserData(user.id, user.role, true);
    }
  }, [isAuthenticated, user, userLoading, hasAttemptedFetch]);

  // Update dialog visibility based on profile completeness and fingerprint setup
  useEffect(() => {
    // Only check when we have loaded user data
    if (hasAttemptedFetch && !userLoading && !fingerprintLoading) {
      const isIncomplete = isProfileIncomplete();
      const needsFingerprint = isFingerprintSetupRequired();

      // Show profile dialog first if profile is incomplete
      if (requireCompleteProfile && isAuthenticated && userId && isIncomplete) {
        setShowProfileDialog(true);
        setShowFingerprintDialog(false);
      }
      // Then show fingerprint dialog if profile is complete but fingerprint is not set up
      else if (isAuthenticated && userId && needsFingerprint) {
        setShowProfileDialog(false);
        setShowFingerprintDialog(true);
      }
      // Hide both dialogs if everything is complete
      else {
        setShowProfileDialog(false);
        setShowFingerprintDialog(false);
      }
    }
  }, [
    requireCompleteProfile,
    isAuthenticated,
    userLoading,
    fingerprintLoading,
    userId,
    profile,
    fingerprintStatus,
    hasAttemptedFetch,
  ]);

  const handleProfileComplete = () => {
    setShowProfileDialog(false);
    // Reset fetch state so we can fetch new profile data
    setHasAttemptedFetch(false);
  };

  const handleFingerprintComplete = () => {
    setShowFingerprintDialog(false);
    // Clean up localStorage flag
    localStorage.removeItem("fingerprint-setup-in-progress");
  };

  // Cleanup localStorage on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("fingerprint-setup-in-progress");
    };
  }, []);

  // Listen for storage changes to react to settings page dialog state
  useEffect(() => {
    const handleStorageChange = () => {
      // Force re-evaluation of dialog visibility when localStorage changes
      // This will trigger the dialog visibility useEffect
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (authLoading || (userLoading && hasAttemptedFetch)) {
    return <Loader />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isPaymentOverdue) {
    return <Navigate to="/payment-reminder" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (user?.role === "HR") {
      return (
        <>
          <Outlet />
          {showProfileDialog && userId && (
            <ProfileCompletionDialog
              open={showProfileDialog}
              userId={userId}
              profile={profile}
              onComplete={handleProfileComplete}
            />
          )}
          {showFingerprintDialog && userId && (
            <FingerprintSetupDialog
              open={showFingerprintDialog}
              onOpenChange={setShowFingerprintDialog}
              employeeId={employeeId ?? 0}
              onComplete={handleFingerprintComplete}
            />
          )}
        </>
      );
    }

    const hasRequiredRole = user && allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
      if (user?.role === "EMPLOYEE") {
        return <Navigate to="/employee/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return (
    <>
      <Outlet />
      {showProfileDialog && userId && (
        <ProfileCompletionDialog
          open={showProfileDialog}
          userId={userId}
          profile={profile}
          onComplete={handleProfileComplete}
        />
      )}
      {showFingerprintDialog && userId && (
        <FingerprintSetupDialog
          open={showFingerprintDialog}
          onOpenChange={setShowFingerprintDialog}
          employeeId={employeeId ?? 0}
          onComplete={handleFingerprintComplete}
        />
      )}
    </>
  );
};
