import Link from 'next/link'
import {
  Hotel,
  BedDouble,
  Percent,
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
  ArrowUpRight
} from 'lucide-react'

export default function AdminHotelDashboardPage() {
  const kpis = [
    {
      titre: 'Hôtels & Résidences',
      valeur: '18',
      desc: '15 actifs, 3 en période d’essai',
      icon: Hotel,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      titre: 'Chambres & Suites',
      valeur: '640',
      desc: 'Capacité totale sous gestion PMS',
      icon: BedDouble,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      titre: 'Taux d’Occupation Réseau',
      valeur: '78.5%',
      desc: '+4.2% comparé au mois précédent',
      icon: Percent,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      titre: 'Revenus Licences (MRR)',
      valeur: '1 450 000 F',
      desc: 'Abonnements mensuels récurrents',
      icon: CreditCard,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
  ]

  const etablissements = [
    {
      id: 'hot-01',
      nom: 'Hôtel Teranga Palace',
      etoiles: '5★ Luxe',
      ville: 'Dakar (Almadies)',
      chambres: 120,
      directeur: 'Mamadou Sow',
      telephone: '+221 33 800 00 00',
      plan: 'Palace & Resort',
      prix: '160 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-10-30',
    },
    {
      id: 'hot-02',
      nom: 'Résidence Palm Beach',
      etoiles: '4★ Affaires',
      ville: 'Saly Portudal',
      chambres: 45,
      directeur: 'Aminata Touré',
      telephone: '+221 77 650 44 11',
      plan: 'Confort 3-4★',
      prix: '75 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-08-15',
    },
    {
      id: 'hot-03',
      nom: 'Écolodge du Saloum',
      etoiles: 'Auberge & Nature',
      ville: 'Toubacouta',
      chambres: 18,
      directeur: 'Jean-Luc Gomis',
      telephone: '+221 78 300 22 99',
      plan: 'Standard',
      prix: '35 000 FCFA/m',
      statut: 'essai',
      expireLe: '2026-11-14',
    },
    {
      id: 'hot-04',
      nom: 'Hôtel Saint-Louis Fleuve',
      etoiles: '3★ Historique',
      ville: 'Saint-Louis (Île)',
      chambres: 32,
      directeur: 'Ousmane Diagne',
      telephone: '+221 33 961 12 34',
      plan: 'Confort 3-4★',
      prix: '75 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-03-20',
    },
    {
      id: 'hot-05',
      nom: 'Cap Skirring Ocean Resort',
      etoiles: '4★ Vacances',
      ville: 'Casamance (Cap)',
      chambres: 64,
      directeur: 'Aissatou Mané',
      telephone: '+221 77 412 88 00',
      plan: 'Palace & Resort',
      prix: '160 000 FCFA/m',
      statut: 'actif',
      expireLe: '2027-11-01',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
            <Hotel className="w-7 h-7 text-amber-400" />
            Supervision D-HOTEL
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestion centrale des parcs hôteliers, licences PMS, chambres et directeurs
          </p>
        </div>
        <Link
          href="/admin/etablissements"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/10 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Établissement</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-slate-900 border ${kpi.border} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {kpi.titre}
              </span>
              <div className={`p-2 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{kpi.valeur}</p>
              <p className="text-xs text-slate-400 mt-1">{kpi.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table des Établissements */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Établissements Hôteliers Partenaires
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              18 hôtels supervisés sur la plateforme DEMBA SOLUTION
            </p>
          </div>
          <Link
            href="/admin/etablissements"
            className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
          >
            Voir tous les hôtels <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Localisation</th>
                <th className="py-3 px-4">Capacité</th>
                <th className="py-3 px-4">Direction & Contact</th>
                <th className="py-3 px-4">Formule</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {etablissements.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{h.nom}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold mt-0.5">
                      <Sparkles className="w-3 h-3" />
                      {h.etoiles}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {h.ville}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-200">
                      <BedDouble className="w-3 h-3 text-amber-400" />
                      {h.chambres} ch.
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <p className="text-white font-medium">{h.directeur}</p>
                    <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {h.telephone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <p className="font-bold text-slate-200">{h.plan}</p>
                    <p className="text-slate-400">{h.prix}</p>
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
                      Gérer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

