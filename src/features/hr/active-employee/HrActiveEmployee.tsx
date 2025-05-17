import { useState } from "react";
import { Eye, Share2, Clock } from "lucide-react";
import DataTable from "@/components/custom/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HeaderSection from "@/components/custom/common/HeaderSection";

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

  const employeeData: Employee[] = Array.from({ length: stats.totalActive }, (_, i) => ({
    id: i + 1,
    name: `First Name Last Name`,
    email: `employee${i + 1}@company.com`,
    department: ['IT', 'Human Resources', 'Finance'][i % 3],
    avatarUrl: undefined, // replace with real URL if available
    timeIn: '8:00 AM',
    timeOut: '5:00 PM',
    status: 'On time',
  }));

  // Build columns: name column will include avatar if showAvatar, toggling both together
  const columns = [
    {
      key: 'name', header: 'Name', hidden: false,
      render: (item: Employee) => (
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
      key: 'department', header: 'Department',
      render: (item: Employee) => {
        const colors: Record<string, string> = {
          'IT': 'bg-blue-100 text-blue-800',
          'Human Resources': 'bg-pink-100 text-pink-800',
          'Finance': 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[item.department] || 'bg-gray-100 text-gray-800'}`}>{item.department}</span>
        );
      }
    },
    { key: 'timeIn', header: 'Time in', render: (item: Employee) => <><span className="mr-1">⏱️</span>{item.timeIn}</> },
    { key: 'timeOut', header: 'Time out', render: (item: Employee) => <><span className="mr-1">⏱️</span>{item.timeOut}</> },
    {
      key: 'status', header: 'Status',
      render: (item: Employee) => (
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
          {item.status}
        </div>
      )
    }
  ];

  const renderRowActions = (item: Employee) => (
    <div className="flex justify-end space-x-4">
      <button className="text-gray-500 hover:text-gray-700"><Eye size={16} /></button>
      <button className="text-gray-500 hover:text-gray-700"><Share2 size={16} /></button>
    </div>
  );

  return (
    <div className="px-4 pt-3 w-full">
      <div className="flex justify-between items-center">
        <HeaderSection title="Active Employee" />

        {/* Right side - Stats */}
        <div className="flex">
          {/* First column - Total Active and On Leave */}
          <div className="mr-12">
            {/* Total Active */}
            <div className="text-right mb-6">
              <p className="text-sm text-gray-500">Total Active</p>
              <p className="text-xl font-bold">{stats.totalActive} emp.</p>
            </div>

            {/* On Leave */}
            <div className="tex-left">
              <p className="text-sm text-gray-500">On Leave</p>
              <p className="text-xl font-bold">{stats.onLeave} emp.</p>
            </div>
          </div>

          {/* Second column - Not Yet Logged In */}
          <div className="text-right">
            <p className="text-sm text-gray-500">Not Yet Logged In</p>
            <p className="text-xl font-bold">{stats.notLoggedIn} emp.</p>
          </div>
        </div>
      </div>
      {/* Status indicators */}
      <div className="flex items-center">
        {statusData.map((item) => (
          <div key={item.status} className="flex items-center mr-8">
            <div className={`h-3 w-3 rounded-full ${item.color} mr-2`}></div>
            <span className="text-sm">{item.status} {item.percentage}%</span>
          </div>
        ))}
      </div>
      <div className="w-full border-t border-gray-200 my-4"></div>
      <DataTable
        data={employeeData}
        columns={columns}
        searchPlaceholder="Search active employees details"
        idKey="id"
        renderActions={renderRowActions}
      />
    </div>
  );
}
