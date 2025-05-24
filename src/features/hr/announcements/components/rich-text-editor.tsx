import { useState, useRef, useCallback, useEffect } from "react";
import { Bold, Italic, Underline, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  // handlers
  const updateActiveFormats = useCallback(() => {
    const formats: string[] = [];

    if (document.queryCommandState("bold")) {
      formats.push("bold");
    }
    if (document.queryCommandState("italic")) {
      formats.push("italic");
    }
    if (document.queryCommandState("underline")) {
      formats.push("underline");
    }
    if (document.queryCommandState("insertUnorderedList")) {
      formats.push("list");
    }

    setActiveFormats(formats);
  }, []);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      const editor = editorRef.current;
      if (editor) {
        editor.focus();
        handleContentChange();
        // Update active formats after command execution
        setTimeout(updateActiveFormats, 0);
      }
    },
    [updateActiveFormats],
  );

  const handleContentChange = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const content = editor.innerHTML;
    const textContent = editor.textContent || "";

    setIsEmpty(textContent.trim().length === 0);
    onChange(content);
  }, [onChange]);

  const insertFormatting = (format: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    switch (format) {
      case "bold":
        execCommand("bold");
        break;
      case "italic":
        execCommand("italic");
        break;
      case "underline":
        execCommand("underline");
        break;
      case "list":
        execCommand("insertUnorderedList");
        break;
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // shortcuts
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

      // auto-formatting
      if (e.key === " ") {
        const editor = editorRef.current;
        if (!editor) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        if (textNode.nodeType === Node.TEXT_NODE) {
          const text = textNode.textContent || "";
          const cursorPos = range.startOffset;
          const beforeCursor = text.substring(0, cursorPos);

          // auto bullet points
          if (beforeCursor.endsWith("-") || beforeCursor.endsWith("*")) {
            e.preventDefault();

            // remove the trigger character
            const newText =
              text.substring(0, cursorPos - 1) + text.substring(cursorPos);
            textNode.textContent = newText;

            // create bullet point
            execCommand("insertUnorderedList");
            return;
          }

          // auto bold **text**
          const boldMatch = beforeCursor.match(/\*\*([^*]+)$/);
          if (boldMatch && e.key === " ") {
            e.preventDefault();
            const matchStart = cursorPos - boldMatch[0].length;
            const matchEnd = cursorPos;

            // select the text including **
            range.setStart(textNode, matchStart);
            range.setEnd(textNode, matchEnd);
            selection.removeAllRanges();
            selection.addRange(range);

            // replace with bold text
            const textToFormat = boldMatch[1];
            document.execCommand("insertText", false, textToFormat);

            // make it bold
            range.setStart(textNode, matchStart);
            range.setEnd(textNode, matchStart + textToFormat.length);
            selection.removeAllRanges();
            selection.addRange(range);
            execCommand("bold");

            // move cursor after the bold text and add space
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("insertText", false, " ");
            return;
          }

          // auto italic *text*
          const italicMatch = beforeCursor.match(/\*([^*]+)$/);
          if (italicMatch && e.key === " " && !beforeCursor.includes("**")) {
            e.preventDefault();
            const matchStart = cursorPos - italicMatch[0].length;
            const matchEnd = cursorPos;

            range.setStart(textNode, matchStart);
            range.setEnd(textNode, matchEnd);
            selection.removeAllRanges();
            selection.addRange(range);

            const textToFormat = italicMatch[1];
            document.execCommand("insertText", false, textToFormat);

            range.setStart(textNode, matchStart);
            range.setEnd(textNode, matchStart + textToFormat.length);
            selection.removeAllRanges();
            selection.addRange(range);
            execCommand("italic");

            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("insertText", false, " ");
            return;
          }
        }
      }
    },
    [execCommand],
  );

  const handleSelectionChange = useCallback(() => {
    const editor = editorRef.current;
    if (
      !editor ||
      !document.activeElement ||
      !editor.contains(document.activeElement)
    ) {
      return;
    }
    updateActiveFormats();
  }, [updateActiveFormats]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      handleContentChange();
    },
    [handleContentChange],
  );

  // effects
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (value !== editor.innerHTML) {
      editor.innerHTML = value;
      setIsEmpty((editor.textContent || "").trim().length === 0);
    }
  }, [value]);

  useEffect(() => {
    // Listen for selection changes to update active formats
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Formatting Toolbar */}
      <div className="border-input bg-background/50 flex items-center gap-2 rounded-lg border p-2">
        <ToggleGroup type="multiple" value={activeFormats} className="gap-1">
          <ToggleGroupItem
            value="bold"
            aria-label="Bold (Ctrl+B or **text**)"
            onClick={() => insertFormatting("bold")}
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Italic (Ctrl+I or *text*)"
            onClick={() => insertFormatting("italic")}
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            aria-label="Underline (Ctrl+U)"
            onClick={() => insertFormatting("underline")}
            size="sm"
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="border-border h-6 w-px bg-gray-300" />

        <Toggle
          pressed={activeFormats.includes("list")}
          aria-label="Bullet List (- or *)"
          onClick={() => insertFormatting("list")}
          size="sm"
        >
          <List className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Rich Text Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className={cn(
            "border-input bg-background ring-offset-background focus-visible:ring-ring min-h-[200px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "prose prose-sm max-w-none [&_li]:my-1 [&_ul]:my-2 [&_ul]:pl-6",
            isEmpty && "text-muted-foreground",
          )}
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          suppressContentEditableWarning={true}
          tabIndex={0}
          aria-label="Rich text editor with auto-formatting"
          style={{ minHeight: "200px" }}
        />

        {isEmpty && (
          <div
            className="text-muted-foreground pointer-events-none absolute top-2 left-3 text-sm"
            aria-hidden="true"
          >
            {placeholder}
            <div className="mt-2 text-xs opacity-75">
              Auto-format with **bold**, *italic*, or - for bullets
            </div>
            <div className="text-xs opacity-75">
              Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, and
              - for bullet points
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
