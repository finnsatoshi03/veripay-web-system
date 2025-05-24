import { useState } from "react";
import { Camera, Upload, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileUpload } from "@/hooks/useProfileUpload";
import { cn } from "@/lib/utils";
import { defaultAvatars } from "@/lib/helpers/const";
import { useUserStore } from "@/store/userStore";

type ProfileImageSelectorProps = {
  currentImage?: string;
  fallbackText: string;
  size?: "sm" | "md" | "lg";
  showEditButton?: boolean;
  onImageChange?: (imageUrl: string) => void;
};

export const ProfileImageSelector = ({
  currentImage,
  fallbackText,
  size = "md",
  showEditButton = true,
  onImageChange,
}: ProfileImageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDefault, setSelectedDefault] = useState<string>("");

  const identityId = useUserStore((state) => state.identity_id);
  const role = useUserStore((state) => state.role);
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  const { uploadProfileImage, selectDefaultImage, isUploading } =
    useProfileUpload();

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-20 w-20",
    lg: "h-32 w-32",
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const imageUrl = await uploadProfileImage(file);
    if (imageUrl && onImageChange) {
      onImageChange(imageUrl);
      setIsOpen(false);
    }
  };

  // Handle default image selection
  const handleDefaultSelection = async () => {
    if (!selectedDefault) return;

    const success = await selectDefaultImage(selectedDefault);
    if (success && onImageChange) {
      onImageChange(selectedDefault);

      if (identityId) fetchUserData(identityId, role, true);

      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className={cn("", sizeClasses[size])}>
        <AvatarImage src={currentImage} />
        <AvatarFallback>
          <User className="text-muted-foreground h-8 w-8" />
          {fallbackText}
        </AvatarFallback>
      </Avatar>

      {showEditButton && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full p-0"
              variant="default"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Profile Image</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="default">Choose Default</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="border-muted-foreground/25 rounded-full border-2 border-dashed p-8 text-center">
                    <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                    <div className="mt-4">
                      <label
                        htmlFor="profile-upload"
                        className="text-primary hover:text-primary/80 cursor-pointer text-sm font-medium"
                      >
                        Click to upload
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <p className="text-muted-foreground mt-1 text-xs">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="default" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {defaultAvatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDefault(avatar)}
                      className={cn(
                        "relative rounded-full transition-all hover:scale-105",
                        selectedDefault === avatar
                          ? "ring-primary ring-2 ring-offset-2"
                          : "",
                      )}
                    >
                      <Avatar className="size-16">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  ))}
                </div>

                {selectedDefault && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDefault("")}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDefaultSelection}
                      disabled={isUploading}
                    >
                      {isUploading ? "Updating..." : "Select Image"}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
