import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    // Check if there's an error in the URL
    const error = searchParams.get("error");

    if (error) {
      setVerificationStatus("error");
    } else {
      // If no error and user reached this page, assume verification was successful
      // since Supabase only redirects here after successful verification
      setTimeout(() => {
        setVerificationStatus("success");
      }, 1000); // Small delay for better UX
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">
                Completing Email Verification
              </h1>
              <p className="text-muted-foreground text-sm">
                Just a moment while we finalize your email verification...
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
                Your email has been verified. You can now log in to your Veripay
                account.
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-left">
              <h3 className="mb-2 font-medium text-green-800">Next Steps:</h3>
              <ol className="space-y-1 text-sm text-green-700">
                <li>1. Click "Go to Login" below</li>
                <li>
                  2. Use your email and the temporary password from your
                  approval email
                </li>
                <li>3. Change your password after your first login</li>
              </ol>
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
              <h1 className="text-3xl font-bold">Verification Issue</h1>
              <p className="text-muted-foreground text-sm">
                There was an issue with the email verification link.
              </p>
            </div>

            <div className="flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Try Login
                </Button>
              </Link>
              <Link to="/forgot-password" className="flex-1">
                <Button variant="outline" className="w-full">
                  Reset Password
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
