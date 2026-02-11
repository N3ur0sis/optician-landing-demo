# Changelog — Branch update-dashboard

**116 files modified | 33,584 insertions | 10,681 deletions | 30 commits | 55 new files | 2 deleted files**

## 1. New Page Builder System (Complete Redesign)

### Modular Block Editor

The old monolithic `BlockEditor.tsx` has been removed and replaced with 8 specialized modules:

| Module | Role |
|--------|------|
| `ContentEditor.tsx` (4,048 lines) | Content editing for ~41 block types |
| `StyleEditor.tsx` | Visual styles (colors, borders, shadows, radius) |
| `SpacingEditor.tsx` | Margins, padding, dimensions |
| `SettingsEditor.tsx` | Advanced block settings |
| `ItemEditors.tsx` | Child element editors (buttons, cards, items) |
| `Field.tsx` | Reusable field component |
| `ResizeHandles.tsx` | Drag & drop resize handles |
| `SpacingOverlay.tsx` | Visual spacing overlay |

### Block Component Architecture

12 new component files organized by category:

- **Content**: `ContentBlocks.tsx` — Heading, Paragraph, Text, Quote, List, Table
- **Media**: `MediaBlocks.tsx` — Image, Video, Gallery, File, Carousel
- **Interactive**: `ButtonBlocks.tsx`, `InteractiveBlocks.tsx` — Button, ButtonGroup, Accordion, Tabs, FAQ, Modal
- **Layout**: `LayoutBlocks.tsx` — Columns, Grid, Spacer, Divider, Container
- **Embeds**: `EmbedBlocks.tsx` — Map, SocialEmbed, Code, HTML, iFrame
- **Primitives**: `PrimitivesBlocks.tsx` — InfoBox, HoursTable, ServicesList, CtaCard, ReviewBadge, LocationCard, IconFeature
- **Store**: `StoreBlocks.tsx` — 8 legacy store blocks

### Type System

`page-builder.ts`: 41 BLOCK_DEFINITIONS + 60 BLOCK_REGISTRY entries, BlockStyles interface, 7 categories

### Inline Editing

- `InlineEditableBlock.tsx` (825 lines) — Direct text editing on canvas
- `inline-editing-config.ts` (463 lines) — Centralized config for INLINE_EDITABLE_FIELDS + ARRAY_EDITABLE_FIELDS
- `ChildElementEditor.tsx` (700 lines) — Generic CSS editor for child elements

### Preview Mode

Preview mode now uses `BlockRenderer` directly (identical to `DynamicPageRenderer`), without editing wrappers.

### PageBuilderContext

New React Context for sharing `isEditing` state between components.

---

## 2. Appearance/Theming System

| File | Lines | Description |
|------|-------|-------------|
| `ApparenceClient.tsx` | +2,264 | Complete visual customization dashboard |
| `apparence-context.tsx` | new | React Context for global theme |
| `apparence.ts` | +379 | TypeScript types for appearance config |

**Features:**
- Global colors (background, text, accents)
- Navbar configuration (height, fonts, colors, mobile menu)
- Scroll options (shrink, shadow, hide on scroll, opacity)
- Customizable navbar title/subtitle
- Settings reset

---

## 3. Navigation System (Redesign)

- `PageNavigation.tsx` → removed, replaced by `DynamicNavbar.tsx` (+1,187 lines)
- `NavigationManagerClient.tsx` rewritten (+1,682 lines)
- `navigation.ts` (+315 lines) — Complete types for menus, items, pages

**Navbar Features**: Hamburger/traditional/hybrid modes, scroll animations, customizable mobile menu, nested dropdowns

---

## 4. Granular Permissions System

`permissions.ts` (+153 lines) — Fine-grained permissions for WEBMASTER users

- `isSuperAdmin` field added to User model
- `permissions` JSON field for control: pages, media, navigation, settings, analytics, users
- Permission verification on API routes (navigation, pages)

---

## 5. Backup & Restore

| Route | Method | Feature |
|-------|--------|---------|
| `/api/backups` | GET/POST | List and create backups |
| `/api/backups/[id]` | GET/DELETE | Download and delete |
| `/api/backups/[id]/restore` | POST | Complete restore |
| `/api/settings/import` | POST | Config import |

New Prisma model `DatabaseBackup` with compression. Automatic backup before restore. New dependencies: `adm-zip`, `archiver`

---

## 6. UI Components

- **Icon Picker**: `icon-picker.tsx` (+399 lines) — Lucide icon selector with search and categories
- **Color Input**: `DebouncedColorInput` — Hex color input with debounce
- **Loading Skeletons** — Loading placeholders for dashboard components
- **Grid Settings** — Grid tab in dashboard with overlay and style options

---

## 7. Dashboard Improvements

- **Stores Page**: `StoresClient.tsx` — Manage stores from dashboard
- **Upcoming Features**: New section in admin
- **Analytics**: Improved responsive layout
- **Media**: Updated media library
- **Users**: Enhanced `UsersClient.tsx`
- **Settings**: `SettingsClient.tsx` (+1,086 lines) — Export/import, reset, slug check with debounce
- **Style Mode Toggle** — Switch between content and style modes
- **Validation**: Error handling and page save validation

---

## 8. Database Migrations (12 total)

| Migration | Description |
|-----------|-------------|
| `change_default_page_colors` | Modified page colors |
| `add_grid_overlay_options` | Grid overlay options |
| `add_navbar_display_options` | Navbar display modes |
| `add_navbar_styling_options` | Navbar styles (colors, shadows) |
| `add_font_size_fields` | Configurable font sizes |
| `add_mobile_menu_hover` | Mobile menu hover colors |
| `add_navbar_title_fields` | Navbar title/subtitle |
| `replace_blur_with_scroll_options` | Scroll options (shrink, hide, opacity) |
| `create_homepage` | Homepage protection |
| `add_super_admin_field` | Super admin field |
| `add_user_permissions` | Granular JSON permissions |
| `add_database_backups` | Backups table |

---

## 9. Bug Fixes (Audit Session)

| Bug | Fix |
|-----|-----|
| `HoursTableBlock`: border shorthand conflict | Individual border properties |
| Color select dropdowns (5 blocks) | Replaced with `DebouncedColorInput` |
| Icons not updating | Removed legacy iconMap, unified on `<LucideIcon>` |
| Preview mode: incorrect styles/spacing | Direct `BlockRenderer` rendering |
| TEXT: Content Editor wrote text instead of html | Separated from HEADING/PARAGRAPH |
| LIST: Variant written as style | Fixed |
| LINK_BLOCK: href→url, title→text | Fixed |
| ACCORDION: select behavior → checkbox allowMultiple | Fixed |
| DIVIDER: defaultContent style→variant | Fixed |
| TABS: defaultContent variant→style | Fixed |
| TEAM: defaultContent variant→style | Fixed |
| FEATURES: defaultContent layout→style | Fixed |
| SPACER: number input → select presets (xs-2xl) | Fixed type mismatch |
| BUTTON_GROUP: BUTTONS key in ARRAY_EDITABLE_FIELDS | Fixed |
| 15+ blocks: phantom inline fields | Cleaned up |
| ListBlock crash: `{text, _styles}` objects rendered as children | Safe text extraction |

---

## 10. Infrastructure & DevOps

- `.gitattributes` — LF line endings for shell scripts and Dockerfile
- Cache control headers on `/api/grid` (no-cache)
- Fetch requests with `cache: 'no-store'`
- Responsive classes refactored across components

### Deleted Files

| File | Replaced By |
|------|------------|
| `BlockEditor.tsx` | `block-editor/` module (8 files) |
| `PageNavigation.tsx` | `DynamicNavbar.tsx` |

