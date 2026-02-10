"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Crown,
  Lock,
  Mail,
  Calendar,
  Settings,
  FileText,
  Grid3X3,
  Navigation,
  Image,
  BarChart3,
  Palette,
  Store,
  ChevronDown,
  ChevronUp,
  LucideIcon,
} from "lucide-react";
import {
  UserPermissions,
  defaultWebmasterPermissions,
  featureLabels,
  DashboardFeature,
} from "@/types/permissions";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "WEBMASTER";
  isSuperAdmin: boolean;
  permissions: UserPermissions | null;
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "WEBMASTER";
  permissions: UserPermissions;
}

const defaultFormData: UserFormData = {
  email: "",
  password: "",
  name: "",
  role: "WEBMASTER",
  permissions: defaultWebmasterPermissions,
};

// Icon mapping for permissions
const permissionIcons: Record<DashboardFeature, LucideIcon> = {
  pages: FileText,
  grid: Grid3X3,
  navigation: Navigation,
  media: Image,
  analytics: BarChart3,
  apparence: Palette,
  stores: Store,
};

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 401) {
        showNotification("error", "Accès non autorisé - Admin requis");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("error", "Erreur de chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(defaultFormData);
    setShowPassword(false);
    setShowPermissions(false);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "",
      name: user.name,
      role: user.role,
      permissions: user.permissions || defaultWebmasterPermissions,
    });
    setShowPassword(false);
    setShowPermissions(user.role === "WEBMASTER");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(defaultFormData);
    setShowPermissions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const payload = { ...formData };
      if (editingUser && !payload.password) {
        delete (payload as Partial<UserFormData>).password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showNotification(
          "success",
          editingUser ? "Utilisateur modifié" : "Utilisateur créé",
        );
        closeModal();
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Opération échouée");
      }
    } catch (error) {
      showNotification(
        "error",
        error instanceof Error ? error.message : "Erreur lors de l'opération",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification("success", "Utilisateur supprimé");
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Suppression échouée");
      }
    } catch (error) {
      showNotification(
        "error",
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression",
      );
    } finally {
      setDeleteConfirm(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="h-8 sm:h-9 bg-gray-200 rounded-lg w-36 sm:w-40 animate-pulse" />
            <div className="h-4 sm:h-5 bg-gray-100 rounded w-56 sm:w-72 mt-2 animate-pulse" />
          </div>
          <div className="h-11 sm:h-12 bg-gray-200 rounded-lg w-full sm:w-44 animate-pulse" />
        </div>

        {/* Role cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-28 animate-pulse" />
            </div>
            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
          </div>
          <div className="bg-stone-50 border border-stone-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-stone-200 rounded animate-pulse" />
              <div className="h-5 bg-stone-200 rounded w-24 animate-pulse" />
            </div>
            <div className="h-4 bg-stone-100 rounded w-full animate-pulse" />
          </div>
        </div>

        {/* User cards skeleton */}
        <div className="grid gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-6 bg-gray-100 rounded-full w-24 animate-pulse" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-44 mt-2 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-28 mt-2 animate-pulse" />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="w-9 h-9 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg max-w-[calc(100vw-2rem)] ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm sm:text-base">{notification.message}</span>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">
              Utilisateurs
            </h1>
            <p className="text-sm sm:text-base text-stone-500 mt-1">
              Gestion des comptes administrateurs et webmasters
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvel utilisateur</span>
          </button>
        </div>

        {/* Roles explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-gray-700" />
              <h3 className="font-medium text-gray-900">Administrateur</h3>
            </div>
            <p className="text-sm text-gray-700">
              Accès complet : contenu, paramètres, utilisateurs, analytics et
              sauvegardes.
            </p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserIcon className="w-5 h-5 text-stone-600" />
              <h3 className="font-medium text-stone-900">Webmaster</h3>
            </div>
            <p className="text-sm text-stone-700">
              Gestion du contenu : pages, navigation, médias. Pas d&apos;accès
              aux paramètres.
            </p>
          </div>
        </div>

        {/* Users List - Card Layout */}
        <div className="space-y-3 sm:space-y-4">
          {users.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 sm:p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p className="text-stone-500 font-medium">
                Aucun utilisateur trouvé
              </p>
              <p className="text-sm text-stone-400 mt-1">
                Créez le premier utilisateur pour commencer
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className={`bg-white rounded-xl border transition-all hover:shadow-md ${
                  user.isSuperAdmin
                    ? "border-gray-400 ring-1 ring-gray-300"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                        user.isSuperAdmin
                        ? "bg-gradient-to-br from-gray-700 to-black text-white shadow-lg shadow-gray-300"
                        : user.role === "ADMIN"
                          ? "bg-gray-100 text-gray-700"
                            : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {user.isSuperAdmin ? (
                        <Crown className="w-6 h-6 sm:w-7 sm:h-7" />
                      ) : user.role === "ADMIN" ? (
                        <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
                      ) : (
                        <UserIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <p className="font-medium text-stone-900 text-base sm:text-lg truncate">
                          {user.name}
                        </p>

                        {/* Role badges */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {user.isSuperAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-800 to-black text-white shadow-sm">
                              <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              Super Admin
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                              user.role === "ADMIN"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {user.role === "ADMIN"
                              ? "Administrateur"
                              : "Webmaster"}
                          </span>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-stone-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-sm truncate">{user.email}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 mt-1 text-stone-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs sm:text-sm">
                          Créé le {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {user.isSuperAdmin ? (
                        <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-stone-100 rounded-lg text-stone-400">
                          <Lock className="w-4 h-4" />
                          <span className="text-xs sm:text-sm hidden sm:inline">
                            Protégé
                          </span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 sm:p-2.5 text-stone-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {deleteConfirm === user.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              className="p-2 sm:p-2.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats footer */}
        {users.length > 0 && (
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4" />
              <span>
                {users.length} utilisateur{users.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4" />
              <span>
                {users.filter((u) => u.role === "ADMIN").length} admin
                {users.filter((u) => u.role === "ADMIN").length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full">
              <UserIcon className="w-4 h-4" />
              <span>
                {users.filter((u) => u.role === "WEBMASTER").length} webmaster
                {users.filter((u) => u.role === "WEBMASTER").length > 1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 sm:p-6 border-b border-stone-200">
              <h2 className="text-lg sm:text-xl font-medium text-stone-900">
                {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-4 sm:space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-stone-900"
                  placeholder="Prénom Nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-stone-900"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Mot de passe{" "}
                  {editingUser ? (
                    "(laisser vide pour ne pas changer)"
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                    minLength={8}
                    className="w-full px-4 py-2.5 pr-12 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-stone-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-500 mt-1.5">
                  Minimum 8 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Rôle
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, role: "WEBMASTER" });
                      setShowPermissions(true);
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      formData.role === "WEBMASTER"
                        ? "border-black bg-gray-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <UserIcon
                      className={`w-6 h-6 ${formData.role === "WEBMASTER" ? "text-black" : "text-stone-500"}`}
                    />
                    <span
                      className={`text-sm font-medium ${formData.role === "WEBMASTER" ? "text-black" : "text-stone-700"}`}
                    >
                      Webmaster
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, role: "ADMIN" });
                      setShowPermissions(false);
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      formData.role === "ADMIN"
                        ? "border-black bg-gray-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Shield
                      className={`w-6 h-6 ${formData.role === "ADMIN" ? "text-black" : "text-stone-500"}`}
                    />
                    <span
                      className={`text-sm font-medium ${formData.role === "ADMIN" ? "text-black" : "text-stone-700"}`}
                    >
                      Admin
                    </span>
                  </button>
                </div>
              </div>

              {/* Permissions section - only for WEBMASTER */}
              {formData.role === "WEBMASTER" && (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowPermissions(!showPermissions)}
                    className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-stone-600" />
                      <span className="font-medium text-stone-700">Permissions d&apos;accès</span>
                    </div>
                    {showPermissions ? (
                      <ChevronUp className="w-5 h-5 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-500" />
                    )}
                  </button>
                  
                  {showPermissions && (
                    <div className="p-4 space-y-3 border-t border-stone-200">
                      <p className="text-xs text-stone-500 mb-3">
                        Sélectionnez les fonctionnalités auxquelles ce webmaster aura accès
                      </p>
                      {(Object.keys(featureLabels) as DashboardFeature[]).map((feature) => {
                        const Icon = permissionIcons[feature];
                        const { label, description } = featureLabels[feature];
                        const isChecked = formData.permissions[feature];
                        
                        return (
                          <label
                            key={feature}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              isChecked ? "bg-gray-100 border border-gray-300" : "bg-stone-50 border border-transparent hover:bg-stone-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  permissions: {
                                    ...formData.permissions,
                                    [feature]: e.target.checked,
                                  },
                                })
                              }
                              className="mt-1 w-4 h-4 text-black border-stone-300 rounded focus:ring-gray-400"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${isChecked ? "text-black" : "text-stone-500"}`} />
                                <span className={`text-sm font-medium ${isChecked ? "text-black" : "text-stone-700"}`}>
                                  {label}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 mt-0.5">{description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {editingUser ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
