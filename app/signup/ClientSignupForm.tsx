"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Building,
  User,
  Phone,
  Mail,
  Lock,
  BedDouble,
} from "lucide-react";
import { signupHotelAction } from "./actions";

function SubmitHotelSignupButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
    >
      {pending ? (
        <span>Initialisation de votre établissement en cours...</span>
      ) : (
        <>
          <span>Créer mon établissement & Débuter l&apos;essai</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export default function ClientSignupForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") === "auberge" ? "auberge" : "hotel";
  const initialCycle = searchParams.get("cycle") === "monthly" ? "monthly" : "yearly";
  const errorMessage = searchParams.get("error");

  const [selectedPlan, setSelectedPlan] = useState<"auberge" | "hotel">(initialPlan);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(initialCycle);

  const plansInfo = {
    auberge: {
      name: "Auberge & Campement",
      mensuel: 15000,
      annuelMois: 13500,
      annuelTotal: 162000,
      badge: "Idéal Auberges & Écolodges",
      points: [
        "PMS complet & Planning interactif",
        "Fiches de police conformes Ministère",
        "Folio de séjour & Encaissements Wave/OM",
        "Mode PWA résilient utilisable hors-ligne",
      ],
    },
    hotel: {
      name: "Hôtel & Résidence",
      mensuel: 20000,
      annuelMois: 18000,
      annuelTotal: 216000,
      badge: "Formule Complète Recommandée",
      points: [
        "Tout du forfait Auberge inclus",
        "Touch POS Restaurant, Bar & Piscine (Report direct sur chambre)",
        "Gouvernance mobile & Ménage smartphone",
        "Salles de séminaires MICE & Économat F&B",
        "Export comptable SYSCOHADA certifié",
      ],
    },
  };

  const currentPlan = plansInfo[selectedPlan];
  const displayedPrice =
    billingCycle === "yearly" ? currentPlan.annuelMois : currentPlan.mensuel;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Choix du Forfait */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Choisissez votre Formule d&apos;Abonnement
          </label>
          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-2 py-0.5 rounded-full font-semibold transition-colors ${
                billingCycle === "monthly" ? "bg-amber-500 text-slate-950" : "text-slate-400"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-2 py-0.5 rounded-full font-semibold transition-colors ${
                billingCycle === "yearly" ? "bg-amber-500 text-slate-950" : "text-slate-400"
              }`}
            >
              Annuel (-10%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["auberge", "hotel"] as const).map((pKey) => {
            const plan = plansInfo[pKey];
            const isSelected = selectedPlan === pKey;
            const price = billingCycle === "yearly" ? plan.annuelMois : plan.mensuel;

            return (
              <div
                key={pKey}
                onClick={() => setSelectedPlan(pKey)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                  isSelected
                    ? "bg-slate-950/80 border-amber-500 ring-2 ring-amber-500/30 shadow-lg"
                    : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    Sélectionné
                  </span>
                )}
                <div className="text-[11px] font-semibold text-amber-400 mb-1">{plan.badge}</div>
                <h4 className="text-base font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-black text-amber-400">
                    {price.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">FCFA / mois</span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="text-[10px] text-emerald-400 font-medium mb-3">
                    Facturé {plan.annuelTotal.toLocaleString("fr-FR")} FCFA / an
                  </div>
                )}
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  {plan.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulaire d'inscription */}
      <form action={signupHotelAction} className="space-y-5">
        <input type="hidden" name="plan" value={selectedPlan} />
        <input type="hidden" name="cycle" value={billingCycle} />

        <div className="border-t border-slate-800/80 pt-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            2. Coordonnées de votre Établissement
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom de l&apos;établissement *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="etablissement_nom"
                  required
                  placeholder="Ex: Hôtel Teranga Saly"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <Hotel className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Type de structure *
              </label>
              <div className="relative">
                <select
                  name="etablissement_type"
                  defaultValue="hotel"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-amber-500"
                >
                  <option value="hotel">Hôtel</option>
                  <option value="residence">Résidence Hôtelière / Appartements</option>
                  <option value="auberge">Auberge</option>
                  <option value="campement">Campement Touristique</option>
                  <option value="ecolodge">Écolodge / Maison d&apos;hôtes</option>
                </select>
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre de chambres / hébergements
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="chambres_nb"
                  min="1"
                  defaultValue="15"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-amber-500"
                />
                <BedDouble className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Téléphone WhatsApp officiel *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="telephone"
                  required
                  placeholder="+221 77 000 00 00"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            3. Compte Directeur / Gestionnaire
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom complet du Directeur / Gérant *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="directeur_nom"
                  required
                  placeholder="Ex: Babacar Diop"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Adresse e-mail professionnelle *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="direction@votrehotel.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mot de passe secret *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Essai complet 7 jours gratuit.</strong> Vos accès PMS, planning interactif et Touch POS sont activés immédiatement. Le règlement de l&apos;abonnement ({displayedPrice.toLocaleString("fr-FR")} FCFA/mois) s&apos;effectue en toute simplicité par Wave ou Orange Money.
          </div>
        </div>

        <SubmitHotelSignupButton />
      </form>
    </div>
  );
}
