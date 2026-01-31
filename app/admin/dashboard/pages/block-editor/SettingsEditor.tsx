'use client';

import { PageBlock } from '@/types/page-builder';
import { Field } from './Field';
import { SettingsEditorProps } from './types';

export default function SettingsEditor({ block, onUpdate }: SettingsEditorProps) {
  const settings = block.settings as Record<string, unknown>;

  const updateSettings = (key: string, value: unknown) => {
    onUpdate({
      settings: { ...settings, [key]: value },
    });
  };

  return (
    <div className="space-y-4">
      <Field label="ID d'ancrage">
        <input
          type="text"
          value={(settings.anchorId as string) || ''}
          onChange={(e) => updateSettings('anchorId', e.target.value)}
          className="input"
          placeholder="mon-section"
        />
        <p className="text-xs text-gray-700 mt-1">
          Permet de créer un lien direct vers ce bloc (ex: #mon-section)
        </p>
      </Field>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={(settings.hideOnMobile as boolean) || false}
          onChange={(e) => updateSettings('hideOnMobile', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <span className="text-sm">Masquer sur mobile</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={(settings.hideOnTablet as boolean) || false}
          onChange={(e) => updateSettings('hideOnTablet', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <span className="text-sm">Masquer sur tablette</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={(settings.hideOnDesktop as boolean) || false}
          onChange={(e) => updateSettings('hideOnDesktop', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <span className="text-sm">Masquer sur bureau</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={block.visible}
          onChange={(e) => onUpdate({ visible: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300"
        />
        <span className="text-sm">Visible</span>
      </label>

      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg mt-4">
        <p className="font-medium mb-1">📱 Tailles d&apos;écran :</p>
        <ul className="space-y-0.5">
          <li>• Mobile : moins de 768px</li>
          <li>• Tablette : 768px - 1024px</li>
          <li>• Bureau : plus de 1024px</li>
        </ul>
      </div>
    </div>
  );
}
