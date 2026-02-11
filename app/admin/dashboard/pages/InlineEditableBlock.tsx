"use client";

import { useRef, useEffect, useCallback, useState, memo } from "react";
import { PageBlock } from "@/types/page-builder";
import BlockRenderer from "@/components/page-builder/BlockRenderer";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import {
  INLINE_EDITABLE_FIELDS,
  ARRAY_EDITABLE_FIELDS,
  getSelectorsForField,
} from "./inline-editing-config";

interface InlineEditableBlockProps {
  block: PageBlock;
  isEditing: boolean; // Block is selected for editing
  isPreviewMode?: boolean; // True when in preview mode (no edit hints)
  onUpdate: (updates: Partial<PageBlock>) => void;
  onChildClick?: (
    e: MouseEvent,
    element: HTMLElement,
    childType: string,
    index: number,
    arrayField: string,
  ) => void;
  styleMode?: boolean;
  onStyleModeChange?: (active: boolean) => void;
}

// Type for inline handlers stored on elements
interface InlineHandlers {
  inputHandler: (e: Event) => void;
  blurHandler: () => void;
  keyDownHandler: (e: Event) => void;
  focusHandler: () => void;
  mouseEnterHandler: () => void;
  mouseLeaveHandler: () => void;
}

// Extended HTMLElement with handlers
interface EditableHTMLElement extends HTMLElement {
  _inlineHandlers?: InlineHandlers;
}

/**
 * Get nested value from object using dot-path (e.g., "items.0.title")
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let value: unknown = obj;
  for (const part of parts) {
    if (value && typeof value === "object") {
      value = (value as Record<string, unknown>)[part];
    } else {
      return "";
    }
  }
  return String(value || "");
}

/**
 * Set nested value in object using dot-path, returns new object.
 * Special handling for string array items: converts them to objects with text property.
 */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: string,
): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(obj));
  const parts = path.split(".");
  let current: Record<string, unknown> = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = isNaN(Number(parts[i + 1])) ? {} : [];
    }
    
    // Handle string array items - convert to object when trying to set a property
    const currentValue = current[part];
    if (typeof currentValue === "string" && !isNaN(Number(parts[i + 1]))) {
      // This is an array of strings, we don't need to convert
      current = current[part] as Record<string, unknown>;
    } else if (Array.isArray(currentValue)) {
      // Check if we're setting a property on a string array item
      const nextIndex = Number(parts[i + 1]);
      if (!isNaN(nextIndex) && typeof currentValue[nextIndex] === "string") {
        // Keep it as a string array for now, we'll handle the final value
        current = current[part] as Record<string, unknown>;
      } else {
        current = current[part] as Record<string, unknown>;
      }
    } else {
      current = current[part] as Record<string, unknown>;
    }
  }
  
  // If the last part is an index setting a property on a string, handle specially
  const finalPart = parts[parts.length - 1];
  const secondLastPart = parts.length >= 2 ? parts[parts.length - 2] : null;
  
  // Check if we're setting text on a string array item
  if (secondLastPart && !isNaN(Number(secondLastPart)) && finalPart === "text") {
    // The parent is an array index, check if the item is a string
    const arrayIndex = Number(secondLastPart);
    if (typeof current[arrayIndex] === "string") {
      // Convert string to object with text property
      current[arrayIndex] = { text: value };
      return result;
    }
  }
  
  current[finalPart] = value;
  return result;
}

/**
 * Apply editable styling and event listeners to an element
 */
function makeElementEditable(
  el: HTMLElement,
  fieldPath: string,
  handlers: {
    onInput: (e: Event) => void;
    onBlur: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onFocus: () => void;
  },
): void {
  if (el.getAttribute("data-inline-editable")) return;

  const htmlEl = el as EditableHTMLElement;

  // Mark as editable
  htmlEl.setAttribute("data-inline-editable", fieldPath);
  htmlEl.setAttribute("contenteditable", "true");
  htmlEl.setAttribute("spellcheck", "false");

  // Apply editing styles
  Object.assign(htmlEl.style, {
    outline: "none",
    cursor: "text",
    borderRadius: "4px",
    transition: "box-shadow 0.15s ease",
  });

  // Create handlers
  const inlineHandlers: InlineHandlers = {
    inputHandler: (e) => handlers.onInput(e),
    blurHandler: () => {
      htmlEl.style.boxShadow = "";
      handlers.onBlur();
    },
    keyDownHandler: (e) => handlers.onKeyDown(e as KeyboardEvent),
    focusHandler: () => {
      handlers.onFocus();
      htmlEl.style.boxShadow =
        "0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.2)";
    },
    mouseEnterHandler: () => {
      if (!htmlEl.matches(":focus")) {
        htmlEl.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.3)";
      }
    },
    mouseLeaveHandler: () => {
      if (!htmlEl.matches(":focus")) {
        htmlEl.style.boxShadow = "";
      }
    },
  };

  // Attach listeners
  htmlEl.addEventListener("input", inlineHandlers.inputHandler);
  htmlEl.addEventListener("blur", inlineHandlers.blurHandler);
  htmlEl.addEventListener("keydown", inlineHandlers.keyDownHandler);
  htmlEl.addEventListener("focus", inlineHandlers.focusHandler);
  htmlEl.addEventListener("mouseenter", inlineHandlers.mouseEnterHandler);
  htmlEl.addEventListener("mouseleave", inlineHandlers.mouseLeaveHandler);

  // Store for cleanup
  htmlEl._inlineHandlers = inlineHandlers;
}

/**
 * Remove editable styling and event listeners from an element
 */
function cleanupEditableElement(el: HTMLElement): void {
  const htmlEl = el as EditableHTMLElement;
  const handlers = htmlEl._inlineHandlers;

  if (handlers) {
    htmlEl.removeEventListener("input", handlers.inputHandler);
    htmlEl.removeEventListener("blur", handlers.blurHandler);
    htmlEl.removeEventListener("keydown", handlers.keyDownHandler);
    htmlEl.removeEventListener("focus", handlers.focusHandler);
    htmlEl.removeEventListener("mouseenter", handlers.mouseEnterHandler);
    htmlEl.removeEventListener("mouseleave", handlers.mouseLeaveHandler);
  }

  htmlEl.removeAttribute("data-inline-editable");
  htmlEl.removeAttribute("contenteditable");
  htmlEl.removeAttribute("spellcheck");
  Object.assign(htmlEl.style, {
    outline: "",
    cursor: "",
    borderRadius: "",
    transition: "",
    boxShadow: "",
  });

  delete htmlEl._inlineHandlers;
}

/**
 * Block ALL interactive elements (links, buttons, forms, clickable cards) in edit mode
 * Prevents navigation, form submission, and other default behaviors
 * BUT allows click events to bubble up for block selection
 */
function blockInteractiveElements(container: HTMLElement): () => void {
  // Store original href values to restore later
  const disabledLinks: Map<HTMLAnchorElement, string> = new Map();

  // Find ALL links and disable them by removing href temporarily
  const allLinks = container.querySelectorAll<HTMLAnchorElement>("a[href]");
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      disabledLinks.set(link, href);
      link.removeAttribute("href");
      link.setAttribute("data-disabled-href", href);
      link.style.cursor = "default";
    }
  });

  // Handler to prevent default actions but ALLOW propagation for block selection
  const clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // If clicking on an editable element, allow it (for text editing)
    if (target.getAttribute("contenteditable") === "true") {
      // Still prevent default to avoid any link/button behavior
      e.preventDefault();
      return;
    }

    // Check if clicking on or inside ANY interactive elements
    const interactiveElement = target.closest(
      'a, button, [role="button"], form, [onclick], [data-disabled-href], ' +
        '[data-child-type], .cursor-pointer, [class*="clickable"]',
    );

    // Always prevent default for any element in edit mode
    // This stops links, buttons, form submissions, etc.
    e.preventDefault();

    // DO NOT stopPropagation - we want the click to bubble up to select the block

    // If there's an editable child and the element is an interactive one, focus it
    if (interactiveElement) {
      const editableChild = interactiveElement.querySelector(
        '[contenteditable="true"]',
      ) as HTMLElement;
      if (editableChild) {
        const closestEditable = target.closest(
          '[contenteditable="true"]',
        ) as HTMLElement;
        if (closestEditable) {
          closestEditable.focus();
        } else {
          editableChild.focus();
        }
      } else if (
        interactiveElement.getAttribute("contenteditable") === "true"
      ) {
        (interactiveElement as HTMLElement).focus();
      }
    }
  };

  // Handler to prevent form submissions
  const submitHandler = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handler to prevent keyboard navigation (Enter on links/buttons)
  const keyDownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    // If pressing Enter on a link/button that's not being edited, prevent default
    if (e.key === "Enter" && !target.getAttribute("contenteditable")) {
      const interactiveElement = target.closest('a, button, [role="button"]');
      if (interactiveElement) {
        e.preventDefault();
        // Don't stop propagation on keydown - allow it to bubble
      }
    }
  };

  // Block accordion and tabs toggle buttons but allow click to bubble
  const buttons = container.querySelectorAll<HTMLButtonElement>("button");
  const originalOnClicks: Map<
    HTMLButtonElement,
    ((e: MouseEvent) => void) | null
  > = new Map();
  buttons.forEach((btn) => {
    // Store and remove onclick handlers
    originalOnClicks.set(btn, btn.onclick as ((e: MouseEvent) => void) | null);
    btn.onclick = (e) => {
      e.preventDefault();
      // DO NOT stopPropagation - allow click to bubble for block selection
      // Focus editable child if exists
      const editable = btn.querySelector(
        '[contenteditable="true"]',
      ) as HTMLElement;
      if (editable) editable.focus();
    };
  });

  // Add listeners with capture phase to intercept before normal handlers
  container.addEventListener("click", clickHandler, true);
  container.addEventListener("submit", submitHandler, true);
  container.addEventListener("keydown", keyDownHandler, true);

  // Return cleanup function
  return () => {
    container.removeEventListener("click", clickHandler, true);
    container.removeEventListener("submit", submitHandler, true);
    container.removeEventListener("keydown", keyDownHandler, true);

    // Restore all disabled links
    disabledLinks.forEach((href, link) => {
      link.setAttribute("href", href);
      link.removeAttribute("data-disabled-href");
      link.style.cursor = "";
    });

    // Restore button onclick handlers
    originalOnClicks.forEach((handler, btn) => {
      btn.onclick = handler;
    });
  };
}

function InlineEditableBlock({
  block,
  isEditing, // Block is selected for inline editing
  isPreviewMode = false, // True when in preview mode (no edit hints)
  onUpdate,
  onChildClick,
  styleMode: externalStyleMode,
  onStyleModeChange,
}: InlineEditableBlockProps) {
  const { isEditing: isInEditMode } = usePageBuilder(); // Global edit mode
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [internalStyleMode, setInternalStyleMode] = useState(false);
  const pendingChangesRef = useRef<Map<string, string>>(new Map());

  // Combined style mode: external prop takes priority, otherwise use internal state
  const isStyleMode =
    externalStyleMode !== undefined ? externalStyleMode : internalStyleMode;

  // Toggle style mode
  const toggleStyleMode = useCallback(() => {
    const newValue = !isStyleMode;
    if (onStyleModeChange) {
      onStyleModeChange(newValue);
    } else {
      setInternalStyleMode(newValue);
    }
  }, [isStyleMode, onStyleModeChange]);

  // Save all pending changes
  const saveChanges = useCallback(() => {
    if (pendingChangesRef.current.size === 0) return;

    let content = block.content as Record<string, unknown>;
    pendingChangesRef.current.forEach((value, field) => {
      content = setNestedValue(content, field, value);
    });

    onUpdate({ content });
    pendingChangesRef.current.clear();
  }, [block.content, onUpdate]);

  // Determine if a field supports multiline editing (Enter key creates new line)
  const isMultilineField = useCallback((field: string): boolean => {
    const lastPart = field.split(".").pop() || "";
    // Fields that commonly need line breaks
    const multilineFields = [
      "text", // General text content
      "description", // Descriptions
      "content", // Rich content
      "answer", // FAQ answers
      "bio", // Biographies
      "quote", // Quotes/testimonials
      "address", // Addresses often have multiple lines
      "subtitle", // Subtitles can be multi-line
      "paragraph", // Paragraphs
      "body", // Body text
      "message", // Messages
      "details", // Details
      "notes", // Notes
    ];
    return multilineFields.includes(lastPart);
  }, []);

  // Block ALL interactive elements when in edit mode (even if block is not selected)
  // This prevents navigation when clicking on cards, links, buttons etc.
  useEffect(() => {
    if (!containerRef.current || !isInEditMode) return;

    const container = containerRef.current;
    const cleanupInteractiveBlock = blockInteractiveElements(container);

    return cleanupInteractiveBlock;
  }, [isInEditMode]);

  // Setup editable elements (only when block is selected)
  useEffect(() => {
    if (!containerRef.current || !isEditing) return;

    const container = containerRef.current;
    const content = block.content as Record<string, unknown>;

    // Cleanup existing editables
    container
      .querySelectorAll<HTMLElement>("[data-inline-editable]")
      .forEach(cleanupEditableElement);

    // Create handlers for a field
    const createHandlers = (fieldPath: string) => ({
      onInput: (e: Event) => {
        const target = e.target as HTMLElement;
        // Use innerText to preserve line breaks (converts <br> to \n)
        pendingChangesRef.current.set(fieldPath, target.innerText || "");
      },
      onBlur: () => {
        setActiveField(null);
        saveChanges();
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          const target = e.target as HTMLElement;
          // Restore original content with line breaks
          const originalValue = getNestedValue(content, fieldPath);
          target.innerText = originalValue;
          pendingChangesRef.current.delete(fieldPath);
          target.blur();
        } else if (e.key === "Enter") {
          if (isMultilineField(fieldPath)) {
            // Allow Enter for multiline fields - insert line break
            // Don't prevent default, let browser handle it naturally
          } else {
            // For single-line fields, blur on Enter
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
        }
      },
      onFocus: () => setActiveField(fieldPath),
    });

    // Find element by selector and text content
    const findElementByText = (
      parent: Element,
      selector: string,
      text: string,
    ): HTMLElement | null => {
      const elements = parent.querySelectorAll<HTMLElement>(selector);
      for (const el of elements) {
        if (
          el.textContent?.trim() === text.trim() &&
          !el.getAttribute("data-inline-editable")
        ) {
          return el;
        }
      }
      return null;
    };

    // Setup a single field
    const setupField = (fieldPath: string, textValue: string) => {
      const selectors = getSelectorsForField(fieldPath.split(".").pop() || "");

      for (const selector of selectors.split(", ")) {
        const el = findElementByText(container, selector.trim(), textValue);
        if (el) {
          makeElementEditable(el, fieldPath, createHandlers(fieldPath));
          return;
        }
      }
    };

    // 1. Setup simple editable fields
    const editableFields = INLINE_EDITABLE_FIELDS[block.type] || [];
    editableFields.forEach((field) => {
      const value = content[field];
      if (value && typeof value === "string") {
        setupField(field, value);
      }
    });

    // 2. Setup array-based editable fields
    const arrayConfigs = ARRAY_EDITABLE_FIELDS[block.type] || [];
    arrayConfigs.forEach(({ arrayField, textFields }) => {
      const rawItems = content[arrayField];
      if (!rawItems || !Array.isArray(rawItems) || !rawItems.length) return;

      rawItems.forEach((item: unknown, index: number) => {
        // Handle both string items and object items
        if (typeof item === "string") {
          // For string items, use "text" as the field path
          const fieldPath = `${arrayField}.${index}.text`;
          
          // Find the element with this index and set up editing
          const itemContainer = container.querySelector(
            `[data-item-index="${index}"]`,
          );
          
          if (itemContainer) {
            // Try data-field="text" first
            const dataFieldEl = itemContainer.querySelector<HTMLElement>(
              `[data-field="text"]`,
            );
            if (dataFieldEl && !dataFieldEl.getAttribute("data-inline-editable")) {
              makeElementEditable(dataFieldEl, fieldPath, createHandlers(fieldPath));
              return;
            }
            
            // Fallback to matching text content
            const selectors = getSelectorsForField("text");
            for (const selector of selectors.split(", ")) {
              const el = findElementByText(itemContainer, selector.trim(), item);
              if (el) {
                makeElementEditable(el, fieldPath, createHandlers(fieldPath));
                return;
              }
            }
          }
          return;
        }
        
        // Object items - handle each text field
        const objectItem = item as Record<string, unknown>;
        textFields.forEach((textField) => {
          const value = objectItem[textField];
          if (!value || typeof value !== "string") return;

          const fieldPath = `${arrayField}.${index}.${textField}`;

          // Try data-item-index containers first (most accurate)
          const itemContainer = container.querySelector(
            `[data-item-index="${index}"]`,
          );

          if (itemContainer) {
            // Try data-field attribute first
            const dataFieldEl = itemContainer.querySelector<HTMLElement>(
              `[data-field="${textField}"]`,
            );
            if (
              dataFieldEl &&
              !dataFieldEl.getAttribute("data-inline-editable")
            ) {
              makeElementEditable(
                dataFieldEl,
                fieldPath,
                createHandlers(fieldPath),
              );
              return;
            }

            // Fallback to selectors within item
            const selectors = getSelectorsForField(textField);
            for (const selector of selectors.split(", ")) {
              const el = findElementByText(
                itemContainer,
                selector.trim(),
                value,
              );
              if (el) {
                makeElementEditable(el, fieldPath, createHandlers(fieldPath));
                return;
              }
            }
          } else {
            // Fallback: search entire container
            setupField(fieldPath, value);
          }
        });
      });
    });

    // Cleanup on unmount
    return () => {
      container
        .querySelectorAll<HTMLElement>("[data-inline-editable]")
        .forEach(cleanupEditableElement);
    };
  }, [block, isEditing, saveChanges, isMultilineField]);

  // Save on unmount
  useEffect(() => {
    const pendingChanges = pendingChangesRef.current;
    return () => {
      if (pendingChanges.size > 0) {
        saveChanges();
      }
    };
  }, [saveChanges]);

  // Handle Alt+Click OR style mode click on child elements to open style editor
  useEffect(() => {
    if (!containerRef.current || !isEditing || !onChildClick) return;

    const container = containerRef.current;

    const handleClick = (e: MouseEvent) => {
      // Handle both Alt+Click and style mode click
      if (!e.altKey && !isStyleMode) return;

      // Find closest element with data-child-type
      const target = e.target as HTMLElement;
      const childElement = target.closest<HTMLElement>("[data-child-type]");

      if (!childElement) return;

      const childType = childElement.getAttribute("data-child-type");
      const itemIndex = childElement.getAttribute("data-item-index");

      if (!childType || itemIndex === null) return;

      // Get the arrayField for this child type from config
      const arrayConfigs = ARRAY_EDITABLE_FIELDS[block.type] || [];
      let arrayField = "items";
      for (const config of arrayConfigs) {
        if (config.childType === childType) {
          arrayField = config.arrayField;
          break;
        }
      }

      e.preventDefault();
      e.stopPropagation();

      onChildClick(
        e,
        childElement,
        childType,
        parseInt(itemIndex, 10),
        arrayField,
      );
    };

    container.addEventListener("click", handleClick, true);
    return () => container.removeEventListener("click", handleClick, true);
  }, [block.type, isEditing, onChildClick, isStyleMode]);

  // ALT key listener - toggle style mode on/off with single press
  useEffect(() => {
    if (!isEditing || !onChildClick) return;

    let altKeyHeld = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt" && !e.repeat && !altKeyHeld) {
        altKeyHeld = true;
        // Toggle style mode on ALT press
        toggleStyleMode();
        e.preventDefault(); // Prevent browser menu
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        altKeyHeld = false;
      }
    };

    // Also handle window blur (e.g., user alt-tabs away) - disable style mode
    const handleBlur = () => {
      if (isStyleMode && onStyleModeChange) {
        onStyleModeChange(false);
      } else if (isStyleMode) {
        setInternalStyleMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [
    isEditing,
    onChildClick,
    toggleStyleMode,
    isStyleMode,
    onStyleModeChange,
  ]);

  // Add CSS for style mode highlighting
  useEffect(() => {
    if (!isEditing) return;

    const styleId = "alt-mode-highlight-styles";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    if (isStyleMode) {
      styleEl.textContent = `
        [data-child-type] {
          position: relative;
          cursor: pointer !important;
          transition: all 0.15s ease !important;
        }
        [data-child-type]::after {
          content: '';
          position: absolute;
          inset: -2px;
          border: 2px dashed rgba(59, 130, 246, 0.4);
          border-radius: 4px;
          pointer-events: none;
          opacity: 1;
          transition: all 0.15s ease;
        }
        [data-child-type]:hover::after {
          border-color: rgb(59, 130, 246);
          border-style: solid;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        }
        [data-child-type]:hover {
          transform: scale(1.01);
        }
      `;
    } else {
      styleEl.textContent = "";
    }

    return () => {
      // Don't remove on unmount, just clear content
    };
  }, [isEditing, isStyleMode]);

  return (
    <div
      ref={containerRef}
      className={`relative group ${isStyleMode ? "style-mode-active" : ""}`}
    >
      <BlockRenderer block={block} />

      {/* Style mode indicator - fixed at top, clickable to exit */}
      {isEditing && isStyleMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={toggleStyleMode}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-medium">Mode Style Actif</span>
            <span className="text-blue-200 text-xs">Cliquez pour quitter</span>
          </button>
        </div>
      )}

      {/* Active field indicator */}
      {isEditing && activeField && (
        <div className="absolute -top-6 left-0 z-10 pointer-events-none">
          <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t shadow-sm font-medium">
            ✎ {activeField.split(".").pop()}
          </div>
        </div>
      )}

      {/* Edit hints - show only on hover, hide when block selected or in preview mode */}
      {!isEditing && !isStyleMode && !isPreviewMode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg backdrop-blur-sm">
            ✎ Cliquez pour éditer · Alt+Clic pour styler
          </div>
        </div>
      )}
    </div>
  );
}

// Custom comparison for memo - ensure content changes trigger re-render
function arePropsEqual(
  prevProps: InlineEditableBlockProps,
  nextProps: InlineEditableBlockProps
): boolean {
  // Always re-render if block id changes
  if (prevProps.block.id !== nextProps.block.id) return false;
  
  // Always re-render if block content changes (deep compare via JSON)
  if (JSON.stringify(prevProps.block.content) !== JSON.stringify(nextProps.block.content)) {
    return false;
  }
  
  // Always re-render if block styles change
  if (JSON.stringify(prevProps.block.styles) !== JSON.stringify(nextProps.block.styles)) {
    return false;
  }
  
  // Check other important props
  if (prevProps.isEditing !== nextProps.isEditing) return false;
  if (prevProps.isPreviewMode !== nextProps.isPreviewMode) return false;
  if (prevProps.styleMode !== nextProps.styleMode) return false;
  
  // If none of the above changed, consider props equal
  return true;
}

export default memo(InlineEditableBlock, arePropsEqual);
