import { useQuery } from "@tanstack/react-query";
import { differenceInDays, parseISO } from "date-fns";

import {
  getLeaveRequestsByEmployeeId,
  getLeaveTypes,
  type LeaveRequest,
  type LeaveType,
} from "@/services/employee/leave-service";
import { useUser } from "@/store/userStore";

import type { LeaveAllowance } from "../../_lib/mock/mock-leaveAllowance";
import type { LeaveRequestCardProps } from "../components/leave-request-card";
import { queryKeys } from "@/lib/configs/query-keys";

// Enhanced interface for leave request with calculated days
export interface EnhancedLeaveRequest extends LeaveRequest {
  days: number;
  leave_type_name?: string;
}

// Interface for leave allowance calculation
export interface LeaveAllowanceData {
  allowances: LeaveAllowance[];
  leaveRequests: {
    pending: LeaveRequestCardProps[];
    approved: LeaveRequestCardProps[];
    rejected: LeaveRequestCardProps[];
  };
}

// Color mapping for different leave types
const getLeaveTypeColor = (leaveTypeName: string): string => {
  const colorMap: Record<string, string> = {
    "Vacation Leave": "bg-secondary",
    "Sick Leave": "bg-primary",
    "Emergency Leave": "bg-rose-300",
    "Bereavement Leave": "bg-green-700",
  };

  return colorMap[leaveTypeName] || "bg-gray-400";
};

// Calculate days between two dates
const calculateDays = (startDate: string, endDate: string): number => {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return differenceInDays(end, start) + 1; // +1 to include both start and end dates
  } catch {
    return 0;
  }
};

// Calculate leave allowance based on leave types and requests
const calculateLeaveAllowance = (
  leaveTypes: LeaveType[],
  leaveRequests: LeaveRequest[],
): LeaveAllowance[] => {
  return leaveTypes.map((leaveType) => {
    const total = leaveType.max_days || 0;

    // Count only approved leave requests for this leave type
    const approvedRequests = leaveRequests.filter(
      (request) =>
        request.leave_type_id === leaveType.id && request.status === "approved",
    );

    // Calculate total used days
    const used = approvedRequests.reduce((sum, request) => {
      return sum + calculateDays(request.start_date, request.end_date);
    }, 0);

    const remaining = Math.max(0, total - used);
    const percentUsed = total > 0 ? Math.round((used / total) * 100) : 0;
    const percentRemaining =
      total > 0 ? Math.round((remaining / total) * 100) : 100;

    return {
      type: leaveType.name,
      remaining,
      total,
      used,
      percentRemaining,
      percentUsed,
      colorClass: getLeaveTypeColor(leaveType.name),
    };
  });
};

// Transform database leave request to UI card props
const transformToCardProps = (
  request: LeaveRequest,
  leaveTypeName?: string,
  employeeName?: string,
): LeaveRequestCardProps => {
  // Extract reviewer information if available
  const reviewedBy = request.reviewed_by?.user_profiles
    ? {
        name: `${request.reviewed_by.user_profiles.first_name} ${request.reviewed_by.user_profiles.last_name}`.trim(),
        image: request.reviewed_by.user_profiles.profile_image,
      }
    : undefined;

  return {
    id: request.id.toString(),
    title: leaveTypeName || "Leave Request",
    reason: request.reason || "No reason provided",
    startDate: request.start_date,
    endDate: request.end_date,
    days: calculateDays(request.start_date, request.end_date),
    status: request.status || "pending",
    requestedBy: {
      name: employeeName || "Employee",
    },
    reviewedBy,
    dateRequested: request.requested_at,
  };
};

// Group leave requests by status and transform to card props
const processLeaveRequests = (
  leaveRequests: LeaveRequest[],
  leaveTypes: LeaveType[],
  employeeName?: string,
): LeaveAllowanceData["leaveRequests"] => {
  // Create a map for quick leave type lookup
  const leaveTypeMap = new Map(leaveTypes.map((lt) => [lt.id, lt.name]));

  const transformedRequests: LeaveRequestCardProps[] = leaveRequests.map(
    (request) =>
      transformToCardProps(
        request,
        leaveTypeMap.get(request.leave_type_id),
        employeeName,
      ),
  );

  return {
    pending: transformedRequests.filter((req) => req.status === "pending"),
    approved: transformedRequests.filter((req) => req.status === "approved"),
    rejected: transformedRequests.filter((req) => req.status === "rejected"),
  };
};

export const useLeaveOverview = () => {
  const { employee, fullName } = useUser();
  const employeeId = employee?.id;

  return useQuery({
    queryKey: [queryKeys.OVERVIEW.leaveOverview, employeeId],
    queryFn: async (): Promise<LeaveAllowanceData> => {
      if (!employeeId) {
        throw new Error("Employee ID is required");
      }

      // Fetch both leave types and leave requests in parallel
      const [leaveTypes, leaveRequests] = await Promise.all([
        getLeaveTypes(),
        getLeaveRequestsByEmployeeId(employeeId),
      ]);

      // Calculate allowances and process requests
      const allowances = calculateLeaveAllowance(leaveTypes, leaveRequests);
      const processedRequests = processLeaveRequests(
        leaveRequests,
        leaveTypes,
        fullName,
      );

      return {
        allowances,
        leaveRequests: processedRequests,
      };
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
