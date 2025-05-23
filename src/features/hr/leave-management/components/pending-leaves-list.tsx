import { format, parseISO, differenceInDays } from "date-fns";
import { Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { LeaveRequest } from "@/features/hr/_lib/types";

type PendingLeavesListProps = {
  leaveRequests: LeaveRequest[];
  onLeaveClick: (leave: LeaveRequest) => void;
};

export const PendingLeavesList = ({
  leaveRequests,
  onLeaveClick,
}: PendingLeavesListProps) => {
  const pendingLeaves = leaveRequests.filter(
    (leave) => leave.status === "pending",
  );

  // Group by leave type
  const leavesByType = pendingLeaves.reduce(
    (acc, leave) => {
      const leaveType = leave.leave_type_id.name;
      if (!acc[leaveType]) {
        acc[leaveType] = [];
      }
      acc[leaveType].push(leave);
      return acc;
    },
    {} as Record<string, LeaveRequest[]>,
  );

  const getLeaveSpanText = (leave: LeaveRequest) => {
    const startDate = parseISO(leave.start_date);
    const endDate = parseISO(leave.end_date);
    const days = differenceInDays(endDate, startDate) + 1;

    if (days === 1) {
      return format(startDate, "MMM d");
    }
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")} (${days} days)`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (pendingLeaves.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <Calendar className="mx-auto mb-2 h-12 w-12" />
        <p>No pending leave requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(leavesByType)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([leaveType, leaves]) => (
          <div key={leaveType} className="space-y-3">
            <h3 className="text-muted-foreground text-xs font-medium uppercase">
              {leaveType} ({leaves.length})
            </h3>
            <div className="space-y-2">
              {leaves.map((leave) => {
                const employee = leave.employee_id;
                const userProfile = employee.user_id.user_profiles;

                return (
                  <Card
                    key={leave.id}
                    className="cursor-pointer bg-transparent p-0 transition-colors"
                    onClick={() => onLeaveClick(leave)}
                  >
                    <CardContent className="h-fit p-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={userProfile.profile_image || ""}
                            alt={`${userProfile.first_name} ${userProfile.last_name}`}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(
                              userProfile.first_name,
                              userProfile.last_name,
                            )}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium">
                              {userProfile.first_name} {userProfile.last_name}
                            </p>
                          </div>

                          <div className="mt-1">
                            <Badge
                              variant="outline"
                              className="flex w-fit items-center gap-1 text-xs"
                            >
                              <Calendar className="h-3 w-3" />
                              {getLeaveSpanText(leave)}
                            </Badge>
                          </div>

                          {leave.reason && (
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                              {leave.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};
