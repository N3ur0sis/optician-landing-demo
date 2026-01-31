"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  PageBlock,
  BLOCK_DEFINITIONS,
  BlockStyles,
} from "@/types/page-builder";
import { BlockEditorProps } from "./types";
import ContentEditor from "./ContentEditor";
import StyleEditor from "./StyleEditor";
import SettingsEditor from "./SettingsEditor";

export default function BlockEditor({
  block,
  onUpdate,
  onClose,
}: BlockEditorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "settings">(
    "content",
  );
  const definition = BLOCK_DEFINITIONS.find((d) => d.type === block.type);

  const updateContent = (key: string, value: unknown) => {
    onUpdate({
      content: { ...block.content, [key]: value },
    });
  };

  const updateStyles = (key: string, value: unknown) => {
    onUpdate({
      styles: { ...block.styles, [key]: value },
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {definition?.label || block.type}
          </h3>
          <p className="text-xs text-gray-700">{definition?.description}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["content", "style", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "content"
              ? "Contenu"
              : tab === "style"
                ? "Style"
                : "Options"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "content" && (
          <ContentEditor block={block} updateContent={updateContent} />
        )}
        {activeTab === "style" && (
          <StyleEditor
            styles={block.styles as BlockStyles}
            updateStyles={updateStyles}
          />
        )}
        {activeTab === "settings" && (
          <SettingsEditor block={block} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

// Re-export types and components for convenience
export type {
  BlockEditorProps,
  ContentEditorProps,
  StyleEditorProps,
  SettingsEditorProps,
  SpacingValue,
} from "./types";
export {
  SPACING_OPTIONS,
  getSpacingPx,
  getSpacingValueFromIndex,
  getSpacingIndexFromValue,
  spacingToCss,
} from "./types";
export { default as ContentEditor } from "./ContentEditor";
export { default as StyleEditor } from "./StyleEditor";
export { default as SettingsEditor } from "./SettingsEditor";
export { default as SpacingEditor } from "./SpacingEditor";
export { default as SpacingOverlay } from "./SpacingOverlay";
