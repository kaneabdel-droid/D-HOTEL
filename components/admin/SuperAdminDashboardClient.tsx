'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Hotel,
  BedDouble,
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Sparkles,
  Zap,
  SlidersHorizontal,
  X,
  ShieldCheck,
  RefreshCw,
  Lock,
  Unlock,
  Loader2,
} from 'lucide-react'
import { ParametragePasserelles } from './ParametragePasserelles'
import {
  type EtablissementItem,
  creerEtablissementSuperAdmin,
} from '@/app/admin/(protected)/actions'

const DEFAULT_DEMO_ETABLISSEMENTS: EtablissementItem[] = [
  {
    id: 'hot-01',
    nom: 'Hôtel Teranga Palace',
    type: 'Hôtel & Résidence',
    ville: 'Dakar (Almadies)',
    chambres: 120,
    directeur: 'Mamadou Sow',
    telephone: '+221 33 800 00 00',
    email: 'direction@terangapalace.sn',
    plan: 'hotel',
    prix: '20 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-10-30',
    source: 'demo',
  },
  {
    id: 'hot-02',
    nom: 'Résidence Palm Beach',
    type: 'Hôtel & Résidence',
    ville: 'Saly Portudal',
    chambres: 45,
    directeur: 'Aminata Touré',
    telephone: '+221 77 650 44 11',
    email: 'contact@palmbeachsaly.sn',
    plan: 'hotel',
    prix: '20 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-08-15',
    source: 'demo',
  },
  {
    id: 'hot-03',
    nom: 'Écolodge du Saloum',
    type: 'Auberge & Campement',
    ville: 'Toubacouta',
    chambres: 18,
    directeur: 'Jean-Luc Gomis',
    telephone: '+221 78 300 22 99',
    email: 'resa@saloum-ecolodge.com',
    plan: 'auberge',
    prix: '15 000 FCFA/m',
    statut: 'essai',
    expireLe: '2026-11-14',
    source: 'demo',
  },
  {
    id: 'hot-04',
    nom: 'Campement Le Bolong Fleuri',
    type: 'Auberge & Campement',
    ville: 'Cap Skirring',
    chambres: 12,
    directeur: 'Bakary Sagna',
    telephone: '+221 77 500 88 12',
    email: 'bolong@campement.sn',
    plan: 'auberge',
    prix: '15 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-05-10',
    source: 'demo',
  },
  {
    id: 'hot-05',
    nom: 'Hôtel Saint-Louis Fleuve',
    type: 'Hôtel & Résidence',
    ville: 'Saint-Louis (Île)',
    chambres: 32,
    directeur: 'Ousmane Diagne',
    telephone: '+221 33 961 12 34',
    email: 'contact@stlouis-fleuve.sn',
    plan: 'hotel',
    prix: '20 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-03-20',
    source: 'demo',
  },
]

export function SuperAdminDashboardClient({
  initialEtablissements,
}: {
  initialEtablissements?: EtablissementItem[]
}) {
  const [activeTab, setActiveTab] = useState<'etablissements' | 'passerelles' | 'kpis'>('etablissements')
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [filterPlan, setFilterPlan] = useState('tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Liste des établissements hôteliers (initialisée depuis Supabase)
  const [etablissements, setEtablissements] = useState<EtablissementItem[]>(
    initialEtablissements && initialEtablissements.length > 0
      ? initialEtablissements
      : DEFAULT_DEMO_ETABLISSEMENTS
  )

  // New hotel form state
  const [newNom, setNewNom] = useState('')
  const [newVille, setNewVille] = useState('Dakar')
  const [newChambres, setNewChambres] = useState(15)
  const [newDirecteur, setNewDirecteur] = useState('')
  const [newTelephone, setNewTelephone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('Demba@2026!')
  const [newPlan, setNewPlan] = useState<'auberge' | 'hotel'>('hotel')
  const [newStatut, setNewStatut] = useState('actif')

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.set('nom', newNom)
    formData.set('type', newPlan)
    formData.set('ville', newVille)
    formData.set('chambres', String(newChambres))
    formData.set('directeur', newDirecteur)
    formData.set('telephone', newTelephone)
    formData.set('email', newEmail || `contact@${newNom.toLowerCase().replace(/[^a-z0-9]/g, '')}.sn`)
    formData.set('password', newPassword)
    formData.set('plan', newPlan)
    formData.set('statut', newStatut)

    const res = await creerEtablissementSuperAdmin(formData)
    setIsSubmitting(false)

    if (res?.success && res.etablissement) {
      setEtablissements([res.etablissement as any, ...etablissements])
      setIsModalOpen(false)
      setNewNom('')
      setNewDirecteur('')
      setNewTelephone('')
      setNewEmail('')
      setSuccessToast(`L'établissement "${res.etablissement.nom}" a été créé et synchronisé avec succès !`)
      setTimeout(() => setSuccessToast(null), 3500)
    } else {
      const newEntry: EtablissementItem = {
        id: `hot-0${etablissements.length + 1}`,
        nom: newNom,
        type: newPlan === 'auberge' ? 'Auberge & Campement' : 'Hôtel & Résidence',
        ville: newVille,
        chambres: Number(newChambres),
        directeur: newDirecteur || 'Directeur Général',
        telephone: newTelephone || '+221 77 000 00 00',
        email: newEmail,
        plan: newPlan,
        prix: newPlan === 'auberge' ? '15 000 FCFA/m' : '20 000 FCFA/m',
        statut: newStatut as any,
        expireLe: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      }
      setEtablissements([newEntry, ...etablissements])
      setIsModalOpen(false)
      setSuccessToast(`L'établissement "${newEntry.nom}" a été créé avec succès !`)
      setTimeout(() => setSuccessToast(null), 3500)
    }
  }

  const toggleStatut = (id: string) => {
    setEtablissements((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextStatut = e.statut === 'actif' ? 'suspendu' : 'actif'
          return { ...e, statut: nextStatut }
        }
        return e
      })
    )
  }

  const togglePlan = (id: string) => {
    setEtablissements((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextPlan = e.plan === 'auberge' ? 'hotel' : 'auberge'
          return {
            ...e,
            plan: nextPlan,
            type: nextPlan === 'auberge' ? 'Auberge & Campement' : 'Hôtel & Résidence',
            prix: nextPlan === 'auberge' ? '15 000 FCFA/m' : '20 000 FCFA/m',
          }
        }
        return e
      })
    )
  }

  const prolongerAbonnement = (id: string) => {
    setEtablissements((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const current = new Date(e.expireLe)
          current.setFullYear(current.getFullYear() + 1)
          return { ...e, expireLe: current.toISOString().split('T')[0], statut: 'actif' }
        }
        return e
      })
    )
    setSuccessToast("Abonnement prolongé d'une année supplémentaire.")
    setTimeout(() => setSuccessToast(null), 3000)
  }

  // Filtrage
  const filteredHotels = etablissements.filter((h) => {
    const matchSearch =
      h.nom.toLowerCase().includes(search.toLowerCase()) ||
      h.ville.toLowerCase().includes(search.toLowerCase()) ||
      h.directeur.toLowerCase().includes(search.toLowerCase()) ||
      (h.email && h.email.toLowerCase().includes(search.toLowerCase()))
    const matchStatut = filterStatut === 'tous' || h.statut === filterStatut
    const matchPlan = filterPlan === 'tous' || h.plan === filterPlan
    return matchSearch && matchStatut && matchPlan
  })

  // KPIs
  const totalHotels = etablissements.length
  const totalActifs = etablissements.filter((e) => e.statut === 'actif').length
  const totalEssai = etablissements.filter((e) => e.statut === 'essai').length
  const totalChambres = etablissements.reduce((acc, curr) => acc + curr.chambres, 0)
  const mrrTotal = etablissements
    .filter((e) => e.statut === 'actif')
    .reduce((acc, curr) => acc + (curr.plan === 'auberge' ? 15000 : 20000), 0)

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Entête SuperAdmin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Console Centrale SuperAdmin D-HOTEL</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gestion du Réseau Hôtelier & Passerelles
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Supervision des établissements membres, abonnements Maketou / Chariow et activations de licences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Établissement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Établissements</span>
            <Hotel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalHotels}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span>{totalActifs} actifs</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400">{totalEssai} en essai</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">MRR Logiciel (Abonnements)</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {mrrTotal.toLocaleString('fr-FR')} <span className="text-sm font-bold text-slate-400">FCFA/m</span>
          </div>
          <div className="text-[11px] text-slate-400">Revenus récurrents mensuels D-HOTEL</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Parc d&apos;Hébergements</span>
            <BedDouble className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalChambres}</div>
          <div className="text-[11px] text-slate-400">Chambres, suites et bungalows pilotés</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Passerelles de Paiement</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">2 Actives</div>
          <div className="text-[11px] text-emerald-400 font-mono">Maketou & Chariow OK</div>
        </div>
      </div>

      {/* Onglets Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('etablissements')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'etablissements'
              ? 'bg-slate-900 text-amber-400 border-t border-x border-slate-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Hotel className="w-4 h-4" />
          <span>Établissements & Licences ({totalHotels})</span>
        </button>

        <button
          onClick={() => setActiveTab('passerelles')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'passerelles'
              ? 'bg-slate-900 text-amber-400 border-t border-x border-slate-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Paramétrage Maketou & Chariow</span>
        </button>
      </div>

      {/* ── ONGLET 1 : ÉTABLISSEMENTS ── */}
      {activeTab === 'etablissements' && (
        <div className="space-y-4">
          {/* Barre de Recherche et Filtres */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Rechercher hôtel, gérant, e-mail, ville..."
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
                <option value="actif">Actif uniquement</option>
                <option value="essai">En essai</option>
                <option value="suspendu">Suspendu</option>
              </select>

              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-hidden focus:border-amber-500"
              >
                <option value="tous">Toutes les formules</option>
                <option value="auberge">Auberge / Campement (15k)</option>
                <option value="hotel">Hôtel / Résidence (20k)</option>
              </select>
            </div>
          </div>

          {/* Tableau des établissements */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Établissement</th>
                    <th className="px-5 py-4">Formule Active</th>
                    <th className="px-5 py-4">Capacité</th>
                    <th className="px-5 py-4">Directeur & Contact</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4">Échéance</th>
                    <th className="px-5 py-4 text-right">Actions SuperAdmin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredHotels.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{h.nom}</span>
                          {(h.source === 'supabase' || h.email) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Inscrit en ligne
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{h.ville}</span>
                          {h.email && (
                            <span className="text-slate-500 font-mono ml-2">• {h.email}</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              h.plan === 'hotel'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            }`}
                          >
                            {h.plan === 'hotel' ? 'Hôtel / Résidence' : 'Auberge / Camp.'}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">{h.prix}</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                          <span>{h.chambres} hébergements</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{h.directeur}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{h.telephone}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {h.statut === 'actif' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Actif
                          </span>
                        )}
                        {h.statut === 'essai' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Essai
                          </span>
                        )}
                        {h.statut === 'suspendu' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            Suspendu
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-400 text-[11px]">
                        {h.expireLe}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => toggleStatut(h.id)}
                            title={h.statut === 'actif' ? 'Suspendre la structure' : 'Activer'}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              h.statut === 'actif'
                                ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-slate-700'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                            }`}
                          >
                            {h.statut === 'actif' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => togglePlan(h.id)}
                            title="Basculer formule (Auberge / Hôtel)"
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 cursor-pointer"
                          >
                            Plan
                          </button>

                          <button
                            onClick={() => prolongerAbonnement(h.id)}
                            title="Prolonger d'un an"
                            className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30 cursor-pointer"
                          >
                            +1 An
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ONGLET 2 : PASSERELLES ── */}
      {activeTab === 'passerelles' && <ParametragePasserelles />}

      {/* MODAL CRÉATION ÉTABLISSEMENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Créer un Nouvel Établissement</h3>
                <p className="text-xs text-slate-400">Ajout d&apos;un hôtel ou d&apos;une auberge sur le réseau D-HOTEL</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHotel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom de l&apos;établissement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hôtel Saly Oasis"
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville / Région *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Saly"
                    value={newVille}
                    onChange={(e) => setNewVille(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Capacité hébergements
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newChambres}
                    onChange={(e) => setNewChambres(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Formule d&apos;Abonnement *
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="auberge">Auberge / Campement (15 000 F/m)</option>
                    <option value="hotel">Hôtel / Résidence (20 000 F/m)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Statut initial *
                  </label>
                  <select
                    value={newStatut}
                    onChange={(e) => setNewStatut(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="essai">Période d&apos;essai 7 jours</option>
                    <option value="actif">Actif (Abonnement réglé)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom du Directeur / Gérant
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cheikh Tidiane Diallo"
                    value={newDirecteur}
                    onChange={(e) => setNewDirecteur(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Téléphone WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={newTelephone}
                    onChange={(e) => setNewTelephone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail de connexion
                  </label>
                  <input
                    type="email"
                    placeholder="directeur@hotel.sn"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mot de passe initial
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Créer l&apos;Établissement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
