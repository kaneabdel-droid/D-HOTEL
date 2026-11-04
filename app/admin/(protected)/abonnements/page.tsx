'use client'

import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, Zap, ArrowUpRight, DollarSign, Download } from 'lucide-react'

export default function AdminHotelAbonnementsPage() {
  const plans = [
    {
      nom: 'Auberge & Campement',
      prix: '15 000 FCFA',
      frequence: '/ mois',
      annuel: '162 000 FCFA / an (-10%)',
      hotels: 4,
      desc: 'Idéal auberges, campements, écolodges et résidences touristiques légères.',
      badge: 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
    },
    {
      nom: 'Hôtel & Résidence',
      prix: '20 000 FCFA',
      frequence: '/ mois',
      annuel: '216 000 FCFA / an (-10%)',
      hotels: 10,
      desc: 'Formule complète pour hôtels, complexes balnéaires et appart-hôtels.',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    },
  ]

  const paiementsRecents = [
    {
      id: 'PAY-1089',
      hotel: 'Hôtel Teranga Palace 5★',
      montant: '216 000 FCFA (Annuel)',
      formule: 'Hôtel & Résidence',
      date: '2026-10-28',
      moyen: 'Virement Bancaire',
      statut: 'validé'
    },
    {
      id: 'PAY-1088',
      hotel: 'Campement Le Bolong Fleuri',
      montant: '15 000 FCFA',
      formule: 'Auberge & Campement',
      date: '2026-10-25',
      moyen: 'Wave Business',
      statut: 'validé'
    },
    {
      id: 'PAY-1087',
      hotel: 'Résidence Palm Beach',
      montant: '20 000 FCFA',
      formule: 'Hôtel & Résidence',
      date: '2026-10-20',
      moyen: 'Orange Money',
      statut: 'validé'
    },
    {
      id: 'PAY-1086',
      hotel: 'Écolodge du Saloum',
      montant: '162 000 FCFA (Annuel)',
      formule: 'Auberge & Campement',
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
          Suivi des renouvellements, des formules souscrites et du chiffre d&apos;affaires logiciel
        </p>
      </div>

      {/* Grille des formules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.badge}`}>
                  {p.hotels} hôtel(s) actif(s)
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                  {p.annuel}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{p.nom}</h3>
              <p className="text-xs text-slate-400 mb-4">{p.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white">{p.prix}</span>
                <span className="text-xs text-slate-400">{p.frequence}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Passerelles Maketou & Chariow</span>
              <span className="text-emerald-400 font-medium">Actives</span>
            </div>
          </div>
        ))}
      </div>

      {/* Paiements récents */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Derniers Encaissements Licences</h2>
            <p className="text-xs text-slate-400">Transactions validées via les passerelles agrégées</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Réf.</th>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Formule</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Moyen</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-xs">
              {paiementsRecents.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400">{p.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{p.hotel}</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.formule}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">{p.montant}</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.moyen}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{p.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {p.statut}
                    </span>
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
