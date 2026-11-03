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
} from 'lucide-react'
import { ParametragePasserelles } from './ParametragePasserelles'

export function SuperAdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<'etablissements' | 'passerelles' | 'kpis'>('etablissements')
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [filterPlan, setFilterPlan] = useState('tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Liste des établissements hôteliers
  const [etablissements, setEtablissements] = useState([
    {
      id: 'hot-01',
      nom: 'Hôtel Teranga Palace',
      type: 'Hôtel & Résidence',
      ville: 'Dakar (Almadies)',
      chambres: 120,
      directeur: 'Mamadou Sow',
      telephone: '+221 33 800 00 00',
      plan: 'hotel',
      prix: '20 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-10-30',
    },
    {
      id: 'hot-02',
      nom: 'Résidence Palm Beach',
      type: 'Hôtel & Résidence',
      ville: 'Saly Portudal',
      chambres: 45,
      directeur: 'Aminata Touré',
      telephone: '+221 77 650 44 11',
      plan: 'hotel',
      prix: '20 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-08-15',
    },
    {
      id: 'hot-03',
      nom: 'Écolodge du Saloum',
      type: 'Auberge & Campement',
      ville: 'Toubacouta',
      chambres: 18,
      directeur: 'Jean-Luc Gomis',
      telephone: '+221 78 300 22 99',
      plan: 'auberge',
      prix: '15 000 FCFA/m',
      statut: 'essai',
      expireLe: '2026-11-14',
    },
    {
      id: 'hot-04',
      nom: 'Campement Le Bolong Fleuri',
      type: 'Auberge & Campement',
      ville: 'Cap Skirring',
      chambres: 12,
      directeur: 'Bakary Sagna',
      telephone: '+221 77 500 88 12',
      plan: 'auberge',
      prix: '15 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-05-10',
    },
    {
      id: 'hot-05',
      nom: 'Hôtel Saint-Louis Fleuve',
      type: 'Hôtel & Résidence',
      ville: 'Saint-Louis (Île)',
      chambres: 32,
      directeur: 'Ousmane Diagne',
      telephone: '+221 33 961 12 34',
      plan: 'hotel',
      prix: '20 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-03-20',
    },
  ])

  // New hotel form state
  const [newNom, setNewNom] = useState('')
  const [newType, setNewType] = useState('hotel')
  const [newVille, setNewVille] = useState('Dakar')
  const [newChambres, setNewChambres] = useState(15)
  const [newDirecteur, setNewDirecteur] = useState('')
  const [newTelephone, setNewTelephone] = useState('')
  const [newPlan, setNewPlan] = useState<'auberge' | 'hotel'>('hotel')
  const [newStatut, setNewStatut] = useState('essai')

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry = {
      id: `hot-0${etablissements.length + 1}`,
      nom: newNom,
      type: newPlan === 'auberge' ? 'Auberge & Campement' : 'Hôtel & Résidence',
      ville: newVille,
      chambres: Number(newChambres),
      directeur: newDirecteur || 'Directeur Général',
      telephone: newTelephone || '+221 77 000 00 00',
      plan: newPlan,
      prix: newPlan === 'auberge' ? '15 000 FCFA/m' : '20 000 FCFA/m',
      statut: newStatut,
      expireLe: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    }

    setEtablissements([newEntry, ...etablissements])
    setIsModalOpen(false)
    setNewNom('')
    setNewDirecteur('')
    setNewTelephone('')
    setSuccessToast(`L'établissement "${newEntry.nom}" a été créé avec succès !`)
    setTimeout(() => setSuccessToast(null), 3500)
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

  const filteredHotels = etablissements.filter((h) => {
    const matchSearch =
      h.nom.toLowerCase().includes(search.toLowerCase()) ||
      h.ville.toLowerCase().includes(search.toLowerCase()) ||
      h.directeur.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'tous' || h.statut === filterStatut
    const matchPlan = filterPlan === 'tous' || h.plan === filterPlan
    return matchSearch && matchStatut && matchPlan
  })

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
            <Hotel className="w-7 h-7 text-amber-400" />
            Tableau de Bord SuperAdmin • D-HOTEL
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestion centrale des établissements hôteliers et passerelles Maketou & Chariow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Établissement</span>
          </button>
        </div>
      </div>

      {/* Onglets Métier SuperAdmin */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('etablissements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'etablissements'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Gestion des Établissements ({etablissements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('passerelles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'passerelles'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Paramétrage Maketou & Chariow</span>
        </button>

        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'kpis'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Abonnements & Licences</span>
        </button>
      </div>

      {/* ── ONGLET 1 : GESTION DES ÉTABLISSEMENTS ── */}
      {activeTab === 'etablissements' && (
        <div className="space-y-6">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Rechercher hôtel, ville, gérant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value="tous">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="essai">En essai</option>
                <option value="suspendu">Suspendu</option>
              </select>

              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
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
                        <div className="font-bold text-white text-sm">{h.nom}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{h.ville}</span>
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
                            Essai 7j
                          </span>
                        )}
                        {h.statut === 'suspendu' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            Suspendu
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-400 text-xs">
                        {h.expireLe}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => togglePlan(h.id)}
                            title="Basculer formule Auberge (15k) / Hôtel (20k)"
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
                          >
                            Changer Plan
                          </button>
                          <button
                            type="button"
                            onClick={() => prolongerAbonnement(h.id)}
                            title="Prolonger la licence d'1 an"
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[11px] font-semibold border border-emerald-800/60 transition-colors"
                          >
                            +1 An
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatut(h.id)}
                            title={h.statut === 'actif' ? 'Suspendre' : 'Activer'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              h.statut === 'actif'
                                ? 'bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border-slate-700'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}
                          >
                            {h.statut === 'actif' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
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

      {/* ── ONGLET 2 : PARAMÉTRAGE PASSERELLES (MAKETOU & CHARIOW) ── */}
      {activeTab === 'passerelles' && <ParametragePasserelles />}

      {/* ── ONGLET 3 : KPIS & REVENUS ── */}
      {activeTab === 'kpis' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              Établissements Actifs
            </span>
            <div className="text-3xl font-black text-amber-400">{etablissements.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Hôtels, auberges & campements</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              Chambres sous gestion
            </span>
            <div className="text-3xl font-black text-white">227</div>
            <div className="text-[11px] text-slate-500 mt-1">Capacité lits totale</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              MRR Abonnements
            </span>
            <div className="text-3xl font-black text-emerald-400">90 000 F</div>
            <div className="text-[11px] text-slate-500 mt-1">Revenu récurrent mensuel</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              Volume Mobile Money (Maketou)
            </span>
            <div className="text-3xl font-black text-sky-400">98.4%</div>
            <div className="text-[11px] text-slate-500 mt-1">Wave & Orange Money</div>
          </div>
        </div>
      )}

      {/* ── MODAL : CRÉER UN NOUVEL ÉTABLISSEMENT ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Créer un Nouvel Établissement</h3>
                <p className="text-xs text-slate-400">Ajout d&apos;un hôtel ou d&apos;une auberge sur le réseau D-HOTEL</p>
              </div>
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

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  Créer l&apos;Établissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
