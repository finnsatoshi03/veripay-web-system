import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Palette, User, Bell, Globe, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PasswordChangeForm } from "./password-change-form";
import { AppearanceSettings } from "./appearance-settings";

type SettingsTab =
  | "security"
  | "appearance"
  | "profile"
  | "notifications"
  | "language"
  | "help";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const settingsNavigation = [
  {
    id: "security" as SettingsTab,
    label: "Security",
    icon: Shield,
    description: "Password and security settings",
  },
  {
    id: "appearance" as SettingsTab,
    label: "Appearance",
    icon: Palette,
    description: "Theme and display preferences",
  },
  {
    id: "profile" as SettingsTab,
    label: "Profile",
    icon: User,
    description: "Personal information",
    disabled: true,
  },
  {
    id: "notifications" as SettingsTab,
    label: "Notifications",
    icon: Bell,
    description: "Email and push notifications",
    disabled: true,
  },
  {
    id: "language" as SettingsTab,
    label: "Language",
    icon: Globe,
    description: "Language and region",
    disabled: true,
  },
  {
    id: "help" as SettingsTab,
    label: "Help & Support",
    icon: HelpCircle,
    description: "Get help and contact support",
    disabled: true,
  },
];

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("security");

  const handleTabChange = (tab: SettingsTab) => {
    const navItem = settingsNavigation.find((item) => item.id === tab);
    if (!navItem?.disabled) {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "security":
        return <PasswordChangeForm />;
      case "appearance":
        return <AppearanceSettings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <HelpCircle className="text-muted-foreground size-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              This feature is currently under development and will be available
              in a future update.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[600px] max-w-4xl min-w-[800px] gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex h-full min-h-0 flex-1">
          {/* Sidebar Navigation */}
          <div className="bg-muted/30 w-64 border-r p-4">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isDisabled = item.disabled;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "h-auto w-full justify-start p-3 text-left",
                      isActive && "bg-border dark:bg-border",
                      isDisabled && "cursor-not-allowed opacity-50",
                    )}
                    onClick={() => handleTabChange(item.id)}
                    disabled={isDisabled}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-muted-foreground mt-0.5 text-xs">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="h-full min-h-0 flex-1 overflow-y-auto p-6">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
