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
import { Field } from "./Field";
import { ContentEditorProps } from "./types";
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
        </div>
      );

    case "TEXT":
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
              value={(content.href as string) || ""}
              onChange={(e) => updateContent("href", e.target.value)}
              className="input"
              placeholder="/page-destination"
            />
          </Field>
          <Field label="Style">
            <select
              value={(content.variant as string) || "primary"}
              onChange={(e) => updateContent("variant", e.target.value)}
              className="input"
            >
              <option value="primary">Principal (noir)</option>
              <option value="secondary">Secondaire (blanc)</option>
              <option value="outline">Contour</option>
              <option value="ghost">Fantôme</option>
            </select>
          </Field>
          <Field label="Taille">
            <select
              value={(content.size as string) || "md"}
              onChange={(e) => updateContent("size", e.target.value)}
              className="input"
            >
              <option value="sm">Petit</option>
              <option value="md">Moyen</option>
              <option value="lg">Grand</option>
            </select>
          </Field>
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
        </div>
      );

    case "SPACER":
      return (
        <div className="space-y-4">
          <Field label="Hauteur (px)">
            <input
              type="number"
              value={(content.height as number) || 40}
              onChange={(e) =>
                updateContent("height", parseInt(e.target.value))
              }
              className="input"
              min="0"
              max="500"
              step="10"
            />
          </Field>
          <div
            className="h-8 bg-gray-200 rounded"
            style={{
              height: `${Math.min((content.height as number) || 40, 100)}px`,
            }}
          />
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
              <option value="solid">Ligne pleine</option>
              <option value="dashed">Pointillés</option>
              <option value="dotted">Points</option>
              <option value="double">Double ligne</option>
            </select>
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
          <div className="flex gap-4">
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
              value={(content.variant as string) || "bullet"}
              onChange={(e) => updateContent("variant", e.target.value)}
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
          <Field label="Disposition">
            <select
              value={(content.layout as string) || "grid"}
              onChange={(e) => updateContent("layout", e.target.value)}
              className="input"
            >
              <option value="grid">Grille</option>
              <option value="masonry">Masonry</option>
              <option value="carousel">Carrousel</option>
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
          <Field label="Écart (gap)">
            <select
              value={(content.gap as string) || "md"}
              onChange={(e) => updateContent("gap", e.target.value)}
              className="input"
            >
              <option value="sm">Petit</option>
              <option value="md">Moyen</option>
              <option value="lg">Grand</option>
            </select>
          </Field>
        </div>
      );

    case "LINK_BLOCK":
      return (
        <div className="space-y-4">
          <Field label="Titre">
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => updateContent("title", e.target.value)}
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
              value={(content.href as string) || ""}
              onChange={(e) => updateContent("href", e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </Field>
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
          <Field label="Comportement">
            <select
              value={(content.behavior as string) || "single"}
              onChange={(e) => updateContent("behavior", e.target.value)}
              className="input"
            >
              <option value="single">Un seul ouvert</option>
              <option value="multiple">Plusieurs ouverts</option>
            </select>
          </Field>
        </div>
      );

    case "TABS":
      return (
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
      );

    case "TABLE":
      return (
        <TableEditor
          headers={(content.headers as string[]) || []}
          rows={(content.rows as string[][]) || []}
          onHeadersChange={(headers) => updateContent("headers", headers)}
          onRowsChange={(rows) => updateContent("rows", rows)}
        />
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
          <Field label="Direction">
            <select
              value={(content.direction as string) || "vertical"}
              onChange={(e) => updateContent("direction", e.target.value)}
              className="input"
            >
              <option value="vertical">Verticale</option>
              <option value="alternating">Alternée</option>
            </select>
          </Field>
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
          <Field label="Variante">
            <select
              value={(content.variant as string) || "card"}
              onChange={(e) => updateContent("variant", e.target.value)}
              className="input"
            >
              <option value="card">Carte complète</option>
              <option value="minimal">Minimal</option>
              <option value="profile">Profil détaillé</option>
            </select>
          </Field>
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
          <Field label="Disposition">
            <select
              value={(content.layout as string) || "grid"}
              onChange={(e) => updateContent("layout", e.target.value)}
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
          <Field label="Disposition">
            <select
              value={(content.layout as string) || "accordion"}
              onChange={(e) => updateContent("layout", e.target.value)}
              className="input"
            >
              <option value="accordion">Accordéon</option>
              <option value="cards">Cartes</option>
              <option value="two-column">Deux colonnes</option>
            </select>
          </Field>
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
          <Field label="Disposition">
            <select
              value={(content.layout as string) || "cards"}
              onChange={(e) => updateContent("layout", e.target.value)}
              className="input"
            >
              <option value="cards">Cartes</option>
              <option value="list">Liste</option>
              <option value="icons">Icônes centrées</option>
            </select>
          </Field>
          <Field label="Style des icônes">
            <select
              value={(content.iconStyle as string) || "circle"}
              onChange={(e) => updateContent("iconStyle", e.target.value)}
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
