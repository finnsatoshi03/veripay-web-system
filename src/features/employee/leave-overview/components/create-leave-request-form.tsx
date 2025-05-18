import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInBusinessDays, format } from "date-fns";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronDown, Check } from "lucide-react";

// Define leave type as a union type
type LeaveType = "Vacation" | "Sick" | "Emergency" | "Bereavement";

// Form schema using Zod
const formSchema = z
  .object({
    leave_type: z.enum(["Vacation", "Sick", "Emergency", "Bereavement"], {
      required_error: "Please select a leave type.",
    }),
    start_date: z.date({
      required_error: "Start date is required.",
    }),
    end_date: z.date({
      required_error: "End date is required.",
    }),
    reason: z.string().min(10, {
      message: "Reason must be at least 10 characters.",
    }),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date >= data.start_date;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["end_date"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface CreateLeaveRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowance: {
    vacation: number;
    sick: number;
    emergency: number;
    bereavement: number;
  };
}

export const CreateLeaveRequestForm = ({
  open,
  onOpenChange,
  allowance,
}: CreateLeaveRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveSpan, setLeaveSpan] = useState(0);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leave_type: "Vacation",
      reason: "",
    },
  });

  // Calculate leave span when dates change
  const startDate = form.watch("start_date");
  const endDate = form.watch("end_date");

  useEffect(() => {
    if (startDate && endDate) {
      const span = differenceInBusinessDays(endDate, startDate) + 1;
      setLeaveSpan(span > 0 ? span : 0);
    }
  }, [startDate, endDate]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // For now, just log the values
      console.log("Submitted values:", values);

      // Close the dialog after successful submission
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveTypes = [
    { value: "Vacation", label: "Vacation" },
    { value: "Sick", label: "Sick" },
    { value: "Emergency", label: "Emergency" },
    { value: "Bereavement", label: "Bereavement" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span>Leave</span>
            <span>/</span>
            <span className="text-muted-foreground">New Request</span>
          </div>

          {/* Allowance Display */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Your Leave Allowance</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Vacation</p>
                <p className="text-xl font-bold">{allowance.vacation}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Sick</p>
                <p className="text-xl font-bold">{allowance.sick}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Emergency</p>
                <p className="text-xl font-bold">{allowance.emergency}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Bereavement</p>
                <p className="text-xl font-bold">{allowance.bereavement}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-[120px_1fr] gap-y-6">
                {/* Leave Type */}
                <div className="text-muted-foreground text-sm">Leave Type</div>
                <FormField
                  control={form.control}
                  name="leave_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? leaveTypes.find(
                                    (type) => type.value === field.value,
                                  )?.label
                                : "Select leave type"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search leave type..." />
                            <CommandEmpty>No leave type found.</CommandEmpty>
                            <CommandGroup>
                              {leaveTypes.map((type) => (
                                <CommandItem
                                  key={type.value}
                                  value={type.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "leave_type",
                                      type.value as LeaveType,
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      type.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {type.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Date */}
                <div className="text-muted-foreground text-sm">Start Date</div>
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[200px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <div className="text-muted-foreground text-sm">End Date</div>
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[200px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) =>
                              startDate ? date < startDate : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Leave Span */}
                <div className="text-muted-foreground text-sm">Leave Span</div>
                <div>
                  <p className="text-lg font-medium">
                    {leaveSpan} {leaveSpan === 1 ? "day" : "days"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Business days only (excludes weekends)
                  </p>
                </div>

                {/* Reason */}
                <div className="text-muted-foreground text-sm">Reason</div>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a reason for your leave request..."
                          className="min-h-[120px] resize-none border bg-transparent focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
