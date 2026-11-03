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
  Hotel,
  Compass,
  UtensilsCrossed,
  Layers,
} from "lucide-react";

export default function TarifsDHotelPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const discount = billingCycle === "yearly" ? 0.9 : 1; // 10% discount on annual

  const plans = [
    {
      id: "auberge",
      name: "Auberge & Campement",
      tagline: "Pour auberges touristiques, campements villageois, écolodges, maisons d'hôtes et gîtes ruraux",
      monthlyPrice: 15000,
      annualTotal: 162000, // 15000 * 12 * 0.9
      annualMonthlyEquivalent: 13500,
      capacity: "Chambres, cases, bungalows & lodges",
      popular: false,
      features: [
        "PMS complet (Planning d'occupation interactif)",
        "Check-in & Check-out express avec assignation des clés",
        "Fiches de police dématérialisées conformes Ministère de l'Intérieur",
        "Gestion des tarifs nuitées (Haute / Basse saison)",
        "Facturation des séjours & Folio client individuel ou groupe",
        "Encaissement multi-moyens (Wave, Orange Money, Espèces, Carte)",
        "Gouvernance & Statut ménage (Propre, Sale, En recouche)",
        "Mode PWA résilient utilisable en zone rurale à faible débit",
        "Support technique réactif par WhatsApp & Email (7j/7)",
      ],
      notIncluded: [
        "Point de Vente tactile Restaurant & Bar avec report sur chambre",
        "Module MICE (Salles de séminaires, mariages, conférences)",
        "Billetterie piscine & Day-Pass visiteurs extérieurs",
        "Économat & gestion des stocks matières premières / boissons",
        "Export comptable SYSCOHADA certifié",
      ],
    },
    {
      id: "hotel",
      name: "Hôtel & Résidence",
      tagline: "Pour hôtels d'affaires, résidences hôtelières meublées, complexes balnéaires et resorts",
      monthlyPrice: 20000,
      annualTotal: 216000, // 20000 * 12 * 0.9
      annualMonthlyEquivalent: 18000,
      capacity: "Chambres, suites, appartements & villas illimités",
      popular: true,
      features: [
        "Tout ce qui est inclus dans Auberge & Campement",
        "Point de Vente tactile Restaurant, Bar & Pool-Bar (Touch POS)",
        "Transfert direct et sécurisé des consommations F&B sur le folio de la chambre",
        "Gouvernance mobile complète (Housekeeping smartphone, inspection, maintenance)",
        "Module MICE : Salles de séminaires, banquets, réunions & mariages",
        "Billetterie piscine & Day-Pass pour clients extérieurs",
        "Économat & gestion des stocks F&B (matières premières, boissons, fiches recettes)",
        "Audit de nuit automatisé & Main courante journalière",
        "Intégration et export comptable SYSCOHADA certifié",
        "Support prioritaire 24/7 & assistance personnalisée au paramétrage",
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
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Tarification claire, sans commission par réservation ni frais cachés
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Des forfaits conçus pour l&apos;hôtellerie africaine
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Optez pour un abonnement mensuel souple ou profitez de <strong>10% de réduction</strong> en souscription annuelle. Déploiement rapide, formation et assistance incluses.
        </p>

        {/* Toggle billing cycle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-7 bg-slate-800 border border-slate-700 rounded-full relative p-1 transition-colors"
            aria-label="Basculer cycle de facturation"
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
              -10% d&apos;économie
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan) => {
            const displayedPrice = billingCycle === "yearly" ? plan.annualMonthlyEquivalent : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 border transition-all ${
                  plan.popular
                    ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-500 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/50"
                    : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    Recommandé • Solution Complète
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
                        {plan.id === "auberge" ? "Auberges & Écolodges" : "Hôtels & Résidences"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">{plan.tagline}</p>
                  </div>

                  <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                        {displayedPrice.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">FCFA / mois</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-2">
                      {billingCycle === "yearly" ? (
                        <>
                          <span className="text-emerald-400 font-semibold">
                            Facturé {plan.annualTotal.toLocaleString("fr-FR")} FCFA / an
                          </span>
                          <span className="text-slate-500">• (-10% appliqué)</span>
                        </>
                      ) : (
                        <span>Facturation mensuelle sans engagement</span>
                      )}
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
                        <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
                          Non inclus dans cette formule :
                        </span>
                        {plan.notIncluded.map((nf, i) => (
                          <li key={i} className="flex items-start gap-2 list-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0 mt-1.5" />
                            <span>{nf}</span>
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Link
                    href={`/signup?plan=${plan.id}&cycle=${billingCycle}`}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    Activer {plan.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-slate-500">
                    Essai gratuit 7 jours • Activation sans carte bancaire
                  </p>
                </div>
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
              Besoin d&apos;un devis multi-établissements ou d&apos;un audit sur site ?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              Notre équipe d&apos;ingénieurs hôteliers installe D-HOTEL sur site ou à distance et forme vos réceptionnistes, gouvernantes et gérants.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center">
              <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Demande transmise avec succès</h3>
              <p className="text-xs text-slate-300 mt-1">
                Un conseiller hôtelier DEMBA prendra contact avec vous dans un délai maximal de 2 heures ouvrées.
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
                    Nom de l&apos;établissement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Hôtel Teranga Saly"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Type d&apos;établissement *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="auberge">Auberge / Campement / Écolodge (15 000 FCFA/mois)</option>
                    <option value="hotel">Hôtel / Résidence hôtelière (20 000 FCFA/mois)</option>
                    <option value="chaine">Chaîne hôtelière / Multi-sites</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Responsable / Directeur *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Babacar Diop"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Téléphone WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +221 77 000 00 00"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Envoyer ma demande de devis & d&apos;assistance
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Headphones className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-xs font-semibold text-white">Support WhatsApp 7j/7</span>
              <span className="text-[11px] text-slate-400">+221 77 123 45 67</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-xs font-semibold text-white">Sans Engagement</span>
              <span className="text-[11px] text-slate-400">Résiliation libre à tout moment</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-5 h-5 text-sky-400 mb-1" />
              <span className="text-xs font-semibold text-white">Mise en route rapide</span>
              <span className="text-[11px] text-slate-400">Opérationnel en 24 heures</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} D-HOTEL • DEMBA Hospitality Management System. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
