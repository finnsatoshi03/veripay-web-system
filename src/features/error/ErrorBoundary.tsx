import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can log the error to an error reporting service here
    toast.error(`Error caught by ErrorBoundary: ${error.message} ${errorInfo}`);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-4 text-center">
          <AlertTriangle className="text-destructive size-16" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">
              An unexpected error has occurred
            </p>
            {this.state.error && (
              <div className="bg-border mt-4 max-w-md overflow-auto rounded-md p-4 text-left text-sm">
                <p className="font-mono">{this.state.error.toString()}</p>
              </div>
            )}
          </div>
          <Button
            onClick={this.handleReset}
            className="flex items-center gap-2"
            tabIndex={0}
            aria-label="Try Again"
            onKeyDown={(e) => e.key === "Enter" && this.handleReset()}
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
