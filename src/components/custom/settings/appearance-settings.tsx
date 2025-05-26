import { useState } from "react";
import { Palette, Monitor, Sun, Moon, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";

type Theme = "light" | "dark" | "system";

const themeOptions = [
  {
    id: "light" as Theme,
    label: "Light",
    description: "Clean and bright interface",
    icon: Sun,
    preview: "bg-white border-2",
  },
  {
    id: "dark" as Theme,
    label: "Dark",
    description: "Easy on the eyes in low light",
    icon: Moon,
    preview: "bg-gray-900 border-2",
  },
  {
    id: "system" as Theme,
    label: "System",
    description: "Matches your device settings",
    icon: Monitor,
    preview: "bg-gradient-to-br from-white to-gray-900 border-2",
  },
];

export const AppearanceSettings = () => {
  const { setTheme, theme } = useTheme();

  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    setTheme(theme);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-purple-100 p-2">
          <Palette className="size-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Appearance Settings</h2>
          <p className="text-muted-foreground text-sm">
            Customize the look and feel of your interface
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Preference</CardTitle>
          <CardDescription>
            Choose how the interface looks. You can switch between light, dark,
            or system preference.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedTheme === option.id;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50",
                  )}
                  onClick={() => handleThemeChange(option.id)}
                >
                  {/* Theme Preview */}
                  <div className="mb-3 flex justify-center">
                    <div className={cn("h-16 w-24 rounded-md", option.preview)}>
                      <div className="flex h-full items-center justify-center">
                        <Icon className="text-muted-foreground size-6" />
                      </div>
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="text-center">
                    <Label className="font-medium">{option.label}</Label>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {option.description}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-primary rounded-full p-1">
                        <div className="size-2 rounded-full bg-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="size-4" />
            Display Options
          </CardTitle>
          <CardDescription>
            Additional display preferences and accessibility options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Compact Mode</Label>
                <p className="text-muted-foreground text-xs">
                  Reduce spacing for a more compact interface
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">High Contrast</Label>
                <p className="text-muted-foreground text-xs">
                  Increase contrast for better accessibility
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Font Size</Label>
                <p className="text-muted-foreground text-xs">
                  Adjust text size throughout the interface
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
