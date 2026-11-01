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
  ChevronRight
} from 'lucide-react'

export default function AdminEtablissementsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')

  const [hotels, setHotels] = useState([
    {
      id: 'hot-01',
      nom: 'Hôtel Teranga Palace',
      etoiles: '5★ Palace',
      type: 'Hôtel de Luxe',
      ville: 'Dakar',
      adresse: 'Route des Almadies',
      chambres: 120,
      directeur: 'Mamadou Sow',
      telephone: '+221 33 800 00 00',
      email: 'direction@terangapalace.sn',
      plan: 'Palace & Resort',
      statut: 'actif',
      dateCreation: '2025-01-15'
    },
    {
      id: 'hot-02',
      nom: 'Résidence Palm Beach',
      etoiles: '4★ Confort',
      type: 'Résidence Hôtelière',
      ville: 'Saly Portudal',
      adresse: 'Zone Touristique Nord',
      chambres: 45,
      directeur: 'Aminata Touré',
      telephone: '+221 77 650 44 11',
      email: 'contact@palmbeachsaly.sn',
      plan: 'Confort 3-4★',
      statut: 'actif',
      dateCreation: '2025-03-10'
    },
    {
      id: 'hot-03',
      nom: 'Écolodge du Saloum',
      etoiles: 'Auberge & Écotourisme',
      type: 'Écolodge',
      ville: 'Toubacouta',
      adresse: 'Bordure du Bolong',
      chambres: 18,
      directeur: 'Jean-Luc Gomis',
      telephone: '+221 78 300 22 99',
      email: 'resa@saloum-ecolodge.com',
      plan: 'Standard',
      statut: 'essai',
      dateCreation: '2026-10-18'
    },
    {
      id: 'hot-04',
      nom: 'Hôtel Saint-Louis Fleuve',
      etoiles: '3★ Historique',
      type: 'Hôtel Colonial',
      ville: 'Saint-Louis',
      adresse: 'Rue Lebon, Île de Saint-Louis',
      chambres: 32,
      directeur: 'Ousmane Diagne',
      telephone: '+221 33 961 12 34',
      email: 'reception@stlouis-fleuve.sn',
      plan: 'Confort 3-4★',
      statut: 'actif',
      dateCreation: '2025-06-22'
    },
    {
      id: 'hot-05',
      nom: 'Cap Skirring Ocean Resort',
      etoiles: '4★ Resort',
      type: 'Complexe Balnéaire',
      ville: 'Cap Skirring',
      adresse: 'Plage des Cocotiers',
      chambres: 64,
      directeur: 'Aissatou Mané',
      telephone: '+221 77 412 88 00',
      email: 'direction@capoceanresort.com',
      plan: 'Palace & Resort',
      statut: 'actif',
      dateCreation: '2025-09-05'
    },
  ])

  // Ajout nouvel hôtel
  const [form, setForm] = useState({
    nom: '',
    type: 'Hôtel de Luxe',
    etoiles: '4★ Confort',
    ville: 'Dakar',
    adresse: '',
    chambres: 30,
    directeur: '',
    telephone: '',
    email: '',
    plan: 'Confort 3-4★',
  })

  function handleCreateHotel(e: React.FormEvent) {
    e.preventDefault()
    const newH = {
      id: 'hot-' + Date.now(),
      nom: form.nom,
      etoiles: form.etoiles,
      type: form.type,
      ville: form.ville,
      adresse: form.adresse || 'Centre-ville',
      chambres: Number(form.chambres) || 20,
      directeur: form.directeur || 'Direction',
      telephone: form.telephone || '+221 33 000 00 00',
      email: form.email || 'contact@hotel.sn',
      plan: form.plan,
      statut: 'essai',
      dateCreation: new Date().toISOString().split('T')[0]
    }
    setHotels([newH, ...hotels])
    setModalOpen(false)
  }

  const filtered = hotels.filter(h => {
    const matchSearch = h.nom.toLowerCase().includes(search.toLowerCase()) ||
      h.ville.toLowerCase().includes(search.toLowerCase()) ||
      h.directeur.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'tous' || h.statut === filterStatut
    return matchSearch && matchStatut
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
            <Hotel className="w-7 h-7 text-amber-400" />
            Parc des Établissements Hôteliers
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enregistrement, configuration des chambres et suivi des licences hôtelières
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/10 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Hôtel</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom d'hôtel, ville ou directeur..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex gap-2">
          {['tous', 'actif', 'essai'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatut(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                filterStatut === s
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s === 'tous' ? 'Tous' : s === 'actif' ? 'Actifs' : 'En essai'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Type & Étoiles</th>
                <th className="py-3 px-4">Ville</th>
                <th className="py-3 px-4">Capacité</th>
                <th className="py-3 px-4">Direction & Contact</th>
                <th className="py-3 px-4">Formule</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{h.nom}</p>
                    <p className="text-xs text-slate-400">{h.adresse}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      {h.etoiles}
                    </span>
                    <p className="text-xs text-slate-400">{h.type}</p>
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
                      {h.chambres} chambres
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <p className="text-white font-medium">{h.directeur}</p>
                    <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {h.telephone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-bold text-slate-200 bg-slate-800 px-2 py-1 rounded-lg">
                      {h.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {h.statut === 'actif' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        Essai (14j)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors">
                      Paramètres
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvel Hôtel */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Hotel className="w-5 h-5 text-amber-400" />
                Créer un Établissement Hôtelier
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHotel} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nom de l'hôtel *</label>
                  <input
                    type="text"
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Hôtel Teranga Palace"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie & Étoiles</label>
                  <select
                    value={form.etoiles}
                    onChange={(e) => setForm({ ...form, etoiles: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="5★ Palace">5★ Palace & Resort</option>
                    <option value="4★ Confort">4★ Confort Affaires</option>
                    <option value="3★ Économique">3★ Standard</option>
                    <option value="Auberge & Écolodge">Auberge / Écolodge</option>
                    <option value="Résidence Meublée">Résidence Meublée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ville / Région *</label>
                  <input
                    type="text"
                    required
                    value={form.ville}
                    onChange={(e) => setForm({ ...form, ville: e.target.value })}
                    placeholder="Ex: Dakar, Saly, Saint-Louis..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre total de chambres</label>
                  <input
                    type="number"
                    min="1"
                    value={form.chambres}
                    onChange={(e) => setForm({ ...form, chambres: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Directeur Général / Gérant</label>
                  <input
                    type="text"
                    value={form.directeur}
                    onChange={(e) => setForm({ ...form, directeur: e.target.value })}
                    placeholder="Ex: Mamadou Sow"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone de contact</label>
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Formule de licence D-HOTEL</label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Standard">Standard (Auberges / Petits hôtels jusqu'à 15 ch.) - 35 000 FCFA/mois</option>
                  <option value="Confort 3-4★">Confort (Hôtels 3-4★ jusqu'à 50 ch.) - 75 000 FCFA/mois</option>
                  <option value="Palace & Resort">Palace & Resort (5★ / Multi-bâtiments) - 160 000 FCFA/mois</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md"
                >
                  Enregistrer l'Hôtel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

