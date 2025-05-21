import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Footer = ({
  isForgotPassword = false,
}: {
  isForgotPassword?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex w-full justify-end",
        isForgotPassword && "items-end justify-between",
      )}
    >
      {isForgotPassword && (
        <p className="text-muted-foreground max-w-[300px] text-xs">
          Only registered company accounts can request a reset. For other
          issues, please contact HR.
        </p>
      )}
      <div className="flex gap-6">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/support">Support</Link>
      </div>
    </div>
  );
};
