import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatInitials } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import { useHrEmployees } from "../_mutations/useHrEmployees";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewerDisplayProps {
  reviewers?: {
    name: string;
    image?: string;
  }[];
  description?: string;
  useHrData?: boolean;
}

export const ReviewerDisplay = ({
  reviewers: propReviewers,
  description,
  useHrData = true,
}: ReviewerDisplayProps) => {
  const { data: hrEmployees, isLoading } = useHrEmployees({
    enabled: useHrData,
  });

  const reviewers =
    useHrData && hrEmployees
      ? hrEmployees.map((employee) => ({
          name: `${employee.user_id.user_profiles.first_name} ${employee.user_id.user_profiles.last_name}`,
          image: employee.user_id.user_profiles.profile_image,
        }))
      : propReviewers || [];

  if (useHrData && isLoading) {
    return (
      <div className="flex justify-end space-x-2 py-2">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="relative flex justify-end">
        {reviewers.slice(0, 4).map((reviewer, index) => (
          <Tooltip key={reviewer.name}>
            <TooltipTrigger asChild>
              <Avatar
                className={cn(
                  "border-background relative -ml-1.5 size-9 border-2 first:ml-0",
                )}
                style={{
                  zIndex: index,
                }}
              >
                <AvatarImage src={reviewer.image} alt={reviewer.name} />
                <AvatarFallback className="rounded-lg">
                  {formatInitials(reviewer.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{reviewer.name}</TooltipContent>
          </Tooltip>
        ))}
        {reviewers.length > 4 && (
          <div
            className="border-background relative -ml-1.5 flex size-9 items-center justify-center rounded-full border-2 bg-zinc-700 text-xs font-medium text-white"
            style={{ zIndex: 4 }}
          >
            +{reviewers.length - 4}
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-right text-sm leading-none">
        Assigned HR reviewers <br />
        {description}
      </p>
    </div>
  );
};
