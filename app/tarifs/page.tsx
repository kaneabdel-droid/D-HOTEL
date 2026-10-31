"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  HelpCircle,
  Building,
  ShieldCheck,
  Headphones,
  Zap,
  ArrowRight,
  PhoneCall,
  Mail,
} from "lucide-react";

export default function TarifsDHotelPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const discount = billingCycle === "yearly" ? 0.85 : 1; // 15% discount on annual

  const plans = [
    {
      id: "standard",
      name: "Standard",
      tagline: "Pour auberges, résidences meublées et petits hôtels de charme",
      basePrice: 35000,
      capacity: "Jusqu'à 15 chambres / appartements",
      popular: false,
      features: [
        "PMS complet (Planning interactif drag & drop)",
        "Check-in / Check-out express",
        "Fiches de police dématérialisées",
        "Gestion des tarifs haute / basse saison",
        "Facturation clients & Folio de séjour",
        "Encaissement Wave, Orange Money & Espèces",
        "Support technique par email (7j/7)",
      ],
      notIncluded: [
        "Point de Vente Restaurant & Bar (POS)",
        "Module Gouvernance & Housekeeping smartphone",
        "Salles de séminaires et MICE",
        "Export comptable SYSCOHADA avancé",
      ],
    },
    {
      id: "confort",
      name: "Confort",
      tagline: "La solution la plus prisée pour hôtels d'affaires, resorts et écolodges",
      basePrice: 75000,
      capacity: "Jusqu'à 50 chambres & 2 points de vente",
      popular: true,
      features: [
        "Tout ce qui est inclus dans Standard",
        "Point de vente tactile Restaurant, Bar & Piscine",
        "Transfert direct des consommations sur la chambre",
        "Gouvernance mobile (statut ménage & recouche en direct)",
        "Module Salles de conférence & Séminaires MICE",
        "Gestion des stocks F&B (boissons, fiches techniques)",
        "Clôture journalière & Main courante automatisée",
        "Support prioritaire WhatsApp & Téléphone",
      ],
      notIncluded: [
        "Multi-établissements consolidés",
        "Yield Management & RevPAR prédictif",
      ],
    },
    {
      id: "palace",
      name: "Palace & Resort",
      tagline: "Pour grands complexes hôteliers, chaînes et resorts haut de gamme",
      basePrice: 160000,
      capacity: "Chambres & points de vente illimités",
      popular: false,
      features: [
        "Tout ce qui est inclus dans Confort",
        "Capacité chambres, suites & villas illimitée",
        "Multi-caisses restaurant, spa, excursions & boutique",
        "Yield Management & optimisation du RevPAR / ADR",
        "Export et intégration comptable SYSCOHADA certifiée",
        "Gestion avancée des contrats agences et allotements",
        "Base de données dédiée & sauvegardes temps réel",
        "Account Manager dédié & Assistance sur site 24/7",
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              H
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">D-HOTEL</span>
              <span className="block text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
                DEMBA Hospitality Suite
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/decouvrir-dhotel"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Découverte & Démo
            </Link>
            <Link
              href="/guide"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Guide d&apos;utilisation
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Tarification claire et sans frais cachés
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Des forfaits adaptés à la taille de votre établissement
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Optez pour un abonnement mensuel flexible ou bénéficiez de 15% de réduction en choisissant la facturation annuelle. Déploiement et formation inclus.
        </p>

        {/* Toggle billing cycle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-7 bg-slate-800 border border-slate-700 rounded-full relative p-1 transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-full bg-amber-500 transition-transform ${
                billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-white" : "text-slate-400"}`}>
            Annuel
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              -15%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const finalPrice = Math.round(plan.basePrice * discount);
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 border transition-all ${
                  plan.popular
                    ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-500 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    Recommandé
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{plan.tagline}</p>
                  </div>

                  <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-amber-400">
                        {finalPrice.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">FCFA / mois</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {billingCycle === "yearly" ? "Facturé annuellement" : "Sans engagement"} • {plan.capacity}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Fonctionnalités incluses :
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.notIncluded.length > 0 && (
                      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-500">
                        {plan.notIncluded.map((nf, i) => (
                          <li key={i} className="flex items-center gap-2 list-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span>{nf}</span>
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <a
                  href="#commander"
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  Choisir cette formule
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order & Contact Form Section */}
      <section id="commander" className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 scroll-mt-24">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Demande de souscription ou d&apos;essai personnalisé
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              Notre équipe d&apos;ingénieurs hôteliers installe D-HOTEL sur site ou à distance et forme vos réceptionnistes, gouvernantes et gérants.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Demande enregistrée avec succès !</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Notre service commercial prendra contact avec vous sous 2 heures pour configurer votre accès et planifier votre démonstration.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom de votre hôtel / résidence
                  </label>
                  <input
                    required
                    placeholder="Ex: Hôtel Teranga Lodge"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville & Pays
                  </label>
                  <input
                    required
                    placeholder="Ex: Dakar, Saly, Abidjan..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom du contact
                  </label>
                  <input
                    required
                    placeholder="Prénom et Nom"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Numéro Téléphone / WhatsApp
                  </label>
                  <input
                    required
                    placeholder="+221 77 000 00 00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre de chambres
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 24"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Besoins spécifiques ou message
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Besoin d'une imprimante ticket pour le bar piscine et d'une formation pour 4 réceptionnistes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                Envoyer ma demande d&apos;essai
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              +221 77 626 50 51
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              contact@dembasolution.com
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} DEMBA Solution — D-HOTEL. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
