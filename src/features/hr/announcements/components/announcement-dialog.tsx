import { useState, useEffect } from "react";
import { Globe, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RichTextEditor } from "./rich-text-editor";
import {
  useRoles,
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "../mutations/useAnnouncements";
import type { AnnouncementWithDetails } from "@/services/hr/hr-announcement-service";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: AnnouncementWithDetails | null;
  userId?: number;
}

type FormData = {
  title: string;
  body: string;
  scope: "global" | "by role";
  target_role?: number;
};

export const AnnouncementDialog = ({
  open,
  onOpenChange,
  announcement,
  userId,
}: AnnouncementDialogProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    body: "",
    scope: "global",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const { data: rolesData } = useRoles();
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const isEditing = !!announcement;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Reset form when dialog opens/closes or announcement changes
  useEffect(() => {
    if (open) {
      if (announcement) {
        setFormData({
          title: announcement.title,
          body: announcement.body,
          scope: announcement.scope,
          target_role: announcement.target_role,
        });
      } else {
        setFormData({
          title: "",
          body: "",
          scope: "global",
        });
      }
      setErrors({});
    }
  }, [open, announcement]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.body.trim()) {
      newErrors.body = "Content is required";
    }

    if (formData.scope === "by role" && !formData.target_role) {
      newErrors.target_role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditing && announcement) {
        await updateMutation.mutateAsync({
          id: announcement.id,
          title: formData.title,
          body: formData.body,
          scope: formData.scope,
          target_role:
            formData.scope === "by role" ? formData.target_role : undefined,
          created_by: userId,
        });
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          body: formData.body,
          scope: formData.scope,
          target_role:
            formData.scope === "by role" ? formData.target_role : undefined,
          created_by: userId,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const handleScopeChange = (scope: string[]) => {
    const newScope = scope[0] as "global" | "by role";
    setFormData((prev) => ({
      ...prev,
      scope: newScope,
      target_role: newScope === "global" ? undefined : prev.target_role,
    }));

    // Clear role error when switching to global
    if (newScope === "global") {
      setErrors((prev) => ({ ...prev, target_role: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Announcement" : "Create New Announcement"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter announcement title..."
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title}</p>
            )}
          </div>

          {/* Scope Selection */}
          <div className="space-y-2">
            <Label>Scope *</Label>
            <ToggleGroup
              type="single"
              value={formData.scope}
              onValueChange={(value) => handleScopeChange([value])}
              className="w-fit justify-start gap-2"
            >
              <ToggleGroupItem
                value="global"
                aria-label="Global announcement"
                className="w-fit rounded-md"
              >
                <Globe className="mr-2 h-4 w-4" />
                Global
              </ToggleGroupItem>
              <ToggleGroupItem
                value="by role"
                aria-label="Role-specific announcement"
                className="min-w-fit rounded-md"
              >
                <Users className="mr-2 h-4 w-4" />
                Role-specific
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Role Selection (only when scope is "by role") */}
          {formData.scope === "by role" && (
            <div className="space-y-2">
              <Label htmlFor="target_role">Target Role *</Label>
              <Select
                value={formData.target_role?.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    target_role: Number(value),
                  }))
                }
              >
                <SelectTrigger
                  className={errors.target_role ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.data?.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.target_role && (
                <p className="text-destructive text-sm">{errors.target_role}</p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor
              value={formData.body}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, body: value }))
              }
              placeholder="Write your announcement content..."
              className={errors.body ? "border-destructive" : ""}
            />
            {errors.body && (
              <p className="text-destructive text-sm">{errors.body}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
