"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { PageBlock } from "@/types/page-builder";
import BlockRenderer from "@/components/page-builder/BlockRenderer";

interface InlineEditableBlockProps {
  block: PageBlock;
  isEditing: boolean;
  onUpdate: (updates: Partial<PageBlock>) => void;
}

// Fields that can be inline-edited per block type
const INLINE_EDITABLE_FIELDS: Record<string, string[]> = {
  HERO: ["title", "subtitle", "buttonText"],
  TEXT: ["text"],
  HEADING: ["text"],
  PARAGRAPH: ["text"],
  BUTTON: ["text"],
  QUOTE: ["text", "author", "role"],
  IMAGE: ["caption"],
  STATS: [], // Complex items, handled in sidebar
  CARDS: [], // Complex items
  NEWSLETTER: ["title", "description", "buttonText"],
  CONTACT_FORM: ["title", "description", "submitText"],
  FAQ: [], // Complex items
  TEAM: [], // Complex items
  TESTIMONIALS: [], // Complex items
  PRICING: [], // Complex items
  FEATURES: [], // Complex items
  LINK_BLOCK: ["title", "description"],
  FILE: ["name", "description"],
};

export default function InlineEditableBlock({
  block,
  isEditing,
  onUpdate,
}: InlineEditableBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const pendingChangesRef = useRef<Map<string, string>>(new Map());

  // Get the content value for a field
  const getFieldValue = useCallback(
    (field: string): string => {
      const content = block.content as Record<string, unknown>;
      return String(content[field] || "");
    },
    [block.content],
  );

  // Save pending changes
  const saveChanges = useCallback(() => {
    if (pendingChangesRef.current.size === 0) return;

    const content = block.content as Record<string, unknown>;
    const updates: Record<string, unknown> = { ...content };

    pendingChangesRef.current.forEach((value, field) => {
      updates[field] = value;
    });

    onUpdate({ content: updates });
    pendingChangesRef.current.clear();
  }, [block.content, onUpdate]);

  // Handle input event for contentEditable elements
  const handleInput = useCallback((e: Event, field: string) => {
    const target = e.target as HTMLElement;
    const newValue = target.textContent || "";
    pendingChangesRef.current.set(field, newValue);
  }, []);

  // Handle blur - save changes
  const handleBlur = useCallback(
    (field: string) => {
      setActiveField(null);
      saveChanges();
    },
    [saveChanges],
  );

  // Handle keydown for special keys
  const handleKeyDown = useCallback(
    (e: KeyboardEvent, field: string) => {
      if (e.key === "Escape") {
        // Cancel editing, restore original value
        const target = e.target as HTMLElement;
        target.textContent = getFieldValue(field);
        pendingChangesRef.current.delete(field);
        target.blur();
      } else if (e.key === "Enter" && !e.shiftKey) {
        // Save and exit (except for multiline fields)
        const isMultiline = ["text", "description", "subtitle"].includes(field);
        if (!isMultiline) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }
    },
    [getFieldValue],
  );

  // Make elements editable based on block type
  useEffect(() => {
    if (!containerRef.current || !isEditing) return;

    const container = containerRef.current;
    const content = block.content as Record<string, unknown>;
    const editableFields = INLINE_EDITABLE_FIELDS[block.type] || [];

    // Cleanup any previously marked elements first
    const existingEditables = container.querySelectorAll(
      "[data-inline-editable]",
    );
    existingEditables.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const handlers = (
        htmlEl as unknown as {
          _inlineHandlers?: {
            inputHandler: (e: Event) => void;
            blurHandler: () => void;
            keyDownHandler: (e: Event) => void;
            focusHandler: () => void;
          };
        }
      )._inlineHandlers;

      if (handlers) {
        htmlEl.removeEventListener("input", handlers.inputHandler);
        htmlEl.removeEventListener("blur", handlers.blurHandler);
        htmlEl.removeEventListener("keydown", handlers.keyDownHandler);
        htmlEl.removeEventListener("focus", handlers.focusHandler);
      }

      htmlEl.removeAttribute("data-inline-editable");
      htmlEl.removeAttribute("contenteditable");
      htmlEl.removeAttribute("spellcheck");
    });

    // Helper to find and setup editable elements
    const setupEditableElement = (
      field: string,
      selector: string,
      textContent: string,
    ) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el) => {
        const matchText = el.textContent?.trim() === textContent?.trim();
        if (matchText && !el.getAttribute("data-inline-editable")) {
          const htmlEl = el as HTMLElement;

          // Mark as editable
          htmlEl.setAttribute("data-inline-editable", field);
          htmlEl.setAttribute("contenteditable", "true");
          htmlEl.setAttribute("spellcheck", "false");

          // Add styling
          htmlEl.style.outline = "none";
          htmlEl.style.cursor = "text";
          htmlEl.style.borderRadius = "4px";
          htmlEl.style.transition = "box-shadow 0.15s ease";

          // Hover effect
          const addHoverStyle = () => {
            if (!htmlEl.matches(":focus")) {
              htmlEl.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.3)";
            }
          };
          const removeHoverStyle = () => {
            if (!htmlEl.matches(":focus")) {
              htmlEl.style.boxShadow = "";
            }
          };
          htmlEl.addEventListener("mouseenter", addHoverStyle);
          htmlEl.addEventListener("mouseleave", removeHoverStyle);

          // Event handlers
          const inputHandler = (e: Event) => handleInput(e, field);
          const blurHandler = () => {
            htmlEl.style.boxShadow = "";
            handleBlur(field);
          };
          const keyDownHandler = (e: Event) =>
            handleKeyDown(e as KeyboardEvent, field);
          const focusHandler = () => {
            setActiveField(field);
            htmlEl.style.boxShadow =
              "0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.2)";
          };

          htmlEl.addEventListener("input", inputHandler);
          htmlEl.addEventListener("blur", blurHandler);
          htmlEl.addEventListener("keydown", keyDownHandler);
          htmlEl.addEventListener("focus", focusHandler);

          // Store handlers for cleanup
          type InlineHandlers = {
            inputHandler: (e: Event) => void;
            blurHandler: () => void;
            keyDownHandler: (e: Event) => void;
            focusHandler: () => void;
            addHoverStyle: () => void;
            removeHoverStyle: () => void;
          };
          const extendedEl = htmlEl as unknown as {
            _inlineHandlers: InlineHandlers;
          };
          extendedEl._inlineHandlers = {
            inputHandler,
            blurHandler,
            keyDownHandler,
            focusHandler,
            addHoverStyle,
            removeHoverStyle,
          };
        }
      });
    };

    // Setup based on content fields
    if (editableFields.includes("title") && content.title) {
      setupEditableElement(
        "title",
        "h1, h2, h3, h4, h5, h6",
        String(content.title),
      );
    }

    if (editableFields.includes("subtitle") && content.subtitle) {
      setupEditableElement("subtitle", "p", String(content.subtitle));
    }

    if (editableFields.includes("text") && content.text) {
      if (block.type === "HEADING") {
        setupEditableElement(
          "text",
          "h1, h2, h3, h4, h5, h6",
          String(content.text),
        );
      } else if (block.type === "QUOTE") {
        setupEditableElement(
          "text",
          "blockquote p, blockquote, q",
          String(content.text),
        );
      } else if (block.type === "BUTTON") {
        setupEditableElement("text", "button, a", String(content.text));
      } else {
        setupEditableElement("text", "p, span, div", String(content.text));
      }
    }

    if (editableFields.includes("description") && content.description) {
      setupEditableElement("description", "p", String(content.description));
    }

    if (editableFields.includes("buttonText") && content.buttonText) {
      setupEditableElement(
        "buttonText",
        "button, a",
        String(content.buttonText),
      );
    }

    if (editableFields.includes("author") && content.author) {
      setupEditableElement("author", "cite, span, p", String(content.author));
    }

    if (editableFields.includes("caption") && content.caption) {
      setupEditableElement(
        "caption",
        "figcaption, p, span",
        String(content.caption),
      );
    }

    // Cleanup function
    return () => {
      const editableElements = container.querySelectorAll(
        "[data-inline-editable]",
      );
      editableElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const handlers = (
          htmlEl as unknown as {
            _inlineHandlers?: {
              inputHandler: (e: Event) => void;
              blurHandler: () => void;
              keyDownHandler: (e: Event) => void;
              focusHandler: () => void;
              addHoverStyle: () => void;
              removeHoverStyle: () => void;
            };
          }
        )._inlineHandlers;

        if (handlers) {
          htmlEl.removeEventListener("input", handlers.inputHandler);
          htmlEl.removeEventListener("blur", handlers.blurHandler);
          htmlEl.removeEventListener("keydown", handlers.keyDownHandler);
          htmlEl.removeEventListener("focus", handlers.focusHandler);
          htmlEl.removeEventListener("mouseenter", handlers.addHoverStyle);
          htmlEl.removeEventListener("mouseleave", handlers.removeHoverStyle);
        }

        htmlEl.removeAttribute("data-inline-editable");
        htmlEl.removeAttribute("contenteditable");
        htmlEl.removeAttribute("spellcheck");
        htmlEl.style.outline = "";
        htmlEl.style.cursor = "";
        htmlEl.style.borderRadius = "";
        htmlEl.style.transition = "";
        htmlEl.style.boxShadow = "";
      });
    };
  }, [block, isEditing, handleInput, handleBlur, handleKeyDown]);

  // Save on unmount - capture ref value
  useEffect(() => {
    const pendingChanges = pendingChangesRef.current;
    return () => {
      if (pendingChanges.size > 0) {
        saveChanges();
      }
    };
  }, [saveChanges]);

  return (
    <div ref={containerRef} className="relative group">
      {/* Render the actual block */}
      <BlockRenderer block={block} />

      {/* Inline editing indicator */}
      {isEditing && activeField && (
        <div className="absolute -top-6 left-0 z-10 pointer-events-none">
          <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t shadow-sm font-medium">
            ✎ {activeField}
          </div>
        </div>
      )}

      {/* Hint for editable elements */}
      {isEditing && !activeField && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg backdrop-blur-sm">
            ✎ Cliquez sur le texte pour l&apos;éditer
          </div>
        </div>
      )}
    </div>
  );
}
