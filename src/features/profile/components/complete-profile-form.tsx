import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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
import { ProfileImageSelector } from "@/components/custom/profile-image-selector";
import type { UserProfile } from "@/store/userStore";
import { useUpdateProfile } from "@/features/profile/mutations/profile-service";

const formSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required." }),
  last_name: z.string().min(1, { message: "Last name is required." }),
  contact_number: z.string().min(1, { message: "Contact number is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  birth_date: z.string().min(1, { message: "Birth date is required." }),
  gender: z.string().min(1, { message: "Gender is required." }),
  profile_image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export type CompleteProfileFormProps = {
  profile: Partial<UserProfile> | null;
  userId: number;
  onSuccess: () => void;
};

export const CompleteProfileForm = ({
  profile,
  userId,
  onSuccess,
}: CompleteProfileFormProps) => {
  const [profileImage, setProfileImage] = useState<string>(
    profile?.profile_image || "",
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      contact_number: profile?.contact_number || "",
      address: profile?.address || "",
      birth_date: profile?.birth_date || "",
      gender: profile?.gender || "",
      profile_image: profile?.profile_image || "",
    },
  });

  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = (values: FormValues) => {
    updateProfileMutation.mutate(
      {
        userId,
        profileData: {
          ...values,
          profile_image: profileImage,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  const handleImageChange = (imageUrl: string) => {
    setProfileImage(imageUrl);
    form.setValue("profile_image", imageUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <p className="text-muted-foreground text-sm">
              Upload a photo or choose from our collection
            </p>
          </div>
          <ProfileImageSelector
            currentImage={profileImage}
            fallbackText={`${form.watch("first_name")?.[0] || ""}${form.watch("last_name")?.[0] || ""}`}
            size="lg"
            onImageChange={handleImageChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contact_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
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
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </Form>
  );
};
