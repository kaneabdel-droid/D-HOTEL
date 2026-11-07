'use client'

import { useState, useTransition } from 'react'
import {
  Smartphone,
  CreditCard,
  Banknote,
  Landmark,
  CheckCircle2,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { initierPaiementAbonnementHotel, type MoyenPaiement } from './actions'

interface PlanOption {
  id: 'auberge' | 'hotel'
  nom: string
  prixMensuel: number
  prixAnnuel: number
  desc: string
  features: string[]
  populaire?: boolean
}

const PLANS: PlanOption[] = [
  {
    id: 'auberge',
    nom: 'Auberge & Campement',
    prixMensuel: 15000,
    prixAnnuel: 162000,
    desc: 'Idéal auberges, campements villageois, écolodges et gîtes touristiques.',
    features: [
      "PMS complet (Planning d'occupation chambres & cases)",
      'Check-in & Check-out express avec assignation',
      'Fiches de police Ministère de l’Intérieur',
      'Facturation séjour, folios & proformas',
      'Encaissement Wave, Orange Money & Espèces',
      'Statut ménage et gouvernance basique',
    ],
  },
  {
    id: 'hotel',
    nom: 'Hôtel & Résidence',
    prixMensuel: 20000,
    prixAnnuel: 216000,
    desc: 'Solution tout-en-un pour hôtels d’affaires, complexes balnéaires et appart-hôtels.',
    features: [
      'Tout le pack Auberge & Campement',
      'Caisse Tactile Restaurant, Bar & Pool (Touch POS)',
      'Transfert direct des consos restaurant sur la chambre',
      'Housekeeping mobile & suivi des interventions',
      'Salles de séminaires, mariages & événements MICE',
      'Économat, stocks matières premières & ratios F&B',
      'Audit de nuit & Main courante journalière automatisée',
      'Export comptable SYSCOHADA certifié',
    ],
    populaire: true,
  },
]

export default function PlanSelectorHotel({
  planActuel = 'hotel',
  telephoneDefaut = '',
}: {
  planActuel?: string
  telephoneDefaut?: string
}) {
  const [selectedPlan, setSelectedPlan] = useState<'auberge' | 'hotel'>(
    planActuel === 'auberge' ? 'auberge' : 'hotel'
  )
  const [frequence, setFrequence] = useState<'mensuel' | 'annuel'>('annuel')
  const [moyenPaiement, setMoyenPaiement] = useState<MoyenPaiement>('mobile_money')
  const [telephone, setTelephone] = useState(telephoneDefaut)
  const [erreur, setErreur] = useState<string | null>(null)
  const [succesManuel, setSuccesManuel] = useState<{
    titre: string
    message: string
    ref?: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const currentPlanObj = PLANS.find((p) => p.id === selectedPlan) || PLANS[1]
  const montant =
    frequence === 'annuel' ? currentPlanObj.prixAnnuel : currentPlanObj.prixMensuel

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErreur(null)
    setSuccesManuel(null)

    startTransition(async () => {
      const res = await initierPaiementAbonnementHotel(
        selectedPlan,
        frequence,
        moyenPaiement,
        telephone
      )

      if (!res.ok) {
        setErreur(res.error || 'Une erreur est survenue lors de l’initialisation.')
        return
      }

      if (res.caisse) {
        setSuccesManuel({
          titre: 'Demande de règlement en Caisse enregistrée',
          message:
            res.message ||
            'Votre demande a été transmise. Présentez-vous à la caisse ou contactez votre administrateur pour valider immédiatement le règlement en espèces sur le SuperAdmin.',
          ref: res.paymentId,
        })
        return
      }

      if (res.virement) {
        setSuccesManuel({
          titre: 'Ordre de virement bancaire émis',
          message:
            res.message ||
            'Effectuez votre virement vers notre compte bancaire BOA / UBA en mentionnant la référence ci-dessous. Dès réception, l’administrateur validera votre abonnement en un clic.',
          ref: res.paymentId,
        })
        return
      }

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* 1. Choix du Forfait */}
      <div>
        <label className="block text-sm font-bold text-foreground mb-3">
          1. Choisissez votre Formule D-HOTEL
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLANS.map((p) => {
            const isSelected = selectedPlan === p.id
            const prixAffiche =
              frequence === 'annuel'
                ? `${(p.prixAnnuel / 12).toLocaleString('fr-FR')} FCFA/mois`
                : `${p.prixMensuel.toLocaleString('fr-FR')} FCFA/mois`

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlan(p.id)}
                className={`text-left rounded-2xl border p-5 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/30 shadow-md'
                    : 'border-surface-border bg-surface hover:border-amber-500/50 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-base text-foreground flex items-center gap-2">
                      {p.nom}
                      {p.populaire && (
                        <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                          RECOMMANDÉ
                        </span>
                      )}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-slate-950'
                          : 'border-surface-border bg-background'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-foreground-muted mb-4">{p.desc}</p>

                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-2xl font-black text-foreground font-mono">
                      {prixAffiche}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {frequence === 'annuel'
                        ? `(Total ${p.prixAnnuel.toLocaleString('fr-FR')} F/an)`
                        : 'sans engagement'}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-foreground-muted border-t border-surface-border pt-3">
                    {p.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Périodicité */}
      <div>
        <label className="block text-sm font-bold text-foreground mb-2">
          2. Durée de la licence
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setFrequence('mensuel')}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
              frequence === 'mensuel'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500'
                : 'border-surface-border bg-surface text-foreground-muted hover:text-foreground'
            }`}
          >
            Facturation Mensuelle
            <span className="block text-[11px] font-normal text-foreground-muted mt-0.5">
              Sans engagement
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFrequence('annuel')}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center relative ${
              frequence === 'annuel'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500'
                : 'border-surface-border bg-surface text-foreground-muted hover:text-foreground'
            }`}
          >
            <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              -10% REMISE
            </span>
            Facturation Annuelle
            <span className="block text-[11px] font-normal text-foreground-muted mt-0.5">
              1 an de sérénité
            </span>
          </button>
        </div>
      </div>

      {/* 3. Moyen de Paiement */}
      <div>
        <label className="block text-sm font-bold text-foreground mb-3">
          3. Mode de règlement
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Mobile Money : Maketou avec Chariow secours */}
          <button
            type="button"
            onClick={() => setMoyenPaiement('mobile_money')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              moyenPaiement === 'mobile_money'
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                : 'border-surface-border bg-surface hover:border-amber-500/40'
            }`}
          >
            <Smartphone
              className={`w-6 h-6 mb-2 ${
                moyenPaiement === 'mobile_money' ? 'text-amber-600' : 'text-foreground-muted'
              }`}
            />
            <p className="font-bold text-xs text-foreground">Wave / Orange Money</p>
            <p className="text-[11px] text-foreground-muted mt-0.5">
              Maketou direct (Chariow secours)
            </p>
          </button>

          {/* Carte Bancaire */}
          <button
            type="button"
            onClick={() => setMoyenPaiement('carte')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              moyenPaiement === 'carte'
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                : 'border-surface-border bg-surface hover:border-amber-500/40'
            }`}
          >
            <CreditCard
              className={`w-6 h-6 mb-2 ${
                moyenPaiement === 'carte' ? 'text-amber-600' : 'text-foreground-muted'
              }`}
            />
            <p className="font-bold text-xs text-foreground">Carte Bancaire</p>
            <p className="text-[11px] text-foreground-muted mt-0.5">Visa & Mastercard (Maketou)</p>
          </button>

          {/* Caisse / Espèces */}
          <button
            type="button"
            onClick={() => setMoyenPaiement('caisse')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              moyenPaiement === 'caisse'
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                : 'border-surface-border bg-surface hover:border-amber-500/40'
            }`}
          >
            <Banknote
              className={`w-6 h-6 mb-2 ${
                moyenPaiement === 'caisse' ? 'text-amber-600' : 'text-foreground-muted'
              }`}
            />
            <p className="font-bold text-xs text-foreground">Paiement Caisse</p>
            <p className="text-[11px] text-foreground-muted mt-0.5">
              Espèces • Validé par l&apos;Admin
            </p>
          </button>

          {/* Virement Bancaire */}
          <button
            type="button"
            onClick={() => setMoyenPaiement('virement')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              moyenPaiement === 'virement'
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                : 'border-surface-border bg-surface hover:border-amber-500/40'
            }`}
          >
            <Landmark
              className={`w-6 h-6 mb-2 ${
                moyenPaiement === 'virement' ? 'text-amber-600' : 'text-foreground-muted'
              }`}
            />
            <p className="font-bold text-xs text-foreground">Virement Bancaire</p>
            <p className="text-[11px] text-foreground-muted mt-0.5">Compte BOA / UBA Sénégal</p>
          </button>
        </div>
      </div>

      {/* Numéro de téléphone pour Mobile Money */}
      {moyenPaiement === 'mobile_money' && (
        <div className="max-w-md">
          <label className="block text-xs font-semibold text-foreground mb-1">
            Numéro de téléphone Wave / Orange Money
          </label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="77 000 00 00 ou 78 000 00 00"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-foreground text-xs font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      )}

      {/* Messages d'erreur ou succès manuel */}
      {erreur && (
        <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-danger" />
          <span>{erreur}</span>
        </div>
      )}

      {succesManuel && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{succesManuel.titre}</span>
          </div>
          <p className="text-foreground-muted leading-relaxed">{succesManuel.message}</p>
          {succesManuel.ref && (
            <div className="p-3 bg-surface rounded-xl border border-surface-border font-mono text-foreground text-xs inline-block">
              Référence dossier : #{succesManuel.ref.slice(0, 8)}
            </div>
          )}
        </div>
      )}

      {/* Bouton de confirmation & Total */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs text-foreground-muted block">Total à régler :</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {montant.toLocaleString('fr-FR')} FCFA
            </span>
            <span className="text-xs text-foreground-muted">
              pour 1 {frequence === 'annuel' ? 'an' : 'mois'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Traitement en cours...</span>
            </>
          ) : (
            <>
              <span>
                {moyenPaiement === 'caisse'
                  ? 'Enregistrer le paiement en Caisse'
                  : moyenPaiement === 'virement'
                    ? 'Générer l’ordre de Virement'
                    : 'Régler via Maketou (ou Chariow)'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

