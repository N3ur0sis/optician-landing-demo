/**
 * User permissions type definitions
 * These permissions control access to different dashboard features for WEBMASTER users
 * ADMIN users have full access regardless of these settings
 */

// All available dashboard features/pages
export type DashboardFeature = 
  | "pages"       // Gestion des pages
  | "grid"        // Gestion de la grille
  | "navigation"  // Gestion de la navigation
  | "media"       // Bibliothèque de médias
  | "analytics"   // Analytics (lecture seule)
  | "apparence"   // Paramètres d'apparence
  | "stores"      // Gestion des boutiques

// Permission settings for a user
export interface UserPermissions {
  pages: boolean
  grid: boolean
  navigation: boolean
  media: boolean
  analytics: boolean
  apparence: boolean
  stores: boolean
}

// Default permissions for new WEBMASTER users (all enabled)
export const defaultWebmasterPermissions: UserPermissions = {
  pages: true,
  grid: true,
  navigation: true,
  media: true,
  analytics: true,
  apparence: false, // Disabled by default for webmasters
  stores: true,
}

// All permissions for ADMIN users
export const adminPermissions: UserPermissions = {
  pages: true,
  grid: true,
  navigation: true,
  media: true,
  analytics: true,
  apparence: true,
  stores: true,
}

// Feature labels for UI
export const featureLabels: Record<DashboardFeature, { label: string; description: string }> = {
  pages: {
    label: "Pages",
    description: "Créer, modifier et supprimer les pages du site"
  },
  grid: {
    label: "Grille",
    description: "Gérer les tuiles de la grille d'accueil"
  },
  navigation: {
    label: "Navigation",
    description: "Gérer les menus et éléments de navigation"
  },
  media: {
    label: "Médias",
    description: "Gérer la bibliothèque d'images et fichiers"
  },
  analytics: {
    label: "Analytics",
    description: "Consulter les statistiques du site"
  },
  apparence: {
    label: "Apparence",
    description: "Modifier les paramètres visuels du site"
  },
  stores: {
    label: "Boutiques",
    description: "Gérer les informations des boutiques"
  },
}

// Parse permissions from database JSON
export function parsePermissions(json: unknown): UserPermissions {
  if (!json || typeof json !== "object") {
    return defaultWebmasterPermissions
  }
  
  const perms = json as Partial<UserPermissions>
  
  return {
    pages: perms.pages ?? defaultWebmasterPermissions.pages,
    grid: perms.grid ?? defaultWebmasterPermissions.grid,
    navigation: perms.navigation ?? defaultWebmasterPermissions.navigation,
    media: perms.media ?? defaultWebmasterPermissions.media,
    analytics: perms.analytics ?? defaultWebmasterPermissions.analytics,
    apparence: perms.apparence ?? defaultWebmasterPermissions.apparence,
    stores: perms.stores ?? defaultWebmasterPermissions.stores,
  }
}

// Check if user has access to a specific feature
export function hasPermission(
  role: "ADMIN" | "WEBMASTER",
  permissions: UserPermissions | null | undefined,
  feature: DashboardFeature
): boolean {
  // ADMIN users have full access
  if (role === "ADMIN") {
    return true
  }
  
  // WEBMASTER users check their specific permissions
  const perms = parsePermissions(permissions)
  return perms[feature] ?? false
}

// Map URL paths to required features (for server-side protection)
export const pathToFeature: Record<string, DashboardFeature> = {
  "/admin/dashboard/pages": "pages",
  "/admin/dashboard/grid": "grid",
  "/admin/dashboard/navigation": "navigation",
  "/admin/dashboard/media": "media",
  "/admin/dashboard/analytics": "analytics",
  "/admin/dashboard/apparence": "apparence",
  "/admin/dashboard/stores": "stores",
}

// Check if user can access a specific path
export function canAccessPath(
  role: "ADMIN" | "WEBMASTER",
  permissions: UserPermissions | null | undefined,
  path: string
): boolean {
  // Admin-only paths
  const adminOnlyPaths = [
    "/admin/dashboard/users",
    "/admin/dashboard/settings",
  ]
  
  if (adminOnlyPaths.some(p => path.startsWith(p))) {
    return role === "ADMIN"
  }
  
  // Find matching feature for the path
  for (const [basePath, feature] of Object.entries(pathToFeature)) {
    if (path.startsWith(basePath)) {
      return hasPermission(role, permissions, feature)
    }
  }
  
  // Default allow for unmatched paths (dashboard home, etc.)
  return true
}
