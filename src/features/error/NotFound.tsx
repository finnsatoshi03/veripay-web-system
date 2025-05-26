import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import type { ReactNode } from "react";

interface NotFoundProps {
  title?: string;
  message?: string;
  secondaryAction?: {
    label: string;
    to: string;
    icon?: ReactNode;
    ariaLabel?: string;
  };
}

export default function NotFound({
  title = "Page not found",
  message = "The page you're looking for doesn't exist or has been moved to another address.",
  secondaryAction = {
    label: "Return Home",
    to: "/",
    icon: <Home />,
    ariaLabel: "Return Home",
  },
}: NotFoundProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSecondaryAction = () => {
    navigate(secondaryAction.to);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-primary text-9xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex items-center gap-2"
          tabIndex={0}
          aria-label="Go Back"
          onKeyDown={(e) => e.key === "Enter" && handleGoBack()}
        >
          <ArrowLeft />
          Go Back
        </Button>
        <Button
          onClick={handleSecondaryAction}
          className="flex items-center gap-2"
          tabIndex={0}
          aria-label={secondaryAction.ariaLabel || secondaryAction.label}
          onKeyDown={(e) => e.key === "Enter" && handleSecondaryAction()}
        >
          {secondaryAction.icon}
          {secondaryAction.label}
        </Button>
      </div>
    </div>
  );
}
