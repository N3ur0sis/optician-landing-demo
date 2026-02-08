"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";
import { IconPicker } from "@/components/ui/icon-picker";
import { Field } from "./Field";
import {
  StatItem,
  CardItem,
  GalleryImage,
  GridItem,
  AccordionItem,
  TabItem,
  TimelineItem,
  TeamMember,
  Testimonial,
  PricingPlan,
  FAQItem,
  FormField,
  FeatureItem,
  BUTTON_VARIANTS,
  FORM_FIELD_TYPES,
} from "./types";

// Stats Editor
export function StatsEditor({
  stats,
  onChange,
}: {
  stats: StatItem[];
  onChange: (stats: StatItem[]) => void;
}) {
  const addStat = () => onChange([...stats, { value: "0", label: "Label" }]);
  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange(newStats);
  };
  const removeStat = (index: number) =>
    onChange(stats.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Stat {index + 1}
            </span>
            <button
              onClick={() => removeStat(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={stat.value}
            onChange={(e) => updateStat(index, "value", e.target.value)}
            className="input"
            placeholder="Valeur"
          />
          <input
            type="text"
            value={stat.label}
            onChange={(e) => updateStat(index, "label", e.target.value)}
            className="input"
            placeholder="Label"
          />
        </div>
      ))}
      <button
        onClick={addStat}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une statistique
      </button>
    </div>
  );
}

// Cards Editor
export function CardsEditor({
  cards,
  onChange,
}: {
  cards: CardItem[];
  onChange: (cards: CardItem[]) => void;
}) {
  const addCard = () => onChange([...cards, { title: "Nouvelle carte" }]);
  const updateCard = (index: number, field: string, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange(newCards);
  };
  const removeCard = (index: number) =>
    onChange(cards.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Carte {index + 1}
            </span>
            <button
              onClick={() => removeCard(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={card.title}
            onChange={(e) => updateCard(index, "title", e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={card.description || ""}
            onChange={(e) => updateCard(index, "description", e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          <MediaPicker
            value={card.image || ""}
            onChange={(url) => updateCard(index, "image", url)}
            acceptTypes="image"
            placeholder="Sélectionner une image"
            showPreview={false}
          />
          <input
            type="text"
            value={card.link || ""}
            onChange={(e) => updateCard(index, "link", e.target.value)}
            className="input"
            placeholder="Lien"
          />
        </div>
      ))}
      <button
        onClick={addCard}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une carte
      </button>
    </div>
  );
}

// List Items Editor
export function ListItemsEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const addItem = () => onChange([...items, ""]);
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };
  const removeItem = (index: number) =>
    onChange(items.filter((_, i) => i !== index));
  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [
        newItems[newIndex],
        newItems[index],
      ];
      onChange(newItems);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Éléments
      </label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => moveItem(index, "up")}
              disabled={index === 0}
              className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
            >
              <ChevronDown className="w-3 h-3 rotate-180" />
            </button>
            <button
              onClick={() => moveItem(index, "down")}
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
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un élément
      </button>
    </div>
  );
}

// Gallery Editor
export function GalleryEditor({
  images,
  onChange,
}: {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}) {
  const addImage = () => onChange([...images, { src: "", alt: "" }]);
  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange(newImages);
  };
  const removeImage = (index: number) =>
    onChange(images.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Images
      </label>
      {images.map((image, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Image {index + 1}
            </span>
            <button
              onClick={() => removeImage(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <MediaPicker
            value={image.src}
            onChange={(url) => updateImage(index, "src", url)}
            acceptTypes="image"
            placeholder="Sélectionner une image"
            showPreview={true}
          />
          <input
            type="text"
            value={image.alt}
            onChange={(e) => updateImage(index, "alt", e.target.value)}
            className="input"
            placeholder="Texte alternatif"
          />
          <input
            type="text"
            value={image.caption || ""}
            onChange={(e) => updateImage(index, "caption", e.target.value)}
            className="input"
            placeholder="Légende (optionnelle)"
          />
        </div>
      ))}
      <button
        onClick={addImage}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une image
      </button>
    </div>
  );
}

// Grid Items Editor
export function GridItemsEditor({
  items,
  onChange,
}: {
  items: GridItem[];
  onChange: (items: GridItem[]) => void;
}) {
  const addItem = () => onChange([...items, { title: "Nouvel élément" }]);
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };
  const removeItem = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Éléments
      </label>
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Élément {index + 1}
            </span>
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={item.description || ""}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          <MediaPicker
            value={item.image || ""}
            onChange={(url) => updateItem(index, "image", url)}
            acceptTypes="image"
            placeholder="Image"
            showPreview={false}
          />
          <input
            type="text"
            value={item.link || ""}
            onChange={(e) => updateItem(index, "link", e.target.value)}
            className="input"
            placeholder="Lien (optionnel)"
          />
          <input
            type="text"
            value={item.badge || ""}
            onChange={(e) => updateItem(index, "badge", e.target.value)}
            className="input"
            placeholder="Badge (ex: Nouveau, Promo)"
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un élément
      </button>
    </div>
  );
}

// Accordion Items Editor
export function AccordionItemsEditor({
  items,
  onChange,
}: {
  items: AccordionItem[];
  onChange: (items: AccordionItem[]) => void;
}) {
  const addItem = () =>
    onChange([...items, { title: "Nouvelle section", content: "" }]);
  const updateItem = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };
  const removeItem = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Sections
      </label>
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Section {index + 1}
            </span>
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={item.content}
            onChange={(e) => updateItem(index, "content", e.target.value)}
            className="input"
            rows={4}
            placeholder="Contenu de l'élément..."
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.defaultOpen || false}
              onChange={(e) =>
                updateItem(index, "defaultOpen", e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Ouvert par défaut</span>
          </label>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une section
      </button>
    </div>
  );
}

// Tabs Editor
export function TabsEditor({
  tabs,
  onChange,
}: {
  tabs: TabItem[];
  onChange: (tabs: TabItem[]) => void;
}) {
  const addTab = () =>
    onChange([...tabs, { label: "Nouvel onglet", content: "" }]);
  const updateTab = (index: number, field: string, value: string) => {
    const newTabs = [...tabs];
    newTabs[index] = { ...newTabs[index], [field]: value };
    onChange(newTabs);
  };
  const removeTab = (index: number) =>
    onChange(tabs.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Onglets
      </label>
      {tabs.map((tab, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Onglet {index + 1}
            </span>
            <button
              onClick={() => removeTab(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={tab.label}
              onChange={(e) => updateTab(index, "label", e.target.value)}
              className="input"
              placeholder="Libellé"
            />
            <IconPicker
              value={tab.icon || ""}
              onChange={(iconName) => updateTab(index, "icon", iconName)}
              placeholder="Icône"
            />
          </div>
          <textarea
            value={tab.content}
            onChange={(e) => updateTab(index, "content", e.target.value)}
            className="input"
            rows={4}
            placeholder="Contenu de l'onglet..."
          />
        </div>
      ))}
      <button
        onClick={addTab}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un onglet
      </button>
    </div>
  );
}

// Table Editor
export function TableEditor({
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
    onRowsChange(rows.map((row) => [...row, ""]));
  };
  const removeColumn = (colIndex: number) => {
    onHeadersChange(headers.filter((_, i) => i !== colIndex));
    onRowsChange(rows.map((row) => row.filter((_, i) => i !== colIndex)));
  };
  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    onHeadersChange(newHeaders);
  };
  const addRow = () =>
    onRowsChange([...rows, new Array(headers.length).fill("")]);
  const removeRow = (rowIndex: number) =>
    onRowsChange(rows.filter((_, i) => i !== rowIndex));
  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    onRowsChange(newRows);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-800">
          Tableau
        </label>
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
                        className="p-1 hover:bg-red-100 rounded text-red-500 shrink-0"
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
                        onChange={(e) =>
                          updateCell(rowIndex, colIndex, e.target.value)
                        }
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
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une ligne
      </button>
    </div>
  );
}

// Timeline Editor
export function TimelineEditor({
  items,
  onChange,
}: {
  items: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
}) {
  const addItem = () =>
    onChange([...items, { date: "", title: "Nouvel événement" }]);
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };
  const removeItem = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Événements
      </label>
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Événement {index + 1}
            </span>
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.date}
            onChange={(e) => updateItem(index, "date", e.target.value)}
            className="input"
            placeholder="Date (ex: Janvier 2024)"
          />
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            className="input"
            placeholder="Titre"
          />
          <textarea
            value={item.description || ""}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            className="input"
            rows={2}
            placeholder="Description"
          />
          <MediaPicker
            value={item.image || ""}
            onChange={(url) => updateItem(index, "image", url)}
            acceptTypes="image"
            placeholder="Image (optionnelle)"
            showPreview={false}
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un événement
      </button>
    </div>
  );
}

// Team Members Editor
export function TeamMembersEditor({
  members,
  onChange,
}: {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}) {
  const addMember = () =>
    onChange([...members, { name: "Nouveau membre", role: "" }]);
  const updateMember = (
    index: number,
    field: string,
    value: string | Record<string, string>,
  ) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    onChange(newMembers);
  };
  const updateSocial = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = {
      ...newMembers[index],
      social: { ...newMembers[index].social, [field]: value },
    };
    onChange(newMembers);
  };
  const removeMember = (index: number) =>
    onChange(members.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Membres
      </label>
      {members.map((member, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Membre {index + 1}
            </span>
            <button
              onClick={() => removeMember(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <MediaPicker
            value={member.image || ""}
            onChange={(url) => updateMember(index, "image", url)}
            acceptTypes="image"
            placeholder="Photo"
            showPreview={true}
          />
          <input
            type="text"
            value={member.name}
            onChange={(e) => updateMember(index, "name", e.target.value)}
            className="input"
            placeholder="Nom"
          />
          <input
            type="text"
            value={member.role}
            onChange={(e) => updateMember(index, "role", e.target.value)}
            className="input"
            placeholder="Fonction"
          />
          <textarea
            value={member.bio || ""}
            onChange={(e) => updateMember(index, "bio", e.target.value)}
            className="input"
            rows={2}
            placeholder="Biographie courte"
          />
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Réseaux sociaux
            </p>
            <div className="space-y-2">
              <input
                type="email"
                value={member.social?.email || ""}
                onChange={(e) => updateSocial(index, "email", e.target.value)}
                className="input text-sm"
                placeholder="Email"
              />
              <input
                type="url"
                value={member.social?.linkedin || ""}
                onChange={(e) =>
                  updateSocial(index, "linkedin", e.target.value)
                }
                className="input text-sm"
                placeholder="LinkedIn URL"
              />
              <input
                type="url"
                value={member.social?.instagram || ""}
                onChange={(e) =>
                  updateSocial(index, "instagram", e.target.value)
                }
                className="input text-sm"
                placeholder="Instagram URL"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addMember}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un membre
      </button>
    </div>
  );
}

// Testimonials Editor
export function TestimonialsEditor({
  testimonials,
  onChange,
}: {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
}) {
  const addTestimonial = () =>
    onChange([...testimonials, { text: "", author: "" }]);
  const updateTestimonial = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onChange(newTestimonials);
  };
  const removeTestimonial = (index: number) =>
    onChange(testimonials.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Témoignages
      </label>
      {testimonials.map((testimonial, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Témoignage {index + 1}
            </span>
            <button
              onClick={() => removeTestimonial(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <textarea
            value={testimonial.text}
            onChange={(e) => updateTestimonial(index, "text", e.target.value)}
            className="input"
            rows={3}
            placeholder="Texte du témoignage"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={testimonial.author}
              onChange={(e) =>
                updateTestimonial(index, "author", e.target.value)
              }
              className="input"
              placeholder="Nom"
            />
            <input
              type="text"
              value={testimonial.role || ""}
              onChange={(e) => updateTestimonial(index, "role", e.target.value)}
              className="input"
              placeholder="Fonction"
            />
          </div>
          <input
            type="text"
            value={testimonial.company || ""}
            onChange={(e) =>
              updateTestimonial(index, "company", e.target.value)
            }
            className="input"
            placeholder="Entreprise"
          />
          <MediaPicker
            value={testimonial.image || ""}
            onChange={(url) => updateTestimonial(index, "image", url)}
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
                  onClick={() => updateTestimonial(index, "rating", star)}
                  className={`text-2xl ${(testimonial.rating || 0) >= star ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
              <button
                type="button"
                onClick={() => updateTestimonial(index, "rating", 0)}
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
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un témoignage
      </button>
    </div>
  );
}

// Pricing Plans Editor
export function PricingPlansEditor({
  plans,
  onChange,
}: {
  plans: PricingPlan[];
  onChange: (plans: PricingPlan[]) => void;
}) {
  const addPlan = () =>
    onChange([...plans, { name: "Nouveau plan", price: "0€", features: [] }]);
  const updatePlan = (
    index: number,
    field: string,
    value: string | boolean | string[],
  ) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    onChange(newPlans);
  };
  const removePlan = (index: number) =>
    onChange(plans.filter((_, i) => i !== index));
  const updateFeature = (
    planIndex: number,
    featureIndex: number,
    value: string,
  ) => {
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
      features: [...newPlans[planIndex].features, ""],
    };
    onChange(newPlans);
  };
  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: newPlans[planIndex].features.filter(
        (_, i) => i !== featureIndex,
      ),
    };
    onChange(newPlans);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Plans tarifaires
      </label>
      {plans.map((plan, planIndex) => (
        <div key={planIndex} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Plan {planIndex + 1}
            </span>
            <button
              onClick={() => removePlan(planIndex)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={plan.name}
            onChange={(e) => updatePlan(planIndex, "name", e.target.value)}
            className="input"
            placeholder="Nom du plan"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={plan.price}
              onChange={(e) => updatePlan(planIndex, "price", e.target.value)}
              className="input"
              placeholder="Prix (ex: 29€)"
            />
            <input
              type="text"
              value={plan.period || ""}
              onChange={(e) => updatePlan(planIndex, "period", e.target.value)}
              className="input"
              placeholder="Période (ex: mois)"
            />
          </div>
          <textarea
            value={plan.description || ""}
            onChange={(e) =>
              updatePlan(planIndex, "description", e.target.value)
            }
            className="input"
            rows={2}
            placeholder="Description"
          />
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Fonctionnalités
            </p>
            {plan.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    updateFeature(planIndex, featureIndex, e.target.value)
                  }
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
              value={plan.buttonText || ""}
              onChange={(e) =>
                updatePlan(planIndex, "buttonText", e.target.value)
              }
              className="input text-sm"
              placeholder="Texte du bouton"
            />
            <input
              type="text"
              value={plan.buttonUrl || ""}
              onChange={(e) =>
                updatePlan(planIndex, "buttonUrl", e.target.value)
              }
              className="input text-sm"
              placeholder="URL du bouton"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={plan.highlighted || false}
              onChange={(e) =>
                updatePlan(planIndex, "highlighted", e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              Mettre en avant ce plan
            </span>
          </label>
        </div>
      ))}
      <button
        onClick={addPlan}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un plan
      </button>
    </div>
  );
}

// FAQ Editor
export function FAQEditor({
  questions,
  onChange,
}: {
  questions: FAQItem[];
  onChange: (questions: FAQItem[]) => void;
}) {
  const addQuestion = () =>
    onChange([...questions, { question: "", answer: "" }]);
  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    onChange(newQuestions);
  };
  const removeQuestion = (index: number) =>
    onChange(questions.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Questions
      </label>
      {questions.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Question {index + 1}
            </span>
            <button
              onClick={() => removeQuestion(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => updateQuestion(index, "question", e.target.value)}
            className="input"
            placeholder="Question"
          />
          <textarea
            value={item.answer}
            onChange={(e) => updateQuestion(index, "answer", e.target.value)}
            className="input"
            rows={3}
            placeholder="Réponse"
          />
        </div>
      ))}
      <button
        onClick={addQuestion}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une question
      </button>
    </div>
  );
}

// Form Fields Editor
export function FormFieldsEditor({
  fields,
  onChange,
}: {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}) {
  const addField = () =>
    onChange([
      ...fields,
      {
        type: "text",
        name: `field_${fields.length + 1}`,
        label: "Nouveau champ",
      },
    ]);
  const updateField = (
    index: number,
    field: string,
    value: string | boolean | string[],
  ) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    onChange(newFields);
  };
  const removeField = (index: number) =>
    onChange(fields.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Champs du formulaire
      </label>
      {fields.map((field, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Champ {index + 1}
            </span>
            <button
              onClick={() => removeField(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={field.type}
              onChange={(e) => updateField(index, "type", e.target.value)}
              className="input"
            >
              {FORM_FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={field.name}
              onChange={(e) => updateField(index, "name", e.target.value)}
              className="input"
              placeholder="Nom du champ"
            />
          </div>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(index, "label", e.target.value)}
            className="input"
            placeholder="Libellé"
          />
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) => updateField(index, "placeholder", e.target.value)}
            className="input"
            placeholder="Placeholder"
          />
          {field.type === "select" && (
            <textarea
              value={(field.options || []).join("\n")}
              onChange={(e) =>
                updateField(index, "options", e.target.value.split("\n"))
              }
              className="input text-sm"
              rows={3}
              placeholder="Options (une par ligne)"
            />
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) => updateField(index, "required", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Champ obligatoire</span>
          </label>
        </div>
      ))}
      <button
        onClick={addField}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un champ
      </button>
    </div>
  );
}

// Features Editor
export function FeaturesEditor({
  features,
  onChange,
}: {
  features: FeatureItem[];
  onChange: (features: FeatureItem[]) => void;
}) {
  const addFeature = () =>
    onChange([
      ...features,
      { title: "Nouvelle fonctionnalité", description: "" },
    ]);
  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onChange(newFeatures);
  };
  const removeFeature = (index: number) =>
    onChange(features.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Fonctionnalités
      </label>
      {features.map((feature, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Fonctionnalité {index + 1}
            </span>
            <button
              onClick={() => removeFeature(index)}
              className="text-red-500 text-xs"
            >
              Supprimer
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <IconPicker
              value={feature.icon || ""}
              onChange={(iconName) => updateFeature(index, "icon", iconName)}
              placeholder="Icône"
            />
            <input
              type="text"
              value={feature.title}
              onChange={(e) => updateFeature(index, "title", e.target.value)}
              className="input col-span-2"
              placeholder="Titre"
            />
          </div>
          <textarea
            value={feature.description}
            onChange={(e) =>
              updateFeature(index, "description", e.target.value)
            }
            className="input"
            rows={2}
            placeholder="Description"
          />
          <input
            type="text"
            value={feature.link || ""}
            onChange={(e) => updateFeature(index, "link", e.target.value)}
            className="input"
            placeholder="Lien (optionnel)"
          />
        </div>
      ))}
      <button
        onClick={addFeature}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une fonctionnalité
      </button>
    </div>
  );
}

// Columns Editor - for COLUMNS block
export function ColumnsEditor({
  columns,
  onChange,
}: {
  columns: Array<{ width?: number; content?: string }>;
  onChange: (columns: Array<{ width?: number; content?: string }>) => void;
}) {
  const addColumn = () => onChange([...columns, { width: 50, content: "" }]);
  const updateColumn = (index: number, field: string, value: unknown) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    onChange(newColumns);
  };
  const removeColumn = (index: number) =>
    onChange(columns.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Colonnes ({columns.length})
      </label>
      {columns.map((column, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Colonne {index + 1}
            </span>
            <button
              onClick={() => removeColumn(index)}
              className="text-red-500 text-xs hover:text-red-700"
              disabled={columns.length <= 1}
            >
              Supprimer
            </button>
          </div>
          <Field label="Largeur (%)">
            <input
              type="number"
              min={10}
              max={100}
              value={column.width || 50}
              onChange={(e) =>
                updateColumn(index, "width", parseInt(e.target.value) || 50)
              }
              className="input"
            />
          </Field>
          <Field label="Contenu">
            <textarea
              value={column.content || ""}
              onChange={(e) => updateColumn(index, "content", e.target.value)}
              className="input"
              rows={4}
              placeholder="Contenu de la colonne..."
            />
          </Field>
        </div>
      ))}
      <button
        onClick={addColumn}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter une colonne
      </button>
    </div>
  );
}

// Services List Editor - for SERVICES_LIST block
export function ServicesListEditor({
  services,
  onChange,
}: {
  services: string[];
  onChange: (services: string[]) => void;
}) {
  const addService = () => onChange([...services, ""]);
  const updateService = (index: number, value: string) => {
    const newServices = [...services];
    newServices[index] = value;
    onChange(newServices);
  };
  const removeService = (index: number) =>
    onChange(services.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Services
      </label>
      {services.map((service, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={service}
            onChange={(e) => updateService(index, e.target.value)}
            className="input flex-1"
            placeholder={`Service ${index + 1}`}
          />
          <button
            onClick={() => removeService(index)}
            className="p-1 hover:bg-red-100 rounded text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addService}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un service
      </button>
    </div>
  );
}

// Hours Editor - for HOURS_TABLE block
export function HoursEditor({
  hours,
  onChange,
}: {
  hours: Record<string, string>;
  onChange: (hours: Record<string, string>) => void;
}) {
  const defaultDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const updateHours = (day: string, value: string) => {
    onChange({ ...hours, [day]: value });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Horaires d'ouverture
      </label>
      {defaultDays.map((day) => (
        <div key={day} className="flex items-center gap-2">
          <span className="w-24 text-sm text-gray-700">{day}</span>
          <input
            type="text"
            value={hours[day] || ""}
            onChange={(e) => updateHours(day, e.target.value)}
            className="input flex-1"
            placeholder="ex: 9h-12h / 14h-19h ou Fermé"
          />
        </div>
      ))}
    </div>
  );
}

// Store Buttons Editor - for STORE_HERO, CTA blocks
export function ButtonsEditor({
  buttons,
  onChange,
}: {
  buttons: Array<{
    label: string;
    href: string;
    variant?: string;
    openInNewTab?: boolean;
  }>;
  onChange: (
    buttons: Array<{
      label: string;
      href: string;
      variant?: string;
      openInNewTab?: boolean;
    }>,
  ) => void;
}) {
  const addButton = () =>
    onChange([...buttons, { label: "Nouveau bouton", href: "#" }]);
  const updateButton = (index: number, field: string, value: unknown) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    onChange(newButtons);
  };
  const removeButton = (index: number) =>
    onChange(buttons.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Boutons
      </label>
      {buttons.map((button, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Bouton {index + 1}
            </span>
            <button
              onClick={() => removeButton(index)}
              className="text-red-500 text-xs hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
          <input
            type="text"
            value={button.label}
            onChange={(e) => updateButton(index, "label", e.target.value)}
            className="input"
            placeholder="Texte du bouton"
          />
          <input
            type="text"
            value={button.href}
            onChange={(e) => updateButton(index, "href", e.target.value)}
            className="input"
            placeholder="URL"
          />
          <div className="flex gap-4">
            <Field label="Style">
              <select
                value={button.variant || "primary"}
                onChange={(e) => updateButton(index, "variant", e.target.value)}
                className="input"
              >
                {BUTTON_VARIANTS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={button.openInNewTab || false}
                onChange={(e) =>
                  updateButton(index, "openInNewTab", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Nouvel onglet</span>
            </label>
          </div>
        </div>
      ))}
      <button
        onClick={addButton}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400"
      >
        + Ajouter un bouton
      </button>
    </div>
  );
}
