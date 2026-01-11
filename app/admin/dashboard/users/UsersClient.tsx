"use client"

import { useState, useEffect, useCallback } from "react"
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
  EyeOff
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  role: "ADMIN" | "WEBMASTER"
  createdAt: string
  updatedAt: string
}

interface UserFormData {
  email: string
  password: string
  name: string
  role: "ADMIN" | "WEBMASTER"
}

const defaultFormData: UserFormData = {
  email: "",
  password: "",
  name: "",
  role: "WEBMASTER",
}

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else if (response.status === 401) {
        showNotification("error", "Accès non autorisé - Admin requis")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      showNotification("error", "Erreur de chargement des utilisateurs")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData(defaultFormData)
    setShowPassword(false)
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: "", // Don't show existing password
      name: user.name,
      role: user.role,
    })
    setShowPassword(false)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData(defaultFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
      const method = editingUser ? "PUT" : "POST"

      // Don't send empty password on edit
      const payload = { ...formData }
      if (editingUser && !payload.password) {
        delete (payload as Partial<UserFormData>).password
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        showNotification(
          "success",
          editingUser ? "Utilisateur modifié" : "Utilisateur créé"
        )
        closeModal()
        fetchUsers()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Operation failed")
      }
    } catch (error) {
      showNotification(
        "error",
        error instanceof Error ? error.message : "Erreur lors de l'opération"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        showNotification("success", "Utilisateur supprimé")
        fetchUsers()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Delete failed")
      }
    } catch (error) {
      showNotification(
        "error",
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      )
    } finally {
      setDeleteConfirm(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-stone-900">Utilisateurs</h1>
            <p className="text-stone-500 mt-1">
              Gestion des comptes administrateurs et webmasters
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvel utilisateur
          </button>
        </div>

        {/* Roles explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <h3 className="font-medium text-amber-900">Administrateur</h3>
            </div>
            <p className="text-sm text-amber-800">
              Accès complet : gestion du contenu, paramètres, utilisateurs,
              analytics et sauvegardes.
            </p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserIcon className="w-5 h-5 text-stone-600" />
              <h3 className="font-medium text-stone-900">Webmaster</h3>
            </div>
            <p className="text-sm text-stone-700">
              Gestion du contenu : pages, navigation, médias. Pas d'accès aux
              paramètres système.
            </p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-stone-600">
                  Utilisateur
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-stone-600">
                  Rôle
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-stone-600">
                  Créé le
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-stone-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun utilisateur trouvé</p>
                    <p className="text-sm mt-1">
                      Créez le premier utilisateur pour commencer
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === "ADMIN"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {user.role === "ADMIN" ? (
                            <Shield className="w-5 h-5" />
                          ) : (
                            <UserIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">{user.name}</p>
                          <p className="text-sm text-stone-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          user.role === "ADMIN"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Administrateur" : "Webmaster"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {deleteConfirm === user.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-sm bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-xl font-medium text-stone-900">
                {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-stone-500 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Prénom Nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Mot de passe {editingUser ? "(laisser vide pour ne pas changer)" : "*"}
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
                    className="w-full px-4 py-2 pr-12 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Minimum 8 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "ADMIN" | "WEBMASTER",
                    })
                  }
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="WEBMASTER">Webmaster (contenu uniquement)</option>
                  <option value="ADMIN">Administrateur (accès complet)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
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
  )
}
