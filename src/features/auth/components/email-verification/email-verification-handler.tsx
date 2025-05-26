import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabase";

export const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "missing-token" | "already-verified"
  >("loading");

  useEffect(() => {
    const handleEmailVerification = async () => {
      const token = searchParams.get("token");
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      // If no tokens at all, show missing token error
      if (!token && !accessToken && !refreshToken) {
        setVerificationStatus("missing-token");
        return;
      }

      try {
        // If we have access_token and refresh_token, it means the email was already verified
        // and Supabase redirected here with the session tokens
        if (accessToken && refreshToken) {
          // Set the session to confirm the user is verified
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) {
            console.error("Session error:", sessionError);
            setVerificationStatus("error");
            return;
          }

          // Check if the user's email is confirmed
          if (sessionData.user?.email_confirmed_at) {
            setVerificationStatus("success");
          } else {
            setVerificationStatus("error");
          }
          return;
        }

        // If we have a token hash, try to verify it
        if (token) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          });

          if (error) {
            // Check if the error is because email is already confirmed
            if (
              error.message.includes("already confirmed") ||
              error.message.includes("already verified")
            ) {
              setVerificationStatus("already-verified");
            } else {
              console.error("Verification error:", error);
              setVerificationStatus("error");
            }
            return;
          }

          if (data.user?.email_confirmed_at) {
            setVerificationStatus("success");
          } else {
            setVerificationStatus("error");
          }
          return;
        }

        // If we get here, something went wrong
        setVerificationStatus("error");
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus("error");
      }
    };

    handleEmailVerification();
  }, [searchParams]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Verifying Your Email</h1>
              <p className="text-muted-foreground text-sm">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">
                Email Verified Successfully!
              </h1>
              <p className="text-muted-foreground text-sm">
                Your email has been verified. You can now log in to your
                account.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        );

      case "already-verified":
        return (
          <div className="space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Email Already Verified</h1>
              <p className="text-muted-foreground text-sm">
                Your email address has already been verified. You can log in to
                your account.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="space-y-4">
            <XCircle className="mx-auto h-16 w-16 text-red-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Verification Failed</h1>
              <p className="text-muted-foreground text-sm">
                We couldn't verify your email. The link may be expired or
                invalid.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Try Login
                </Button>
              </Link>
              <Link to="/forgot-password" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Reset Password
                </Button>
              </Link>
            </div>
          </div>
        );

      case "missing-token":
        return (
          <div className="space-y-4">
            <XCircle className="mx-auto h-16 w-16 text-red-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Invalid Verification Link</h1>
              <p className="text-muted-foreground text-sm">
                This verification link is missing required parameters or has
                expired.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/register" className="flex-1">
                <Button variant="outline" className="w-full">
                  Request Access
                </Button>
              </Link>
              <Link to="/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
};
