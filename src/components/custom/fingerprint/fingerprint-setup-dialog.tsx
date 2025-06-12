import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Fingerprint,
  Shield,
  SkipForward,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import {
  useFingerprintSettings,
  useFingerprintStatus,
  useSkipFingerprint,
  useInitiateFingerprintSetup,
  useMarkFingerprintTimeout,
  useDeleteFingerprintRecord,
} from "@/features/auth/mutations/fingerprint-service";

interface FingerprintSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: number;
  onComplete: () => void;
}

export const FingerprintSetupDialog = ({
  open,
  onOpenChange,
  employeeId,
  onComplete,
}: FingerprintSetupDialogProps) => {
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const { data: settings } = useFingerprintSettings();
  const { data: fingerprintStatus } = useFingerprintStatus(employeeId);
  const skipMutation = useSkipFingerprint();
  const setupMutation = useInitiateFingerprintSetup();
  const timeoutMutation = useMarkFingerprintTimeout();
  const deleteMutation = useDeleteFingerprintRecord();

  // Ensure localStorage flag is maintained while dialog is open to prevent conflicts
  useEffect(() => {
    if (open) {
      localStorage.setItem("fingerprint-setup-in-progress", "true");
    } else {
      // Only remove the flag if we're explicitly closing the dialog
      // The onComplete callback will handle cleanup for successful setups
      if (!isSetupInProgress && !showSuccess) {
        localStorage.removeItem("fingerprint-setup-in-progress");
      }
    }
  }, [open, isSetupInProgress, showSuccess]);

  // Watch for fingerprint status changes and show success/failure when setup is complete
  useEffect(() => {
    if (isSetupInProgress && fingerprintStatus?.status === "done") {
      setIsSetupInProgress(false);
      setShowSuccess(true);

      // Show success for 3 seconds then close dialog
      setTimeout(() => {
        setShowSuccess(false);
        onComplete();
        onOpenChange(false);
      }, 3000);
    } else if (
      isSetupInProgress &&
      fingerprintStatus?.status === "failed" &&
      fingerprintStatus?.result !== "setup_timeout"
    ) {
      // Only show failure for non-timeout failures (timeout is handled by useEffect timeout)
      setIsSetupInProgress(false);
      setShowFailure(true);
    }
  }, [
    fingerprintStatus?.status,
    fingerprintStatus?.result,
    isSetupInProgress,
    onComplete,
    onOpenChange,
  ]);

  // Fallback timeout in case realtime updates don't work (60 seconds)
  useEffect(() => {
    if (!isSetupInProgress) return;

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

  const handleSetupFingerprint = async () => {
    setIsSetupInProgress(true);
    // Set flag to prevent protected route from showing another dialog
    localStorage.setItem("fingerprint-setup-in-progress", "true");

    try {
      await setupMutation.mutateAsync(employeeId);
      // Don't close the dialog here - wait for status to change to "done"
    } catch {
      setIsSetupInProgress(false);
    }
  };

  const handleSkipSetup = async () => {
    try {
      await skipMutation.mutateAsync(employeeId);
      onComplete();
      onOpenChange(false);
    } catch {
      // Error handling is done in the mutation
    }
  };

  const handleRetrySetup = async () => {
    try {
      // Ensure localStorage flag is set to prevent protected route from showing its dialog
      localStorage.setItem("fingerprint-setup-in-progress", "true");

      // Delete the existing record to clear IoT device conflicts
      await deleteMutation.mutateAsync(employeeId);
      // Reset states
      setShowFailure(false);
      // The deletion will trigger a realtime update and reset the dialog state
    } catch {
      // Error handling is done in the mutation
    }
  };

  const canSkip = settings?.skip_allowed && !settings?.force_fingerprint;
  const isLoading =
    skipMutation.isPending || setupMutation.isPending || isSetupInProgress;

  // Prevent ESC key from closing dialog during setup
  useEffect(() => {
    if (!isLoading) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Add event listener to capture ESC key before it reaches the dialog
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isLoading]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={!isLoading ? onOpenChange : undefined}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <Fingerprint className="text-primary size-8" />
          </div>
          <AlertDialogTitle className="text-xl">
            Set Up Fingerprint
          </AlertDialogTitle>
          <AlertDialogDescription>
            {settings?.description ||
              "Enhance your account security with fingerprint authentication. Please ensure you are near the IoT fingerprint scanner device."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {settings?.force_fingerprint && !showSuccess && (
            <Alert>
              <Shield className="size-4" />
              <AlertDescription>
                Fingerprint setup is required by your organization for security
                purposes.
              </AlertDescription>
            </Alert>
          )}

          {showSuccess && (
            <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
              <CheckCircle className="size-4" />
              <AlertDescription>
                <strong>Success!</strong> Your fingerprint has been set up
                successfully. You can now use fingerprint authentication to
                access your account.
              </AlertDescription>
            </Alert>
          )}

          {showFailure && (
            <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
              <XCircle className="size-4" />
              <AlertDescription>
                <strong>Setup Failed!</strong> The fingerprint setup could not
                be completed. Please ensure your finger is properly placed on
                the IoT device and try again.
              </AlertDescription>
            </Alert>
          )}

          {isSetupInProgress && !showSuccess && (
            <Alert>
              <Fingerprint className="size-4 animate-pulse" />
              <AlertDescription>
                Fingerprint setup in progress. Please place your finger on the
                IoT fingerprint scanner device...
              </AlertDescription>
            </Alert>
          )}

          {!showSuccess && (
            <div className="space-y-3">
              {showFailure ? (
                <Button
                  onClick={handleRetrySetup}
                  disabled={deleteMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  <RotateCcw className="mr-2 size-4" />
                  {deleteMutation.isPending ? "Clearing..." : "Retry Setup"}
                </Button>
              ) : (
                <Button
                  onClick={handleSetupFingerprint}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  <Fingerprint className="mr-2 size-4" />
                  {isSetupInProgress ? "Setting up..." : "Set Up Fingerprint"}
                </Button>
              )}

              {canSkip && !showFailure && (
                <Button
                  variant="outline"
                  onClick={handleSkipSetup}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  <SkipForward className="mr-2 size-4" />
                  Skip for Now
                </Button>
              )}
            </div>
          )}

          {canSkip && !showSuccess && (
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <div className="text-sm">
                  <p className="font-medium">Skip Setup?</p>
                  <p className="text-muted-foreground mt-1">
                    You can set up fingerprint authentication later in your
                    settings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
