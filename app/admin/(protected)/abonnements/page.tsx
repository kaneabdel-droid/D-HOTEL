'use client'

import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, Zap, ArrowUpRight, DollarSign, Download } from 'lucide-react'

export default function AdminHotelAbonnementsPage() {
  const plans = [
    {
      nom: 'Standard (Auberges & Gîtes)',
      prix: '35 000 FCFA',
      frequence: '/ mois',
      hotels: 4,
      desc: 'Jusqu’à 15 chambres, réservations & check-in, facturation directe.',
      badge: 'bg-slate-800 text-slate-300'
    },
    {
      nom: 'Confort (Hôtels 3-4★)',
      prix: '75 000 FCFA',
      frequence: '/ mois',
      hotels: 10,
      desc: 'Jusqu’à 50 chambres, Restauration & Bar, Gouvernance, Main courante.',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    },
    {
      nom: 'Palace & Resort (5★)',
      prix: '160 000 FCFA',
      frequence: '/ mois',
      hotels: 4,
      desc: 'Chambres illimitées, Multi-points de vente, Banquets, Spa & Support 24/7.',
      badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    },
  ]

  const paiementsRecents = [
    {
      id: 'PAY-1089',
      hotel: 'Hôtel Teranga Palace 5★',
      montant: '160 000 FCFA',
      formule: 'Palace & Resort',
      date: '2026-10-28',
      moyen: 'Virement Bancaire',
      statut: 'validé'
    },
    {
      id: 'PAY-1088',
      hotel: 'Cap Skirring Ocean Resort',
      montant: '160 000 FCFA',
      formule: 'Palace & Resort',
      date: '2026-10-25',
      moyen: 'Wave Business',
      statut: 'validé'
    },
    {
      id: 'PAY-1087',
      hotel: 'Résidence Palm Beach',
      montant: '75 000 FCFA',
      formule: 'Confort 3-4★',
      date: '2026-10-20',
      moyen: 'Orange Money',
      statut: 'validé'
    },
    {
      id: 'PAY-1086',
      hotel: 'Hôtel Saint-Louis Fleuve',
      montant: '75 000 FCFA',
      formule: 'Confort 3-4★',
      date: '2026-10-15',
      moyen: 'Carte Bancaire',
      statut: 'validé'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
          <CreditCard className="w-7 h-7 text-amber-400" />
          Abonnements & Licences Hôtelières
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Suivi des renouvellements, des formules souscrites et du chiffre d'affaires logiciel
        </p>
      </div>

      {/* Grille des formules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.badge}`}>
                  {p.hotels} hôtel(s) actif(s)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{p.nom}</h3>
              <p className="text-xs text-slate-400 mb-4">{p.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white">{p.prix}</span>
                <span className="text-xs text-slate-400">{p.frequence}</span>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors">
              Gérer la grille tarifaire
            </button>
          </div>
        ))}
      </div>

      {/* Historique des paiements */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Derniers Règlements de Licences</h2>
          <span className="text-xs text-slate-400">Encaissés via Demba Billing</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Réf Paiement</th>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Facture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {paiementsRecents.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-amber-400">{pay.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{pay.hotel}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-100">{pay.montant}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-300">{pay.moyen}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">{pay.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Validé
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
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
