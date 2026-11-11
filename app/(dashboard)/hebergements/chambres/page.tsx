"use client";

import { useState, useEffect } from "react";
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
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { loadHotelData, saveHotelData, clearHotelData } from "@/lib/hotel-storage";

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

const DEFAULT_TYPES_CHAMBRES: TypeChambre[] = [
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
];

const DEFAULT_CHAMBRES: Chambre[] = [
  {
    id: "demo-1",
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
    id: "demo-2",
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
    id: "demo-3",
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
    id: "demo-4",
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
    id: "demo-5",
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
];

export default function ChambresPage() {
  const [ongletActif, setOngletActif] = useState<"chambres" | "tarifs">("chambres");
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("tous");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [modalAjoutChambre, setModalAjoutChambre] = useState(false);
  const [modalModifierChambre, setModalModifierChambre] = useState<Chambre | null>(null);
  const [modalTypeTarif, setModalTypeTarif] = useState<TypeChambre | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire d'ajout
  const [nouveauNumero, setNouveauNumero] = useState("");
  const [nouveauType, setNouveauType] = useState("std");
  const [nouvelEtage, setNouvelEtage] = useState("RDC");
  const [nouveauBatiment, setNouveauBatiment] = useState("Principal");

  // Données persistantes
  const [chambres, setChambres] = useState<Chambre[]>(DEFAULT_CHAMBRES);
  const [typesChambres, setTypesChambres] = useState<TypeChambre[]>(DEFAULT_TYPES_CHAMBRES);
  const [isExempleFiligrane, setIsExempleFiligrane] = useState(true);

  // Chargement storage
  useEffect(() => {
    const loaded = loadHotelData<Chambre>("dhotel_chambres", DEFAULT_CHAMBRES);
    setChambres(loaded.items);
    setIsExempleFiligrane(loaded.isExempleFiligrane);

    const loadedTypes = loadHotelData<TypeChambre>("dhotel_types_chambres", DEFAULT_TYPES_CHAMBRES);
    setTypesChambres(loadedTypes.items);
  }, []);

  const handleAjoutChambre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauNumero.trim()) return;

    const typeObj = typesChambres.find((t) => t.id === nouveauType) || typesChambres[0];

    const nouvelle: Chambre = {
      id: "ch-" + Date.now(),
      numero: nouveauNumero.trim(),
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

    // Si on était en filigrane, on bascule sur la liste réelle avec ce premier enregistrement
    const updated = isExempleFiligrane ? [nouvelle] : [nouvelle, ...chambres];
    setChambres(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_chambres", updated);

    setModalAjoutChambre(false);
    setNouveauNumero("");
    setSuccesMsg(`Chambre ${nouvelle.numero} créée avec succès.`);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const handleModifierChambre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalModifierChambre) return;

    const updated = chambres.map((ch) =>
      ch.id === modalModifierChambre.id ? modalModifierChambre : ch
    );
    setChambres(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_chambres", updated);

    setModalModifierChambre(null);
    setSuccesMsg(`Chambre ${modalModifierChambre.numero} modifiée avec succès.`);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const handleSupprimerChambre = (id: string, numero: string) => {
    if (!window.confirm(`Confirmez-vous la suppression définitive de la chambre ${numero} ?`)) {
      return;
    }

    const updated = chambres.filter((ch) => ch.id !== id);
    setChambres(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_chambres", updated);

    setSuccesMsg(`Chambre ${numero} supprimée.`);
    setTimeout(() => setSuccesMsg(null), 3000);
  };

  const handleViderExemples = () => {
    if (window.confirm("Voulez-vous vider tous les exemples pour démarrer avec un inventaire vierge ?")) {
      setChambres([]);
      setIsExempleFiligrane(false);
      clearHotelData("dhotel_chambres");
      setSuccesMsg("Inventaire vidé. Vous pouvez maintenant ajouter vos propres chambres.");
      setTimeout(() => setSuccesMsg(null), 4000);
    }
  };

  const handleConvertirExemples = () => {
    // Rend les chambres de démo modifiables comme réelles
    const converted = chambres.map((c, i) => ({
      ...c,
      id: "ch-reel-" + (i + 1) + "-" + Date.now(),
    }));
    setChambres(converted);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_chambres", converted);
    setSuccesMsg("Les chambres d'exemple ont été converties en données réelles modifiables.");
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
            Inventaire de l&apos;hébergement, typologies et tarification multi-saisons
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalAjoutChambre(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary)] text-white hover:opacity-95 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Ajouter une Chambre
          </button>
        </div>
      </div>

      {/* Bannière filigrane sans impact */}
      {isExempleFiligrane && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Données d&apos;exemple en filigrane :</strong> Votre établissement ne possède pas encore de chambres enregistrées. Ces {chambres.length} chambres sont affichées à titre d&apos;exemple sans impact. Vous pouvez les modifier, les supprimer ou ajouter vos propres chambres.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleConvertirExemples}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold transition cursor-pointer"
            >
              Conserver et Modifier
            </button>
            <button
              onClick={handleViderExemples}
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-black/5 text-amber-900 dark:text-amber-200 text-xs font-semibold transition cursor-pointer"
            >
              Partir de zéro
            </button>
          </div>
        </div>
      )}

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
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${ongletActif === "chambres"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
        >
          <BedDouble className="w-4 h-4" />
          Inventaire des Chambres ({chambres.length})
        </button>
        <button
          onClick={() => setOngletActif("tarifs")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${ongletActif === "tarifs"
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
                placeholder="Rechercher par numéro, typologie ou bâtiment..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-surface-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-surface-border bg-surface text-foreground focus:outline-none"
              >
                <option value="tous">Toutes typologies</option>
                {typesChambres.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nom}
                  </option>
                ))}
              </select>

              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-surface-border bg-surface text-foreground focus:outline-none"
              >
                <option value="tous">Tous statuts</option>
                <option value="libre">Libre</option>
                <option value="occupee">Occupée</option>
                <option value="reservee">Réservée</option>
              </select>
            </div>
          </div>

          {/* Grille des chambres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chambresFiltrees.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-surface border border-surface-border rounded-2xl text-foreground-muted">
                Aucune chambre ne correspond à vos filtres.
              </div>
            ) : null}

            {chambresFiltrees.map((chambre) => {
              const estOccupee = chambre.statutOccupation === "occupee";
              const estReservee = chambre.statutOccupation === "reservee";

              return (
                <div
                  key={chambre.id}
                  className={`p-4 rounded-xl border border-surface-border bg-surface shadow-xs space-y-3 transition hover:shadow-md ${isExempleFiligrane ? "opacity-75 border-dashed border-amber-500/40" : ""
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold font-mono text-foreground">
                          {chambre.numero}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-surface-muted text-foreground-muted">
                          {chambre.batiment} • {chambre.etage}
                        </span>
                        {isExempleFiligrane && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            Exemple
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[var(--accent)] mt-0.5">
                        {chambre.typeNom}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${estOccupee
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
                      className={`font-medium ${chambre.statutMenage === "propre"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : chambre.statutMenage === "en_cours"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                    >
                      {chambre.statutMenage === "propre"
                        ? "✓ Propre"
                        : chambre.statutMenage === "en_cours"
                          ? "En cours"
                          : chambre.statutMenage === "hors_service"
                            ? "Hors Service"
                            : "À nettoyer"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-foreground-muted">Tarif nuitée :</span>
                    <span className="text-sm font-bold text-foreground">
                      {formatXOF(chambre.prixBase)}
                    </span>
                  </div>

                  {/* Actions Modifier & Supprimer */}
                  <div className="flex items-center justify-between pt-2 border-t border-surface-border/60">
                    <div className="flex items-center gap-1 text-foreground-muted">
                      <Wifi className="w-3.5 h-3.5" />
                      <Wind className="w-3.5 h-3.5 ml-1" />
                      <Tv className="w-3.5 h-3.5 ml-1" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModalModifierChambre(chambre)}
                        className="px-2 py-1 rounded-md text-xs font-semibold bg-surface-border/60 hover:bg-surface-border text-foreground transition cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSupprimerChambre(chambre.id, chambre.numero)}
                        className="p-1 rounded-md text-danger/70 hover:text-danger hover:bg-danger/10 transition cursor-pointer"
                        title="Supprimer cette chambre"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 2 : GRILLE TARIFAIRE */}
      {ongletActif === "tarifs" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typesChambres.map((type) => (
              <div
                key={type.id}
                className="p-5 rounded-xl border border-surface-border bg-surface shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {type.code}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-1">{type.nom}</h3>
                    <p className="text-xs text-foreground-muted">{type.capacite}</p>
                  </div>
                  <button
                    onClick={() => setModalTypeTarif(type)}
                    className="p-1.5 rounded-lg hover:bg-surface-muted text-foreground-muted hover:text-foreground cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-foreground-muted line-clamp-2">{type.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-surface-border text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Tarif Base :</span>
                    <span className="font-bold text-foreground">{formatXOF(type.tarifBase)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Saison Haute :</span>
                    <span className="font-bold text-emerald-600">{formatXOF(type.saisonHaute)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Saison Basse :</span>
                    <span className="font-bold text-amber-600">{formatXOF(type.saisonBasse)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALE AJOUT CHAMBRE */}
      {modalAjoutChambre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white bg-surface text-foreground border border-surface-border w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-surface-border">
              <h3 className="text-lg font-bold text-foreground">Ajouter une Chambre</h3>
              <button
                onClick={() => setModalAjoutChambre(false)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAjoutChambre} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium mb-1 text-foreground">Numéro de chambre *</label>
                <input
                  type="text"
                  placeholder="ex: 104, 301, VILLA-1"
                  value={nouveauNumero}
                  onChange={(e) => setNouveauNumero(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Typologie</label>
                <select
                  value={nouveauType}
                  onChange={(e) => setNouveauType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                >
                  {typesChambres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom} ({formatXOF(t.tarifBase)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1 text-foreground">Étage</label>
                  <input
                    type="text"
                    value={nouvelEtage}
                    onChange={(e) => setNouvelEtage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-foreground">Bâtiment</label>
                  <input
                    type="text"
                    value={nouveauBatiment}
                    onChange={(e) => setNouveauBatiment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalAjoutChambre(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-foreground hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-bold hover:opacity-95"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE MODIFICATION CHAMBRE */}
      {modalModifierChambre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white bg-surface text-foreground border border-surface-border w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-surface-border">
              <h3 className="text-lg font-bold text-foreground">
                Modifier Chambre N° {modalModifierChambre.numero}
              </h3>
              <button
                onClick={() => setModalModifierChambre(null)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModifierChambre} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium mb-1 text-foreground">Numéro de chambre *</label>
                <input
                  type="text"
                  value={modalModifierChambre.numero}
                  onChange={(e) =>
                    setModalModifierChambre({ ...modalModifierChambre, numero: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Typologie</label>
                <select
                  value={modalModifierChambre.typeId}
                  onChange={(e) => {
                    const sel = typesChambres.find((t) => t.id === e.target.value);
                    setModalModifierChambre({
                      ...modalModifierChambre,
                      typeId: e.target.value,
                      typeNom: sel?.nom || modalModifierChambre.typeNom,
                      prixBase: sel?.tarifBase || modalModifierChambre.prixBase,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                >
                  {typesChambres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1 text-foreground">Statut Occupation</label>
                  <select
                    value={modalModifierChambre.statutOccupation}
                    onChange={(e: any) =>
                      setModalModifierChambre({
                        ...modalModifierChambre,
                        statutOccupation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                  >
                    <option value="libre">Libre</option>
                    <option value="occupee">Occupée</option>
                    <option value="reservee">Réservée</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-foreground">Statut Ménage</label>
                  <select
                    value={modalModifierChambre.statutMenage}
                    onChange={(e: any) =>
                      setModalModifierChambre({
                        ...modalModifierChambre,
                        statutMenage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                  >
                    <option value="propre">Propre / Prête</option>
                    <option value="en_cours">En cours</option>
                    <option value="a_nettoyer">À nettoyer</option>
                    <option value="hors_service">Hors service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Tarif Nuitée (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  value={modalModifierChambre.prixBase}
                  onChange={(e) =>
                    setModalModifierChambre({
                      ...modalModifierChambre,
                      prixBase: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-surface-border bg-background text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalModifierChambre(null)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-foreground hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-bold hover:opacity-95"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
