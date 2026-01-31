'use client';

import { useState, CSSProperties } from 'react';
import { X } from 'lucide-react';
import { BlockStyles } from '@/types/page-builder';
import MediaPicker from '@/components/media/MediaPicker';
import { Field, CollapsibleSection } from './Field';
import { StyleEditorProps } from './types';
import SpacingEditor from './SpacingEditor';

// Animation Preview Component
function AnimationPreview({ animation, delay }: { animation: string; delay: number }) {
  const [key, setKey] = useState(0);
  
  const getAnimationStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      width: '60px',
      height: '40px',
      backgroundColor: '#3b82f6',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold',
      animationDelay: `${delay}ms`,
      animationDuration: '0.6s',
      animationFillMode: 'both',
    };
    
    switch (animation) {
      case 'fade-in':
        return { ...baseStyle, animation: `fadeIn 0.6s ease-out ${delay}ms both` };
      case 'slide-up':
        return { ...baseStyle, animation: `slideUp 0.6s ease-out ${delay}ms both` };
      case 'slide-left':
        return { ...baseStyle, animation: `slideLeft 0.6s ease-out ${delay}ms both` };
      case 'slide-right':
        return { ...baseStyle, animation: `slideRight 0.6s ease-out ${delay}ms both` };
      case 'scale':
        return { ...baseStyle, animation: `scaleIn 0.6s ease-out ${delay}ms both` };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div key={key} style={getAnimationStyle()}>Bloc</div>
      <button
        onClick={() => setKey(k => k + 1)}
        className="text-xs text-blue-600 hover:text-blue-800"
      >
        Rejouer
      </button>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default function StyleEditor({ styles, updateStyles }: StyleEditorProps) {
  // State to track current mode (persists through re-renders)
  const [widthMode, setWidthMode] = useState<'container' | 'custom'>(
    styles.widthPercent !== undefined && styles.widthPercent !== 100 ? 'custom' : 'container'
  );
  
  // Reset all size/layout settings
  const resetSizeLayout = () => {
    updateStyles('widthPercent', undefined);
    updateStyles('containerWidth', undefined);
    updateStyles('alignment', undefined);
    updateStyles('height', undefined);
    updateStyles('inline', undefined);
    updateStyles('verticalAlign', undefined);
    setWidthMode('container');
  };

  // Switch to container mode
  const switchToContainerMode = () => {
    setWidthMode('container');
    updateStyles('widthPercent', undefined);
  };

  // Switch to custom width mode
  const switchToCustomMode = () => {
    setWidthMode('custom');
    updateStyles('widthPercent', 50);
    updateStyles('containerWidth', undefined);
  };

  return (
    <div className="space-y-6">
      {/* SIZE & LAYOUT - Main section */}
      <CollapsibleSection title="Taille & Disposition" defaultOpen>
        <div className="space-y-4">
          {/* Mode selector */}
          <Field label="Mode de largeur">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={switchToContainerMode}
                className={`p-3 text-sm rounded-lg border-2 transition-all ${
                  widthMode === 'container'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="block font-medium">Conteneur</span>
                <span className="text-xs opacity-70">Largeur prédéfinie</span>
              </button>
              <button
                onClick={switchToCustomMode}
                className={`p-3 text-sm rounded-lg border-2 transition-all ${
                  widthMode === 'custom'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="block font-medium">Personnalisé</span>
                <span className="text-xs opacity-70">Largeur en %</span>
              </button>
            </div>
          </Field>

          {/* Container mode options */}
          {widthMode === 'container' && (
            <Field label="Largeur du conteneur">
              <select
                value={styles.containerWidth || 'WIDE'}
                onChange={(e) => updateStyles('containerWidth', e.target.value === 'WIDE' ? undefined : e.target.value)}
                className="input"
              >
                <option value="NARROW">Étroit (672px)</option>
                <option value="MEDIUM">Moyen (896px)</option>
                <option value="WIDE">Large (1152px) - Défaut</option>
                <option value="FULL">Plein (1280px)</option>
                <option value="EDGE">Bord à bord (100%)</option>
              </select>
            </Field>
          )}

          {/* Custom width mode options */}
          {widthMode === 'custom' && (
            <>
              <Field label="Largeur personnalisée">
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-1">
                    {[25, 33, 50, 66, 75, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateStyles('widthPercent', val === 100 ? undefined : val)}
                        className={`p-2 text-xs rounded border-2 transition-all ${
                          styles.widthPercent === val
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={styles.widthPercent || 100}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        updateStyles('widthPercent', val === 100 ? undefined : val);
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{styles.widthPercent || 100}%</span>
                  </div>
                </div>
              </Field>
              <Field label="Alignement horizontal">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'left', label: 'Gauche' },
                    { value: 'center', label: 'Centre' },
                    { value: 'right', label: 'Droite' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateStyles('alignment', opt.value === 'left' ? undefined : opt.value)}
                      className={`p-2 text-sm rounded border-2 transition-all ${
                        (styles.alignment || 'left') === opt.value
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
              <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={styles.inline || false}
                  onChange={(e) => updateStyles('inline', e.target.checked ? true : undefined)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">Affichage en ligne</span>
                  <p className="text-xs text-gray-600">Permet de placer plusieurs blocs côte à côte</p>
                </div>
              </label>
            </>
          )}

          {/* Reset button */}
          <button
            onClick={resetSizeLayout}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Réinitialiser taille et disposition
          </button>
        </div>
      </CollapsibleSection>

      {/* SPACING - Margins & Paddings - New Visual Editor */}
      <CollapsibleSection title="Espacements" defaultOpen>
        <SpacingEditor styles={styles} updateStyles={updateStyles} />
      </CollapsibleSection>

      {/* Apparence */}
      <CollapsibleSection title="Apparence">
        <div className="space-y-4">
          <Field label="Couleur de fond">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styles.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={styles.backgroundColor || ''}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                className="input flex-1 font-mono text-sm"
                placeholder="transparent"
              />
              {styles.backgroundColor && (
                <button
                  onClick={() => updateStyles('backgroundColor', undefined)}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </Field>
          <Field label="Image de fond">
            <MediaPicker
              value={styles.backgroundImage || ''}
              onChange={(url) => updateStyles('backgroundImage', url || undefined)}
              acceptTypes="image"
              placeholder="Sélectionner une image de fond"
              showPreview={true}
            />
          </Field>
          <Field label="Arrondi des coins">
            <select
              value={styles.borderRadius || 'none'}
              onChange={(e) => updateStyles('borderRadius', e.target.value === 'none' ? undefined : e.target.value)}
              className="input"
            >
              <option value="none">Aucun</option>
              <option value="sm">Petit (4px)</option>
              <option value="md">Moyen (8px)</option>
              <option value="lg">Grand (12px)</option>
              <option value="xl">Très grand (16px)</option>
              <option value="full">Rond</option>
            </select>
          </Field>
          <Field label="Ombre">
            <select
              value={styles.shadow || 'none'}
              onChange={(e) => updateStyles('shadow', e.target.value === 'none' ? undefined : e.target.value)}
              className="input"
            >
              <option value="none">Aucune</option>
              <option value="sm">Légère</option>
              <option value="md">Moyenne</option>
              <option value="lg">Forte</option>
              <option value="xl">Très forte</option>
            </select>
          </Field>
        </div>
      </CollapsibleSection>

      {/* Animation */}
      <CollapsibleSection title="Animation">
        <div className="space-y-4">
          <Field label="Type d'animation">
            <select
              value={styles.animation || 'none'}
              onChange={(e) => updateStyles('animation', e.target.value === 'none' ? undefined : e.target.value)}
              className="input"
            >
              <option value="none">Aucune</option>
              <option value="fade-in">Fondu</option>
              <option value="slide-up">Glissement haut</option>
              <option value="slide-left">Glissement gauche</option>
              <option value="slide-right">Glissement droite</option>
              <option value="scale">Zoom</option>
            </select>
          </Field>
          {styles.animation && styles.animation !== 'none' && (
            <>
              <Field label="Délai (ms)">
                <input
                  type="number"
                  value={styles.animationDelay || 0}
                  onChange={(e) => updateStyles('animationDelay', parseInt(e.target.value) || undefined)}
                  className="input"
                  min="0"
                  max="2000"
                  step="100"
                />
              </Field>
              {/* Animation Preview */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-500 mb-3">Aperçu de l&apos;animation</p>
                <AnimationPreview animation={styles.animation} delay={styles.animationDelay || 0} />
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Avancé */}
      <CollapsibleSection title="Avancé">
        <div className="space-y-4">
          <Field label="Classes CSS Tailwind">
            <input
              type="text"
              value={styles.customClass || ''}
              onChange={(e) => updateStyles('customClass', e.target.value || undefined)}
              className="input font-mono text-sm"
              placeholder="text-red-500 bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Classes Tailwind séparées par des espaces
            </p>
          </Field>
        </div>
      </CollapsibleSection>
    </div>
  );
}
