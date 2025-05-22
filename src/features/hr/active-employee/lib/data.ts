// types/data.ts
export type EmployeeStatus = "On time" | "Late" | "On leave";
export type Department = "IT" | "Human Resources" | "Finance";

export interface ActiveEmployee {
  [x: string]: string | undefined;
  id: string;
  name: string;
  department: Department;
  timeIn: string;
  timeOut: string;
  status: EmployeeStatus;
}

export const mockActiveEmployees: ActiveEmployee[] = [
  {
    id: "1",
    name: "First Name Last Name",
    department: "IT",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "2",
    name: "First Name Last Name",
    department: "Human Resources",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "3",
    name: "tae",
    department: "Finance",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "4",
    name: "First Name Last Name",
    department: "IT",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "5",
    name: "First Name Last Name",
    department: "IT",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "6",
    name: "First Name Last Name",
    department: "Finance",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "7",
    name: "First Name Last Name",
    department: "Human Resources",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "8",
    name: "First Name Last Name",
    department: "Human Resources",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
  {
    id: "9",
    name: "First Name Last Name",
    department: "Finance",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    status: "On time",
  },
];