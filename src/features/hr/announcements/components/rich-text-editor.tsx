import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your announcement...",
  className,
}: RichTextEditorProps) => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormatToggle = (formats: string[]) => {
    setSelectedFormats(formats);
  };

  const insertFormatting = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let replacement = "";

    switch (format) {
      case "bold":
        replacement = `**${selectedText}**`;
        break;
      case "italic":
        replacement = `*${selectedText}*`;
        break;
      case "underline":
        replacement = `__${selectedText}__`;
        break;
      case "list":
        replacement = selectedText ? `\n• ${selectedText}` : `\n• `;
        break;
      case "align-left":
        replacement = `\n<div align="left">${selectedText}</div>\n`;
        break;
      case "align-center":
        replacement = `\n<div align="center">${selectedText}</div>\n`;
        break;
      case "align-right":
        replacement = `\n<div align="right">${selectedText}</div>\n`;
        break;
      default:
        replacement = selectedText;
    }

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Reset selection after formatting
    setTimeout(() => {
      if (textarea) {
        const newPosition = start + replacement.length;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl+B for bold, Ctrl+I for italic, etc.
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          insertFormatting("bold");
          break;
        case "i":
          e.preventDefault();
          insertFormatting("italic");
          break;
        case "u":
          e.preventDefault();
          insertFormatting("underline");
          break;
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Formatting Toolbar */}
      <div className="border-input bg-background/50 flex items-center gap-2 rounded-lg border p-2">
        <ToggleGroup
          type="multiple"
          value={selectedFormats}
          onValueChange={handleFormatToggle}
          className="gap-1"
        >
          <ToggleGroupItem
            value="bold"
            aria-label="Bold"
            onClick={() => insertFormatting("bold")}
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Italic"
            onClick={() => insertFormatting("italic")}
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            aria-label="Underline"
            onClick={() => insertFormatting("underline")}
            size="sm"
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="border-border h-6 w-px bg-gray-300" />

        <ToggleGroup type="single" className="gap-1">
          <ToggleGroupItem
            value="align-left"
            aria-label="Align Left"
            onClick={() => insertFormatting("align-left")}
            size="sm"
          >
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="align-center"
            aria-label="Align Center"
            onClick={() => insertFormatting("align-center")}
            size="sm"
          >
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="align-right"
            aria-label="Align Right"
            onClick={() => insertFormatting("align-right")}
            size="sm"
          >
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Toggle
          value="list"
          aria-label="Bullet List"
          onClick={() => insertFormatting("list")}
          size="sm"
        >
          <List className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[200px] resize-none"
        tabIndex={0}
        aria-label="Announcement content"
      />

      {/* Preview */}
      {value && (
        <div className="border-input space-y-2 rounded-lg border p-4">
          <h4 className="text-sm font-medium">Preview:</h4>
          <div
            className="text-muted-foreground prose prose-sm max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: value
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/__(.*?)__/g, "<u>$1</u>")
                .replace(/\n• (.*?)(?=\n|$)/g, "<li>$1</li>")
                .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
                .replace(/\n/g, "<br>"),
            }}
          />
        </div>
      )}
    </div>
  );
};
