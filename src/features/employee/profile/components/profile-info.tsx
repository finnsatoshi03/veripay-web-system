import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helpers/formatters";
import {
  UserRound,
  Cake,
  MapPin,
  Mail,
  Phone,
  Pencil,
  Save,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { UserData } from "./profile-header";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  birth_date: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileInfoProps = {
  userData: UserData;
};

export const ProfileInfo = ({ userData }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      birth_date: userData.birth_date,
    },
  });

  const handleSubmit = (values: ProfileFormValues) => {
    console.log("Form values:", values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const { isDirty } = form.formState;

  if (isEditing) {
    return (
      <div className="space-y-4 rounded-lg border p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="mr-1 size-4" /> Cancel
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={!isDirty}
            >
              <Save className="mr-1 size-4" /> Save
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-xs font-medium uppercase">
                Basic Info
              </h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value.split("T")[0]}
                        />
                      </FormControl>
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
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-muted-foreground text-xs font-medium uppercase">
                Contacts
              </h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Profile</h2>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
          Edit <Pencil className="ml-1 size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-muted-foreground text-xs font-medium uppercase">
          Basic Info
        </h3>
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-1">
            <UserRound className="text-muted-foreground size-4" />{" "}
            {userData.name}
          </p>
          <p className="flex items-center gap-1">
            <Cake className="text-muted-foreground size-4" />{" "}
            {formatDate(userData.birth_date)}
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="text-muted-foreground size-4" />{" "}
            {userData.address}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-xs font-medium uppercase">
          Contacts
        </h3>
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-1">
            <Mail className="text-muted-foreground size-4" /> {userData.email}
          </p>
          <p className="flex items-center gap-1">
            <Phone className="text-muted-foreground size-4" /> {userData.phone}
          </p>
        </div>
      </div>
    </div>
  );
};
