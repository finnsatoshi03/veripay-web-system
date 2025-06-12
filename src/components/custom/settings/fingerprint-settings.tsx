import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Fingerprint,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  useFingerprintStatus,
  useInitiateFingerprintSetup,
  useMarkFingerprintTimeout,
} from "@/features/auth/mutations/fingerprint-service";
import { useUserStore } from "@/store/userStore";

export const FingerprintSettings = () => {
  const { employeeId } = useUserStore();
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);

  const { data: fingerprintStatus, isLoading: fingerprintLoading } =
    useFingerprintStatus(employeeId);
  const setupMutation = useInitiateFingerprintSetup();
  const timeoutMutation = useMarkFingerprintTimeout();

  const handleSetupFingerprint = async () => {
    if (!employeeId) return;

    setIsSetupInProgress(true);
    try {
      await setupMutation.mutateAsync(employeeId);
      // Don't auto-stop loading - wait for realtime updates
    } catch {
      setIsSetupInProgress(false);
    }
  };

  // Watch for fingerprint status changes and stop loading when setup is complete
  useEffect(() => {
    if (isSetupInProgress && fingerprintStatus?.status === "done") {
      setIsSetupInProgress(false);
    }
  }, [fingerprintStatus?.status, isSetupInProgress]);

  // Fallback timeout for setup process
  useEffect(() => {
    if (!isSetupInProgress || !employeeId) return;

    const timeoutId = setTimeout(async () => {
      setIsSetupInProgress(false);
      // Mark the setup as timed out in the database
      try {
        await timeoutMutation.mutateAsync(employeeId);
      } catch (error) {
        console.error("Failed to mark fingerprint timeout:", error);
      }
    }, 60000);

    return () => clearTimeout(timeoutId);
  }, [isSetupInProgress, timeoutMutation, employeeId]);

  const getStatusInfo = () => {
    if (!fingerprintStatus) {
      return {
        status: "Not Set Up",
        description: "Fingerprint authentication has not been configured.",
        variant: "secondary" as const,
        icon: XCircle,
        canSetup: true,
      };
    }

    switch (fingerprintStatus.status) {
      case "done":
        return {
          status: "Active",
          description: "Fingerprint authentication is active and working.",
          variant: "default" as const,
          icon: CheckCircle,
          canSetup: false,
        };
      case "failed":
        if (fingerprintStatus.result === "skipped_by_user") {
          return {
            status: "Skipped",
            description:
              "You previously skipped fingerprint setup. You can set it up now.",
            variant: "outline" as const,
            icon: AlertTriangle,
            canSetup: true,
          };
        }
        if (fingerprintStatus.result === "setup_timeout") {
          return {
            status: "Timed Out",
            description:
              "Previous fingerprint setup timed out. Please ensure you are near the IoT device and try again.",
            variant: "destructive" as const,
            icon: XCircle,
            canSetup: true,
          };
        }
        return {
          status: "Failed",
          description:
            "Previous fingerprint setup attempt failed. Try setting it up again.",
          variant: "destructive" as const,
          icon: XCircle,
          canSetup: true,
        };
      case null:
        return {
          status: "Pending",
          description: "Fingerprint setup is in progress.",
          variant: "secondary" as const,
          icon: Clock,
          canSetup: false,
        };
      default:
        return {
          status: "Unknown",
          description: "Unable to determine fingerprint status.",
          variant: "secondary" as const,
          icon: XCircle,
          canSetup: true,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const isLoading = setupMutation.isPending || isSetupInProgress;

  if (fingerprintLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Loading fingerprint settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-semibold">
          Fingerprint Authentication
        </h2>
        <p className="text-muted-foreground">
          Manage your fingerprint authentication settings for enhanced security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Fingerprint className="text-primary size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Fingerprint Status</CardTitle>
              <CardDescription>
                Current status of your fingerprint authentication
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <StatusIcon
              className={`size-5 ${
                statusInfo.variant === "default"
                  ? "text-green-600"
                  : statusInfo.variant === "outline"
                    ? "text-amber-600"
                    : statusInfo.variant === "destructive"
                      ? "text-red-600"
                      : "text-muted-foreground"
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{statusInfo.status}</span>
                <Badge variant={statusInfo.variant}>{statusInfo.status}</Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {statusInfo.description}
              </p>
            </div>
          </div>

          {statusInfo.canSetup && (
            <div className="border-t pt-4">
              {isSetupInProgress && (
                <Alert className="mb-4">
                  <Fingerprint className="size-4 animate-pulse" />
                  <AlertDescription>
                    Fingerprint setup in progress. Please place your finger on
                    the IoT fingerprint scanner device...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSetupFingerprint}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <Fingerprint className="mr-2 size-4" />
                {isSetupInProgress ? "Setting up..." : "Set Up Fingerprint"}
              </Button>
            </div>
          )}

          {fingerprintStatus && (
            <div className="border-t pt-4">
              <h4 className="mb-2 text-sm font-medium">Setup Details</h4>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>
                  Last updated:{" "}
                  {new Date(fingerprintStatus.updated_at).toLocaleString()}
                </p>
                <p>
                  Setup date:{" "}
                  {new Date(fingerprintStatus.created_at).toLocaleString()}
                </p>
                {fingerprintStatus.result && (
                  <p>Result: {fingerprintStatus.result}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="size-4" />
        <AlertDescription>
          <strong>Security Note:</strong> Fingerprint authentication adds an
          extra layer of security to your account. We recommend setting it up to
          protect your sensitive data.
        </AlertDescription>
      </Alert>
    </div>
  );
};
