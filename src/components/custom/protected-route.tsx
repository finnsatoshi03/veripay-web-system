import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { ProfileCompletionDialog } from "@/features/profile/components/profile-completion-dialog";

type ProtectedRouteProps = {
  allowedRoles?: string[];
  requireCompleteProfile?: boolean;
};

export const ProtectedRoute = ({
  allowedRoles,
  requireCompleteProfile = true,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const {
    id: userId,
    profile,
    isLoading: userLoading,
    fetchUserData,
  } = useUserStore();

  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

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

  useEffect(() => {
    if (isAuthenticated && user && !userLoading && !hasAttemptedFetch) {
      setHasAttemptedFetch(true);
      fetchUserData(user.id, user.role);
    }
  }, [isAuthenticated, user, userLoading, hasAttemptedFetch]);

  // Update dialog visibility based on profile completeness
  useEffect(() => {
    // Only check when we have loaded user data
    if (hasAttemptedFetch && !userLoading) {
      const isIncomplete = isProfileIncomplete();

      // Update dialog visibility
      if (requireCompleteProfile && isAuthenticated && userId && isIncomplete) {
        setShowProfileDialog(true);
      } else {
        setShowProfileDialog(false);
      }
    }
  }, [
    requireCompleteProfile,
    isAuthenticated,
    userLoading,
    userId,
    profile,
    hasAttemptedFetch,
  ]);

  const handleProfileComplete = () => {
    setShowProfileDialog(false);
    // Reset fetch state so we can fetch new profile data
    setHasAttemptedFetch(false);
  };

  if (authLoading || (userLoading && hasAttemptedFetch)) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
    </>
  );
};
