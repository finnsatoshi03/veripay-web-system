import {
  Clock,
  User,
  Building2,
  Badge as BadgeIcon,
  Mail,
  Briefcase,
  UserCheck,
  UserX,
  UserMinus,
  CheckCircle,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { formatInitials, formatNotionDate } from "@/lib/helpers/formatters";
import type { ActiveEmployee } from "../lib/helpers";

interface EmployeeDetailsDialogProps {
  employee: ActiveEmployee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmployeeDetailsDialog = ({
  employee,
  open,
  onOpenChange,
}: EmployeeDetailsDialogProps) => {
  if (!employee) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "On time":
        return <CheckCircle className="size-4" />;
      case "Late":
        return <Clock className="size-4" />;
      case "On leave":
        return <UserX className="size-4" />;
      case "Absent":
        return <UserMinus className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "On time":
        return "bg-green-100 text-green-700 border-green-200";
      case "Late":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "On leave":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Absent":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "IT":
        return "💻";
      case "Human Resources":
        return "👥";
      case "Finance":
        return "💰";
      default:
        return "🏢";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>Active Employees</span>
              <span>/</span>
              <span className="text-foreground font-medium">
                {employee.employeeCode}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback className="bg-yellow-400 text-lg font-bold text-white">
                    {formatInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl leading-tight font-bold">
                    {employee.name}
                  </h1>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Mail className="size-3" />
                    {employee.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1.5 ${getStatusStyles(employee.status)}`}
                >
                  {getStatusIcon(employee.status)}
                  {employee.status}
                </Badge>

                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Building2 className="size-3" />
                  {employee.department}
                </Badge>

                {employee.position && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    <Briefcase className="size-3" />
                    {employee.position}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Content */}
          <div className="space-y-6">
            {/* Today's Attendance */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Clock className="text-muted-foreground size-4" />
                Today's Attendance
              </h3>

              <div className="grid grid-cols-1 gap-4 pl-6 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Time In
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-muted-foreground size-3" />
                    <span
                      className={
                        employee.timeIn === "--:--"
                          ? "text-muted-foreground"
                          : ""
                      }
                    >
                      {employee.timeIn}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Time Out
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-muted-foreground size-3" />
                    <span
                      className={
                        employee.timeOut === "--:--"
                          ? "text-muted-foreground"
                          : ""
                      }
                    >
                      {employee.timeOut}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pl-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Current Status
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1.5 ${getStatusStyles(employee.status)}`}
                    >
                      {getStatusIcon(employee.status)}
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Employee Information */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <User className="text-muted-foreground size-4" />
                Employee Information
              </h3>

              <div className="grid grid-cols-1 gap-6 pl-6 md:grid-cols-2">
                {/* Employee Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">
                      Employee Code
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <BadgeIcon className="text-muted-foreground size-3" />
                      {employee.employeeCode || "Not assigned"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">
                      Department
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-base">
                        {getDepartmentIcon(employee.department)}
                      </span>
                      {employee.department}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">
                      Email Address
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="text-muted-foreground size-3" />
                      {employee.email}
                    </div>
                  </div>

                  {employee.position && (
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        Position
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="text-muted-foreground size-3" />
                        {employee.position}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Information */}
            <Separator className="my-6" />
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <UserCheck className="text-muted-foreground size-4" />
                Status Information
              </h3>
              <div className="pl-6">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Current Status</p>
                      <p className="text-muted-foreground text-xs">
                        Last updated:{" "}
                        {formatNotionDate(new Date().toISOString())}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1.5 ${getStatusStyles(employee.status)}`}
                    >
                      {getStatusIcon(employee.status)}
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
