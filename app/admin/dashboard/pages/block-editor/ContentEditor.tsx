"use client";

import Image from "next/image";
import {
  Plus,
  Trash2,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Columns,
  RotateCcw,
} from "lucide-react";
import { PageBlock } from "@/types/page-builder";
import MediaPicker from "@/components/media/MediaPicker";
import { IconPicker } from "@/components/ui/icon-picker";
import { Field, DebouncedColorInput, DebouncedRangeInput } from "./Field";
import {
  ContentEditorProps,
  BUTTON_VARIANTS,
  HEADING_LEVELS,
  LIST_STYLE_OPTIONS,
  SOCIAL_PLATFORMS,
  INFO_BOX_TYPES,
  COLUMN_OPTIONS,
  SIZE_OPTIONS,
  TEXT_ALIGN_OPTIONS,
  GAP_OPTIONS,
  CARD_STYLE_OPTIONS,
  HERO_LAYOUT_OPTIONS,
  HERO_STYLE_OPTIONS,
  QUOTE_STYLE_OPTIONS,
  DIVIDER_STYLE_OPTIONS,
  TESTIMONIAL_STYLE_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  STATS_LAYOUT_OPTIONS,
  FAQ_STYLE_OPTIONS,
  PRICING_STYLE_OPTIONS,
  TEAM_STYLE_OPTIONS,
  GALLERY_STYLE_OPTIONS,
  FEATURE_STYLE_OPTIONS,
  NEWSLETTER_STYLE_OPTIONS,
  FORM_STYLE_OPTIONS,
  TIMELINE_STYLE_OPTIONS,
  TABS_STYLE_OPTIONS,
  TABLE_STYLE_OPTIONS,
  ANIMATION_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  CTA_STYLE_OPTIONS,
  RADIUS_OPTIONS,
} from "./types";
import {
  StatsEditor,
  CardsEditor,
  ListItemsEditor,
  GalleryEditor,
  GridItemsEditor,
  AccordionItemsEditor,
  TabsEditor,
  TableEditor,
  TimelineEditor,
  TeamMembersEditor,
  TestimonialsEditor,
  PricingPlansEditor,
  FAQEditor,
  FormFieldsEditor,
  FeaturesEditor,
  ColumnsEditor,
  ServicesListEditor,
  HoursEditor,
  ButtonsEditor,
} from "./ItemEditors";

export default function ContentEditor({
  block,
  updateContent,
}: ContentEditorProps) {
  const content = block.content as Record<string, unknown>;

  switch (block.type) {
    case "HERO":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Titre du hero"
            />
          </Field>
          <Field label="Sous-titre">
            <textarea
              value={(content.subtitle as string) || ""}
              onChange={(e) => updateContent("subtitle", e.target.value)}
              className="input"
              rows={2}
              placeholder="Description courte"
            />
          </Field>
          <Field label="Image de fond">
            <MediaPicker
              value={(content.backgroundImage as string) || ""}
              onChange={(url) => updateContent("backgroundImage", url)}
              acceptTypes="image"
              placeholder="Sélectionner une image"
              showPreview={true}
            />
          </Field>
          <Field label="Alignement vertical">
            <select
              value={(content.verticalAlign as string) || "center"}
              onChange={(e) => updateContent("verticalAlign", e.target.value)}
              className="input"
            >
              <option value="top">Haut</option>
              <option value="center">Centre</option>
              <option value="bottom">Bas</option>
            </select>
          </Field>
          <Field label="Texte du bouton principal">
            <input
              type="text"
              value={(content.buttonText as string) || ""}
              onChange={(e) => updateContent("buttonText", e.target.value)}
              className="input"
              placeholder="En savoir plus"
            />
          </Field>
          <Field label="Lien du bouton">
            <input
              type="text"
              value={(content.buttonLink as string) || ""}
              onChange={(e) => updateContent("buttonLink", e.target.value)}
              className="input"
              placeholder="/contact"
            />
          </Field>
          <div className="pt-6 mt-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Apparence
            </span>
          </div>
          <Field label="Disposition">
            <select
              value={(content.layout as string) || "centered"}
              onChange={(e) => updateContent("layout", e.target.value)}
              className="input"
            >
              {HERO_LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Style visuel">
            <select
              value={(content.style as string) || "default"}
              onChange={(e) => updateContent("style", e.target.value)}
              className="input"
            >
              {HERO_STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Overlay">
            <div className="flex items-center gap-2">
              <DebouncedColorInput
                value={(content.overlayColor as string) || "#000000"}
                onChange={(val) => updateContent("overlayColor", val)}
              />
              <DebouncedRangeInput
                value={(content.overlayOpacity as number) || 50}
                onChange={(val) => updateContent("overlayOpacity", val)}
                min={0}
                max={100}
                className="flex-1"
              />
              <span className="text-sm w-12">
                {(content.overlayOpacity as number) || 50}%
              </span>
            </div>
          </Field>
        </div>
      );

    case "TEXT":
      return (
        <div className="space-y-4">
          <Field label="Contenu HTML">
            <textarea
              value={(content.html as string) || ""}
              onChange={(e) => updateContent("html", e.target.value)}
              className="input"
              rows={6}
              placeholder="Votre contenu HTML ici..."
            />
          </Field>
        </div>
      );

    case "HEADING":
    case "PARAGRAPH":
      return (
        <div className="space-y-4">
          <Field label="Texte">
            <textarea
              value={(content.text as string) || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              className="input"
              rows={6}
              placeholder="Votre texte ici..."
            />
          </Field>
          {block.type === "HEADING" && (
            <Field label="Niveau">
              <select
                value={(content.level as number) || 2}
                onChange={(e) =>
                  updateContent("level", parseInt(e.target.value))
                }
                className="input"
              >
                <option value={1}>H1 - Titre principal</option>
                <option value={2}>H2 - Titre de section</option>
                <option value={3}>H3 - Sous-titre</option>
                <option value={4}>H4 - Titre mineur</option>
              </select>
            </Field>
          )}
        </div>
      );

    case "IMAGE":
      return (
        <div className="space-y-4">
          <Field label="Image">
            <MediaPicker
              value={(content.src as string) || ""}
              onChange={(url) => updateContent("src", url)}
              acceptTypes="image"
              placeholder="Sélectionner une image"
              showPreview={true}
            />
          </Field>
          <Field label="Texte alternatif">
            <input
              type="text"
              value={(content.alt as string) || ""}
              onChange={(e) => updateContent("alt", e.target.value)}
              className="input"
              placeholder="Description de l'image"
            />
          </Field>
          <Field label="Légende">
            <input
              type="text"
              value={(content.caption as string) || ""}
              onChange={(e) => updateContent("caption", e.target.value)}
              className="input"
              placeholder="Légende (optionnelle)"
            />
          </Field>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Apparence</h4>

            <Field label="Format de l'image">
              <select
                value={(content.aspectRatio as string) || "auto"}
                onChange={(e) => updateContent("aspectRatio", e.target.value)}
                className="input"
              >
                {ASPECT_RATIO_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Bords de l'image">
              <select
                value={(content.borderRadius as string) || "md"}
                onChange={(e) => updateContent("borderRadius", e.target.value)}
                className="input"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ombre">
              <select
                value={(content.shadow as string) || "none"}
                onChange={(e) => updateContent("shadow", e.target.value)}
                className="input"
              >
                <option value="none">Aucune</option>
                <option value="sm">Légère</option>
                <option value="md">Moyenne</option>
                <option value="lg">Grande</option>
                <option value="xl">Très grande</option>
              </select>
            </Field>

            <Field label="Effet au survol">
              <select
                value={(content.hoverEffect as string) || "none"}
                onChange={(e) => updateContent("hoverEffect", e.target.value)}
                className="input"
              >
                {HOVER_EFFECT_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showCaption as boolean) || false}
                onChange={(e) => updateContent("showCaption", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher la légende</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.lightbox as boolean) || false}
                onChange={(e) => updateContent("lightbox", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Ouvrir en plein écran
              </span>
            </label>
          </div>

          {(content.src as string) && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={content.src as string}
                alt={(content.alt as string) || ""}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      );

    case "BUTTON":
      return (
        <div className="space-y-4">
          <Field label="Texte">
            <input
              type="text"
              value={(content.text as string) || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              className="input"
              placeholder="Cliquez ici"
            />
          </Field>
          <Field label="Lien">
            <input
              type="text"
              value={(content.url as string) || (content.href as string) || ""}
              onChange={(e) => updateContent("url", e.target.value)}
              className="input"
              placeholder="/page-destination"
            />
          </Field>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Style du bouton</h4>

            <Field label="Variante">
              <select
                value={(content.variant as string) || "primary"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="input"
              >
                {BUTTON_VARIANTS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Taille">
              <select
                value={(content.size as string) || "md"}
                onChange={(e) => updateContent("size", e.target.value)}
                className="input"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Arrondi des coins">
              <select
                value={(content.borderRadius as string) || "md"}
                onChange={(e) => updateContent("borderRadius", e.target.value)}
                className="input"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>

            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || "#D4A574"}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur du texte">
              <DebouncedColorInput
                value={(content.textColor as string) || "#ffffff"}
                onChange={(val) => updateContent("textColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur de bordure (pour contour)">
              <DebouncedColorInput
                value={(content.borderColor as string) || "#D4A574"}
                onChange={(val) => updateContent("borderColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.fullWidth as boolean) || false}
                onChange={(e) => updateContent("fullWidth", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Pleine largeur</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.newTab as boolean) || false}
                onChange={(e) => updateContent("newTab", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Ouvrir dans un nouvel onglet
              </span>
            </label>
          </div>

          <Field label="Icône (optionnel)">
            <IconPicker
              value={(content.icon as string) || ""}
              onChange={(iconName) => updateContent("icon", iconName)}
              placeholder="Choisir une icône"
            />
          </Field>
        </div>
      );

    case "BUTTON_GROUP":
      return (
        <div className="space-y-4">
          <ButtonsEditor
            buttons={
              (content.buttons as Array<{
                label: string;
                href: string;
                variant?: string;
                openInNewTab?: boolean;
              }>) || []
            }
            onChange={(buttons) => updateContent("buttons", buttons)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Disposition</h4>

            <Field label="Alignement">
              <select
                value={(content.alignment as string) || "center"}
                onChange={(e) => updateContent("alignment", e.target.value)}
                className="input"
              >
                <option value="left">Gauche</option>
                <option value="center">Centre</option>
                <option value="right">Droite</option>
                <option value="space-between">Espacé</option>
              </select>
            </Field>

            <Field label="Espacement">
              <select
                value={(content.gap as string) || "md"}
                onChange={(e) => updateContent("gap", e.target.value)}
                className="input"
              >
                {GAP_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Direction">
              <select
                value={(content.direction as string) || "horizontal"}
                onChange={(e) => updateContent("direction", e.target.value)}
                className="input"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.stackOnMobile as boolean) !== false}
              onChange={(e) => updateContent("stackOnMobile", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Empiler sur mobile</span>
          </label>
        </div>
      );

    case "QUOTE":
      return (
        <div className="space-y-4">
          <Field label="Citation">
            <textarea
              value={(content.text as string) || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              className="input"
              rows={4}
              placeholder="Le texte de votre citation..."
            />
          </Field>
          <Field label="Auteur">
            <input
              type="text"
              value={(content.author as string) || ""}
              onChange={(e) => updateContent("author", e.target.value)}
              className="input"
              placeholder="Nom de l'auteur"
            />
          </Field>
          <Field label="Fonction">
            <input
              type="text"
              value={(content.role as string) || ""}
              onChange={(e) => updateContent("role", e.target.value)}
              className="input"
              placeholder="PDG, Expert, etc."
            />
          </Field>
          <Field label="Style">
            <select
              value={(content.style as string) || "default"}
              onChange={(e) => updateContent("style", e.target.value)}
              className="input"
            >
              {QUOTE_STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Couleur d'accent">
            <DebouncedColorInput
              value={(content.accentColor as string) || "#d4af37"}
              onChange={(val) => updateContent("accentColor", val)}
              className="w-full h-10"
            />
          </Field>
        </div>
      );

    case "SPACER":
      return (
        <div className="space-y-4">
          <Field label="Hauteur">
            <select
              value={(content.height as string) || "md"}
              onChange={(e) => updateContent("height", e.target.value)}
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

    case "DIVIDER":
      return (
        <div className="space-y-4">
          <Field label="Style">
            <select
              value={(content.variant as string) || "solid"}
              onChange={(e) => updateContent("variant", e.target.value)}
              className="input"
            >
              {DIVIDER_STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Épaisseur">
            <select
              value={(content.thickness as string) || "thin"}
              onChange={(e) => updateContent("thickness", e.target.value)}
              className="input"
            >
              <option value="thin">Fine (1px)</option>
              <option value="medium">Moyenne (2px)</option>
              <option value="thick">Épaisse (4px)</option>
            </select>
          </Field>
          <Field label="Largeur">
            <select
              value={(content.width as string) || "full"}
              onChange={(e) => updateContent("width", e.target.value)}
              className="input"
            >
              <option value="short">Courte (25%)</option>
              <option value="half">Moitié (50%)</option>
              <option value="long">Longue (75%)</option>
              <option value="full">Pleine (100%)</option>
            </select>
          </Field>
          <Field label="Couleur">
            <DebouncedColorInput
              value={(content.color as string) || "#ffffff"}
              onChange={(val) => updateContent("color", val)}
              className="w-full h-10"
            />
          </Field>
        </div>
      );

    case "STATS":
      return (
        <div className="space-y-4">
          <StatsEditor
            stats={
              (content.stats as Array<{
                value: string;
                label: string;
                prefix?: string;
                suffix?: string;
              }>) || []
            }
            onChange={(stats) => updateContent("stats", stats)}
          />
          <Field label="Disposition">
            <select
              value={(content.layout as string) || "horizontal"}
              onChange={(e) => updateContent("layout", e.target.value)}
              className="input"
            >
              {STATS_LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 4}
              onChange={(e) =>
                updateContent("columns", parseInt(e.target.value))
              }
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
          <Field label="Espacement">
            <select
              value={(content.gap as string) || "md"}
              onChange={(e) => updateContent("gap", e.target.value)}
              className="input"
            >
              {GAP_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Style">
            <select
              value={(content.style as string) || "default"}
              onChange={(e) => updateContent("style", e.target.value)}
              className="input"
            >
              {CARD_STYLE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Couleur des valeurs">
            <DebouncedColorInput
              value={(content.valueColor as string) || "#ffffff"}
              onChange={(val) => updateContent("valueColor", val)}
              className="w-full h-10"
            />
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.animate as boolean) || false}
              onChange={(e) => updateContent("animate", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Animer les chiffres</span>
          </label>
        </div>
      );

    case "CARDS":
      return (
        <div className="space-y-4">
          <CardsEditor
            cards={
              (content.cards as Array<{
                title: string;
                description?: string;
                image?: string;
                link?: string;
              }>) || []
            }
            onChange={(cards) => updateContent("cards", cards)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style des cartes">
              <select
                value={(content.cardStyle as string) || "default"}
                onChange={(e) => updateContent("cardStyle", e.target.value)}
                className="input"
              >
                {CARD_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Colonnes">
              <select
                value={(content.columns as number) || 3}
                onChange={(e) =>
                  updateContent("columns", parseInt(e.target.value))
                }
                className="input"
              >
                <option value={2}>2 colonnes</option>
                <option value={3}>3 colonnes</option>
                <option value={4}>4 colonnes</option>
              </select>
            </Field>

            <Field label="Espacement">
              <select
                value={(content.gap as string) || "md"}
                onChange={(e) => updateContent("gap", e.target.value)}
                className="input"
              >
                {GAP_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Bords des cartes">
              <select
                value={(content.cardRadius as string) || "md"}
                onChange={(e) => updateContent("cardRadius", e.target.value)}
                className="input"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Images</h4>

            <Field label="Format des images">
              <select
                value={(content.imageRatio as string) || "video"}
                onChange={(e) => updateContent("imageRatio", e.target.value)}
                className="input"
              >
                {ASPECT_RATIO_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Couleurs et effets
            </h4>

            <Field label="Couleur d'accent">
              <DebouncedColorInput
                value={(content.accentColor as string) || "#D4A574"}
                onChange={(val) => updateContent("accentColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Effet au survol">
              <select
                value={(content.hoverEffect as string) || "lift"}
                onChange={(e) => updateContent("hoverEffect", e.target.value)}
                className="input"
              >
                {HOVER_EFFECT_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showImage as boolean) !== false}
                onChange={(e) => updateContent("showImage", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher les images</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showDescription as boolean) !== false}
                onChange={(e) =>
                  updateContent("showDescription", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher les descriptions
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showLink as boolean) !== false}
                onChange={(e) => updateContent("showLink", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher les liens</span>
            </label>
          </div>
        </div>
      );

    case "IFRAME":
      return (
        <div className="space-y-4">
          <Field label="URL">
            <input
              type="text"
              value={(content.url as string) || ""}
              onChange={(e) => updateContent("url", e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
          <Field label="Hauteur (px)">
            <input
              type="number"
              value={(content.height as number) || 400}
              onChange={(e) =>
                updateContent("height", parseInt(e.target.value))
              }
              className="input"
            />
          </Field>
        </div>
      );

    case "VIDEO":
      return (
        <div className="space-y-4">
          <Field label="URL de la vidéo">
            <input
              type="text"
              value={(content.url as string) || ""}
              onChange={(e) => updateContent("url", e.target.value)}
              className="input"
              placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
            />
          </Field>
          <p className="text-xs text-gray-600">
            Ou utilisez une vidéo locale :
          </p>
          <Field label="Fichier vidéo">
            <MediaPicker
              value={(content.src as string) || ""}
              onChange={(url) => updateContent("src", url)}
              acceptTypes="video"
              placeholder="Sélectionner une vidéo"
              showPreview={false}
            />
          </Field>
          <Field label="Poster (image d'aperçu)">
            <MediaPicker
              value={(content.poster as string) || ""}
              onChange={(url) => updateContent("poster", url)}
              acceptTypes="image"
              placeholder="Image d'aperçu"
              showPreview={true}
            />
          </Field>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Apparence</h4>

            <Field label="Format de la vidéo">
              <select
                value={(content.aspectRatio as string) || "video"}
                onChange={(e) => updateContent("aspectRatio", e.target.value)}
                className="input"
              >
                {ASPECT_RATIO_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Bords de la vidéo">
              <select
                value={(content.borderRadius as string) || "md"}
                onChange={(e) => updateContent("borderRadius", e.target.value)}
                className="input"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.autoplay as boolean) || false}
                onChange={(e) => updateContent("autoplay", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Lecture auto</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.loop as boolean) || false}
                onChange={(e) => updateContent("loop", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Boucle</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.muted as boolean) || false}
                onChange={(e) => updateContent("muted", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Muet</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.controls as boolean) !== false}
                onChange={(e) => updateContent("controls", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Contrôles</span>
            </label>
          </div>
        </div>
      );

    case "LIST":
      return (
        <div className="space-y-4">
          <ListItemsEditor
            items={(content.items as string[]) || []}
            onChange={(items) => updateContent("items", items)}
          />
          <Field label="Style">
            <select
              value={(content.style as string) || "bullet"}
              onChange={(e) => updateContent("style", e.target.value)}
              className="input"
            >
              <option value="bullet">Puces</option>
              <option value="numbered">Numérotée</option>
              <option value="check">Coches</option>
              <option value="arrow">Flèches</option>
            </select>
          </Field>
        </div>
      );

    case "GALLERY":
      return (
        <div className="space-y-4">
          <GalleryEditor
            images={
              (content.images as Array<{
                src: string;
                alt: string;
                caption?: string;
              }>) || []
            }
            onChange={(images) => updateContent("images", images)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "grid"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {GALLERY_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Colonnes">
              <select
                value={(content.columns as number) || 3}
                onChange={(e) =>
                  updateContent("columns", parseInt(e.target.value))
                }
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
                value={(content.gap as string) || "md"}
                onChange={(e) => updateContent("gap", e.target.value)}
                className="input"
              >
                {GAP_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Apparence des images
            </h4>

            <Field label="Format des images">
              <select
                value={(content.aspectRatio as string) || "auto"}
                onChange={(e) => updateContent("aspectRatio", e.target.value)}
                className="input"
              >
                {ASPECT_RATIO_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Bords des images">
              <select
                value={(content.imageRadius as string) || "md"}
                onChange={(e) => updateContent("imageRadius", e.target.value)}
                className="input"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Effet au survol">
              <select
                value={(content.hoverEffect as string) || "zoom"}
                onChange={(e) => updateContent("hoverEffect", e.target.value)}
                className="input"
              >
                {HOVER_EFFECT_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showCaptions as boolean) || false}
                onChange={(e) =>
                  updateContent("showCaptions", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher les légendes
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.lightbox as boolean) !== false}
                onChange={(e) => updateContent("lightbox", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Ouvrir en lightbox</span>
            </label>
          </div>
        </div>
      );

    case "FILE":
      return (
        <div className="space-y-4">
          <Field label="Fichier">
            <MediaPicker
              value={(content.url as string) || ""}
              onChange={(url) => updateContent("url", url)}
              acceptTypes="document"
              placeholder="Sélectionner un fichier"
              showPreview={false}
            />
          </Field>
          <Field label="Nom du fichier affiché">
            <input
              type="text"
              value={(content.name as string) || ""}
              onChange={(e) => updateContent("name", e.target.value)}
              className="input"
              placeholder="document.pdf"
            />
          </Field>
          <Field label="Description">
            <input
              type="text"
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              placeholder="Description du fichier"
            />
          </Field>
        </div>
      );

    case "GRID":
      return (
        <div className="space-y-4">
          {/* Items Editor */}
          <GridItemsEditor
            items={
              (content.items as Array<{
                title: string;
                description?: string;
                image?: string;
                link?: string;
                badge?: string;
              }>) || []
            }
            onChange={(items) => updateContent("items", items)}
          />
          
          {/* Layout Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Disposition</h4>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Colonnes">
                <select
                  value={(content.columns as number) || 3}
                  onChange={(e) =>
                    updateContent("columns", parseInt(e.target.value))
                  }
                  className="input"
                >
                  <option value={1}>1 colonne</option>
                  <option value={2}>2 colonnes</option>
                  <option value={3}>3 colonnes</option>
                  <option value={4}>4 colonnes</option>
                  <option value={5}>5 colonnes</option>
                  <option value={6}>6 colonnes</option>
                </select>
              </Field>
              <Field label="Écart">
                <select
                  value={(content.gap as string) || "md"}
                  onChange={(e) => updateContent("gap", e.target.value)}
                  className="input"
                >
                  {GAP_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Item Style Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Style des éléments</h4>
            <div className="space-y-3">
              <Field label="Style des cartes">
                <select
                  value={(content.itemStyle as string) || "default"}
                  onChange={(e) => updateContent("itemStyle", e.target.value)}
                  className="input"
                >
                  {CARD_STYLE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rayon bordure">
                  <select
                    value={(content.itemRadius as string) || "lg"}
                    onChange={(e) => updateContent("itemRadius", e.target.value)}
                    className="input"
                  >
                    {RADIUS_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Padding interne">
                  <select
                    value={(content.itemPadding as string) || "md"}
                    onChange={(e) => updateContent("itemPadding", e.target.value)}
                    className="input"
                  >
                    <option value="none">Aucun</option>
                    <option value="sm">Petit</option>
                    <option value="md">Moyen</option>
                    <option value="lg">Grand</option>
                    <option value="xl">Très grand</option>
                  </select>
                </Field>
              </div>
              <Field label="Couleur de fond">
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={(content.itemBgColor as string) || "#ffffff"}
                    onChange={(e) => updateContent("itemBgColor", e.target.value)}
                    className="h-9 w-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(content.itemBgColor as string) || ""}
                    onChange={(e) => updateContent("itemBgColor", e.target.value)}
                    className="input flex-1"
                    placeholder="Auto (selon le style)"
                  />
                  {Boolean(content.itemBgColor) && (
                    <button
                      onClick={() => updateContent("itemBgColor", undefined)}
                      className="px-2 text-gray-500 hover:text-red-500"
                      title="Réinitialiser"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </Field>
            </div>
          </div>

          {/* Image Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Images</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(content.showImage as boolean) !== false}
                  onChange={(e) => updateContent("showImage", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Afficher les images</span>
              </label>
              {(content.showImage as boolean) !== false && (
                <>
                  <Field label="Position de l'image">
                    <select
                      value={(content.imagePosition as string) || "top"}
                      onChange={(e) => updateContent("imagePosition", e.target.value)}
                      className="input"
                    >
                      <option value="top">En haut</option>
                      <option value="left">À gauche</option>
                      <option value="right">À droite</option>
                      <option value="background">En fond</option>
                    </select>
                  </Field>
                  <Field label="Format d'image">
                    <select
                      value={(content.imageAspect as string) || "video"}
                      onChange={(e) => updateContent("imageAspect", e.target.value)}
                      className="input"
                    >
                      <option value="video">16:9 (Vidéo)</option>
                      <option value="square">1:1 (Carré)</option>
                      <option value="portrait">3:4 (Portrait)</option>
                      <option value="wide">21:9 (Ultra-large)</option>
                      <option value="auto">Auto</option>
                    </select>
                  </Field>
                </>
              )}
            </div>
          </div>

          {/* Text Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Texte</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Taille du titre">
                  <select
                    value={(content.titleSize as string) || "md"}
                    onChange={(e) => updateContent("titleSize", e.target.value)}
                    className="input"
                  >
                    <option value="sm">Petit</option>
                    <option value="md">Moyen</option>
                    <option value="lg">Grand</option>
                  </select>
                </Field>
                <Field label="Alignement">
                  <select
                    value={(content.textAlign as string) || "left"}
                    onChange={(e) => updateContent("textAlign", e.target.value)}
                    className="input"
                  >
                    <option value="left">Gauche</option>
                    <option value="center">Centre</option>
                    <option value="right">Droite</option>
                  </select>
                </Field>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(content.showDescription as boolean) !== false}
                  onChange={(e) => updateContent("showDescription", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Afficher les descriptions</span>
              </label>
            </div>
          </div>
        </div>
      );

    case "LINK_BLOCK":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.text as string) || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              className="input"
              placeholder="Titre du lien"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={2}
              placeholder="Description courte"
            />
          </Field>
          <Field label="URL">
            <input
              type="text"
              value={(content.url as string) || ""}
              onChange={(e) => updateContent("url", e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.newTab as boolean) || false}
              onChange={(e) => updateContent("newTab", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Ouvrir dans un nouvel onglet</span>
          </div>
          <Field label="Image">
            <MediaPicker
              value={(content.image as string) || ""}
              onChange={(url) => updateContent("image", url)}
              acceptTypes="image"
              placeholder="Image (optionnelle)"
              showPreview={true}
            />
          </Field>
        </div>
      );

    case "ACCORDION":
      return (
        <div className="space-y-4">
          <AccordionItemsEditor
            items={
              (content.items as Array<{
                title: string;
                content: string;
                defaultOpen?: boolean;
              }>) || []
            }
            onChange={(items) => updateContent("items", items)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.allowMultiple as boolean) || false}
              onChange={(e) => updateContent("allowMultiple", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Autoriser plusieurs ouverts</span>
          </div>
        </div>
      );

    case "TABS":
      return (
        <div className="space-y-4">
          <TabsEditor
            tabs={
              (content.tabs as Array<{
                label: string;
                content: string;
                icon?: string;
              }>) || []
            }
            onChange={(tabs) => updateContent("tabs", tabs)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "default"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {TABS_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Position des onglets">
              <select
                value={(content.position as string) || "top"}
                onChange={(e) => updateContent("position", e.target.value)}
                className="input"
              >
                <option value="top">En haut</option>
                <option value="left">À gauche</option>
                <option value="bottom">En bas</option>
              </select>
            </Field>

            <Field label="Couleur active">
              <DebouncedColorInput
                value={(content.activeColor as string) || "#D4A574"}
                onChange={(val) => updateContent("activeColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showIcon as boolean) || false}
                onChange={(e) => updateContent("showIcon", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher les icônes</span>
            </label>
          </div>
        </div>
      );

    case "TABLE":
      return (
        <div className="space-y-4">
          <TableEditor
            headers={(content.headers as string[]) || []}
            rows={(content.rows as string[][]) || []}
            onHeadersChange={(headers) => updateContent("headers", headers)}
            onRowsChange={(rows) => updateContent("rows", rows)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Design du tableau
            </h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "default"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {TABLE_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Couleur d'en-tête">
              <DebouncedColorInput
                value={(content.headerColor as string) || "#1f2937"}
                onChange={(val) => updateContent("headerColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.striped as boolean) || false}
                onChange={(e) => updateContent("striped", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Lignes alternées</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.hoverable as boolean) || false}
                onChange={(e) => updateContent("hoverable", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Surbrillance au survol
              </span>
            </label>
          </div>
        </div>
      );

    case "TIMELINE":
      return (
        <div className="space-y-4">
          <TimelineEditor
            items={
              (content.items as Array<{
                date: string;
                title: string;
                description?: string;
                image?: string;
              }>) || []
            }
            onChange={(items) => updateContent("items", items)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "vertical"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {TIMELINE_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Couleur de la ligne">
              <DebouncedColorInput
                value={(content.lineColor as string) || "#D4A574"}
                onChange={(val) => updateContent("lineColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur des points">
              <DebouncedColorInput
                value={(content.dotColor as string) || "#D4A574"}
                onChange={(val) => updateContent("dotColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showImage as boolean) || false}
                onChange={(e) => updateContent("showImage", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher les images</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.animated as boolean) !== false}
                onChange={(e) => updateContent("animated", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Animer à l'apparition
              </span>
            </label>
          </div>
        </div>
      );

    case "MAP":
      return (
        <div className="space-y-4">
          <Field label="Adresse">
            <input
              type="text"
              value={(content.address as string) || ""}
              onChange={(e) => updateContent("address", e.target.value)}
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
                value={(content.lat as number) || ""}
                onChange={(e) =>
                  updateContent("lat", parseFloat(e.target.value) || undefined)
                }
                className="input"
                placeholder="48.8566"
              />
            </Field>
            <Field label="Longitude">
              <input
                type="number"
                step="any"
                value={(content.lng as number) || ""}
                onChange={(e) =>
                  updateContent("lng", parseFloat(e.target.value) || undefined)
                }
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
              onChange={(e) => updateContent("zoom", parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-700">
              Niveau {(content.zoom as number) || 14}
            </span>
          </Field>
          <Field label="Hauteur (px)">
            <input
              type="number"
              value={(content.height as number) || 400}
              onChange={(e) =>
                updateContent("height", parseInt(e.target.value))
              }
              className="input"
            />
          </Field>
        </div>
      );

    case "SOCIAL":
      return (
        <div className="space-y-4">
          <Field label="Plateforme">
            <select
              value={(content.platform as string) || "instagram"}
              onChange={(e) => updateContent("platform", e.target.value)}
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
              value={(content.embedCode as string) || ""}
              onChange={(e) => updateContent("embedCode", e.target.value)}
              className="input font-mono text-xs"
              rows={6}
              placeholder="Collez le code d'intégration fourni par la plateforme..."
            />
          </Field>
          <p className="text-xs text-gray-600">Ou utilisez une URL directe :</p>
          <Field label="URL du post">
            <input
              type="text"
              value={(content.url as string) || ""}
              onChange={(e) => updateContent("url", e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
        </div>
      );

    case "TEAM":
      return (
        <div className="space-y-4">
          <TeamMembersEditor
            members={
              (content.members as Array<{
                name: string;
                role: string;
                image?: string;
                bio?: string;
                social?: {
                  instagram?: string;
                  linkedin?: string;
                  email?: string;
                };
              }>) || []
            }
            onChange={(members) => updateContent("members", members)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "grid"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {TEAM_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Colonnes">
              <select
                value={(content.columns as number) || 3}
                onChange={(e) =>
                  updateContent("columns", parseInt(e.target.value))
                }
                className="input"
              >
                <option value={2}>2 colonnes</option>
                <option value={3}>3 colonnes</option>
                <option value={4}>4 colonnes</option>
              </select>
            </Field>

            <Field label="Espacement">
              <select
                value={(content.gap as string) || "md"}
                onChange={(e) => updateContent("gap", e.target.value)}
                className="input"
              >
                {GAP_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Photos</h4>

            <Field label="Format des photos">
              <select
                value={(content.imageShape as string) || "rounded"}
                onChange={(e) => updateContent("imageShape", e.target.value)}
                className="input"
              >
                <option value="rounded">Arrondi</option>
                <option value="circle">Cercle</option>
                <option value="square">Carré</option>
              </select>
            </Field>

            <Field label="Taille des photos">
              <select
                value={(content.imageSize as string) || "md"}
                onChange={(e) => updateContent("imageSize", e.target.value)}
                className="input"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Couleurs et effets
            </h4>

            <Field label="Couleur d'accent">
              <DebouncedColorInput
                value={(content.accentColor as string) || "#D4A574"}
                onChange={(val) => updateContent("accentColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Animation">
              <select
                value={(content.animation as string) || "none"}
                onChange={(e) => updateContent("animation", e.target.value)}
                className="input"
              >
                {ANIMATION_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Effet au survol">
              <select
                value={(content.hoverEffect as string) || "none"}
                onChange={(e) => updateContent("hoverEffect", e.target.value)}
                className="input"
              >
                {HOVER_EFFECT_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showBio as boolean) !== false}
                onChange={(e) => updateContent("showBio", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher la bio</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showSocial as boolean) !== false}
                onChange={(e) => updateContent("showSocial", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher les réseaux sociaux
              </span>
            </label>
          </div>
        </div>
      );

    case "TESTIMONIALS":
      return (
        <div className="space-y-4">
          <TestimonialsEditor
            testimonials={
              (content.testimonials as Array<{
                text: string;
                author: string;
                role?: string;
                company?: string;
                image?: string;
                rating?: number;
              }>) || []
            }
            onChange={(testimonials) =>
              updateContent("testimonials", testimonials)
            }
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "card"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {TESTIMONIAL_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Disposition">
            <select
              value={(content.layout as string) || "grid"}
              onChange={(e) => updateContent("layout", e.target.value)}
              className="input"
            >
              <option value="grid">Grille</option>
              <option value="carousel">Carrousel</option>
              <option value="masonry">Masonry</option>
              <option value="single">Une à la fois</option>
            </select>
          </Field>
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 2}
              onChange={(e) =>
                updateContent("columns", parseInt(e.target.value))
              }
              className="input"
            >
              <option value={1}>1 colonne</option>
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
            </select>
          </Field>
          <Field label="Espacement">
            <select
              value={(content.gap as string) || "md"}
              onChange={(e) => updateContent("gap", e.target.value)}
              className="input"
            >
              {GAP_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Couleurs et effets
            </h4>

            <Field label="Couleur d'accent">
              <DebouncedColorInput
                value={(content.accentColor as string) || "#D4A574"}
                onChange={(val) => updateContent("accentColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur de fond des cartes">
              <DebouncedColorInput
                value={(content.cardBackground as string) || "#ffffff"}
                onChange={(val) => updateContent("cardBackground", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Animation">
              <select
                value={(content.animation as string) || "none"}
                onChange={(e) => updateContent("animation", e.target.value)}
                className="input"
              >
                {ANIMATION_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showRating as boolean) !== false}
                onChange={(e) => updateContent("showRating", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher les étoiles
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showImage as boolean) !== false}
                onChange={(e) => updateContent("showImage", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher les photos</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showQuoteIcon as boolean) !== false}
                onChange={(e) =>
                  updateContent("showQuoteIcon", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher l'icône de citation
              </span>
            </label>
          </div>
        </div>
      );

    case "PRICING":
      return (
        <div className="space-y-4">
          <PricingPlansEditor
            plans={
              (content.plans as Array<{
                name: string;
                price: string;
                period?: string;
                description?: string;
                features: string[];
                highlighted?: boolean;
                buttonText?: string;
                buttonUrl?: string;
              }>) || []
            }
            onChange={(plans) => updateContent("plans", plans)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "default"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {PRICING_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Colonnes">
              <select
                value={(content.columns as number) || 3}
                onChange={(e) =>
                  updateContent("columns", parseInt(e.target.value))
                }
                className="input"
              >
                <option value={2}>2 colonnes</option>
                <option value={3}>3 colonnes</option>
                <option value={4}>4 colonnes</option>
              </select>
            </Field>

            <Field label="Espacement">
              <select
                value={(content.gap as string) || "md"}
                onChange={(e) => updateContent("gap", e.target.value)}
                className="input"
              >
                {GAP_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>

            <Field label="Couleur d'accent (plan mis en avant)">
              <DebouncedColorInput
                value={(content.accentColor as string) || "#D4A574"}
                onChange={(val) => updateContent("accentColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur de fond des cartes">
              <DebouncedColorInput
                value={(content.cardBackground as string) || "#ffffff"}
                onChange={(val) => updateContent("cardBackground", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showBadge as boolean) !== false}
                onChange={(e) => updateContent("showBadge", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher le badge "Populaire"
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showPeriod as boolean) !== false}
                onChange={(e) => updateContent("showPeriod", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher la période (/mois, /an...)
              </span>
            </label>
          </div>
        </div>
      );

    case "FAQ":
      return (
        <div className="space-y-4">
          <FAQEditor
            questions={
              (content.questions as Array<{
                question: string;
                answer: string;
              }>) || []
            }
            onChange={(questions) => updateContent("questions", questions)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "accordion"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {FAQ_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Disposition">
              <select
                value={(content.layout as string) || "single"}
                onChange={(e) => updateContent("layout", e.target.value)}
                className="input"
              >
                <option value="single">Une colonne</option>
                <option value="two-column">Deux colonnes</option>
              </select>
            </Field>

            <Field label="Espacement">
              <select
                value={(content.gap as string) || "md"}
                onChange={(e) => updateContent("gap", e.target.value)}
                className="input"
              >
                {GAP_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>

            <Field label="Couleur d'accent (icône, bordure)">
              <DebouncedColorInput
                value={(content.accentColor as string) || "#D4A574"}
                onChange={(val) => updateContent("accentColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur de fond des questions">
              <DebouncedColorInput
                value={(content.questionBackground as string) || "#f9fafb"}
                onChange={(val) => updateContent("questionBackground", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showIcon as boolean) !== false}
                onChange={(e) => updateContent("showIcon", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Afficher l'icône +/-
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.allowMultiple as boolean) || false}
                onChange={(e) =>
                  updateContent("allowMultiple", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Permettre plusieurs ouverts
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.startExpanded as boolean) || false}
                onChange={(e) =>
                  updateContent("startExpanded", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Premier élément ouvert par défaut
              </span>
            </label>
          </div>
        </div>
      );

    case "CONTACT_FORM":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Contactez-nous"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={2}
              placeholder="Description optionnelle"
            />
          </Field>
          <FormFieldsEditor
            fields={
              (content.fields as Array<{
                type: string;
                name: string;
                label: string;
                placeholder?: string;
                required?: boolean;
                options?: string[];
              }>) || []
            }
            onChange={(fields) => updateContent("fields", fields)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Design du formulaire
            </h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "default"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {FORM_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Disposition">
              <select
                value={(content.layout as string) || "stacked"}
                onChange={(e) => updateContent("layout", e.target.value)}
                className="input"
              >
                <option value="stacked">Empilée</option>
                <option value="inline">En ligne</option>
                <option value="two-column">Deux colonnes</option>
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>

            <Field label="Couleur du bouton">
              <DebouncedColorInput
                value={(content.buttonColor as string) || "#D4A574"}
                onChange={(val) => updateContent("buttonColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || "#ffffff"}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <Field label="Texte du bouton">
            <input
              type="text"
              value={(content.submitText as string) || "Envoyer"}
              onChange={(e) => updateContent("submitText", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Message de succès">
            <input
              type="text"
              value={(content.successMessage as string) || ""}
              onChange={(e) => updateContent("successMessage", e.target.value)}
              className="input"
              placeholder="Merci pour votre message !"
            />
          </Field>
          <Field label="Email destinataire">
            <input
              type="email"
              value={(content.recipientEmail as string) || ""}
              onChange={(e) => updateContent("recipientEmail", e.target.value)}
              className="input"
              placeholder="contact@example.com"
            />
          </Field>
        </div>
      );

    case "NEWSLETTER":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Restez informé"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={2}
              placeholder="Inscrivez-vous à notre newsletter..."
            />
          </Field>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "default"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {NEWSLETTER_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Disposition">
              <select
                value={(content.layout as string) || "horizontal"}
                onChange={(e) => updateContent("layout", e.target.value)}
                className="input"
              >
                <option value="horizontal">Horizontale</option>
                <option value="vertical">Verticale</option>
                <option value="centered">Centrée</option>
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>

            <Field label="Couleur du bouton">
              <DebouncedColorInput
                value={(content.buttonColor as string) || "#D4A574"}
                onChange={(val) => updateContent("buttonColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || "#ffffff"}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <Field label="Placeholder du champ email">
            <input
              type="text"
              value={(content.placeholder as string) || "Votre email"}
              onChange={(e) => updateContent("placeholder", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Texte du bouton">
            <input
              type="text"
              value={(content.buttonText as string) || "S'inscrire"}
              onChange={(e) => updateContent("buttonText", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Fournisseur">
            <select
              value={(content.provider as string) || "custom"}
              onChange={(e) => updateContent("provider", e.target.value)}
              className="input"
            >
              <option value="custom">Personnalisé</option>
              <option value="mailchimp">Mailchimp</option>
              <option value="sendinblue">Brevo (Sendinblue)</option>
            </select>
          </Field>
          {(content.provider === "mailchimp" ||
            content.provider === "sendinblue") && (
            <Field label="ID de la liste">
              <input
                type="text"
                value={(content.listId as string) || ""}
                onChange={(e) => updateContent("listId", e.target.value)}
                className="input"
                placeholder="ID de votre liste"
              />
            </Field>
          )}
        </div>
      );

    case "FEATURES":
      return (
        <div className="space-y-4">
          <FeaturesEditor
            features={
              (content.features as Array<{
                icon?: string;
                title: string;
                description: string;
                link?: string;
              }>) || []
            }
            onChange={(features) => updateContent("features", features)}
          />

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.style as string) || "icon-top"}
                onChange={(e) => updateContent("style", e.target.value)}
                className="input"
              >
                {FEATURE_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Colonnes">
              <select
                value={(content.columns as number) || 3}
                onChange={(e) =>
                  updateContent("columns", parseInt(e.target.value))
                }
                className="input"
              >
                <option value={2}>2 colonnes</option>
                <option value={3}>3 colonnes</option>
                <option value={4}>4 colonnes</option>
              </select>
            </Field>

            <Field label="Espacement">
              <select
                value={(content.gap as string) || "md"}
                onChange={(e) => updateContent("gap", e.target.value)}
                className="input"
              >
                {GAP_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Icônes</h4>

            <Field label="Style des icônes">
              <select
                value={(content.iconStyle as string) || "circle"}
                onChange={(e) => updateContent("iconStyle", e.target.value)}
                className="input"
              >
                <option value="circle">Cercle</option>
                <option value="square">Carré</option>
                <option value="rounded">Arrondi</option>
                <option value="none">Sans fond</option>
              </select>
            </Field>

            <Field label="Taille des icônes">
              <select
                value={(content.iconSize as string) || "md"}
                onChange={(e) => updateContent("iconSize", e.target.value)}
                className="input"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Couleur des icônes">
              <DebouncedColorInput
                value={(content.iconColor as string) || "#D4A574"}
                onChange={(val) => updateContent("iconColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Animation et effets
            </h4>

            <Field label="Animation">
              <select
                value={(content.animation as string) || "none"}
                onChange={(e) => updateContent("animation", e.target.value)}
                className="input"
              >
                {ANIMATION_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Effet au survol">
              <select
                value={(content.hoverEffect as string) || "none"}
                onChange={(e) => updateContent("hoverEffect", e.target.value)}
                className="input"
              >
                {HOVER_EFFECT_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      );

    case "COLUMNS":
      return (
        <div className="space-y-4">
          <ColumnsEditor
            columns={
              (content.columns as Array<{
                width?: number;
                content?: string;
              }>) || [
                { width: 50, content: "" },
                { width: 50, content: "" },
              ]
            }
            onChange={(columns) => updateContent("columns", columns)}
          />
          <Field label="Écart entre colonnes">
            <select
              value={(content.gap as string) || "medium"}
              onChange={(e) => updateContent("gap", e.target.value)}
              className="input"
            >
              <option value="none">Aucun</option>
              <option value="small">Petit (16px)</option>
              <option value="medium">Moyen (32px)</option>
              <option value="large">Grand (48px)</option>
            </select>
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.stackOnMobile as boolean) !== false}
              onChange={(e) => updateContent("stackOnMobile", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">Empiler sur mobile</span>
          </label>
        </div>
      );

    case "CONTAINER":
      return (
        <div className="space-y-4">
          <Field label="Contenu HTML">
            <textarea
              value={(content.content as string) || ""}
              onChange={(e) => updateContent("content", e.target.value)}
              className="input font-mono text-xs"
              rows={8}
              placeholder="<p>Votre contenu HTML ici...</p>"
            />
          </Field>
          <Field label="Largeur">
            <select
              value={(content.width as string) || "MEDIUM"}
              onChange={(e) => updateContent("width", e.target.value)}
              className="input"
            >
              <option value="NARROW">Étroit (max-w-2xl)</option>
              <option value="MEDIUM">Moyen (max-w-4xl)</option>
              <option value="WIDE">Large (max-w-6xl)</option>
              <option value="FULL">Plein (max-w-7xl)</option>
              <option value="EDGE">Bord à bord</option>
            </select>
          </Field>
        </div>
      );

    case "INFO_BOX":
      return (
        <div className="space-y-4">
          {/* Content */}
          <Field label="Icône">
            <IconPicker
              value={(content.icon as string) || "Info"}
              onChange={(iconName) => updateContent("icon", iconName)}
              placeholder="Choisir une icône"
            />
          </Field>
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Titre de l'info"
            />
          </Field>
          <Field label="Contenu principal">
            <textarea
              value={(content.content as string) || ""}
              onChange={(e) => updateContent("content", e.target.value)}
              className="input"
              rows={3}
              placeholder="Contenu (adresse, numéro, etc.)"
            />
          </Field>
          <Field label="Contenu secondaire">
            <input
              type="text"
              value={(content.secondaryContent as string) || ""}
              onChange={(e) => updateContent("secondaryContent", e.target.value)}
              className="input"
              placeholder="Info supplémentaire"
            />
          </Field>
          <Field label="Lien secondaire">
            <input
              type="text"
              value={(content.secondaryLink as string) || ""}
              onChange={(e) => updateContent("secondaryLink", e.target.value)}
              className="input"
              placeholder="URL du lien secondaire"
            />
          </Field>
          <Field label="Lien principal">
            <input
              type="text"
              value={(content.link as string) || ""}
              onChange={(e) => updateContent("link", e.target.value)}
              className="input"
              placeholder="URL (optionnel)"
            />
          </Field>
          <Field label="Texte du lien">
            <input
              type="text"
              value={(content.linkLabel as string) || ""}
              onChange={(e) => updateContent("linkLabel", e.target.value)}
              className="input"
              placeholder="Voir sur la carte"
            />
          </Field>

          {/* Style Options */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Style</h4>
            <Field label="Variante">
              <select
                value={(content.variant as string) || "default"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="input"
              >
                <option value="default">Par défaut</option>
                <option value="compact">Compact</option>
                <option value="card">Carte</option>
              </select>
            </Field>
            <Field label="Couleur de l'icône">
              <DebouncedColorInput
                value={(content.iconColor as string) || "#f59e0b"}
                onChange={(val) => updateContent("iconColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || ""}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur du texte">
              <DebouncedColorInput
                value={(content.textColor as string) || ""}
                onChange={(val) => updateContent("textColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>
        </div>
      );

    case "HOURS_TABLE":
      return (
        <div className="space-y-4">
          {/* Content */}
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Horaires d'ouverture"
            />
          </Field>
          <HoursEditor
            hours={(content.hours as Record<string, string>) || {}}
            onChange={(hours) => updateContent("hours", hours)}
          />
          
          {/* Display Options */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Affichage</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(content.showIcon as boolean) !== false}
                  onChange={(e) => updateContent("showIcon", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Afficher icône</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(content.highlightToday as boolean) || false}
                  onChange={(e) =>
                    updateContent("highlightToday", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Mettre en avant aujourd'hui</span>
              </label>
            </div>
            <Field label="Variante">
              <select
                value={(content.variant as string) || "table"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="input"
              >
                <option value="table">Tableau</option>
                <option value="list">Liste</option>
                <option value="compact">Compact</option>
                <option value="cards">Cartes</option>
              </select>
            </Field>
          </div>

          {/* Style Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Style</h4>
            <Field label="Couleur d'accent">
              <DebouncedColorInput
                value={(content.accentColor as string) || "#f59e0b"}
                onChange={(val) => updateContent("accentColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || ""}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur du texte">
              <DebouncedColorInput
                value={(content.textColor as string) || ""}
                onChange={(val) => updateContent("textColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>
        </div>
      );

    case "SERVICES_LIST":
      return (
        <div className="space-y-4">
          {/* Content */}
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Nos services"
            />
          </Field>
          <Field label="Sous-titre">
            <input
              type="text"
              value={(content.subtitle as string) || ""}
              onChange={(e) => updateContent("subtitle", e.target.value)}
              className="input"
              placeholder="Description courte"
            />
          </Field>
          <ServicesListEditor
            services={(content.services as (string | { text: string; _styles?: Record<string, unknown> })[]) || []}
            onChange={(services) => updateContent("services", services)}
          />

          {/* Layout Options */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Disposition</h4>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Colonnes">
                <select
                  value={(content.columns as number) || 2}
                  onChange={(e) =>
                    updateContent("columns", parseInt(e.target.value))
                  }
                  className="input"
                >
                  <option value={1}>1 colonne</option>
                  <option value={2}>2 colonnes</option>
                  <option value={3}>3 colonnes</option>
                </select>
              </Field>
              <Field label="Variante">
                <select
                  value={(content.variant as string) || "bullets"}
                  onChange={(e) => updateContent("variant", e.target.value)}
                  className="input"
                >
                  <option value="bullets">Puces</option>
                  <option value="checks">Coches</option>
                  <option value="cards">Cartes</option>
                  <option value="badges">Badges</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Style Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Style</h4>
            <Field label="Couleur des icônes">
              <DebouncedColorInput
                value={(content.iconColor as string) || "#f59e0b"}
                onChange={(val) => updateContent("iconColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || ""}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur du texte">
              <DebouncedColorInput
                value={(content.textColor as string) || ""}
                onChange={(val) => updateContent("textColor", val)}
                className="w-full h-10"
              />
            </Field>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={(content.showTitle as boolean) !== false}
                onChange={(e) => updateContent("showTitle", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher le titre</span>
            </label>
          </div>
        </div>
      );

    case "CTA_CARD":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Prenez rendez-vous"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={2}
              placeholder="Description du CTA"
            />
          </Field>
          
          {/* Title Icon */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={(content.showIcon as boolean) !== false}
                onChange={(e) => updateContent("showIcon", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Afficher une icône dans le titre</span>
            </label>
            {(content.showIcon as boolean) !== false && (
              <Field label="Icône du titre">
                <IconPicker
                  value={(content.icon as string) || "Calendar"}
                  onChange={(iconName) => updateContent("icon", iconName)}
                  placeholder="Choisir une icône"
                />
              </Field>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <span className="text-xs font-medium text-gray-700">
              Bouton principal
            </span>
            <input
              type="text"
              value={
                ((content.primaryButton as Record<string, unknown>)
                  ?.label as string) || ""
              }
              onChange={(e) =>
                updateContent("primaryButton", {
                  ...((content.primaryButton as Record<string, unknown>) || {}),
                  label: e.target.value,
                })
              }
              className="input"
              placeholder="Texte du bouton"
            />
            <input
              type="text"
              value={
                ((content.primaryButton as Record<string, unknown>)
                  ?.url as string) || ""
              }
              onChange={(e) =>
                updateContent("primaryButton", {
                  ...((content.primaryButton as Record<string, unknown>) || {}),
                  url: e.target.value,
                })
              }
              className="input"
              placeholder="URL"
            />
            <Field label="Icône du bouton">
              <IconPicker
                value={((content.primaryButton as Record<string, unknown>)?.icon as string) || ""}
                onChange={(iconName) =>
                  updateContent("primaryButton", {
                    ...((content.primaryButton as Record<string, unknown>) || {}),
                    icon: iconName,
                  })
                }
                placeholder="Aucune icône"
              />
            </Field>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <span className="text-xs font-medium text-gray-700">
              Bouton secondaire (optionnel)
            </span>
            <input
              type="text"
              value={
                ((content.secondaryButton as Record<string, unknown>)
                  ?.label as string) || ""
              }
              onChange={(e) =>
                updateContent("secondaryButton", {
                  ...((content.secondaryButton as Record<string, unknown>) ||
                    {}),
                  label: e.target.value,
                })
              }
              className="input"
              placeholder="Texte du bouton"
            />
            <input
              type="text"
              value={
                ((content.secondaryButton as Record<string, unknown>)
                  ?.url as string) || ""
              }
              onChange={(e) =>
                updateContent("secondaryButton", {
                  ...((content.secondaryButton as Record<string, unknown>) ||
                    {}),
                  url: e.target.value,
                })
              }
              className="input"
              placeholder="URL"
            />
            <Field label="Icône du bouton">
              <IconPicker
                value={((content.secondaryButton as Record<string, unknown>)?.icon as string) || ""}
                onChange={(iconName) =>
                  updateContent("secondaryButton", {
                    ...((content.secondaryButton as Record<string, unknown>) || {}),
                    icon: iconName,
                  })
                }
                placeholder="Aucune icône"
              />
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Design du bloc</h4>

            <Field label="Style visuel">
              <select
                value={(content.variant as string) || (content.style as string) || "default"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="input"
              >
                {CTA_STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Alignement">
              <select
                value={(content.alignment as string) || "center"}
                onChange={(e) => updateContent("alignment", e.target.value)}
                className="input"
              >
                {TEXT_ALIGN_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-6 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>

            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || ""}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur du bouton principal">
              <DebouncedColorInput
                value={(content.buttonColor as string) || ""}
                onChange={(val) => updateContent("buttonColor", val)}
                className="w-full h-10"
              />
            </Field>

            <Field label="Couleur du texte">
              <DebouncedColorInput
                value={(content.textColor as string) || ""}
                onChange={(val) => updateContent("textColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>
        </div>
      );

    case "REVIEW_BADGE":
      return (
        <div className="space-y-4">
          {/* Content */}
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Avis clients"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Note (sur 5)">
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={(content.rating as number) || 0}
                onChange={(e) =>
                  updateContent("rating", parseFloat(e.target.value))
                }
                className="input"
              />
            </Field>
            <Field label="Nombre d'avis">
              <input
                type="number"
                min={0}
                value={(content.reviewCount as number) || 0}
                onChange={(e) =>
                  updateContent("reviewCount", parseInt(e.target.value))
                }
                className="input"
              />
            </Field>
          </div>
          <Field label="Source">
            <input
              type="text"
              value={(content.source as string) || ""}
              onChange={(e) => updateContent("source", e.target.value)}
              className="input"
              placeholder="Google, Trustpilot..."
            />
          </Field>
          <Field label="URL de la source">
            <input
              type="text"
              value={(content.sourceUrl as string) || ""}
              onChange={(e) => updateContent("sourceUrl", e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>

          {/* Display Options */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Affichage</h4>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showStars as boolean) !== false}
                onChange={(e) => updateContent("showStars", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Afficher les étoiles</span>
            </label>
            <Field label="Variante">
              <select
                value={(content.variant as string) || "default"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="input"
              >
                <option value="default">Par défaut</option>
                <option value="compact">Compact</option>
                <option value="detailed">Détaillé</option>
              </select>
            </Field>
          </div>

          {/* Style Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Style</h4>
            <Field label="Couleur des étoiles">
              <DebouncedColorInput
                value={(content.starColor as string) || "#f59e0b"}
                onChange={(val) => updateContent("starColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || ""}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur du texte">
              <DebouncedColorInput
                value={(content.textColor as string) || ""}
                onChange={(val) => updateContent("textColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>
        </div>
      );

    case "LOCATION_CARD":
      return (
        <div className="space-y-4">
          {/* Content */}
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Notre adresse"
            />
          </Field>
          <Field label="Adresse">
            <textarea
              value={(content.address as string) || ""}
              onChange={(e) => updateContent("address", e.target.value)}
              className="input"
              rows={2}
              placeholder="123 Rue Example&#10;97400 Saint-Denis"
            />
          </Field>
          <Field label="URL Google Maps">
            <input
              type="text"
              value={(content.mapUrl as string) || ""}
              onChange={(e) => updateContent("mapUrl", e.target.value)}
              className="input"
              placeholder="https://maps.google.com/..."
            />
          </Field>
          <Field label="URL d'intégration carte">
            <input
              type="text"
              value={(content.embedUrl as string) || ""}
              onChange={(e) => updateContent("embedUrl", e.target.value)}
              className="input"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </Field>

          {/* Display Options */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Affichage</h4>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showPreview as boolean) || false}
                onChange={(e) => updateContent("showPreview", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Afficher aperçu de la carte</span>
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={(content.showIcon as boolean) !== false}
                onChange={(e) => updateContent("showIcon", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Afficher icône</span>
            </label>
            <Field label="Variante">
              <select
                value={(content.variant as string) || "default"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="input"
              >
                <option value="default">Par défaut</option>
                <option value="compact">Compact</option>
                <option value="map-only">Carte uniquement</option>
              </select>
            </Field>
          </div>

          {/* Style Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Style</h4>
            <Field label="Couleur d'accent">
              <DebouncedColorInput
                value={(content.accentColor as string) || "#f59e0b"}
                onChange={(val) => updateContent("accentColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || ""}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur du texte">
              <DebouncedColorInput
                value={(content.textColor as string) || ""}
                onChange={(val) => updateContent("textColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>
        </div>
      );

    case "ICON_FEATURE":
      return (
        <div className="space-y-4">
          {/* Content */}
          <Field label="Icône">
            <IconPicker
              value={(content.icon as string) || "Star"}
              onChange={(iconName) => updateContent("icon", iconName)}
              placeholder="Choisir une icône"
            />
          </Field>
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Titre de la fonctionnalité"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={2}
              placeholder="Description"
            />
          </Field>
          <Field label="Lien">
            <input
              type="text"
              value={(content.link as string) || ""}
              onChange={(e) => updateContent("link", e.target.value)}
              className="input"
              placeholder="URL (optionnel)"
            />
          </Field>

          {/* Style Options */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Style</h4>
            <Field label="Variante">
              <select
                value={(content.variant as string) || "default"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="input"
              >
                <option value="default">Par défaut</option>
                <option value="card">Carte</option>
                <option value="centered">Centré</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </Field>
            <Field label="Couleur de l'icône">
              <DebouncedColorInput
                value={(content.iconColor as string) || "#f59e0b"}
                onChange={(val) => updateContent("iconColor", val)}
                className="w-full h-10"
              />
            </Field>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={(content.iconBackground as boolean) !== false}
                onChange={(e) =>
                  updateContent("iconBackground", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Fond d'icône</span>
            </label>
          </div>

          {/* Colors */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>
            <Field label="Couleur de fond">
              <DebouncedColorInput
                value={(content.backgroundColor as string) || ""}
                onChange={(val) => updateContent("backgroundColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur du titre">
              <DebouncedColorInput
                value={(content.titleColor as string) || ""}
                onChange={(val) => updateContent("titleColor", val)}
                className="w-full h-10"
              />
            </Field>
            <Field label="Couleur de la description">
              <DebouncedColorInput
                value={(content.descriptionColor as string) || ""}
                onChange={(val) => updateContent("descriptionColor", val)}
                className="w-full h-10"
              />
            </Field>
          </div>
        </div>
      );

    // ============================================
    // STORE BLOCKS
    // ============================================

    case "STORE_HERO":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Nom de la boutique"
            />
          </Field>
          <Field label="Sous-titre">
            <input
              type="text"
              value={(content.subtitle as string) || ""}
              onChange={(e) => updateContent("subtitle", e.target.value)}
              className="input"
              placeholder="Slogan ou adresse"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={2}
              placeholder="Description de la boutique"
            />
          </Field>
          <Field label="Image de fond">
            <MediaPicker
              value={(content.backgroundImage as string) || ""}
              onChange={(url) => updateContent("backgroundImage", url)}
              acceptTypes="image"
              placeholder="Sélectionner une image"
              showPreview={true}
            />
          </Field>
          <ButtonsEditor
            buttons={
              (content.buttons as Array<{
                label: string;
                href: string;
                variant?: string;
                openInNewTab?: boolean;
              }>) || []
            }
            onChange={(buttons) => updateContent("buttons", buttons)}
          />
        </div>
      );

    case "STORE_CONTACT":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Informations de contact"
            />
          </Field>
          <Field label="Adresse">
            <textarea
              value={(content.address as string) || ""}
              onChange={(e) => updateContent("address", e.target.value)}
              className="input"
              rows={2}
              placeholder="Adresse complète"
            />
          </Field>
          <Field label="Téléphone">
            <input
              type="text"
              value={(content.phone as string) || ""}
              onChange={(e) => updateContent("phone", e.target.value)}
              className="input"
              placeholder="02 62 XX XX XX"
            />
          </Field>
          <Field label="Téléphone 2 (optionnel)">
            <input
              type="text"
              value={(content.phone2 as string) || ""}
              onChange={(e) => updateContent("phone2", e.target.value)}
              className="input"
              placeholder="06 92 XX XX XX"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={(content.email as string) || ""}
              onChange={(e) => updateContent("email", e.target.value)}
              className="input"
              placeholder="contact@exemple.re"
            />
          </Field>
          <HoursEditor
            hours={(content.hours as Record<string, string>) || {}}
            onChange={(hours) => updateContent("hours", hours)}
          />
        </div>
      );

    case "STORE_SERVICES":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Nos services"
            />
          </Field>
          <FeaturesEditor
            features={
              (content.features as Array<{
                icon?: string;
                title: string;
                description: string;
                link?: string;
              }>) || []
            }
            onChange={(features) => updateContent("features", features)}
          />
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) =>
                updateContent("columns", parseInt(e.target.value))
              }
              className="input"
            >
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
        </div>
      );

    case "STORE_CTA":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Prenez rendez-vous"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={2}
              placeholder="Description"
            />
          </Field>
          <Field label="URL du bouton principal">
            <input
              type="text"
              value={(content.buttonUrl as string) || ""}
              onChange={(e) => updateContent("buttonUrl", e.target.value)}
              className="input"
              placeholder="URL de réservation"
            />
          </Field>
          <Field label="Texte du bouton">
            <input
              type="text"
              value={(content.buttonText as string) || ""}
              onChange={(e) => updateContent("buttonText", e.target.value)}
              className="input"
              placeholder="Réserver maintenant"
            />
          </Field>
          <Field label="Téléphone">
            <input
              type="text"
              value={(content.phone as string) || ""}
              onChange={(e) => updateContent("phone", e.target.value)}
              className="input"
              placeholder="Pour afficher un bouton appeler"
            />
          </Field>
        </div>
      );

    case "STORE_REVIEWS":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Avis clients"
            />
          </Field>
          <Field label="Note (sur 5)">
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={(content.rating as number) || 0}
              onChange={(e) =>
                updateContent("rating", parseFloat(e.target.value))
              }
              className="input"
            />
          </Field>
          <Field label="Nombre d'avis">
            <input
              type="number"
              min={0}
              value={(content.reviewCount as number) || 0}
              onChange={(e) =>
                updateContent("reviewCount", parseInt(e.target.value))
              }
              className="input"
            />
          </Field>
          <Field label="Source (Google, etc.)">
            <input
              type="text"
              value={(content.source as string) || ""}
              onChange={(e) => updateContent("source", e.target.value)}
              className="input"
              placeholder="Google"
            />
          </Field>
          <Field label="URL vers les avis">
            <input
              type="text"
              value={(content.reviewsUrl as string) || ""}
              onChange={(e) => updateContent("reviewsUrl", e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
        </div>
      );

    case "STORE_MAP":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Nous trouver"
            />
          </Field>
          <Field label="URL d'intégration Google Maps">
            <textarea
              value={(content.embedUrl as string) || ""}
              onChange={(e) => updateContent("embedUrl", e.target.value)}
              className="input font-mono text-xs"
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </Field>
          <Field label="Hauteur (px)">
            <input
              type="number"
              min={200}
              max={800}
              value={(content.height as number) || 400}
              onChange={(e) =>
                updateContent("height", parseInt(e.target.value))
              }
              className="input"
            />
          </Field>
          <Field label="Adresse (texte)">
            <textarea
              value={(content.address as string) || ""}
              onChange={(e) => updateContent("address", e.target.value)}
              className="input"
              rows={2}
              placeholder="Adresse affichée sous la carte"
            />
          </Field>
        </div>
      );

    case "STORE_LIST":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="input"
              placeholder="Nos boutiques"
            />
          </Field>
          <Field label="Sous-titre">
            <input
              type="text"
              value={(content.subtitle as string) || ""}
              onChange={(e) => updateContent("subtitle", e.target.value)}
              className="input"
              placeholder="Trouvez la boutique la plus proche"
            />
          </Field>
          <Field label="Colonnes">
            <select
              value={(content.columns as number) || 3}
              onChange={(e) =>
                updateContent("columns", parseInt(e.target.value))
              }
              className="input"
            >
              <option value={1}>1 colonne</option>
              <option value={2}>2 colonnes</option>
              <option value={3}>3 colonnes</option>
              <option value={4}>4 colonnes</option>
            </select>
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.showRating as boolean) !== false}
              onChange={(e) => updateContent("showRating", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">Afficher les notes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(content.showPhone as boolean) !== false}
              onChange={(e) => updateContent("showPhone", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">Afficher les téléphones</span>
          </label>
        </div>
      );

    case "STORE_LAYOUT":
      return (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>STORE_LAYOUT</strong> est un bloc composite qui génère
              automatiquement une mise en page complète pour les pages de
              boutique. Configurez les sections individuelles ci-dessous.
            </p>
          </div>
          <Field label="Nom de la boutique">
            <input
              type="text"
              value={(content.storeName as string) || ""}
              onChange={(e) => updateContent("storeName", e.target.value)}
              className="input"
              placeholder="ODB Saint-Denis"
            />
          </Field>
          <Field label="Slogan">
            <input
              type="text"
              value={(content.tagline as string) || ""}
              onChange={(e) => updateContent("tagline", e.target.value)}
              className="input"
              placeholder="Votre opticien de confiance"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={(content.description as string) || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="input"
              rows={3}
              placeholder="Description de la boutique"
            />
          </Field>
          <Field label="Image hero">
            <MediaPicker
              value={(content.heroImage as string) || ""}
              onChange={(url) => updateContent("heroImage", url)}
              acceptTypes="image"
              placeholder="Image principale"
              showPreview={true}
            />
          </Field>
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">Type de bloc : {block.type}</p>
          <p>Configurez ce bloc via les onglets Style et Paramètres.</p>
        </div>
      );
  }
}
