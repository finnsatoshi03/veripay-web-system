import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Define types for our data
type PayrollData = {
  status: string;
  statusColor: string;
  lastPayrollDate: string;
  employeesInQueue: number;
  payrollPeriod: string;
  nextPayrollDate: string;
  lateSubmissions: number;
  grossPay: number;
  chartData: {
    data: string;
    value: number;
    fill: string;
  }[];
};

// Mock data
const mockPayrollData: PayrollData = {
  status: "Upcoming",
  statusColor: "text-yellow-500",
  lastPayrollDate: "May 15, 2025",
  employeesInQueue: 208,
  payrollPeriod: "May 16 - 31, 2025",
  nextPayrollDate: "June 15, 2025",
  lateSubmissions: 10,
  grossPay: 1180000,
  chartData: [
    {
      data: "estimated deductions",
      value: 106000,
      fill: "var(--chart-2)",
    },
    { data: "estimated net pay", value: 1074000, fill: "var(--chart-1)" },
  ],
};

// Chart configuration
const chartConfig = {
  value: {
    label: "Gross Pay",
  },
  estimatedDeductions: {
    label: "Estimated Deductions",
    color: "var(--chart-2)",
  },
  estimatedNetPay: {
    label: "Estimated Net Pay",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Header component
const SummaryHeader = () => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">Payroll Summary</h2>
    <Link to="/hr/payroll-management">
      <Button variant="outline" size="sm">
        Go to Payroll
      </Button>
    </Link>
  </div>
);

// Payroll metrics grid
const PayrollMetrics = ({ data }: { data: PayrollData }) => (
  <div className="grid grid-cols-3 gap-4">
    <div>
      <p className="text-muted-foreground text-sm">Status</p>
      <p className={`text-2xl leading-none font-semibold ${data.statusColor}`}>
        {data.status}
      </p>
    </div>
    <div>
      <p className="text-muted-foreground text-sm">Last Payroll Date</p>
      <p className="text-2xl leading-none font-semibold">
        {data.lastPayrollDate}
      </p>
    </div>
    <div>
      <p className="text-muted-foreground text-sm">Employees In Queue</p>
      <p className="text-2xl leading-none font-semibold">
        {data.employeesInQueue}
      </p>
    </div>
    <div>
      <p className="text-muted-foreground text-sm">Payroll Period</p>
      <p className="text-2xl leading-none font-semibold">
        {data.payrollPeriod}
      </p>
    </div>
    <div>
      <p className="text-muted-foreground text-sm">Next Payroll Date</p>
      <p className="text-2xl leading-none font-semibold">
        {data.nextPayrollDate}
      </p>
    </div>
    <div>
      <p className="text-muted-foreground text-sm">Late Submissions</p>
      <p className="text-2xl leading-none font-semibold">
        {data.lateSubmissions}
      </p>
    </div>
  </div>
);

// PayrollChart component
const PayrollChart = ({
  data,
  totalGrossPay,
}: {
  data: PayrollData["chartData"];
  totalGrossPay: number;
}) => (
  <div className="grid grid-cols-4 gap-4">
    <ResponsiveContainer className="col-span-2">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="data"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalGrossPay.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground text-xs"
                      >
                        Gross Pay
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>

    <div className="flex flex-col justify-center gap-4">
      {data.map((item) => (
        <div key={item.data} className="flex flex-col">
          <div className="flex items-center gap-1">
            <div
              className="size-2.5 rounded"
              style={{ backgroundColor: item.fill }}
            />
            <p className="text-muted-foreground text-sm capitalize">
              {item.data.replace("estimated ", "")}
            </p>
          </div>
          <p className="text-2xl font-semibold">
            {item.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
    <div className="flex flex-col justify-center text-center">
      <p className="text-3xl leading-none font-semibold">
        {totalGrossPay.toLocaleString()}
      </p>
      <p className="text-muted-foreground text-sm">Gross Pay</p>
    </div>
  </div>
);

// Main component
export const PayrollSummary = () => {
  const data = mockPayrollData;

  const totalGrossPay = useMemo(() => {
    return data.grossPay;
  }, [data.grossPay]);

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader />
      <div className="bg-border -mx-2 h-px px-2" />
      <PayrollMetrics data={data} />
      <div className="bg-border -mx-2 h-px px-2" />
      <PayrollChart data={data.chartData} totalGrossPay={totalGrossPay} />
    </div>
  );
};
