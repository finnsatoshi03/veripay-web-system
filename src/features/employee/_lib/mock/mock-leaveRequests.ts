import type { LeaveRequestCardProps } from "../../leave-overview/components/leave-request-card";

export const leaveRequests: {
  pending: LeaveRequestCardProps[];
  approved: LeaveRequestCardProps[];
  rejected: LeaveRequestCardProps[];
} = {
  pending: [
    {
      id: "LR-2023-1001",
      title: "Annual Vacation",
      reason: "Family trip to Bali for summer vacation",
      startDate: "2023-07-15",
      endDate: "2023-07-25",
      days: 7,
      status: "pending",
      requestedBy: {
        name: "John Doe",
        image: "https://github.com/shadcn.png",
      },
      dateRequested: "2023-07-01",
    },
    {
      id: "LR-2023-1002",
      title: "Medical Leave",
      reason: "Scheduled wisdom tooth extraction and recovery",
      startDate: "2023-07-10",
      endDate: "2023-07-12",
      days: 3,
      status: "pending",
      requestedBy: {
        name: "Jane Smith",
      },
      dateRequested: "2023-07-03",
    },
  ],
  approved: [
    {
      id: "LR-2023-1003",
      title: "Conference Attendance",
      reason: "Attending the annual tech conference in San Francisco",
      startDate: "2023-06-20",
      endDate: "2023-06-23",
      days: 4,
      status: "approved",
      requestedBy: {
        name: "John Doe",
        image: "https://github.com/shadcn.png",
      },
      reviewedBy: {
        name: "Sarah Johnson",
        image: "https://github.com/shadcn.png",
      },
      dateRequested: "2023-06-01",
    },
    {
      id: "LR-2023-1004",
      title: "Family Emergency",
      reason: "Need to attend to an urgent family matter",
      startDate: "2023-06-10",
      endDate: "2023-06-13",
      days: 2,
      status: "approved",
      requestedBy: {
        name: "Peter Parker",
      },
      reviewedBy: {
        name: "Sarah Johnson",
        image: "https://github.com/shadcn.png",
      },
      dateRequested: "2023-06-09",
    },
  ],
  rejected: [
    {
      id: "LR-2023-1005",
      title: "Extended Leave",
      reason: "Personal development and remote work trial",
      startDate: "2023-05-15",
      endDate: "2023-06-15",
      days: 22,
      status: "rejected",
      requestedBy: {
        name: "Mary Jane",
      },
      reviewedBy: {
        name: "Tony Stark",
      },
      rejectionReason:
        "The requested leave period is too long for the current project timeline. Please consider shortening the duration or postponing to a less critical period.",
      dateRequested: "2023-05-01",
    },
    {
      id: "LR-2023-1006",
      title: "Conference Attendance",
      reason: "Attending industry conference in Europe",
      startDate: "2023-05-10",
      endDate: "2023-05-17",
      days: 6,
      status: "rejected",
      requestedBy: {
        name: "Bruce Wayne",
        image: "https://github.com/shadcn.png",
      },
      reviewedBy: {
        name: "Tony Stark",
      },
      rejectionReason:
        "Budget constraints for international travel this quarter. Consider attending virtually or a local alternative.",
      dateRequested: "2023-04-25",
    },
  ],
};
