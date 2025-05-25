import { Clock, Code2, Wallet, Handshake } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeActions } from "./employee-actions";
import type { ActiveEmployee } from "../lib/helpers";

interface ActiveEmployeeTableProps {
  employees: ActiveEmployee[];
  visibleColumns?: string[];
}

export const EMPLOYEE_TABLE_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "department", label: "Department" },
  { id: "timeIn", label: "Time in" },
  { id: "timeOut", label: "Time out" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions" },
];

export const ActiveEmployeeTable = ({
  employees,
  visibleColumns = [
    "name",
    "department",
    "timeIn",
    "timeOut",
    "status",
    "actions",
  ],
}: ActiveEmployeeTableProps) => {
  // Filter columns by visibility
  const columns = EMPLOYEE_TABLE_COLUMNS.filter((col) =>
    visibleColumns.includes(col.id),
  );

  const getColSpan = () => visibleColumns.length || 1;

  const getDepartmentBadgeClasses = (department: string) => {
    switch (department) {
      case "IT":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Human Resources (HR)":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "Finance":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "IT":
        return <Code2 size={14} />;
      case "Human Resources":
        return <Handshake size={14} />;
      case "Finance":
        return <Wallet size={14} />;
      default:
        return null;
    }
  };

  const getStatusBadgeClasses = (status: string) => {
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

  const getEmployeeInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Table>
      <TableHeader className="sticky top-0 z-20 bg-zinc-200 dark:bg-zinc-800">
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={`font-medium ${column.id === "actions" ? "w-[100px]" : ""}`}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={getColSpan()} className="h-24 text-center">
              No active employees found.
            </TableCell>
          </TableRow>
        ) : (
          employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-muted/50">
              {visibleColumns.includes("name") && (
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="bg-yellow-400 text-sm font-bold text-white">
                        {getEmployeeInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    {employee.name}
                  </div>
                </TableCell>
              )}
              {visibleColumns.includes("department") && (
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getDepartmentBadgeClasses(employee.department)}
                  >
                    {getDepartmentIcon(employee.department)}
                    {employee.department}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.includes("timeIn") && (
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {employee.timeIn}
                  </div>
                </TableCell>
              )}
              {visibleColumns.includes("timeOut") && (
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {employee.timeOut}
                  </div>
                </TableCell>
              )}
              {visibleColumns.includes("status") && (
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeClasses(employee.status)}
                  >
                    <div className="mr-1 h-2 w-2 rounded-full bg-current"></div>
                    {employee.status}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.includes("actions") && (
                <TableCell>
                  <EmployeeActions employee={employee} />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
