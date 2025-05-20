import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Flag } from "lucide-react";

export type Priority = "high" | "normal" | "low";

export interface ReportCardProps {
    category?: string;
    title?: string;
    description?: string;
    assignee?: string;
    date?: string;
    priority?: Priority;
}

export default function ReportCard({
    category = "Payroll",
    title = "Unreflected Overtime",
    description = "Filed OT not reflected in timesheet. Needs update.",
    assignee,
    date = "04/18/2025",
    priority = "normal",
}: ReportCardProps) {
    const priorityStyles: Record<Priority, string> = {
        high: "text-red-500",
        normal: "text-amber-500",
        low: "text-green-500",
    };

    const priorityDisplay: Record<Priority, string> = {
        high: "High",
        normal: "Normal",
        low: "Low",
    };

    return (
        <Card className="w-full">
            <CardHeader className="">
                <Badge variant="outline" className="w-fit mb-2 bg-gray-300 text-gray-500">
                    <BarChart3 className="w-3 h-3 text-gray-500" />
                    {category}
                </Badge>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="">
                <p className="text-sm text-gray-500">{description}</p>
                {assignee && (
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500 mr-2">Assigned to</span>
                        <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback className="text-sm text-white">{assignee}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-xs text-gray-500">{date}</span>
                </div>

                <div className="flex items-center">
                    <Flag className={`h-4 w-4 mr-1 ${priorityStyles[priority as Priority]}`} />
                    <span className={`text-xs font-bold ${priorityStyles[priority as Priority]}`}>
                        {priorityDisplay[priority as Priority]}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}