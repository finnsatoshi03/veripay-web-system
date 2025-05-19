export type LeaveAllowance = {
  type: string;
  remaining: number;
  total: number;
  used: number;
  percentRemaining: number;
  percentUsed: number;
  colorClass: string;
};

export const leaveAllowances: LeaveAllowance[] = [
  {
    type: "Vacation Leave",
    remaining: 6,
    total: 10,
    used: 4,
    percentRemaining: 60,
    percentUsed: 40,
    colorClass: "bg-secondary",
  },
  {
    type: "Sick Leave",
    remaining: 8,
    total: 12,
    used: 4,
    percentRemaining: 67,
    percentUsed: 33,
    colorClass: "bg-primary",
  },
  {
    type: "Emergency Leave",
    remaining: 3,
    total: 5,
    used: 2,
    percentRemaining: 60,
    percentUsed: 40,
    colorClass: "bg-rose-300",
  },
  {
    type: "Bereavement Leave",
    remaining: 5,
    total: 5,
    used: 0,
    percentRemaining: 100,
    percentUsed: 0,
    colorClass: "bg-green-700",
  },
];
