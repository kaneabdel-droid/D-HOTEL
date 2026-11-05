"use client";

import { useState } from "react";
import {
  Building,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Users,
  FileText,
  Clock,
  Layers,
  Sparkles,
  Coffee,
  Tv,
  Coins,
  Check,
  X,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface EvenementMICE {
  id: string;
  codeDevis: string;
  titre: string;
  clientEntreprise: string;
  contactTelephone: string;
  salle: string;
  disposition: "Théâtre" | "Disposition en U" | "Classe" | "Banquet" | "Cocktail";
  dateDebut: string;
  dateFin: string;
  nbParticipants: number;
  montantTotal: number;
  acompteVerse: number;
  statut: "devis_emis" | "acompte_recu" | "en_cours" | "termine";
  prestationsIncluses: string[];
}

export default function SallesEvenementsPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [modalNouveauDevis, setModalNouveauDevis] = useState(false);
  const [devisSelectionne, setDevisSelectionne] = useState<EvenementMICE | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const salles = [
    {
      id: "s1",
      nom: "Salle Baobab (Grand Amphithéâtre)",
      capaciteMax: 150,
      tarifJournee: 350000,
      equipements: ["Vidéoprojecteur 4K", "Sonorisation HF", "Cabines traduction", "Fibre 1Gb/s"],
      statutAujourdhui: "occupee",
    },
    {
      id: "s2",
      nom: "Salon VIP Saloum (Conseil)",
      capaciteMax: 25,
      tarifJournee: 180000,
      equipements: ["Écran tactile 85 pouces", "Système visio Polycom", "Machine Nespresso VIP"],
      statutAujourdhui: "libre",
    },
    {
      id: "s3",
      nom: "Esplanade Océane (Plein Air)",
      capaciteMax: 350,
      tarifJournee: 600000,
      equipements: ["Podium scénique", "Éclairage d'ambiance LED", "Tentes berbères"],
      statutAujourdhui: "reservee",
    },
  ];

  const [evenements, setEvenements] = useState<EvenementMICE[]>([
    {
      id: "1",
      codeDevis: "DEV-MICE-2026-081",
      titre: "Séminaire Annuel Stratégie 2027",
      clientEntreprise: "Sonatel Orange Groupe",
      contactTelephone: "+221 77 000 12 34",
      salle: "Salle Baobab (Grand Amphithéâtre)",
      disposition: "Disposition en U",
      dateDebut: "25/10/2026",
      dateFin: "27/10/2026",
      nbParticipants: 35,
      montantTotal: 1850000,
      acompteVerse: 925000,
      statut: "acompte_recu",
      prestationsIncluses: [
        "Location salle 3 jours",
        "Pauses-café matin (Croissants, café Touba)",
        "Déjeuners buffet gastronomique",
        "Matériel sonorisation & vidéoprojection",
      ],
    },
    {
      id: "2",
      codeDevis: "DEV-MICE-2026-082",
      titre: "Banquet Mariage Teranga Royal",
      clientEntreprise: "Famille Ndiaye & Sy",
      contactTelephone: "+221 78 450 99 11",
      salle: "Esplanade Océane (Plein Air)",
      disposition: "Banquet",
      dateDebut: "31/10/2026",
      dateFin: "31/10/2026",
      nbParticipants: 220,
      montantTotal: 3400000,
      acompteVerse: 1700000,
      statut: "acompte_recu",
      prestationsIncluses: [
        "Privatisation esplanade bord de mer",
        "Dîner 4 services fruits de mer & méchoui",
        "Service boissons & gâteau monumental",
      ],
    },
    {
      id: "3",
      codeDevis: "DEV-MICE-2026-083",
      titre: "Conseil d'Administration Extraordinaire",
      clientEntreprise: "Banque Atlantique Sénégal",
      contactTelephone: "+221 76 123 45 67",
      salle: "Salon VIP Saloum (Conseil)",
      disposition: "Théâtre",
      dateDebut: "28/10/2026",
      dateFin: "28/10/2026",
      nbParticipants: 16,
      montantTotal: 650000,
      acompteVerse: 0,
      statut: "devis_emis",
      prestationsIncluses: [
        "Location journée Salon VIP",
        "Accueil VIP & cocktail de clôture",
      ],
    },
  ]);

  const evenementsFiltres = evenements.filter((ev) => {
    const correspondRecherche =
      ev.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      ev.clientEntreprise.toLowerCase().includes(recherche.toLowerCase()) ||
      ev.codeDevis.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut =
      filtreStatut === "tous" || ev.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              MICE : Salles de Conférence, Séminaires & Banquets
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Plannings des espaces, forfaits séminaires, devis et suivi des acomptes contractuels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalNouveauDevis(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Émettre un Devis Séminaire
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartes des 3 espaces */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {salles.map((salle) => (
          <div
            key={salle.id}
            className="p-5 rounded-xl bg-surface border border-surface-border space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground">{salle.nom}</h3>
                <span className="text-xs text-foreground-muted flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                  Jauge max : {salle.capaciteMax} personnes
                </span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${
                  salle.statutAujourdhui === "occupee"
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    : salle.statutAujourdhui === "reservee"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}
              >
                {salle.statutAujourdhui}
              </span>
            </div>

            <div className="pt-2 border-t border-surface-border space-y-1 text-xs">
              <span className="text-foreground-muted block">
                Tarif location journée nue :{" "}
                <strong className="text-foreground">
                  {formatXOF(salle.tarifJournee)}
                </strong>
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {salle.equipements.map((eq, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-surface-muted text-[10px] text-foreground-muted"
                  >
                    ✓ {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher par titre d'événement, entreprise, devis..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
          />
        </div>

        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Tous les statuts de contrat</option>
          <option value="devis_emis">Devis émis</option>
          <option value="acompte_recu">Acompte 50% versé</option>
          <option value="termine">Clôturé & Facturé</option>
        </select>
      </div>

      {/* Tableau des événements MICE */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Code Devis</th>
                <th className="px-4 py-3">Événement & Client</th>
                <th className="px-4 py-3">Espace & Disposition</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3 text-center">Participants</th>
                <th className="px-4 py-3 text-right">Montant Devis</th>
                <th className="px-4 py-3 text-right">Acompte Versé</th>
                <th className="px-4 py-3 text-center">Statut Contrat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {evenementsFiltres.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => setDevisSelectionne(ev)}
                  className="hover:bg-surface-muted/30 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--accent)]">
                    {ev.codeDevis}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-foreground block">
                      {ev.titre}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {ev.clientEntreprise} • {ev.contactTelephone}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-foreground block">
                      {ev.salle}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      Disposition : {ev.disposition}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">
                    {ev.dateDebut === ev.dateFin
                      ? ev.dateDebut
                      : `Du ${ev.dateDebut} au ${ev.dateFin}`}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-foreground">
                    {ev.nbParticipants} pers.
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">
                    {formatXOF(ev.montantTotal)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                    {formatXOF(ev.acompteVerse)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        ev.statut === "acompte_recu"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {ev.statut === "acompte_recu" ? "Acompte Reçu" : "Devis Émis"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOUVEAU DEVIS */}
      {modalNouveauDevis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <h3 className="text-base font-bold text-foreground">Établir un devis séminaire</h3>
              <button
                type="button"
                onClick={() => setModalNouveauDevis(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalNouveauDevis(false);
                setSuccesMsg("Devis séminaire créé avec succès.");
                setTimeout(() => setSuccesMsg(null), 3000);
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Intitulé de l&apos;événement <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Séminaire Cadres Supérieurs"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Entreprise / Client organisateur <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: TotalEnergies Sénégal"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1.5">
                      Espace sélectionné
                    </label>
                    <select className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                      <option value="Salle Baobab">Salle Baobab</option>
                      <option value="Salon VIP Saloum">Salon VIP Saloum</option>
                      <option value="Esplanade Océane">Esplanade Océane</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1.5">
                      Disposition
                    </label>
                    <select className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                      <option value="Théâtre">Théâtre</option>
                      <option value="Disposition en U">Disposition en U</option>
                      <option value="Classe">Classe</option>
                      <option value="Banquet">Banquet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1.5">
                      Nombre de participants
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1.5">
                      Montant total TTC (FCFA)
                    </label>
                    <input
                      type="number"
                      defaultValue={1500000}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center justify-end gap-3 bg-surface">
                <button
                  type="button"
                  onClick={() => setModalNouveauDevis(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition"
                >
                  Générer le Devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
