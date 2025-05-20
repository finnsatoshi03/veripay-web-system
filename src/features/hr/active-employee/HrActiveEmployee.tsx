import { useState } from "react";
import { Eye, Paperclip, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GenericTable, { type Column } from "@/components/table/generic-table";
import TableHeader from "@/components/table/table-header";

// Define your employee interface
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
  timeIn: string;
  timeOut: string;
  status: string;
}

export default function HrActiveEmployee() {
  // Toggle whether to show avatar alongside name
  const [showAvatar] = useState(true);

  // Status breakdown data
  const statusData = [
    { status: 'On time', percentage: 80, color: 'bg-blue-500' },
    { status: 'Late', percentage: 20, color: 'bg-yellow-500' },
    { status: 'On leave', percentage: 0, color: 'bg-gray-500' }
  ];

  const stats = { totalActive: 139, notLoggedIn: 7, onLeave: 2 };



  // Sample employee data
  const employeeData: Employee[] = Array.from({ length: stats.totalActive }, (_, i) => ({
    id: i + 1,
    name: `First Name Last Name${i + 1}`,
    email: `First Name Last Name${i + 1}@gmail.com`,
    department: ['IT', 'Human Resources', 'Finance'][i % 3],
    avatarUrl: undefined, // replace with real URL if available
    timeIn: '8:00 AM',
    timeOut: '5:00 PM',
    status: i % 5 === 0 ? 'Late' : 'On time',
  }));

  // Define columns for ReusableTable - note we're using the Column<T> interface
  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '35%',
      renderCell: (item: Employee) => (
        <div className="flex items-center space-x-3">
          {showAvatar && (
            <Avatar className="w-8 h-8">
              {item.avatarUrl ? (
                <AvatarImage src={item.avatarUrl} alt={item.name} />
              ) : (
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
          )}
          <span>{item.name}</span>
        </div>
      )
    },
    {
      key: 'department',
      header: 'Department',
      width: '20%',
      renderCell: (item: Employee) => {
        const colors: Record<string, string> = {
          'IT': 'bg-blue-100 text-blue-800 font-bold',
          'Human Resources': 'bg-pink-100 text-pink-800 font-bold',
          'Finance': 'bg-green-100 text-green-800 font-bold'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[item.department] || 'bg-gray-100 text-gray-800'}`}>
            {item.department}
          </span>
        );
      }
    },
    {
      key: 'timeIn',
      header: 'Time in',
      width: '15%',
      renderCell: (item: Employee) => (
        <div className="flex items-center">
          <Clock size={15} className="mr-1" />
          {item.timeIn}
        </div>
      )
    },
    {
      key: 'timeOut',
      header: 'Time out',
      width: '15%',
      renderCell: (item: Employee) => (
        <div className="flex items-center">
          <Clock size={15} className="mr-1" />
          {item.timeOut}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      renderCell: (item: Employee) => {
        const statusColor =
          item.status === 'On time' ? 'bg-blue-500' :
            item.status === 'Late' ? 'bg-yellow-500' :
              'bg-gray-500';

        return (
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full ${statusColor} mr-2`} />
            {item.status}
          </div>
        );
      }
    }
  ];

  // Custom actions for employee rows
  const renderActions = (_item: Employee) => (
    <div className="flex justify-end space-x-4">
      <button className="text-gray-500 hover:text-gray-700">
        <Paperclip size={16} />
      </button>
      <button className="text-gray-500 hover:text-gray-700">
        <Eye size={16} />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header section matching the image layout exactly */}
      <div className="">
        <div className="flex justify-between items-start">
          {/* Left side - Title and Date */}
          <TableHeader title="Active Employees" />

          {/* Right side - Stats */}
          <div className="text-right">
            <div className="flex space-x-12">
              {/* Total Active */}
              <div>
                <p className="text-xs text-gray-500">Total Active</p>
                <p className="text-sm font-bold">{stats.totalActive} emp.</p>
              </div>

              {/* Not Yet Logged In */}
              <div>
                <p className="text-xs text-gray-500">Not Yet Logged In</p>
                <p className="text-sm font-bold">{stats.notLoggedIn} emp.</p>
              </div>
            </div>

            {/* On Leave - positioned below */}
            <div className="mt-4">
              <p className="text-xs text-gray-500">On Leave</p>
              <p className="text-sm font-bold">{stats.onLeave} emp.</p>
            </div>
          </div>
        </div>

        {/* Horizontal line separator */}
        <div className="border-t border-gray-300 "></div>

        {/* Status indicators in a pill/rounded box as shown in the image */}
        <div className="inline-flex items-center bg-gray-200 px-3 py-1 rounded-full">
          {statusData.map((item) => (
            <div key={item.status} className="flex items-center mr-8">
              <div className={`h-3 w-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-sm font-medium">{item.status} {item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Using our reusable table component */}
      <GenericTable
        data={employeeData}
        columns={columns}
        searchPlaceholder="Search employees..."
        showActions={true}
        renderActions={renderActions}
        initialRowsPerPage={7}
        rowsPerPageOptions={[7, 25, 50, 100]}
      />
    </div>
  );
}