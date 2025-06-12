import { useState } from "react";
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
import { useFingerprintStatus } from "@/features/auth/mutations/fingerprint-service";
import { FingerprintSetupDialog } from "../fingerprint/fingerprint-setup-dialog";
import { useUserStore } from "@/store/userStore";

export const FingerprintSettings = () => {
  const { employeeId } = useUserStore();
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  const { data: fingerprintStatus, isLoading: fingerprintLoading } =
    useFingerprintStatus(employeeId);

  const handleSetupFingerprint = () => {
    setShowSetupDialog(true);
    // Store in localStorage to prevent Protected Route from showing dialog
    localStorage.setItem("fingerprint-setup-in-progress", "true");
  };

  const handleSetupComplete = () => {
    setShowSetupDialog(false);
    // Remove localStorage flag
    localStorage.removeItem("fingerprint-setup-in-progress");
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowSetupDialog(open);
    if (!open) {
      // Remove localStorage flag when dialog is closed
      localStorage.removeItem("fingerprint-setup-in-progress");
    }
  };

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
      case "skipped":
        return {
          status: "Skipped",
          description:
            "You previously skipped fingerprint setup. You can set it up now.",
          variant: "outline" as const,
          icon: AlertTriangle,
          canSetup: true,
        };
      case "failed":
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
      case "pending":
        return {
          status: "Pending",
          description: "Fingerprint setup is in progress.",
          variant: "secondary" as const,
          icon: Clock,
          canSetup: false,
        };
      case null:
        return {
          status: "Not Set Up",
          description: "Fingerprint authentication has not been configured.",
          variant: "secondary" as const,
          icon: XCircle,
          canSetup: true,
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

  if (fingerprintLoading) {
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
              <Button
                onClick={handleSetupFingerprint}
                className="w-full sm:w-auto"
              >
                <Fingerprint className="mr-2 size-4" />
                Set Up Fingerprint
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

      {showSetupDialog && employeeId && (
        <FingerprintSetupDialog
          open={showSetupDialog}
          onOpenChange={handleDialogOpenChange}
          employeeId={employeeId}
          onComplete={handleSetupComplete}
        />
      )}
    </div>
  );
};
