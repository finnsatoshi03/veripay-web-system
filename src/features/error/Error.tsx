import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
}

export default function Error({
  title = "An error occurred",
  message = "We're sorry, something went wrong.",
  action,
  children,
}: ErrorProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && action?.onClick) {
      action.onClick();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-4 text-center">
      <AlertTriangle className="text-destructive size-16" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground max-w-md">{message}</p>

        {children && <div className="mt-4">{children}</div>}
      </div>

      {action && (
        <Button
          onClick={action.onClick}
          className="flex items-center gap-2"
          tabIndex={0}
          aria-label={action.label}
          onKeyDown={handleKeyDown}
        >
          {action.icon || <RefreshCw className="size-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
