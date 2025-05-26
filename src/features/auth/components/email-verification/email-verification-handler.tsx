import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailVerification } from "../../mutations/email-verification-service";

export const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "missing-token"
  >("loading");

  const emailVerificationMutation = useEmailVerification();

  useEffect(() => {
    const token = searchParams.get("token");
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!token && !accessToken) {
      setVerificationStatus("missing-token");
      return;
    }

    // Handle email verification with token
    if (token) {
      emailVerificationMutation.mutate(token, {
        onSuccess: () => {
          setVerificationStatus("success");
        },
        onError: () => {
          setVerificationStatus("error");
        },
      });
    }

    // Handle email verification with access/refresh tokens (from email link)
    if (accessToken && refreshToken) {
      emailVerificationMutation.mutate(
        { accessToken, refreshToken },
        {
          onSuccess: () => {
            setVerificationStatus("success");
          },
          onError: () => {
            setVerificationStatus("error");
          },
        },
      );
    }
  }, [searchParams, emailVerificationMutation]);

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
                Your email has been verified. You can now access your account.
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
              <Link to="/register" className="flex-1">
                <Button variant="outline" className="w-full">
                  Request New Link
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

      case "missing-token":
        return (
          <div className="space-y-4">
            <XCircle className="mx-auto h-16 w-16 text-red-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Invalid Verification Link</h1>
              <p className="text-muted-foreground text-sm">
                This verification link is missing required parameters.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/register" className="flex-1">
                <Button variant="outline" className="w-full">
                  Request New Link
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
