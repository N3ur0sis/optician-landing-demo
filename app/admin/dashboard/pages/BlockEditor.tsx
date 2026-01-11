'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';
import { PageBlock, BlockType, BLOCK_DEFINITIONS, BlockStyles } from '@/types/page-builder';
import MediaPicker from '@/components/media/MediaPicker';

interface BlockEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
  onClose: () => void;
}

export default function BlockEditor({ block, onUpdate, onClose }: BlockEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'settings'>('content');
  const definition = BLOCK_DEFINITIONS.find(d => d.type === block.type);

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
          <h3 className="font-semibold text-gray-900">{definition?.label || block.type}</h3>
          <p className="text-xs text-gray-700">{definition?.description}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['content', 'style', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'content' ? 'Contenu' : tab === 'style' ? 'Style' : 'Options'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <ContentEditor block={block} updateContent={updateContent} />
        )}
        {activeTab === 'style' && (
          <StyleEditor styles={block.styles as BlockStyles} updateStyles={updateStyles} />
        )}
        {activeTab === 'settings' && (
          <SettingsEditor block={block} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

// Content Editor - Different fields based on block type
function ContentEditor({ 
  block, 
  updateContent 
}: { 
  block: PageBlock; 
  updateContent: (key: string, value: unknown) => void;
}) {
  const content = block.content as Record<string, unknown>;

  switch (block.type) {
    case 'HERO':
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="input"
              placeholder="Titre principal"
            />
          </Field>
          <Field label="Sous-titre">
            <input
              type="text"
              value={(content.subtitle as string) || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              className="input"
              placeholder="Sous-titre optionnel"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="input"
              rows={3}
              placeholder="Description"
            />
          </Field>
          <Field label="Image de fond">
            <MediaPicker
              value={(content.backgroundImage as string) || ''}
              onChange={(url) => updateContent('backgroundImage', url)}
              acceptTypes="image"
              placeholder="Sélectionner une image de fond"
            />
          </Field>
          <Field label="Opacité de l'overlay">
            <input
              type="range"
              min="0"
              max="100"
              value={(content.overlayOpacity as number) || 50}
              onChange={(e) => updateContent('overlayOpacity', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-700">{(content.overlayOpacity as number) || 50}%</span>
          </Field>
          <Field label="Hauteur">
            <select
              value={(content.height as string) || 'large'}
              onChange={(e) => updateContent('height', e.target.value)}
              className="input"
            >
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
              <option value="full">Plein écran</option>
            </select>
          </Field>
          <Field label="Alignement">
            <select
              value={(content.alignment as string) || 'CENTER'}
              onChange={(e) => updateContent('alignment', e.target.value)}
              className="input"
            >
              <option value="LEFT">Gauche</option>
              <option value="CENTER">Centré</option>
              <option value="RIGHT">Droite</option>
            </select>
          </Field>
        </div>
      );

    case 'TEXT':
      return (
        <div className="space-y-4">
          <Field label="Contenu">
            <textarea
              value={(content.html as string) || ''}
              onChange={(e) => updateContent('html', e.target.value)}
              className="input font-mono text-sm"
              rows={10}
              placeholder="<p>Votre contenu HTML...</p>"
            />
          </Field>
          <p className="text-xs text-gray-700">
            Vous pouvez utiliser du HTML basique: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;li&gt;
          </p>
        </div>
      );

    case 'HEADING':
      return (
        <div className="space-y-4">
          <Field label="Texte">
            <input
              type="text"
              value={(content.text as string) || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              className="input"
              placeholder="Votre titre"
            />
          </Field>
          <Field label="Niveau">
            <select
              value={(content.level as string) || 'h2'}
              onChange={(e) => updateContent('level', e.target.value)}
              className="input"
            >
              <option value="h1">H1 - Titre principal</option>
              <option value="h2">H2 - Sous-titre</option>
              <option value="h3">H3 - Section</option>
              <option value="h4">H4 - Sous-section</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </Field>
          <Field label="Sous-titre">
            <input
              type="text"
              value={(content.subtitle as string) || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              className="input"
              placeholder="Sous-titre optionnel"
            />
          </Field>
        </div>
      );

    case 'PARAGRAPH':
      return (
        <div className="space-y-4">
          <Field label="Texte">
            <textarea
              value={(content.text as string) || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              className="input"
              rows={6}
              placeholder="Votre texte..."
            />
          </Field>
        </div>
      );

    case 'IMAGE':
      return (
        <div className="space-y-4">
          <Field label="Image">
            <MediaPicker
              value={(content.src as string) || ''}
              onChange={(url) => updateContent('src', url)}
              acceptTypes="image"
              placeholder="Sélectionner une image"
              showPreview={true}
            />
          </Field>
          <Field label="Texte alternatif">
            <input
              type="text"
              value={(content.alt as string) || ''}
              onChange={(e) => updateContent('alt', e.target.value)}
              className="input"
              placeholder="Description de l'image"
            />
          </Field>
          <Field label="Légende">
            <input
              type="text"
              value={(content.caption as string) || ''}
              onChange={(e) => updateContent('caption', e.target.value)}
              className="input"
              placeholder="Légende optionnelle"
            />
          </Field>
          <Field label="Lien">
            <input
              type="text"
              value={(content.link as string) || ''}
              onChange={(e) => updateContent('link', e.target.value)}
              className="input"
              placeholder="URL de destination (optionnel)"
            />
          </Field>
          <Field label="Ajustement">
            <select
              value={(content.objectFit as string) || 'cover'}
              onChange={(e) => updateContent('objectFit', e.target.value)}
              className="input"
            >
              <option value="cover">Couvrir</option>
              <option value="contain">Contenir</option>
              <option value="fill">Remplir</option>
              <option value="none">Original</option>
            </select>
          </Field>
        </div>
      );

    case 'BUTTON':
      return (
        <div className="space-y-4">
          <Field label="Texte">
            <input
              type="text"
              value={(content.text as string) || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              className="input"
              placeholder="Texte du bouton"
            />
          </Field>
          <Field label="URL">
            <input
              type="text"
              value={(content.url as string) || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              className="input"
              placeholder="/page ou https://..."
            />
          </Field>
          <Field label="Variante">
            <select
              value={(content.variant as string) || 'primary'}
              onChange={(e) => updateContent('variant', e.target.value)}
              className="input"
            >
              <option value="primary">Principal</option>
              <option value="secondary">Secondaire</option>
              <option value="outline">Contour</option>
              <option value="ghost">Transparent</option>
            </select>
          </Field>
          <Field label="Taille">
            <select
              value={(content.size as string) || 'md'}
              onChange={(e) => updateContent('size', e.target.value)}
              className="input"
            >
              <option value="sm">Petit</option>
              <option value="md">Moyen</option>
              <option value="lg">Grand</option>
            </select>
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.fullWidth as boolean) || false}
              onChange={(e) => updateContent('fullWidth', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">Pleine largeur</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.newTab as boolean) || false}
              onChange={(e) => updateContent('newTab', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">Ouvrir dans un nouvel onglet</span>
          </label>
        </div>
      );

    case 'QUOTE':
      return (
        <div className="space-y-4">
          <Field label="Citation">
            <textarea
              value={(content.text as string) || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              className="input"
              rows={4}
              placeholder="Votre citation..."
            />
          </Field>
          <Field label="Auteur">
            <input
              type="text"
              value={(content.author as string) || ''}
              onChange={(e) => updateContent('author', e.target.value)}
              className="input"
              placeholder="Nom de l'auteur"
            />
          </Field>
          <Field label="Fonction">
            <input
              type="text"
              value={(content.role as string) || ''}
              onChange={(e) => updateContent('role', e.target.value)}
              className="input"
              placeholder="Titre ou fonction"
            />
          </Field>
        </div>
      );

    case 'SPACER':
      return (
        <div className="space-y-4">
          <Field label="Hauteur">
            <select
              value={(content.height as string) || 'md'}
              onChange={(e) => updateContent('height', e.target.value)}
              className="input"
            >
              <option value="xs">Très petit (8px)</option>
              <option value="sm">Petit (16px)</option>
              <option value="md">Moyen (32px)</option>
              <option value="lg">Grand (48px)</option>
              <option value="xl">Très grand (64px)</option>
              <option value="2xl">Extra grand (96px)</option>
            </select>
          </Field>
        </div>
      );

    case 'DIVIDER':
      return (
        <div className="space-y-4">
          <Field label="Style">
            <select
              value={(content.style as string) || 'solid'}
              onChange={(e) => updateContent('style', e.target.value)}
              className="input"
            >
              <option value="solid">Plein</option>
              <option value="dashed">Tirets</option>
              <option value="dotted">Points</option>
              <option value="gradient">Dégradé</option>
            </select>
          </Field>
          <Field label="Largeur">
            <select
              value={(content.width as string) || 'full'}
              onChange={(e) => updateContent('width', e.target.value)}
              className="input"
            >
              <option value="short">Court</option>
              <option value="medium">Moyen</option>
              <option value="full">Pleine largeur</option>
            </select>
          </Field>
          <Field label="Couleur">
            <input
              type="color"
              value={(content.color as string) || '#e5e7eb'}
              onChange={(e) => updateContent('color', e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
          </Field>
        </div>
      );

    case 'STATS':
      return (
        <div className="space-y-4">
          <StatsEditor
            stats={(content.stats as Array<{ value: string; label: string; prefix?: string; suffix?: string }>) || []}
            onChange={(stats) => updateContent('stats', stats)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 4}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
        </div>
      );

    case 'CARDS':
      return (
        <div className="space-y-4">
          <CardsEditor
            cards={(content.cards as Array<{ title: string; description?: string; image?: string; link?: string }>) || []}
            onChange={(cards) => updateContent('cards', cards)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
          <Field label="Variante">
            <select
              value={(content.variant as string) || 'default'}
              onChange={(e) => updateContent('variant', e.target.value)}
              className="input"
            >
              <option value="default">Par défaut</option>
              <option value="bordered">Bordure</option>
              <option value="elevated">Élevé</option>
            </select>
          </Field>
        </div>
      );

    case 'IFRAME':
      return (
        <div className="space-y-4">
          <Field label="URL">
            <input
              type="text"
              value={(content.url as string) || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="input"
              placeholder="Titre de l'iframe"
            />
          </Field>
          <Field label="Hauteur (px)">
            <input
              type="number"
              value={(content.height as number) || 400}
              onChange={(e) => updateContent('height', parseInt(e.target.value))}
              className="input"
            />
          </Field>
        </div>
      );

    case 'VIDEO':
      return (
        <div className="space-y-4">
          <Field label="Type">
            <select
              value={(content.type as string) || 'youtube'}
              onChange={(e) => updateContent('type', e.target.value)}
              className="input"
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="file">Fichier</option>
            </select>
          </Field>
          <Field label="URL">
            <input
              type="text"
              value={(content.url as string) || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              className="input"
              placeholder="URL de la vidéo"
            />
          </Field>
          <Field label="Image de couverture">
            <MediaPicker
              value={(content.poster as string) || ''}
              onChange={(url) => updateContent('poster', url)}
              acceptTypes="image"
              placeholder="Image affichée avant lecture"
            />
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.autoplay as boolean) || false}
              onChange={(e) => updateContent('autoplay', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Lecture automatique</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.muted as boolean) || false}
              onChange={(e) => updateContent('muted', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Son coupé</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.loop as boolean) || false}
              onChange={(e) => updateContent('loop', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Boucle</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.controls as boolean) !== false}
              onChange={(e) => updateContent('controls', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Afficher les contrôles</span>
          </label>
        </div>
      );

    case 'LIST':
      return (
        <div className="space-y-4">
          <Field label="Style de liste">
            <select
              value={(content.style as string) || 'bullet'}
              onChange={(e) => updateContent('style', e.target.value)}
              className="input"
            >
              <option value="bullet">Puces</option>
              <option value="number">Numérotée</option>
              <option value="check">Coches</option>
              <option value="arrow">Flèches</option>
            </select>
          </Field>
          <ListItemsEditor
            items={(content.items as string[]) || []}
            onChange={(items) => updateContent('items', items)}
          />
        </div>
      );

    case 'GALLERY':
      return (
        <div className="space-y-4">
          <GalleryEditor
            images={(content.images as Array<{ src: string; alt: string; caption?: string }>) || []}
            onChange={(images) => updateContent('images', images)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
              <option value={5}>5 colonnes</option>
            </select>
          </Field>
          <Field label="Espacement">
            <select
              value={(content.gap as string) || 'medium'}
              onChange={(e) => updateContent('gap', e.target.value)}
              className="input"
            >
              <option value="none">Aucun</option>
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.lightbox as boolean) || false}
              onChange={(e) => updateContent('lightbox', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Activer la lightbox (zoom au clic)</span>
          </label>
        </div>
      );

    case 'FILE':
      return (
        <div className="space-y-4">
          <Field label="Nom du fichier">
            <input
              type="text"
              value={(content.name as string) || ''}
              onChange={(e) => updateContent('name', e.target.value)}
              className="input"
              placeholder="Document.pdf"
            />
          </Field>
          <Field label="Fichier">
            <MediaPicker
              value={(content.url as string) || ''}
              onChange={(url) => updateContent('url', url)}
              acceptTypes="all"
              placeholder="Sélectionner un fichier"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="input"
              rows={2}
              placeholder="Description optionnelle du fichier"
            />
          </Field>
          <Field label="Taille (affichage)">
            <input
              type="text"
              value={(content.size as string) || ''}
              onChange={(e) => updateContent('size', e.target.value)}
              className="input"
              placeholder="Ex: 2.5 MB"
            />
          </Field>
          <Field label="Type de fichier">
            <input
              type="text"
              value={(content.type as string) || ''}
              onChange={(e) => updateContent('type', e.target.value)}
              className="input"
              placeholder="Ex: application/pdf"
            />
          </Field>
        </div>
      );

    case 'GRID':
      return (
        <div className="space-y-4">
          <GridItemsEditor
            items={(content.items as Array<{ title: string; description?: string; image?: string; link?: string; badge?: string }>) || []}
            onChange={(items) => updateContent('items', items)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
          <Field label="Espacement">
            <select
              value={(content.gap as string) || 'medium'}
              onChange={(e) => updateContent('gap', e.target.value)}
              className="input"
            >
              <option value="none">Aucun</option>
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>
          </Field>
        </div>
      );

    case 'LINK_BLOCK':
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="input"
              placeholder="Titre du lien"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="input"
              rows={2}
              placeholder="Description optionnelle"
            />
          </Field>
          <Field label="URL">
            <input
              type="text"
              value={(content.url as string) || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
          <Field label="Image">
            <MediaPicker
              value={(content.image as string) || ''}
              onChange={(url) => updateContent('image', url)}
              acceptTypes="image"
              placeholder="Image de prévisualisation"
            />
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.newTab as boolean) || false}
              onChange={(e) => updateContent('newTab', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Ouvrir dans un nouvel onglet</span>
          </label>
        </div>
      );

    case 'ACCORDION':
      return (
        <div className="space-y-4">
          <AccordionItemsEditor
            items={(content.items as Array<{ title: string; content: string; defaultOpen?: boolean }>) || []}
            onChange={(items) => updateContent('items', items)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.allowMultiple as boolean) || false}
              onChange={(e) => updateContent('allowMultiple', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Permettre plusieurs sections ouvertes</span>
          </label>
        </div>
      );

    case 'TABS':
      return (
        <div className="space-y-4">
          <TabsEditor
            tabs={(content.tabs as Array<{ label: string; content: string; icon?: string }>) || []}
            onChange={(tabs) => updateContent('tabs', tabs)}
          />
          <Field label="Style des onglets">
            <select
              value={(content.variant as string) || 'line'}
              onChange={(e) => updateContent('variant', e.target.value)}
              className="input"
            >
              <option value="line">Ligne</option>
              <option value="pill">Pilule</option>
              <option value="enclosed">Encadré</option>
            </select>
          </Field>
        </div>
      );

    case 'TABLE':
      return (
        <div className="space-y-4">
          <TableEditor
            headers={(content.headers as string[]) || []}
            rows={(content.rows as string[][]) || []}
            onHeadersChange={(headers) => updateContent('headers', headers)}
            onRowsChange={(rows) => updateContent('rows', rows)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.striped as boolean) || false}
              onChange={(e) => updateContent('striped', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Lignes alternées</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.bordered as boolean) || false}
              onChange={(e) => updateContent('bordered', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Bordures</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.hoverable as boolean) || false}
              onChange={(e) => updateContent('hoverable', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">Effet survol</span>
          </label>
        </div>
      );

    case 'TIMELINE':
      return (
        <div className="space-y-4">
          <TimelineEditor
            items={(content.items as Array<{ date: string; title: string; description?: string; image?: string }>) || []}
            onChange={(items) => updateContent('items', items)}
          />
          <Field label="Disposition">
            <select
              value={(content.layout as string) || 'vertical'}
              onChange={(e) => updateContent('layout', e.target.value)}
              className="input"
            >
              <option value="vertical">Verticale</option>
              <option value="alternating">Alternée</option>
            </select>
          </Field>
        </div>
      );

    case 'MAP':
      return (
        <div className="space-y-4">
          <Field label="Adresse">
            <input
              type="text"
              value={(content.address as string) || ''}
              onChange={(e) => updateContent('address', e.target.value)}
              className="input"
              placeholder="123 Rue Example, Paris"
            />
          </Field>
          <p className="text-xs text-gray-600">Ou utilisez des coordonnées :</p>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Latitude">
              <input
                type="number"
                step="any"
                value={(content.lat as number) || ''}
                onChange={(e) => updateContent('lat', parseFloat(e.target.value) || undefined)}
                className="input"
                placeholder="48.8566"
              />
            </Field>
            <Field label="Longitude">
              <input
                type="number"
                step="any"
                value={(content.lng as number) || ''}
                onChange={(e) => updateContent('lng', parseFloat(e.target.value) || undefined)}
                className="input"
                placeholder="2.3522"
              />
            </Field>
          </div>
          <Field label="Zoom">
            <input
              type="range"
              min="1"
              max="20"
              value={(content.zoom as number) || 14}
              onChange={(e) => updateContent('zoom', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-700">Niveau {(content.zoom as number) || 14}</span>
          </Field>
          <Field label="Hauteur (px)">
            <input
              type="number"
              value={(content.height as number) || 400}
              onChange={(e) => updateContent('height', parseInt(e.target.value))}
              className="input"
            />
          </Field>
        </div>
      );

    case 'SOCIAL':
      return (
        <div className="space-y-4">
          <Field label="Plateforme">
            <select
              value={(content.platform as string) || 'instagram'}
              onChange={(e) => updateContent('platform', e.target.value)}
              className="input"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter / X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
          </Field>
          <Field label="Code d'intégration">
            <textarea
              value={(content.embedCode as string) || ''}
              onChange={(e) => updateContent('embedCode', e.target.value)}
              className="input font-mono text-xs"
              rows={6}
              placeholder="Collez le code d'intégration fourni par la plateforme..."
            />
          </Field>
          <p className="text-xs text-gray-600">Ou utilisez une URL directe :</p>
          <Field label="URL du post">
            <input
              type="text"
              value={(content.url as string) || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
        </div>
      );

    case 'TEAM':
      return (
        <div className="space-y-4">
          <TeamMembersEditor
            members={(content.members as Array<{ name: string; role: string; image?: string; bio?: string; social?: { instagram?: string; linkedin?: string; email?: string } }>) || []}
            onChange={(members) => updateContent('members', members)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
          <Field label="Variante">
            <select
              value={(content.variant as string) || 'card'}
              onChange={(e) => updateContent('variant', e.target.value)}
              className="input"
            >
              <option value="card">Carte complète</option>
              <option value="minimal">Minimal</option>
              <option value="profile">Profil détaillé</option>
            </select>
          </Field>
        </div>
      );

    case 'TESTIMONIALS':
      return (
        <div className="space-y-4">
          <TestimonialsEditor
            testimonials={(content.testimonials as Array<{ text: string; author: string; role?: string; company?: string; image?: string; rating?: number }>) || []}
            onChange={(testimonials) => updateContent('testimonials', testimonials)}
          />
          <Field label="Disposition">
            <select
              value={(content.layout as string) || 'grid'}
              onChange={(e) => updateContent('layout', e.target.value)}
              className="input"
            >
              <option value="grid">Grille</option>
              <option value="carousel">Carrousel</option>
              <option value="masonry">Masonry</option>
            </select>
          </Field>
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 2}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={1}>1 colonne</option>
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
            </select>
          </Field>
        </div>
      );

    case 'PRICING':
      return (
        <div className="space-y-4">
          <PricingPlansEditor
            plans={(content.plans as Array<{ name: string; price: string; period?: string; description?: string; features: string[]; highlighted?: boolean; buttonText?: string; buttonUrl?: string }>) || []}
            onChange={(plans) => updateContent('plans', plans)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
        </div>
      );

    case 'FAQ':
      return (
        <div className="space-y-4">
          <FAQEditor
            questions={(content.questions as Array<{ question: string; answer: string }>) || []}
            onChange={(questions) => updateContent('questions', questions)}
          />
          <Field label="Disposition">
            <select
              value={(content.layout as string) || 'accordion'}
              onChange={(e) => updateContent('layout', e.target.value)}
              className="input"
            >
              <option value="accordion">Accordéon</option>
              <option value="cards">Cartes</option>
              <option value="two-column">Deux colonnes</option>
            </select>
          </Field>
        </div>
      );

    case 'CONTACT_FORM':
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="input"
              placeholder="Contactez-nous"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="input"
              rows={2}
              placeholder="Description optionnelle"
            />
          </Field>
          <FormFieldsEditor
            fields={(content.fields as Array<{ type: string; name: string; label: string; placeholder?: string; required?: boolean; options?: string[] }>) || []}
            onChange={(fields) => updateContent('fields', fields)}
          />
          <Field label="Texte du bouton">
            <input
              type="text"
              value={(content.submitText as string) || 'Envoyer'}
              onChange={(e) => updateContent('submitText', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Message de succès">
            <input
              type="text"
              value={(content.successMessage as string) || ''}
              onChange={(e) => updateContent('successMessage', e.target.value)}
              className="input"
              placeholder="Merci pour votre message !"
            />
          </Field>
          <Field label="Email destinataire">
            <input
              type="email"
              value={(content.recipientEmail as string) || ''}
              onChange={(e) => updateContent('recipientEmail', e.target.value)}
              className="input"
              placeholder="contact@example.com"
            />
          </Field>
        </div>
      );

    case 'NEWSLETTER':
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="input"
              placeholder="Restez informé"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="input"
              rows={2}
              placeholder="Inscrivez-vous à notre newsletter..."
            />
          </Field>
          <Field label="Placeholder du champ email">
            <input
              type="text"
              value={(content.placeholder as string) || 'Votre email'}
              onChange={(e) => updateContent('placeholder', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Texte du bouton">
            <input
              type="text"
              value={(content.buttonText as string) || "S'inscrire"}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Fournisseur">
            <select
              value={(content.provider as string) || 'custom'}
              onChange={(e) => updateContent('provider', e.target.value)}
              className="input"
            >
              <option value="custom">Personnalisé</option>
              <option value="mailchimp">Mailchimp</option>
              <option value="sendinblue">Brevo (Sendinblue)</option>
            </select>
          </Field>
          {(content.provider === 'mailchimp' || content.provider === 'sendinblue') && (
            <Field label="ID de la liste">
              <input
                type="text"
                value={(content.listId as string) || ''}
                onChange={(e) => updateContent('listId', e.target.value)}
                className="input"
                placeholder="ID de votre liste"
              />
            </Field>
          )}
        </div>
      );

    case 'FEATURES':
      return (
        <div className="space-y-4">
          <FeaturesEditor
            features={(content.features as Array<{ icon?: string; title: string; description: string; link?: string }>) || []}
            onChange={(features) => updateContent('features', features)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) => updateContent('columns', parseInt(e.target.value))}
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
          <Field label="Disposition">
            <select
              value={(content.layout as string) || 'cards'}
              onChange={(e) => updateContent('layout', e.target.value)}
              className="input"
            >
              <option value="cards">Cartes</option>
              <option value="list">Liste</option>
              <option value="icons">Icônes centrées</option>
            </select>
          </Field>
          <Field label="Style des icônes">
            <select
              value={(content.iconStyle as string) || 'circle'}
              onChange={(e) => updateContent('iconStyle', e.target.value)}
              className="input"
            >
              <option value="circle">Cercle</option>
              <option value="square">Carré</option>
              <option value="none">Sans fond</option>
            </select>
          </Field>
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-700 text-center py-8">
          Éditeur pour ce type de bloc en développement
        </div>
      );
  }
}

// Style Editor
function StyleEditor({ 
  styles, 
  updateStyles 
}: { 
  styles: BlockStyles; 
  updateStyles: (key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Alignment - Simple and global */}
      <CollapsibleSection title="Alignement" defaultOpen>
        <div className="space-y-4">
          <Field label="Position du bloc">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'left', label: 'Gauche', icon: '⬅' },
                { value: 'center', label: 'Centre', icon: '⬌' },
                { value: 'right', label: 'Droite', icon: '➡' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateStyles('alignment', opt.value)}
                  className={`p-3 text-sm rounded-lg border-2 transition-all ${
                    styles.alignment === opt.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="text-lg block mb-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Affecte le bloc entier et tout son contenu
            </p>
          </Field>
        </div>
      </CollapsibleSection>

      {/* Size & Layout */}
      <CollapsibleSection title="Taille & Disposition" defaultOpen>
        <div className="space-y-4">
          {/* Inline toggle */}
          <Field label="Disposition">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={styles.inline || false}
                onChange={(e) => updateStyles('inline', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Affichage en ligne</span>
                <p className="text-xs text-gray-500">Permet de placer plusieurs blocs côte à côte</p>
              </div>
            </label>
          </Field>

          <Field label="Largeur du bloc">
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 25, label: '25%' },
                { value: 33, label: '33%' },
                { value: 50, label: '50%' },
                { value: 66, label: '66%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateStyles('widthPercent', opt.value)}
                  className={`p-2 text-xs rounded-lg border-2 transition-all ${
                    styles.widthPercent === opt.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={styles.widthPercent || 100}
                onChange={(e) => updateStyles('widthPercent', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10%</span>
                <span className="font-medium">{styles.widthPercent || 100}%</span>
                <span>100%</span>
              </div>
            </div>
          </Field>
          
          <Field label="Hauteur minimale">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'auto', label: 'Auto' },
                { value: 'small', label: '200px' },
                { value: 'medium', label: '350px' },
                { value: 'large', label: '500px' },
                { value: 'xlarge', label: '700px' },
                { value: 'screen', label: '100vh' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateStyles('height', opt.value)}
                  className={`p-2 text-xs rounded-lg border-2 transition-all ${
                    styles.height === opt.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </CollapsibleSection>

      {/* Spacing - Simplified */}
      <CollapsibleSection title="Espacement">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Marge haute">
              <SpacingSelect value={styles.marginTop} onChange={(v) => updateStyles('marginTop', v)} />
            </Field>
            <Field label="Marge basse">
              <SpacingSelect value={styles.marginBottom} onChange={(v) => updateStyles('marginBottom', v)} />
            </Field>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Padding haut">
                <SpacingSelect value={styles.paddingTop} onChange={(v) => updateStyles('paddingTop', v)} />
              </Field>
              <Field label="Padding bas">
                <SpacingSelect value={styles.paddingBottom} onChange={(v) => updateStyles('paddingBottom', v)} />
              </Field>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Container */}
      <CollapsibleSection title="Conteneur">
        <div className="space-y-4">
          <Field label="Largeur max du conteneur">
            <select
              value={styles.containerWidth || 'WIDE'}
              onChange={(e) => updateStyles('containerWidth', e.target.value)}
              className="input"
            >
              <option value="NARROW">Étroit (672px)</option>
              <option value="MEDIUM">Moyen (896px)</option>
              <option value="WIDE">Large (1152px)</option>
              <option value="FULL">Plein (1280px)</option>
              <option value="EDGE">Bord à bord</option>
            </select>
          </Field>
        </div>
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
            </div>
          </Field>
          <Field label="Couleur du texte">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styles.textColor || '#000000'}
                onChange={(e) => updateStyles('textColor', e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={styles.textColor || ''}
                onChange={(e) => updateStyles('textColor', e.target.value)}
                className="input flex-1 font-mono text-sm"
                placeholder="inherit"
              />
            </div>
          </Field>
          <Field label="Arrondi">
            <select
              value={styles.borderRadius || 'none'}
              onChange={(e) => updateStyles('borderRadius', e.target.value)}
              className="input"
            >
              <option value="none">Aucun</option>
              <option value="sm">Petit</option>
              <option value="md">Moyen</option>
              <option value="lg">Grand</option>
              <option value="xl">Très grand</option>
              <option value="full">Rond</option>
            </select>
          </Field>
          <Field label="Ombre">
            <select
              value={styles.shadow || 'none'}
              onChange={(e) => updateStyles('shadow', e.target.value)}
              className="input"
            >
              <option value="none">Aucune</option>
              <option value="sm">Légère</option>
              <option value="md">Moyenne</option>
              <option value="lg">Forte</option>
              <option value="xl">Très forte</option>
            </select>
          </Field>
          <Field label="Animation">
            <select
              value={styles.animation || 'none'}
              onChange={(e) => updateStyles('animation', e.target.value)}
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
        </div>
      </CollapsibleSection>

      {/* Custom Class */}
      <CollapsibleSection title="Avancé">
        <Field label="Classes CSS personnalisées">
          <input
            type="text"
            value={styles.customClass || ''}
            onChange={(e) => updateStyles('customClass', e.target.value)}
            className="input font-mono text-sm"
            placeholder="classe1 classe2"
          />
        </Field>
      </CollapsibleSection>
    </div>
  );
}

// Settings Editor
function SettingsEditor({ 
  block, 
  onUpdate 
}: { 
  block: PageBlock; 
  onUpdate: (updates: Partial<PageBlock>) => void;
}) {
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
    </div>
  );
}

// Helper Components
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      {children}
    </div>
  );
}

function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-300 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
      >
        <span className="font-medium text-sm text-gray-900">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-700" /> : <ChevronRight className="w-4 h-4 text-gray-700" />}
      </button>
      {isOpen && <div className="p-3 pt-0 border-t border-gray-200">{children}</div>}
    </div>
  );
}

function SpacingSelect({ 
  value, 
  onChange 
}: { 
  value?: string; 
  onChange: (value: string) => void;
}) {
  return (
    <select value={value || 'none'} onChange={(e) => onChange(e.target.value)} className="input">
      <option value="none">Aucun</option>
      <option value="xs">Très petit (4px)</option>
      <option value="sm">Petit (8px)</option>
      <option value="md">Moyen (16px)</option>
      <option value="lg">Grand (24px)</option>
      <option value="xl">Très grand (32px)</option>
      <option value="2xl">Extra grand (48px)</option>
    </select>
  );
}

// Stats Editor Component
function StatsEditor({
  stats,
  onChange,
}: {
  stats: Array<{ value: string; label: string; prefix?: string; suffix?: string }>;
  onChange: (stats: Array<{ value: string; label: string; prefix?: string; suffix?: string }>) => void;
}) {
  const addStat = () => {
    onChange([...stats, { value: '0', label: 'Label' }]);
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange(newStats);
  };

  const removeStat = (index: number) => {
    onChange(stats.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Stat {index + 1}</span>
            <button onClick={() => removeStat(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={stat.value}
            onChange={(e) => updateStat(index, 'value', e.target.value)}
            className="input"
            placeholder="Valeur"
          />
          <input
            type="text"
            value={stat.label}
            onChange={(e) => updateStat(index, 'label', e.target.value)}
            className="input"
            placeholder="Label"
          />
        </div>
      ))}
      <button
        onClick={addStat}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter une statistique
      </button>
    </div>
  );
}

// Cards Editor Component
function CardsEditor({
  cards,
  onChange,
}: {
  cards: Array<{ title: string; description?: string; image?: string; link?: string }>;
  onChange: (cards: Array<{ title: string; description?: string; image?: string; link?: string }>) => void;
}) {
  const addCard = () => {
    onChange([...cards, { title: 'Nouvelle carte' }]);
  };

  const updateCard = (index: number, field: string, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange(newCards);
  };

  const removeCard = (index: number) => {
    onChange(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Carte {index + 1}</span>
            <button onClick={() => removeCard(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={card.title}
            onChange={(e) => updateCard(index, 'title', e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={card.description || ''}
            onChange={(e) => updateCard(index, 'description', e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          <MediaPicker
            value={card.image || ''}
            onChange={(url) => updateCard(index, 'image', url)}
            acceptTypes="image"
            placeholder="Sélectionner une image"
            showPreview={false}
          />
          <input
            type="text"
            value={card.link || ''}
            onChange={(e) => updateCard(index, 'link', e.target.value)}
            className="input"
            placeholder="Lien"
          />
        </div>
      ))}
      <button
        onClick={addCard}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter une carte
      </button>
    </div>
  );
}

// List Items Editor
function ListItemsEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const addItem = () => {
    onChange([...items, '']);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      onChange(newItems);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">Éléments</label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => moveItem(index, 'up')}
              disabled={index === 0}
              className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
            >
              <ChevronDown className="w-3 h-3 rotate-180" />
            </button>
            <button
              onClick={() => moveItem(index, 'down')}
              disabled={index === items.length - 1}
              className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="input flex-1"
            placeholder={`Élément ${index + 1}`}
          />
          <button
            onClick={() => removeItem(index)}
            className="p-1 hover:bg-red-100 rounded text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un élément
      </button>
    </div>
  );
}

// Gallery Editor
function GalleryEditor({
  images,
  onChange,
}: {
  images: Array<{ src: string; alt: string; caption?: string }>;
  onChange: (images: Array<{ src: string; alt: string; caption?: string }>) => void;
}) {
  const addImage = () => {
    onChange([...images, { src: '', alt: '' }]);
  };

  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Images</label>
      {images.map((image, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Image {index + 1}</span>
            <button onClick={() => removeImage(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <MediaPicker
            value={image.src}
            onChange={(url) => updateImage(index, 'src', url)}
            acceptTypes="image"
            placeholder="Sélectionner une image"
            showPreview={true}
          />
          <input
            type="text"
            value={image.alt}
            onChange={(e) => updateImage(index, 'alt', e.target.value)}
            className="input"
            placeholder="Texte alternatif"
          />
          <input
            type="text"
            value={image.caption || ''}
            onChange={(e) => updateImage(index, 'caption', e.target.value)}
            className="input"
            placeholder="Légende (optionnelle)"
          />
        </div>
      ))}
      <button
        onClick={addImage}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter une image
      </button>
    </div>
  );
}

// Grid Items Editor
function GridItemsEditor({
  items,
  onChange,
}: {
  items: Array<{ title: string; description?: string; image?: string; link?: string; badge?: string }>;
  onChange: (items: Array<{ title: string; description?: string; image?: string; link?: string; badge?: string }>) => void;
}) {
  const addItem = () => {
    onChange([...items, { title: 'Nouvel élément' }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Éléments</label>
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Élément {index + 1}</span>
            <button onClick={() => removeItem(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, 'title', e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={item.description || ''}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          <MediaPicker
            value={item.image || ''}
            onChange={(url) => updateItem(index, 'image', url)}
            acceptTypes="image"
            placeholder="Image"
            showPreview={false}
          />
          <input
            type="text"
            value={item.link || ''}
            onChange={(e) => updateItem(index, 'link', e.target.value)}
            className="input"
            placeholder="Lien (optionnel)"
          />
          <input
            type="text"
            value={item.badge || ''}
            onChange={(e) => updateItem(index, 'badge', e.target.value)}
            className="input"
            placeholder="Badge (ex: Nouveau, Promo)"
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un élément
      </button>
    </div>
  );
}

// Accordion Items Editor
function AccordionItemsEditor({
  items,
  onChange,
}: {
  items: Array<{ title: string; content: string; defaultOpen?: boolean }>;
  onChange: (items: Array<{ title: string; content: string; defaultOpen?: boolean }>) => void;
}) {
  const addItem = () => {
    onChange([...items, { title: 'Nouvelle section', content: '' }]);
  };

  const updateItem = (index: number, field: string, value: string | boolean) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Sections</label>
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Section {index + 1}</span>
            <button onClick={() => removeItem(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, 'title', e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={item.content}
            onChange={(e) => updateItem(index, 'content', e.target.value)}
            className="input"
            rows={4}
            placeholder="Contenu (HTML supporté)"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.defaultOpen || false}
              onChange={(e) => updateItem(index, 'defaultOpen', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Ouvert par défaut</span>
          </label>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter une section
      </button>
    </div>
  );
}

// Tabs Editor
function TabsEditor({
  tabs,
  onChange,
}: {
  tabs: Array<{ label: string; content: string; icon?: string }>;
  onChange: (tabs: Array<{ label: string; content: string; icon?: string }>) => void;
}) {
  const addTab = () => {
    onChange([...tabs, { label: 'Nouvel onglet', content: '' }]);
  };

  const updateTab = (index: number, field: string, value: string) => {
    const newTabs = [...tabs];
    newTabs[index] = { ...newTabs[index], [field]: value };
    onChange(newTabs);
  };

  const removeTab = (index: number) => {
    onChange(tabs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Onglets</label>
      {tabs.map((tab, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Onglet {index + 1}</span>
            <button onClick={() => removeTab(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={tab.label}
              onChange={(e) => updateTab(index, 'label', e.target.value)}
              className="input"
              placeholder="Libellé"
            />
            <input
              type="text"
              value={tab.icon || ''}
              onChange={(e) => updateTab(index, 'icon', e.target.value)}
              className="input"
              placeholder="Icône (emoji)"
            />
          </div>
          <textarea
            value={tab.content}
            onChange={(e) => updateTab(index, 'content', e.target.value)}
            className="input"
            rows={4}
            placeholder="Contenu (HTML supporté)"
          />
        </div>
      ))}
      <button
        onClick={addTab}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un onglet
      </button>
    </div>
  );
}

// Table Editor
function TableEditor({
  headers,
  rows,
  onHeadersChange,
  onRowsChange,
}: {
  headers: string[];
  rows: string[][];
  onHeadersChange: (headers: string[]) => void;
  onRowsChange: (rows: string[][]) => void;
}) {
  const addColumn = () => {
    onHeadersChange([...headers, `Colonne ${headers.length + 1}`]);
    onRowsChange(rows.map(row => [...row, '']));
  };

  const removeColumn = (colIndex: number) => {
    onHeadersChange(headers.filter((_, i) => i !== colIndex));
    onRowsChange(rows.map(row => row.filter((_, i) => i !== colIndex)));
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    onHeadersChange(newHeaders);
  };

  const addRow = () => {
    onRowsChange([...rows, new Array(headers.length).fill('')]);
  };

  const removeRow = (rowIndex: number) => {
    onRowsChange(rows.filter((_, i) => i !== rowIndex));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    onRowsChange(newRows);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-800">Tableau</label>
        <button
          onClick={addColumn}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + Colonne
        </button>
      </div>
      
      {headers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {headers.map((header, colIndex) => (
                  <th key={colIndex} className="p-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => updateHeader(colIndex, e.target.value)}
                        className="input text-xs font-medium"
                        placeholder="En-tête"
                      />
                      <button
                        onClick={() => removeColumn(colIndex)}
                        className="p-1 hover:bg-red-100 rounded text-red-500 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </th>
                ))}
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="p-1">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className="input text-xs"
                        placeholder="..."
                      />
                    </td>
                  ))}
                  <td className="p-1">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <button
        onClick={addRow}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter une ligne
      </button>
    </div>
  );
}

// Timeline Editor
function TimelineEditor({
  items,
  onChange,
}: {
  items: Array<{ date: string; title: string; description?: string; image?: string }>;
  onChange: (items: Array<{ date: string; title: string; description?: string; image?: string }>) => void;
}) {
  const addItem = () => {
    onChange([...items, { date: '', title: 'Nouvel événement' }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Événements</label>
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Événement {index + 1}</span>
            <button onClick={() => removeItem(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.date}
            onChange={(e) => updateItem(index, 'date', e.target.value)}
            className="input"
            placeholder="Date (ex: Janvier 2024)"
          />
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, 'title', e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={item.description || ''}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          <MediaPicker
            value={item.image || ''}
            onChange={(url) => updateItem(index, 'image', url)}
            acceptTypes="image"
            placeholder="Image (optionnelle)"
            showPreview={false}
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un événement
      </button>
    </div>
  );
}

// Team Members Editor
function TeamMembersEditor({
  members,
  onChange,
}: {
  members: Array<{ name: string; role: string; image?: string; bio?: string; social?: { instagram?: string; linkedin?: string; email?: string } }>;
  onChange: (members: Array<{ name: string; role: string; image?: string; bio?: string; social?: { instagram?: string; linkedin?: string; email?: string } }>) => void;
}) {
  const addMember = () => {
    onChange([...members, { name: 'Nouveau membre', role: '' }]);
  };

  const updateMember = (index: number, field: string, value: string | Record<string, string>) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    onChange(newMembers);
  };

  const updateSocial = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = {
      ...newMembers[index],
      social: { ...newMembers[index].social, [field]: value }
    };
    onChange(newMembers);
  };

  const removeMember = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Membres</label>
      {members.map((member, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Membre {index + 1}</span>
            <button onClick={() => removeMember(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <MediaPicker
            value={member.image || ''}
            onChange={(url) => updateMember(index, 'image', url)}
            acceptTypes="image"
            placeholder="Photo"
            showPreview={true}
          />
          <input
            type="text"
            value={member.name}
            onChange={(e) => updateMember(index, 'name', e.target.value)}
            className="input"
            placeholder="Nom"
          />
          <input
            type="text"
            value={member.role}
            onChange={(e) => updateMember(index, 'role', e.target.value)}
            className="input"
            placeholder="Fonction"
          />
          <textarea
            value={member.bio || ''}
            onChange={(e) => updateMember(index, 'bio', e.target.value)}
            className="input"
            rows={2}
            placeholder="Biographie courte"
          />
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Réseaux sociaux</p>
            <div className="space-y-2">
              <input
                type="email"
                value={member.social?.email || ''}
                onChange={(e) => updateSocial(index, 'email', e.target.value)}
                className="input text-sm"
                placeholder="Email"
              />
              <input
                type="url"
                value={member.social?.linkedin || ''}
                onChange={(e) => updateSocial(index, 'linkedin', e.target.value)}
                className="input text-sm"
                placeholder="LinkedIn URL"
              />
              <input
                type="url"
                value={member.social?.instagram || ''}
                onChange={(e) => updateSocial(index, 'instagram', e.target.value)}
                className="input text-sm"
                placeholder="Instagram URL"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addMember}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un membre
      </button>
    </div>
  );
}

// Testimonials Editor
function TestimonialsEditor({
  testimonials,
  onChange,
}: {
  testimonials: Array<{ text: string; author: string; role?: string; company?: string; image?: string; rating?: number }>;
  onChange: (testimonials: Array<{ text: string; author: string; role?: string; company?: string; image?: string; rating?: number }>) => void;
}) {
  const addTestimonial = () => {
    onChange([...testimonials, { text: '', author: '' }]);
  };

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onChange(newTestimonials);
  };

  const removeTestimonial = (index: number) => {
    onChange(testimonials.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Témoignages</label>
      {testimonials.map((testimonial, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Témoignage {index + 1}</span>
            <button onClick={() => removeTestimonial(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <textarea
            value={testimonial.text}
            onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
            className="input"
            rows={3}
            placeholder="Texte du témoignage"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={testimonial.author}
              onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
              className="input"
              placeholder="Nom"
            />
            <input
              type="text"
              value={testimonial.role || ''}
              onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
              className="input"
              placeholder="Fonction"
            />
          </div>
          <input
            type="text"
            value={testimonial.company || ''}
            onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
            className="input"
            placeholder="Entreprise"
          />
          <MediaPicker
            value={testimonial.image || ''}
            onChange={(url) => updateTestimonial(index, 'image', url)}
            acceptTypes="image"
            placeholder="Photo"
            showPreview={false}
          />
          <Field label="Note">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => updateTestimonial(index, 'rating', star)}
                  className={`text-2xl ${(testimonial.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
              <button
                type="button"
                onClick={() => updateTestimonial(index, 'rating', 0)}
                className="ml-2 text-xs text-gray-500 hover:text-gray-700"
              >
                Effacer
              </button>
            </div>
          </Field>
        </div>
      ))}
      <button
        onClick={addTestimonial}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un témoignage
      </button>
    </div>
  );
}

// Pricing Plans Editor
function PricingPlansEditor({
  plans,
  onChange,
}: {
  plans: Array<{ name: string; price: string; period?: string; description?: string; features: string[]; highlighted?: boolean; buttonText?: string; buttonUrl?: string }>;
  onChange: (plans: Array<{ name: string; price: string; period?: string; description?: string; features: string[]; highlighted?: boolean; buttonText?: string; buttonUrl?: string }>) => void;
}) {
  const addPlan = () => {
    onChange([...plans, { name: 'Nouveau plan', price: '0€', features: [] }]);
  };

  const updatePlan = (index: number, field: string, value: string | boolean | string[]) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    onChange(newPlans);
  };

  const removePlan = (index: number) => {
    onChange(plans.filter((_, i) => i !== index));
  };

  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...plans];
    const features = [...newPlans[planIndex].features];
    features[featureIndex] = value;
    newPlans[planIndex] = { ...newPlans[planIndex], features };
    onChange(newPlans);
  };

  const addFeature = (planIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: [...newPlans[planIndex].features, '']
    };
    onChange(newPlans);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: newPlans[planIndex].features.filter((_, i) => i !== featureIndex)
    };
    onChange(newPlans);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Plans tarifaires</label>
      {plans.map((plan, planIndex) => (
        <div key={planIndex} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Plan {planIndex + 1}</span>
            <button onClick={() => removePlan(planIndex)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={plan.name}
            onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
            className="input"
            placeholder="Nom du plan"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={plan.price}
              onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
              className="input"
              placeholder="Prix (ex: 29€)"
            />
            <input
              type="text"
              value={plan.period || ''}
              onChange={(e) => updatePlan(planIndex, 'period', e.target.value)}
              className="input"
              placeholder="Période (ex: mois)"
            />
          </div>
          <textarea
            value={plan.description || ''}
            onChange={(e) => updatePlan(planIndex, 'description', e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Fonctionnalités</p>
            {plan.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(planIndex, featureIndex, e.target.value)}
                  className="input flex-1 text-sm"
                  placeholder="Fonctionnalité"
                />
                <button
                  onClick={() => removeFeature(planIndex, featureIndex)}
                  className="p-1 hover:bg-red-100 rounded text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addFeature(planIndex)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Fonctionnalité
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <input
              type="text"
              value={plan.buttonText || ''}
              onChange={(e) => updatePlan(planIndex, 'buttonText', e.target.value)}
              className="input text-sm"
              placeholder="Texte du bouton"
            />
            <input
              type="text"
              value={plan.buttonUrl || ''}
              onChange={(e) => updatePlan(planIndex, 'buttonUrl', e.target.value)}
              className="input text-sm"
              placeholder="URL du bouton"
            />
          </div>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={plan.highlighted || false}
              onChange={(e) => updatePlan(planIndex, 'highlighted', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Mettre en avant ce plan</span>
          </label>
        </div>
      ))}
      <button
        onClick={addPlan}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un plan
      </button>
    </div>
  );
}

// FAQ Editor
function FAQEditor({
  questions,
  onChange,
}: {
  questions: Array<{ question: string; answer: string }>;
  onChange: (questions: Array<{ question: string; answer: string }>) => void;
}) {
  const addQuestion = () => {
    onChange([...questions, { question: '', answer: '' }]);
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    onChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Questions</label>
      {questions.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Question {index + 1}</span>
            <button onClick={() => removeQuestion(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
            className="input"
            placeholder="Question"
          />
          <textarea
            value={item.answer}
            onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
            className="input"
            rows={3}
            placeholder="Réponse"
          />
        </div>
      ))}
      <button
        onClick={addQuestion}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter une question
      </button>
    </div>
  );
}

// Form Fields Editor
function FormFieldsEditor({
  fields,
  onChange,
}: {
  fields: Array<{ type: string; name: string; label: string; placeholder?: string; required?: boolean; options?: string[] }>;
  onChange: (fields: Array<{ type: string; name: string; label: string; placeholder?: string; required?: boolean; options?: string[] }>) => void;
}) {
  const addField = () => {
    onChange([...fields, { type: 'text', name: `field_${fields.length + 1}`, label: 'Nouveau champ' }]);
  };

  const updateField = (index: number, field: string, value: string | boolean | string[]) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    onChange(newFields);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Champs du formulaire</label>
      {fields.map((field, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Champ {index + 1}</span>
            <button onClick={() => removeField(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={field.type}
              onChange={(e) => updateField(index, 'type', e.target.value)}
              className="input"
            >
              <option value="text">Texte</option>
              <option value="email">Email</option>
              <option value="phone">Téléphone</option>
              <option value="textarea">Zone de texte</option>
              <option value="select">Liste déroulante</option>
              <option value="checkbox">Case à cocher</option>
            </select>
            <input
              type="text"
              value={field.name}
              onChange={(e) => updateField(index, 'name', e.target.value)}
              className="input"
              placeholder="Nom du champ"
            />
          </div>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(index, 'label', e.target.value)}
            className="input"
            placeholder="Libellé"
          />
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => updateField(index, 'placeholder', e.target.value)}
            className="input"
            placeholder="Placeholder"
          />
          {field.type === 'select' && (
            <textarea
              value={(field.options || []).join('\n')}
              onChange={(e) => updateField(index, 'options', e.target.value.split('\n'))}
              className="input text-sm"
              rows={3}
              placeholder="Options (une par ligne)"
            />
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) => updateField(index, 'required', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Champ obligatoire</span>
          </label>
        </div>
      ))}
      <button
        onClick={addField}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter un champ
      </button>
    </div>
  );
}

// Features Editor
function FeaturesEditor({
  features,
  onChange,
}: {
  features: Array<{ icon?: string; title: string; description: string; link?: string }>;
  onChange: (features: Array<{ icon?: string; title: string; description: string; link?: string }>) => void;
}) {
  const addFeature = () => {
    onChange([...features, { title: 'Nouvelle fonctionnalité', description: '' }]);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onChange(newFeatures);
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">Fonctionnalités</label>
      {features.map((feature, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Fonctionnalité {index + 1}</span>
            <button onClick={() => removeFeature(index)} className="text-red-500 text-xs">
              Supprimer
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={feature.icon || ''}
              onChange={(e) => updateFeature(index, 'icon', e.target.value)}
              className="input"
              placeholder="Icône (emoji)"
            />
            <input
              type="text"
              value={feature.title}
              onChange={(e) => updateFeature(index, 'title', e.target.value)}
              className="input col-span-2"
              placeholder="Titre"
            />
          </div>
          <textarea
            value={feature.description}
            onChange={(e) => updateFeature(index, 'description', e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          <input
            type="text"
            value={feature.link || ''}
            onChange={(e) => updateFeature(index, 'link', e.target.value)}
            className="input"
            placeholder="Lien (optionnel)"
          />
        </div>
      ))}
      <button
        onClick={addFeature}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:text-gray-800"
      >
        + Ajouter une fonctionnalité
      </button>
    </div>
  );
}
