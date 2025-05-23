import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDepartments,
  usePositions,
} from "@/features/hr/_mutations/useDeptAndPositions";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  photo: z.any().optional(),
  contactNumber: z
    .string()
    .min(11, {
      message: "Contact number must be exactly 11 digits.",
    })
    .max(11, {
      message: "Contact number must be exactly 11 digits.",
    })
    .regex(/^09\d{9}$/, {
      message: "Contact number must start with 09 and be 11 digits.",
    }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select a gender.",
  }),
  birthdate: z.string().min(1, {
    message: "Birthdate is required.",
  }),
  departmentId: z.string().min(1, {
    message: "Department is required.",
  }),
  positionId: z.string().min(1, {
    message: "Position is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const AddEmployeeForm = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();
  const { data: positions, isLoading: isPositionsLoading } = usePositions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      address: "",
      gender: undefined,
      birthdate: "",
      departmentId: "10", // Default to HR department
      positionId: "",
    },
  });

  const selectedDepartmentId = form.watch("departmentId");

  // Filter positions based on selected department
  const filteredPositions = useMemo(() => {
    if (!positions || !selectedDepartmentId) return [];
    return positions.filter(
      (position) => position.department_id.toString() === selectedDepartmentId,
    );
  }, [positions, selectedDepartmentId]);

  const handleSubmit = (values: FormValues) => {
    console.log("Submitted form data:", {
      ...values,
      photo: selectedPhoto,
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
    }
  };

  // Handle department change to reset position
  const handleDepartmentChange = (value: string) => {
    form.setValue("departmentId", value);
    form.setValue("positionId", ""); // Reset position when department changes
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-8"
      >
        {/* Basic Info Category */}
        <div className="grid grid-cols-[0.4fr_1fr] gap-8">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Basic Info</h3>
            <p className="text-muted-foreground text-sm">
              Start by identifying the employee with their core personal
              details.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter  first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="border-muted-foreground/50 bg-muted/20 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed">
                {selectedPhoto ? (
                  <img
                    src={URL.createObjectURL(selectedPhoto)}
                    alt="Preview"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <Upload className="text-muted-foreground h-8 w-8" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                Upload Photo
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Details Category */}
        <div className="grid grid-cols-[0.4fr_1fr] gap-8">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Contact Details</h3>
            <p className="text-muted-foreground text-sm">
              Essential for records and HR follow-ups.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="09XXXXXXXXX"
                      maxLength={11}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Complete address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Demographics Category */}
        <div className="grid grid-cols-[0.4fr_1fr] gap-8">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Demographics</h3>
            <p className="text-muted-foreground text-sm">
              Required for HR analytics and regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthdate</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Organizational Assignment Category */}
        <div className="grid grid-cols-[0.4fr_1fr] gap-8">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Organizational Assignment</h3>
            <p className="text-muted-foreground text-sm">
              Define the employee's role and department within the organization.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={handleDepartmentChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isDepartmentsLoading ? (
                        <SelectItem value="" disabled>
                          Loading departments...
                        </SelectItem>
                      ) : (
                        departments?.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="positionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={
                      !selectedDepartmentId || filteredPositions.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            !selectedDepartmentId
                              ? "Select department first"
                              : filteredPositions.length === 0
                                ? "No positions available"
                                : "Select position"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isPositionsLoading ? (
                        <SelectItem value="" disabled>
                          Loading positions...
                        </SelectItem>
                      ) : (
                        filteredPositions.map((position) => (
                          <SelectItem
                            key={position.id}
                            value={position.id.toString()}
                          >
                            {position.title} - {position.level}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit" variant="default">
            Add Employee
          </Button>
        </div>
      </form>
    </Form>
  );
};
