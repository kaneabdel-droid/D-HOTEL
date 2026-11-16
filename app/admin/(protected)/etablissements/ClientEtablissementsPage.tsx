'use client'

import { useState } from 'react'
import {
  Hotel,
  Plus,
  Search,
  MapPin,
  BedDouble,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  X,
  Building2,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import {
  type EtablissementItem,
  creerEtablissementSuperAdmin,
  modifierEtablissementSuperAdmin,
  supprimerEtablissementSuperAdmin,
  toggleVerrouillerEtablissement,
} from '@/app/admin/(protected)/actions'

export function ClientEtablissementsPage({
  initialHotels,
}: {
  initialHotels: EtablissementItem[]
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<EtablissementItem | null>(null)
  const [deletingHotel, setDeletingHotel] = useState<EtablissementItem | null>(null)

  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [filterPlan, setFilterPlan] = useState('tous')
  const [hotels, setHotels] = useState<EtablissementItem[]>(initialHotels)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  // Verrouiller / Déverrouiller
  const handleToggleLock = async (h: EtablissementItem) => {
    const isLocked = h.statut === 'suspendu' || Boolean(h.compte_verrouille)
    const newBlockedState = !isLocked
    setLoadingActionId(h.id)

    const res = await toggleVerrouillerEtablissement(h.id, newBlockedState)
    setLoadingActionId(null)

    if (res?.success) {
      setHotels((prev) =>
        prev.map((item) =>
          item.id === h.id
            ? {
                ...item,
                statut: newBlockedState ? 'suspendu' : 'actif',
                compte_verrouille: newBlockedState,
              }
            : item
        )
      )
      showToast(
        newBlockedState
          ? `L'établissement "${h.nom}" a été verrouillé (accès bloqué).`
          : `L'établissement "${h.nom}" a été activé et déverrouillé avec succès.`
      )
    } else {
      showToast(res?.error || 'Action impossible', 'error')
    }
  }

  // Création
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const res = await creerEtablissementSuperAdmin(formData)
    setIsSubmitting(false)

    if (res?.success) {
      if (res.etablissement) {
        setHotels((prev) => [res.etablissement as EtablissementItem, ...prev])
      }
      setModalOpen(false)
      showToast(`L'établissement hôtelier a été créé avec succès !`)
    } else {
      showToast(res?.error || 'Erreur lors de la création', 'error')
    }
  }

  // Modification
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingHotel) return
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    formData.set('id', editingHotel.id)

    const res = await modifierEtablissementSuperAdmin(formData)
    setIsSubmitting(false)

    if (res?.success) {
      const updatedNom = (formData.get('nom') as string) || editingHotel.nom
      const updatedType = (formData.get('type') as string) || editingHotel.type
      const updatedVille = (formData.get('ville') as string) || editingHotel.ville
      const updatedChambres = parseInt((formData.get('chambres') as string) || '15', 10)
      const updatedDirecteur = (formData.get('directeur') as string) || editingHotel.directeur
      const updatedTelephone = (formData.get('telephone') as string) || editingHotel.telephone
      const updatedEmail = (formData.get('email') as string) || editingHotel.email
      const updatedPlan = (formData.get('plan') as string) || editingHotel.plan
      const updatedStatut = (formData.get('statut') as string) || editingHotel.statut

      setHotels((prev) =>
        prev.map((item) =>
          item.id === editingHotel.id
            ? {
                ...item,
                nom: updatedNom,
                type: updatedType,
                ville: updatedVille,
                chambres: updatedChambres,
                directeur: updatedDirecteur,
                telephone: updatedTelephone,
                email: updatedEmail,
                plan: updatedPlan,
                statut: updatedStatut as 'actif' | 'essai' | 'suspendu',
                compte_verrouille: updatedStatut === 'suspendu',
              }
            : item
        )
      )
      setEditingHotel(null)
      showToast(`L'établissement "${updatedNom}" a été modifié avec succès !`)
    } else {
      showToast(res?.error || 'Erreur lors de la modification', 'error')
    }
  }

  // Suppression
  const handleDelete = async () => {
    if (!deletingHotel) return
    setIsSubmitting(true)
    const res = await supprimerEtablissementSuperAdmin(deletingHotel.id)
    setIsSubmitting(false)

    if (res?.success) {
      setHotels((prev) => prev.filter((item) => item.id !== deletingHotel.id))
      const nomSupprime = deletingHotel.nom
      setDeletingHotel(null)
      showToast(`L'établissement "${nomSupprime}" a été supprimé définitivement.`)
    } else {
      showToast(res?.error || 'Erreur lors de la suppression', 'error')
    }
  }

  // Filtrage
  const filtered = hotels.filter((h) => {
    const matchSearch =
      h.nom.toLowerCase().includes(search.toLowerCase()) ||
      h.ville.toLowerCase().includes(search.toLowerCase()) ||
      h.directeur.toLowerCase().includes(search.toLowerCase()) ||
      (h.email && h.email.toLowerCase().includes(search.toLowerCase()))
    const matchStatut = filterStatut === 'tous' || h.statut === filterStatut
    const matchPlan = filterPlan === 'tous' || h.plan === filterPlan
    return matchSearch && matchStatut && matchPlan
  })

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce ${
            toast.type === 'success' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2.5">
            <Hotel className="w-7 h-7 text-amber-600" />
            Établissements Hôteliers Déployés
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Supervision, gestion des accès, modifications et suppressions des hôtels, résidences et campements.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Établissement</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="p-4 rounded-xl bg-background border border-surface-border flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un hôtel, une ville, un directeur ou un email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground focus:outline-none focus:border-primary"
          >
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="essai">En essai</option>
            <option value="suspendu">Suspendu / Verrouillé</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground focus:outline-none focus:border-primary"
          >
            <option value="tous">Tous les forfaits</option>
            <option value="auberge">Auberge & Campement</option>
            <option value="hotel">Hôtel Standard</option>
            <option value="resort">Resort & Palace</option>
          </select>
        </div>
      </div>

      {/* Table des Établissements */}
      <div className="rounded-xl bg-background border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-surface-border text-foreground-muted uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Établissement</th>
                <th className="py-3.5 px-4">Localisation & Chambres</th>
                <th className="py-3.5 px-4">Direction & Contact</th>
                <th className="py-3.5 px-4">Formule / Plan</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground-muted">
                    Aucun établissement hôtelier ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                filtered.map((h) => {
                  const isLocked = h.statut === 'suspendu' || Boolean(h.compte_verrouille)
                  const isLoading = loadingActionId === h.id

                  return (
                    <tr key={h.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                            <Hotel className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">{h.nom}</p>
                            <span className="text-[11px] text-foreground-muted capitalize">
                              {h.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <MapPin className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                          <span>{h.ville}</span>
                          <span className="text-foreground-muted">• {h.chambres} clés</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-medium text-foreground">{h.directeur}</p>
                          <p className="text-[11px] text-foreground-muted">{h.telephone}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                          {h.plan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger/10 text-danger border border-danger/20">
                            <Lock className="w-3 h-3" />
                            Verrouillé
                          </span>
                        ) : h.statut === 'actif' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            Essai
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Verrouiller / Activer */}
                          <button
                            type="button"
                            onClick={() => handleToggleLock(h)}
                            disabled={isLoading}
                            title={isLocked ? 'Déverrouiller l\'accès' : 'Verrouiller l\'accès'}
                            className={`p-1.5 rounded-lg transition-all ${
                              isLocked
                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                : 'bg-danger/10 text-danger hover:bg-danger/20'
                            }`}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isLocked ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </button>

                          {/* Modifier */}
                          <button
                            type="button"
                            onClick={() => setEditingHotel(h)}
                            title="Modifier cet établissement"
                            className="p-1.5 rounded-lg bg-surface hover:bg-surface-border text-foreground transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Supprimer */}
                          <button
                            type="button"
                            onClick={() => setDeletingHotel(h)}
                            title="Supprimer cet établissement"
                            className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL NOUVEL ÉTABLISSEMENT ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Hotel className="w-5 h-5" />
                </div>
                <h3 className="font-bold font-heading text-base text-foreground">Ajouter un Établissement Hôtelier</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-foreground-muted hover:bg-surface-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Nom de l&apos;établissement *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Ex : Hôtel Teranga Palace"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Type d&apos;hébergement</label>
                  <select
                    name="type"
                    defaultValue="hotel"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="hotel">Hôtel & Résidence</option>
                    <option value="auberge">Auberge & Gîte</option>
                    <option value="campement">Campement Touristique</option>
                    <option value="resort">Resort & Spa 5★</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Ville / Région</label>
                  <input
                    type="text"
                    name="ville"
                    defaultValue="Dakar"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Directeur / Gérant</label>
                  <input
                    type="text"
                    name="directeur"
                    placeholder="Mamadou Sow"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Nombre de chambres</label>
                  <input
                    type="number"
                    name="chambres"
                    defaultValue={15}
                    min={1}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    name="telephone"
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Email de direction</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="direction@hotel.sn"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Forfait d&apos;abonnement</label>
                  <select
                    name="plan"
                    defaultValue="hotel"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="auberge">Auberge & Campement (15 000 FCFA/m)</option>
                    <option value="hotel">Hôtel Standard (30 000 FCFA/m)</option>
                    <option value="resort">Resort & Palace (50 000 FCFA/m)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Statut initial</label>
                  <select
                    name="statut"
                    defaultValue="actif"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="actif">Actif (Accès ouvert)</option>
                    <option value="essai">En essai (30 jours)</option>
                    <option value="suspendu">Verrouillé</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-surface-border"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Créer l&apos;établissement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL MODIFICATION ÉTABLISSEMENT ── */}
      {editingHotel && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Edit2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold font-heading text-base text-foreground">Modifier l&apos;Établissement</h3>
              </div>
              <button
                onClick={() => setEditingHotel(null)}
                className="p-1 rounded-lg text-foreground-muted hover:bg-surface-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Nom de l&apos;établissement *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  defaultValue={editingHotel.nom}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Type d&apos;hébergement</label>
                  <select
                    name="type"
                    defaultValue={editingHotel.type}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Hôtel & Résidence">Hôtel & Résidence</option>
                    <option value="Auberge & Gîte">Auberge & Gîte</option>
                    <option value="Campement Touristique">Campement Touristique</option>
                    <option value="Resort & Spa 5★">Resort & Spa 5★</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Ville / Région</label>
                  <input
                    type="text"
                    name="ville"
                    defaultValue={editingHotel.ville}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Directeur / Gérant</label>
                  <input
                    type="text"
                    name="directeur"
                    defaultValue={editingHotel.directeur}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Nombre de chambres</label>
                  <input
                    type="number"
                    name="chambres"
                    defaultValue={editingHotel.chambres}
                    min={1}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    name="telephone"
                    defaultValue={editingHotel.telephone}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Email de direction</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingHotel.email || ''}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Forfait d&apos;abonnement</label>
                  <select
                    name="plan"
                    defaultValue={editingHotel.plan}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="auberge">Auberge & Campement (15 000 FCFA/m)</option>
                    <option value="hotel">Hôtel Standard (30 000 FCFA/m)</option>
                    <option value="resort">Resort & Palace (50 000 FCFA/m)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Statut du compte</label>
                  <select
                    name="statut"
                    defaultValue={editingHotel.statut}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="actif">Actif (Accès ouvert)</option>
                    <option value="essai">En essai</option>
                    <option value="suspendu">Verrouillé / Suspendu</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingHotel(null)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-surface-border"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMATION SUPPRESSION ── */}
      {deletingHotel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-danger/30 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-surface-border flex items-center justify-between bg-danger/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-danger/20 text-danger">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold font-heading text-base text-danger">Supprimer l&apos;Établissement</h3>
              </div>
              <button
                onClick={() => setDeletingHotel(null)}
                className="p-1 rounded-lg text-foreground-muted hover:bg-surface-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-foreground leading-relaxed">
                Êtes-vous certain de vouloir supprimer définitivement l&apos;établissement hôtelier{' '}
                <strong className="text-danger font-bold">{deletingHotel.nom}</strong> ?
              </p>
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Cette action est irréversible. Les comptes utilisateurs, réservations, chambres et données rattachés seront purgés de la plateforme.
                </span>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingHotel(null)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-surface-border"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-danger text-white font-bold hover:bg-danger/90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Confirmer la suppression</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
