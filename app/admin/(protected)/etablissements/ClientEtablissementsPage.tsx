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
} from 'lucide-react'
import {
  type EtablissementItem,
  creerEtablissementSuperAdmin,
  toggleVerrouillerEtablissement,
} from '@/app/admin/(protected)/actions'

export function ClientEtablissementsPage({
  initialHotels,
}: {
  initialHotels: EtablissementItem[]
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [hotels, setHotels] = useState<EtablissementItem[]>(initialHotels)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

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
      setSuccessToast(
        newBlockedState
          ? `L'établissement "${h.nom}" a été verrouillé (accès bloqué).`
          : `L'établissement "${h.nom}" a été activé et déverrouillé avec succès.`
      )
      setTimeout(() => setSuccessToast(null), 3500)
    } else {
      setSuccessToast(`Erreur : ${res?.error || 'Action impossible'}`)
      setTimeout(() => setSuccessToast(null), 3500)
    }
  }

  // Formulaire modal
  const [nom, setNom] = useState('')
  const [ville, setVille] = useState('Dakar')
  const [chambres, setChambres] = useState(15)
  const [directeur, setDirecteur] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('Demba@2026!')
  const [plan, setPlan] = useState<'auberge' | 'hotel'>('hotel')
  const [statut, setStatut] = useState<'actif' | 'essai'>('actif')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.set('nom', nom)
    formData.set('type', plan)
    formData.set('ville', ville)
    formData.set('chambres', String(chambres))
    formData.set('directeur', directeur)
    formData.set('telephone', telephone)
    formData.set('email', email || `contact@${nom.toLowerCase().replace(/[^a-z0-9]/g, '')}.sn`)
    formData.set('password', password)
    formData.set('plan', plan)
    formData.set('statut', statut)

    const res = await creerEtablissementSuperAdmin(formData)
    setIsSubmitting(false)

    if (res?.success && res.etablissement) {
      setHotels([res.etablissement as any, ...hotels])
      setModalOpen(false)
      setNom('')
      setDirecteur('')
      setTelephone('')
      setEmail('')
      setSuccessToast(`L'établissement "${res.etablissement.nom}" a été créé avec succès !`)
      setTimeout(() => setSuccessToast(null), 3500)
    } else {
      const newEntry: EtablissementItem = {
        id: `hot-0${hotels.length + 1}`,
        nom,
        type: plan === 'auberge' ? 'Auberge & Campement' : 'Hôtel & Résidence',
        ville,
        chambres: Number(chambres),
        directeur: directeur || 'Directeur Général',
        telephone: telephone || '+221 77 000 00 00',
        email,
        plan,
        prix: plan === 'auberge' ? '15 000 FCFA/m' : '20 000 FCFA/m',
        statut,
        expireLe: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      }
      setHotels([newEntry, ...hotels])
      setModalOpen(false)
      setSuccessToast(`L'établissement "${newEntry.nom}" a été créé !`)
      setTimeout(() => setSuccessToast(null), 3500)
    }
  }

  const filtered = hotels.filter((h) => {
    const matchSearch =
      h.nom.toLowerCase().includes(search.toLowerCase()) ||
      h.ville.toLowerCase().includes(search.toLowerCase()) ||
      h.directeur.toLowerCase().includes(search.toLowerCase()) ||
      (h.email && h.email.toLowerCase().includes(search.toLowerCase()))
    const matchStatut = filterStatut === 'tous' || h.statut === filterStatut
    return matchSearch && matchStatut
  })

  return (
    <div className="space-y-8">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
            <Hotel className="w-7 h-7 text-amber-400" />
            Établissements Hôteliers Déployés
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestion du parc hôtelier : hôtels indépendants, résidences, chaînes et auberges affiliées.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Établissement
        </button>
      </div>

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Établissements</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{hotels.length}</p>
          <span className="mt-2 inline-flex items-center text-xs text-emerald-400">
            {hotels.filter((h) => h.statut === 'actif').length} actifs sous contrat
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Capacité Totale</p>
          <p className="mt-2 text-3xl font-extrabold text-white">
            {hotels.reduce((acc, h) => acc + h.chambres, 0)}
          </p>
          <span className="mt-2 text-xs text-slate-400">Chambres & Suites répertoriées</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Formule Référence</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-400">
            {hotels.filter((h) => h.plan === 'hotel').length}
          </p>
          <span className="mt-2 text-xs text-slate-400">Hôtels & Résidences (20k/m)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Auberges & Campements</p>
          <p className="mt-2 text-3xl font-extrabold text-sky-400">
            {hotels.filter((h) => h.plan === 'auberge').length}
          </p>
          <span className="mt-2 text-xs text-slate-400">Formule Auberge (15k/m)</span>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom, directeur, ville, e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-hidden focus:border-amber-500"
          >
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="essai">Essai</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Tableau des Établissements */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Ville</th>
                <th className="py-3 px-4">Capacité</th>
                <th className="py-3 px-4">Direction & Contact</th>
                <th className="py-3 px-4">Formule</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Échéance</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-xs">
              {filtered.map((h) => {
                const isLocked = h.statut === 'suspendu' || Boolean(h.compte_verrouille)
                const isLoading = loadingActionId === h.id

                return (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{h.nom}</span>
                        {(h.source === 'supabase' || h.email) && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Inscrit en ligne
                          </span>
                        )}
                      </div>
                      {h.email && (
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{h.email}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {h.ville}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-200">
                        <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                        {h.chambres} hébergements
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <p className="text-white font-medium">{h.directeur}</p>
                      <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {h.telephone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          h.plan === 'hotel'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}
                      >
                        {h.plan === 'hotel' ? 'Hôtel (20k/m)' : 'Auberge (15k/m)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Lock className="w-3.5 h-3.5" />
                          Verrouillé
                        </span>
                      ) : h.statut === 'actif' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          Essai
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-xs">
                      {h.expireLe}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleLock(h)}
                        disabled={isLoading}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                          isLocked
                            ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isLocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Activer</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Verrouiller</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-6 shrink-0 bg-slate-900">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Ajouter un Établissement Hôtelier</h3>
                <p className="text-xs text-slate-400">Renseignez les coordonnées de la structure</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nom de l&apos;Établissement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Teranga Luxury Beach"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Formule de Souscription *
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="auberge">Auberge / Campement (15 000 F/m)</option>
                    <option value="hotel">Hôtel / Résidence (20 000 F/m)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Capacité (Chambres)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={chambres}
                    onChange={(e) => setChambres(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Ville d&apos;implantation *
                  </label>
                  <input
                    type="text"
                    required
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Statut Initial
                  </label>
                  <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="actif">Actif (Contrat réglé)</option>
                    <option value="essai">Essai (Période test)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Nom du Directeur
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Amadou Diop"
                    value={directeur}
                    onChange={(e) => setDirecteur(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Téléphone Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+221 77 000 00 00"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    E-mail de connexion
                  </label>
                  <input
                    type="email"
                    placeholder="contact@hotel.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Mot de passe initial
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              </div>

              <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-800 shrink-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Enregistrer l&apos;Établissement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

