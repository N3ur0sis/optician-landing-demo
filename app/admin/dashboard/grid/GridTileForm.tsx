'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GridTile } from './GridManagerClient';
import { AlertCircle } from 'lucide-react';

type GridTileFormProps = {
  tile: GridTile | null;
  onSave: (tile: Partial<GridTile>) => void;
  onClose: () => void;
};

type ValidationErrors = {
  title?: string;
  href?: string;
  backgroundUrl?: string;
  rowStart?: string;
};

export default function GridTileForm({ tile, onSave, onClose }: GridTileFormProps) {
  const [formData, setFormData] = useState({
    title: tile?.title || '',
    caption: tile?.caption || '',
    href: tile?.href || '/',
    backgroundUrl: tile?.backgroundUrl || '',
    colSpan: tile?.colSpan || 2,
    rowSpan: tile?.rowSpan || 1,
    colStart: tile?.colStart || 1,
    rowStart: tile?.rowStart || 1,
    overlayType: tile?.overlayType || 'DARK' as 'LIGHT' | 'DARK',
    published: tile?.published ?? true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string | number): string | undefined => {
    switch (name) {
      case 'title':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Le titre est requis';
        }
        if (typeof value === 'string' && value.trim().length < 2) {
          return 'Le titre doit contenir au moins 2 caractères';
        }
        if (typeof value === 'string' && value.trim().length > 100) {
          return 'Le titre ne peut pas dépasser 100 caractères';
        }
        break;
      
      case 'href':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Le lien est requis';
        }
        if (typeof value === 'string' && !value.startsWith('/') && !value.startsWith('http')) {
          return 'Le lien doit commencer par / ou http';
        }
        break;
      
      case 'backgroundUrl':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return "L'URL de l'image est requise";
        }
        if (typeof value === 'string' && !value.startsWith('http') && !value.startsWith('url(')) {
          return "L'URL doit commencer par http ou être un gradient CSS";
        }
        break;
      
      case 'rowStart':
        if (typeof value === 'number' && value < 1) {
          return 'La rangée de départ doit être au moins 1';
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    const titleError = validateField('title', formData.title);
    if (titleError) newErrors.title = titleError;
    
    const hrefError = validateField('href', formData.href);
    if (hrefError) newErrors.href = hrefError;
    
    const backgroundUrlError = validateField('backgroundUrl', formData.backgroundUrl);
    if (backgroundUrlError) newErrors.backgroundUrl = backgroundUrlError;
    
    const rowStartError = validateField('rowStart', formData.rowStart);
    if (rowStartError) newErrors.rowStart = rowStartError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
    const fieldValue = formData[fieldName as keyof typeof formData];
    const error = validateField(fieldName, typeof fieldValue === 'boolean' ? String(fieldValue) : fieldValue);
    setErrors({ ...errors, [fieldName]: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      href: true,
      backgroundUrl: true,
      rowStart: true,
    });
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {tile ? 'Modifier la Tuile' : 'Ajouter une Nouvelle Tuile'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {tile ? 'Modifier les propriétés et l\'apparence de la tuile' : 'Créer une nouvelle tuile pour votre grille'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (touched.title) {
                  const error = validateField('title', e.target.value);
                  setErrors({ ...errors, title: error });
                }
              }}
              onBlur={() => handleBlur('title')}
              className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                touched.title && errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="ex: Qui est ODB ?"
            />
            {touched.title && errors.title && (
              <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Légende</label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
              placeholder="ex: Découvrir la maison"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien (href) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.href}
              onChange={(e) => {
                setFormData({ ...formData, href: e.target.value });
                if (touched.href) {
                  const error = validateField('href', e.target.value);
                  setErrors({ ...errors, href: error });
                }
              }}
              onBlur={() => handleBlur('href')}
              className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                touched.href && errors.href ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="/maison"
            />
            {touched.href && errors.href && (
              <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.href}</span>
              </div>
            )}
          </div>

          {/* Background Image URL with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'Image de Fond <span className="text-red-500">*</span>
            </label>
            {formData.backgroundUrl && (
              <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                <div
                  className="w-full h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${formData.backgroundUrl})`,
                  }}
                />
              </div>
            )}
            <input
              type="text"
              value={formData.backgroundUrl}
              onChange={(e) => {
                setFormData({ ...formData, backgroundUrl: e.target.value });
                if (touched.backgroundUrl) {
                  const error = validateField('backgroundUrl', e.target.value);
                  setErrors({ ...errors, backgroundUrl: error });
                }
              }}
              onBlur={() => handleBlur('backgroundUrl')}
              className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                touched.backgroundUrl && errors.backgroundUrl ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://images.unsplash.com/photo-1234..."
            />
            {touched.backgroundUrl && errors.backgroundUrl ? (
              <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.backgroundUrl}</span>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Entrez l'URL complète d'une image</p>
            )}
            
            {/* Image Preview */}
            {formData.backgroundUrl && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Aperçu :</p>
                <div className="relative h-32 rounded-lg overflow-hidden border border-gray-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: formData.backgroundUrl.startsWith('http')
                        ? `url(${formData.backgroundUrl})`
                        : formData.backgroundUrl,
                    }}
                  />
                  <div className={`absolute inset-0 ${formData.overlayType === 'DARK' ? 'bg-black/60' : 'bg-white/60'}`} />
                  <div className="relative h-full flex items-center justify-center">
                    <p className={`text-sm font-medium ${formData.overlayType === 'DARK' ? 'text-white' : 'text-black'}`}>
                      {formData.title || 'Aperçu du titre'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grid Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largeur (1-4 colonnes)
              </label>
              <select
                value={formData.colSpan}
                onChange={(e) => setFormData({ ...formData, colSpan: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-colors cursor-pointer"
              >
                <option value={1}>1 colonne</option>
                <option value={2}>2 colonnes</option>
                <option value={3}>3 colonnes</option>
                <option value={4}>4 colonnes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hauteur (1-2 rangées)
              </label>
              <select
                value={formData.rowSpan}
                onChange={(e) => setFormData({ ...formData, rowSpan: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-colors cursor-pointer"
              >
                <option value={1}>1 rangée</option>
                <option value={2}>2 rangées</option>
              </select>
            </div>
          </div>

          {/* Grid Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colonne de Départ (1-4)
              </label>
              <select
                value={formData.colStart}
                onChange={(e) => setFormData({ ...formData, colStart: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-colors cursor-pointer"
              >
                <option value={1}>Colonne 1</option>
                <option value={2}>Colonne 2</option>
                <option value={3}>Colonne 3</option>
                <option value={4}>Colonne 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rangée de Départ
              </label>
              <input
                type="number"
                value={formData.rowStart}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setFormData({ ...formData, rowStart: value });
                  if (touched.rowStart) {
                    const error = validateField('rowStart', value);
                    setErrors({ ...errors, rowStart: error });
                  }
                }}
                onBlur={() => handleBlur('rowStart')}
                min={1}
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  touched.rowStart && errors.rowStart ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {touched.rowStart && errors.rowStart && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.rowStart}</span>
                </div>
              )}
            </div>
          </div>

          {/* Overlay Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de Filtre</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="DARK"
                  checked={formData.overlayType === 'DARK'}
                  onChange={(e) => setFormData({ ...formData, overlayType: e.target.value as 'DARK' })}
                  className="mr-2 w-4 h-4 text-gray-900 border-gray-300 focus:ring-2 focus:ring-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Sombre (texte clair)</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="LIGHT"
                  checked={formData.overlayType === 'LIGHT'}
                  onChange={(e) => setFormData({ ...formData, overlayType: e.target.value as 'LIGHT' })}
                  className="mr-2 w-4 h-4 text-gray-900 border-gray-300 focus:ring-2 focus:ring-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Clair (texte sombre)</span>
              </label>
            </div>
          </div>

          {/* Published */}
          <div>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="mr-2 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Publié</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Les tuiles non publiées n'apparaîtront pas sur le site</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
            >
              {tile ? '✓ Mettre à Jour' : '+ Créer la Tuile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
