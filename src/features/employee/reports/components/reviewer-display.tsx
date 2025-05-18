import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatInitials } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";

interface ReviewerDisplayProps {
  reviewers: {
    name: string;
    image?: string;
  }[];
}

export const ReviewerDisplay = ({ reviewers }: ReviewerDisplayProps) => {
  return (
    <div className="space-y-1">
      <div className="relative flex">
        {reviewers.slice(0, 4).map((reviewer, index) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                key={reviewer.name}
                className={cn(
                  "border-background relative -ml-1.5 size-9 rounded-lg border-2 first:ml-0",
                )}
                style={{
                  zIndex: index,
                }}
              >
                <AvatarImage src={reviewer.image} alt={reviewer.name} />
                <AvatarFallback>{formatInitials(reviewer.name)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{reviewer.name}</TooltipContent>
          </Tooltip>
        ))}
        {reviewers.length > 4 && (
          <div
            className="border-background relative -ml-1.5 flex size-9 items-center justify-center rounded-lg border-2 bg-zinc-700 text-xs font-medium text-white"
            style={{ zIndex: 4 }}
          >
            +{reviewers.length - 4}
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-right text-sm leading-none">
        Assigned HR reviewers <br />
        for incoming reports.
      </p>
    </div>
  );
};
