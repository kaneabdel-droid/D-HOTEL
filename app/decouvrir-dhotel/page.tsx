"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  UtensilsCrossed,
  Sparkles,
  CalendarCheck,
  CreditCard,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  ChevronRight,
  Tv,
  Wifi,
  Coffee,
  Play,
  RotateCcw,
} from "lucide-react";

export default function DecouvrirDHotelPage() {
  const [activeTab, setActiveTab] = useState<"pms" | "pos" | "mice" | "gov" | "revpar">("pms");

  // Interactive Demo Simulator State
  const [selectedRoom, setSelectedRoom] = useState("102");
  const [guestName, setGuestName] = useState("Mme Aminata Fall");
  const [nights, setNights] = useState(3);
  const [formula, setFormula] = useState<"standard" | "vip">("vip");
  const [hasSpa, setHasSpa] = useState(true);
  const [demoStep, setDemoStep] = useState<"booking" | "stay" | "checkout">("booking");

  const roomRates: Record<string, { type: string; price: number }> = {
    "101": { type: "Chambre Standard", price: 45000 },
    "102": { type: "Chambre Deluxe Vue Mer", price: 75000 },
    "201": { type: "Suite Junior Prestige", price: 120000 },
    "301": { type: "Suite Présidentielle", price: 250000 },
  };

  const currentRate = roomRates[selectedRoom] || roomRates["102"];
  const roomTotal = currentRate.price * nights;
  const spaTotal = hasSpa ? 25000 : 0;
  const cityTax = 1000 * nights;
  const grandTotal = roomTotal + spaTotal + cityTax;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner & Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/guide"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Guide d&apos;utilisation
            </Link>
            <Link
              href="/tarifs"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Tarifs & Licences
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              Accéder au PMS
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl opacity-50" />
          <div className="w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Découvrez la plateforme PMS hôtelière nouvelle génération
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Pilotez votre hôtel avec une{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              précision d&apos;orfèvre
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            De la réservation au check-out, en passant par le restaurant, le ménage et la comptabilité SYSCOHADA, D-HOTEL réunit toute l&apos;exploitation hôtelière en un seul outil fluide et connecté.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#demo-interactive"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Tester la démo interactive
            </a>
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm transition-all"
            >
              Consulter les formules
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("pms")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "pms"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <BedDouble className="w-4 h-4" />
            PMS & Chambres
          </button>
          <button
            onClick={() => setActiveTab("pos")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "pos"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Restaurant & POS Bar
          </button>
          <button
            onClick={() => setActiveTab("mice")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "mice"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Salles MICE & Événements
          </button>
          <button
            onClick={() => setActiveTab("gov")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "gov"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Gouvernance & Ménage
          </button>
          <button
            onClick={() => setActiveTab("revpar")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "revpar"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            RevPAR & Caisse
          </button>
        </div>

        {/* Tab Detail Panels */}
        <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
          {activeTab === "pms" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Gestion des hébergements
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Planning interactif & Check-in ultra-rapide
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Visualisez en temps réel l&apos;état de vos chambres (occupée, propre, en recouche, hors service). Procédez au check-in d&apos;un client en moins de 30 secondes avec numérisation de pièce d&apos;identité et fiche de police automatisée.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Planning drag-and-drop sur 30 jours
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Enregistrement automatique des fiches de police
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Attribution flexible et gestion des surclassements
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span>Planning de ce jour</span>
                  <span className="text-emerald-400 font-semibold">18 / 24 Chambres occupées (75%)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["101", "102", "103", "201", "202", "301"].map((room) => (
                    <div
                      key={room}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                    >
                      <span className="font-bold text-white text-sm">Chambre {room}</span>
                      <span className="text-[11px] text-amber-400">Occupée</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "pos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Restauration & Boissons
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Caisse tactile & Transfert direct en chambre
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Gérez les commandes du bar, du restaurant de plage et du room-service sur tablette. Les additions peuvent être réglées immédiatement (Espèces, Wave, Carte) ou imputées directement sur le folio de la chambre.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Caisse tactile optimisée tablette et smartphone
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Transfert sur note de chambre en 1 clic
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Gestion des stocks de bouteilles et fiches techniques
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Ticket Bar Piscine #482</span>
                  <span className="text-amber-400 font-medium">Chambre 102 (Mme Fall)</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>2x Cocktail Bissap Royal</span>
                    <span>10 000 FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>1x Brochettes de Lotte</span>
                    <span>9 500 FCFA</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                    <span>Total Ticket</span>
                    <span className="text-amber-400">19 500 FCFA</span>
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Imputé avec succès au folio Chambre 102
                </div>
              </div>
            </div>
          )}

          {activeTab === "mice" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Séminaires & Banquets
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Gestion des salles de conférence et banquets
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Planifiez les réunions d&apos;entreprises, séminaires, mariages et cocktails. Génération automatique de devis MICE, suivi des pauses-café, vidéoprojecteurs et facturation entreprise globale.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Planning occupation des salles de conférence
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Forfaits journée d&apos;étude & pauses gourmandes
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Facture récapitulative société proforma & définitive
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase">Événements en cours</div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Séminaire BCEAO</div>
                    <div className="text-xs text-slate-400">Salle Saloum (45 pers.) — Journée complète</div>
                  </div>
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-bold">
                    350 000 FCFA
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gov" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Housekeeping & Maintenance
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Gouvernance connectée & Signalement technique
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  La gouvernante générale et les femmes de chambre mettent à jour le statut des chambres depuis leur smartphone dès que le ménage est validé. Déclaration immédiate des pannes (climatisation, plomberie).
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Mise à jour en temps réel : À Blanc, Recouche, Hors service
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Tickets de maintenance avec alerte responsable technique
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Suivi du stock de linge et produits d&apos;accueil
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase">Statut Gouvernance (Midi)</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold block text-lg">14</span>
                    <span className="text-slate-400">Chambres prêtes (Propres)</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold block text-lg">6</span>
                    <span className="text-slate-400">En cours de ménage</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "revpar" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Yield & Clôture de Caisse
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Main courante, RevPAR & Clôture journalière
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Édition en un clic de la main courante journalière, contrôle des caisses de réception et analyse de performance : Taux d&apos;occupation, Prix Moyen Journalier (ADR) et RevPAR.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Clôture de journée automatisée avec audit de nuit
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Rapprochement des encaissements (Espèces, Wave, Orange Money, TPE)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Export comptable direct SYSCOHADA (journaux Ventes et Caisse)
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase">Indicateurs de performance (Mois M)</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Taux Occ.</span>
                    <span className="text-white font-bold text-base">78.5%</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">ADR</span>
                    <span className="text-white font-bold text-base">62 000 F</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">RevPAR</span>
                    <span className="text-amber-400 font-bold text-base">48 670 F</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Live Demo Simulator */}
      <section id="demo-interactive" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Simulateur de séjour en direct
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Expérimentez le flux de réservation D-HOTEL
              </h2>
              <p className="text-slate-400 text-sm">
                Testez en direct comment D-HOTEL calcule le tarif, les taxes de séjour et génère la facture finale.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRoom("102");
                setGuestName("Mme Aminata Fall");
                setNights(3);
                setHasSpa(true);
                setDemoStep("booking");
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium self-start md:self-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Left Configuration Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Sélection de l&apos;hébergement
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(roomRates).map(([id, info]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedRoom(id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedRoom === id
                          ? "bg-amber-500/20 border-amber-500/60 text-white shadow-md shadow-amber-500/10"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white">N° {id}</span>
                        <span className="text-xs text-amber-400 font-semibold">
                          {info.price.toLocaleString("fr-FR")} F / nuit
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">{info.type}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Durée du séjour (Nuits)
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 5, 7].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNights(n)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          nights === n
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {n} {n === 1 ? "nuit" : "nuits"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Prestations additionnelles
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSpa}
                      onChange={(e) => setHasSpa(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
                    />
                    Accès Spa & Massage Relaxant (+25 000 FCFA)
                  </label>
                </div>
              </div>
            </div>

            {/* Right Summary Invoice Preview */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Note de séjour Proforma
                    </span>
                    <h4 className="font-bold text-white text-base">Folio Client #{selectedRoom}-2026</h4>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 text-xs font-bold">
                    D-HOTEL PMS
                  </span>
                </div>

                <div className="py-4 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Titulaire :</span>
                    <span className="text-white font-medium">{guestName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Chambre sélectionnée :</span>
                    <span className="text-white font-medium">
                      N° {selectedRoom} ({currentRate.type})
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Hébergement ({nights} nuits) :</span>
                    <span className="text-white font-medium">{roomTotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  {hasSpa && (
                    <div className="flex justify-between text-slate-400">
                      <span>Prestation Spa / Bien-être :</span>
                      <span className="text-white font-medium">{spaTotal.toLocaleString("fr-FR")} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Taxe de séjour (1 000 F/nuit) :</span>
                    <span className="text-white font-medium">{cityTax.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-300">Total à régler :</span>
                  <span className="text-2xl font-extrabold text-amber-400">
                    {grandTotal.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Moyens acceptés :</span>
                  <span className="text-white font-medium">Wave, OM, Carte VISA, Espèces</span>
                </div>

                <Link
                  href="/tarifs"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                >
                  Déployer cette solution pour mon hôtel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 text-center text-xs text-slate-500">
        <p className="max-w-xl mx-auto mb-4">
          D-HOTEL est un progiciel édité par DEMBA Solution pour l&apos;Afrique de l&apos;Ouest. Compatible réglementation hôtelière et SYSCOHADA.
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <Link href="/guide" className="hover:text-amber-400">Guide d&apos;utilisation</Link>
          <span>•</span>
          <Link href="/tarifs" className="hover:text-amber-400">Formules & Tarifs</Link>
          <span>•</span>
          <Link href="/login" className="hover:text-amber-400">Connexion</Link>
        </div>
      </footer>
    </div>
  );
}
