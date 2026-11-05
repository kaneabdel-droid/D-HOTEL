"use client";

import { useState } from "react";
import {
  Hotel,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  BedDouble,
  Users,
  Eye,
  SlidersHorizontal,
  Layers,
  Calendar,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Waves,
  X,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface Chambre {
  id: string;
  numero: string;
  etage: string;
  batiment: string;
  typeId: string;
  typeNom: string;
  prixBase: number;
  capaciteAdultes: number;
  capaciteEnfants: number;
  statutOccupation: "libre" | "occupee" | "reservee";
  statutMenage: "propre" | "en_cours" | "a_nettoyer" | "hors_service";
  equipements: string[];
}

interface TypeChambre {
  id: string;
  nom: string;
  code: string;
  tarifBase: number;
  capacite: string;
  nbTotal: number;
  description: string;
  saisonHaute: number;
  saisonBasse: number;
}

export default function ChambresPage() {
  const [ongletActif, setOngletActif] = useState<"chambres" | "tarifs">("chambres");
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("tous");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [modalAjoutChambre, setModalAjoutChambre] = useState(false);
  const [modalTypeTarif, setModalTypeTarif] = useState<TypeChambre | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire d'ajout
  const [nouveauNumero, setNouveauNumero] = useState("");
  const [nouveauType, setNouveauType] = useState("std");
  const [nouvelEtage, setNouvelEtage] = useState("RDC");
  const [nouveauBatiment, setNouveauBatiment] = useState("Principal");

  const [typesChambres, setTypesChambres] = useState<TypeChambre[]>([
    {
      id: "std",
      nom: "Chambre Standard",
      code: "STD",
      tarifBase: 45000,
      capacite: "2 adultes",
      nbTotal: 16,
      description: "Chambre lumineuse avec vue jardin, lit queen size, salle d'eau italienne.",
      saisonHaute: 55000,
      saisonBasse: 38000,
    },
    {
      id: "dlx",
      nom: "Chambre Deluxe",
      code: "DLX",
      tarifBase: 65000,
      capacite: "2 adultes + 1 enfant",
      nbTotal: 12,
      description: "Spacieuse avec balcon privatif, salon cosy, minibar garni et bureau.",
      saisonHaute: 80000,
      saisonBasse: 55000,
    },
    {
      id: "ste-jr",
      nom: "Suite Junior",
      code: "SJR",
      tarifBase: 95000,
      capacite: "2 adultes + 1 enfant",
      nbTotal: 8,
      description: "Espace salon distinct, lit king size, baignoire balnéo et machine Nespresso.",
      saisonHaute: 120000,
      saisonBasse: 80000,
    },
    {
      id: "bung-plage",
      nom: "Bungalow Plage",
      code: "BPL",
      tarifBase: 180000,
      capacite: "4 personnes (2 chambres)",
      nbTotal: 6,
      description: "Accès direct au sable blanc, terrasse panoramique, plunge pool privée.",
      saisonHaute: 230000,
      saisonBasse: 150000,
    },
    {
      id: "lodge",
      nom: "Tente Lodge Safari",
      code: "LOD",
      tarifBase: 110000,
      capacite: "2 adultes",
      nbTotal: 4,
      description: "Immersion nature avec le confort 5 étoiles, terrasse sur pilotis ombragée.",
      saisonHaute: 140000,
      saisonBasse: 90000,
    },
  ]);

  const [chambres, setChambres] = useState<Chambre[]>([
    {
      id: "1",
      numero: "101",
      etage: "RDC",
      batiment: "Principal",
      typeId: "std",
      typeNom: "Chambre Standard",
      prixBase: 45000,
      capaciteAdultes: 2,
      capaciteEnfants: 0,
      statutOccupation: "occupee",
      statutMenage: "propre",
      equipements: ["wifi", "clim", "tv", "minibar"],
    },
    {
      id: "2",
      numero: "102",
      etage: "RDC",
      batiment: "Principal",
      typeId: "std",
      typeNom: "Chambre Standard",
      prixBase: 45000,
      capaciteAdultes: 2,
      capaciteEnfants: 0,
      statutOccupation: "reservee",
      statutMenage: "propre",
      equipements: ["wifi", "clim", "tv", "minibar"],
    },
    {
      id: "3",
      numero: "103",
      etage: "RDC",
      batiment: "Principal",
      typeId: "dlx",
      typeNom: "Chambre Deluxe",
      prixBase: 65000,
      capaciteAdultes: 2,
      capaciteEnfants: 1,
      statutOccupation: "libre",
      statutMenage: "en_cours",
      equipements: ["wifi", "clim", "tv", "minibar", "balcon"],
    },
    {
      id: "4",
      numero: "201",
      etage: "1er étage",
      batiment: "Principal",
      typeId: "ste-jr",
      typeNom: "Suite Junior",
      prixBase: 95000,
      capaciteAdultes: 2,
      capaciteEnfants: 1,
      statutOccupation: "occupee",
      statutMenage: "propre",
      equipements: ["wifi", "clim", "tv", "minibar", "balneo", "nespresso"],
    },
    {
      id: "5",
      numero: "204",
      etage: "1er étage",
      batiment: "Principal",
      typeId: "ste-jr",
      typeNom: "Suite Junior",
      prixBase: 95000,
      capaciteAdultes: 2,
      capaciteEnfants: 1,
      statutOccupation: "libre",
      statutMenage: "hors_service",
      equipements: ["wifi", "clim", "tv", "minibar", "balneo"],
    },
    {
      id: "6",
      numero: "Villa 1",
      etage: "Front de Mer",
      batiment: "Bungalows",
      typeId: "bung-plage",
      typeNom: "Bungalow Plage",
      prixBase: 180000,
      capaciteAdultes: 4,
      capaciteEnfants: 2,
      statutOccupation: "occupee",
      statutMenage: "propre",
      equipements: ["wifi", "clim", "tv", "minibar", "piscine_privee", "terrasse"],
    },
    {
      id: "7",
      numero: "Villa 2",
      etage: "Front de Mer",
      batiment: "Bungalows",
      typeId: "bung-plage",
      typeNom: "Bungalow Plage",
      prixBase: 180000,
      capaciteAdultes: 4,
      capaciteEnfants: 2,
      statutOccupation: "libre",
      statutMenage: "propre",
      equipements: ["wifi", "clim", "tv", "minibar", "piscine_privee", "terrasse"],
    },
    {
      id: "8",
      numero: "Lodge 01",
      etage: "Canopée",
      batiment: "Éco-Lodge",
      typeId: "lodge",
      typeNom: "Tente Lodge Safari",
      prixBase: 110000,
      capaciteAdultes: 2,
      capaciteEnfants: 0,
      statutOccupation: "libre",
      statutMenage: "propre",
      equipements: ["wifi", "ventilateur", "minibar", "terrasse"],
    },
  ]);

  const handleAjoutChambre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauNumero) return;

    const typeObj = typesChambres.find((t) => t.id === nouveauType) || typesChambres[0];

    const nouvelle: Chambre = {
      id: String(Date.now()),
      numero: nouveauNumero,
      etage: nouvelEtage,
      batiment: nouveauBatiment,
      typeId: typeObj.id,
      typeNom: typeObj.nom,
      prixBase: typeObj.tarifBase,
      capaciteAdultes: 2,
      capaciteEnfants: 0,
      statutOccupation: "libre",
      statutMenage: "propre",
      equipements: ["wifi", "clim", "tv", "minibar"],
    };

    setChambres([nouvelle, ...chambres]);
    setModalAjoutChambre(false);
    setNouveauNumero("");
    setSuccesMsg(`Chambre ${nouvelle.numero} créée avec succès.`);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const chambresFiltrees = chambres.filter((ch) => {
    const correspondRecherche =
      ch.numero.toLowerCase().includes(recherche.toLowerCase()) ||
      ch.typeNom.toLowerCase().includes(recherche.toLowerCase()) ||
      ch.batiment.toLowerCase().includes(recherche.toLowerCase());
    const correspondType = filtreType === "tous" || ch.typeId === filtreType;
    const correspondStatut =
      filtreStatut === "tous" || ch.statutOccupation === filtreStatut;
    return correspondRecherche && correspondType && correspondStatut;
  });

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Hotel className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Chambres & Grille Tarifaire
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Inventaire de l'hébergement, typologies et tarification multi-saisons
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalAjoutChambre(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Ajouter une Chambre
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Onglets Chambres / Grille Tarifaire */}
      <div className="flex border-b border-surface-border gap-6">
        <button
          onClick={() => setOngletActif("chambres")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            ongletActif === "chambres"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <BedDouble className="w-4 h-4" />
          Inventaire des Chambres ({chambres.length})
        </button>
        <button
          onClick={() => setOngletActif("tarifs")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            ongletActif === "tarifs"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Grille Tarifaire Multi-Saisons ({typesChambres.length} typologies)
        </button>
      </div>

      {/* CONTENU ONGLET 1 : INVENTAIRE DES CHAMBRES */}
      {ongletActif === "chambres" && (
        <div className="space-y-4">
          {/* Barre de filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
              <input
                type="text"
                placeholder="Rechercher par numéro, bâtiment, type..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              />
            </div>

            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground focus:outline-none"
            >
              <option value="tous">Toutes les typologies</option>
              {typesChambres.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </select>

            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground focus:outline-none"
            >
              <option value="tous">Tous les statuts</option>
              <option value="libre">Libre</option>
              <option value="occupee">Occupée</option>
              <option value="reservee">Réservée</option>
            </select>
          </div>

          {/* Grille des tuiles de chambres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {chambresFiltrees.map((chambre) => {
              const estOccupee = chambre.statutOccupation === "occupee";
              const estReservee = chambre.statutOccupation === "reservee";
              const estLibre = chambre.statutOccupation === "libre";

              return (
                <div
                  key={chambre.id}
                  className="p-5 rounded-xl bg-surface border border-surface-border hover:shadow-md transition space-y-3 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      estOccupee
                        ? "bg-blue-500"
                        : estReservee
                        ? "bg-purple-500"
                        : "bg-emerald-500"
                    }`}
                  />

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-foreground">
                          {chambre.numero}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-surface-muted text-foreground-muted">
                          {chambre.batiment} • {chambre.etage}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--accent)] mt-0.5">
                        {chambre.typeNom}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                        estOccupee
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : estReservee
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {chambre.statutOccupation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-border/60">
                    <span className="text-foreground-muted flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Ménage :
                    </span>
                    <span
                      className={`font-medium ${
                        chambre.statutMenage === "propre"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : chambre.statutMenage === "en_cours"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {chambre.statutMenage === "propre"
                        ? "✓ Propre / Prête"
                        : chambre.statutMenage === "en_cours"
                        ? "En cours"
                        : chambre.statutMenage === "hors_service"
                        ? "Hors Service (Panne)"
                        : "À nettoyer"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-foreground-muted">
                      Tarif nuitée :
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {formatXOF(chambre.prixBase)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 pt-2 text-foreground-muted">
                    <Wifi className="w-3.5 h-3.5" />
                    <Wind className="w-3.5 h-3.5 ml-1" />
                    <Tv className="w-3.5 h-3.5 ml-1" />
                    <Coffee className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 2 : GRILLE TARIFAIRE MULTI-SAISONS */}
      {ongletActif === "tarifs" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-surface border border-surface-border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="text-sm font-bold">Calendrier des Périodes Saisonnières</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-muted/70 border border-surface-border">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  ☀️ Haute Saison (Hivernage & Fêtes)
                </span>
                <span className="text-foreground-muted">
                  01 Nov ➔ 15 Avril & 15 Déc ➔ 05 Jan (+20% à +30% sur le tarif de base)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted/70 border border-surface-border">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                  🍃 Moyenne Saison (Printemps)
                </span>
                <span className="text-foreground-muted">
                  16 Avril ➔ 30 Juin (Tarif nominal de base de référence)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted/70 border border-surface-border">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  🌧️ Basse Saison
                </span>
                <span className="text-foreground-muted">
                  01 Juil ➔ 31 Octobre (Offres de relance, -15% à -25%)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
            <div className="p-4 border-b border-surface-border font-bold text-sm">
              Nomenclature des Typologies & Tarifs par Saison
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
                  <tr>
                    <th className="px-4 py-3">Typologie</th>
                    <th className="px-4 py-3">Capacité</th>
                    <th className="px-4 py-3">Inventaire</th>
                    <th className="px-4 py-3 text-right">Basse Saison</th>
                    <th className="px-4 py-3 text-right">Tarif Base (Moyenne)</th>
                    <th className="px-4 py-3 text-right">Haute Saison</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {typesChambres.map((type) => (
                    <tr key={type.id} className="hover:bg-surface-muted/30">
                      <td className="px-4 py-3">
                        <span className="font-bold block text-foreground">
                          {type.nom}
                        </span>
                        <span className="text-xs text-foreground-muted">
                          Code: {type.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground-muted">
                        {type.capacite}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {type.nbTotal} unités
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatXOF(type.saisonBasse)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">
                        {formatXOF(type.tarifBase)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400">
                        {formatXOF(type.saisonHaute)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setModalTypeTarif(type)}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-surface-muted hover:bg-surface-border transition"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUT CHAMBRE */}
      {modalAjoutChambre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <h3 className="text-base font-bold text-foreground">Ajouter une nouvelle chambre</h3>
              <button
                type="button"
                onClick={() => setModalAjoutChambre(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAjoutChambre} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Numéro ou Nom de la Chambre / Villa <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 104, Suite 302, Villa 5"
                    required
                    value={nouveauNumero}
                    onChange={(e) => setNouveauNumero(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Typologie d&apos;Hébergement <span className="text-danger">*</span>
                  </label>
                  <select
                    value={nouveauType}
                    onChange={(e) => setNouveauType(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    {typesChambres.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nom} ({formatXOF(t.tarifBase)}/nuit)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      Bâtiment / Aile
                    </label>
                    <input
                      type="text"
                      value={nouveauBatiment}
                      onChange={(e) => setNouveauBatiment(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      Étage / Emplacement
                    </label>
                    <input
                      type="text"
                      value={nouvelEtage}
                      onChange={(e) => setNouvelEtage(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center justify-end gap-3 bg-surface">
                <button
                  type="button"
                  onClick={() => setModalAjoutChambre(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition"
                >
                  Créer la Chambre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER TARIF TYPOLOGIE */}
      {modalTypeTarif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <h3 className="text-base font-bold text-foreground">
                Modifier la tarification : {modalTypeTarif.nom}
              </h3>
              <button
                type="button"
                onClick={() => setModalTypeTarif(null)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Tarif Moyen de Base (FCFA)
                </label>
                <input
                  type="number"
                  defaultValue={modalTypeTarif.tarifBase}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Basse Saison (FCFA)
                  </label>
                  <input
                    type="number"
                    defaultValue={modalTypeTarif.saisonBasse}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Haute Saison (FCFA)
                  </label>
                  <input
                    type="number"
                    defaultValue={modalTypeTarif.saisonHaute}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center justify-end gap-3 bg-surface">
              <button
                type="button"
                onClick={() => setModalTypeTarif(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccesMsg("Grille tarifaire actualisée.");
                  setModalTypeTarif(null);
                  setTimeout(() => setSuccesMsg(null), 3000);
                }}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition"
              >
                Enregistrer les Tarifs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
