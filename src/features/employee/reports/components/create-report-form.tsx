import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";

import { CategoryPopover } from "./category-popover";
import { ImportancePopover } from "./importance-popover";

// Form schema using Zod
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  importance: z.enum(["Low", "Medium", "High"], {
    required_error: "Please select the importance level.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateReportForm = ({
  open,
  onOpenChange,
}: CreateReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      importance: "Medium",
    },
  });

  const onSubmit = async (values: FormValues) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span>Reports</span>
            <span>/</span>
            <span className="text-muted-foreground">New Report</span>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title - Notion-like input */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        placeholder="Untitled Report"
                        className="placeholder:text-muted-foreground/50 w-full border-none bg-transparent p-0 text-3xl font-bold outline-none focus:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid grid-cols-[120px_1fr] gap-y-6">
                {/* Category */}
                <div className="text-muted-foreground text-sm">Category</div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CategoryPopover
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Importance */}
                <div className="text-muted-foreground text-sm">Importance</div>
                <FormField
                  control={form.control}
                  name="importance"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImportancePopover
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <div className="text-muted-foreground text-sm">Description</div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add a detailed description..."
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
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
