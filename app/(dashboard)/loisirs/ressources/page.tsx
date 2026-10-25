"use client";

import { useState } from "react";
import {
  Compass,
  Users,
  Anchor,
  Bike,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  Car,
  Layers,
  Sparkles,
  Phone,
} from "lucide-react";

interface GuideRessource {
  id: string;
  nom: string;
  role: "Guide Touristique National" | "Piroguier / Marin" | "Chauffeur 4x4" | "Praticienne Spa";
  telephone: string;
  langues: string[];
  certifications: string[];
  statut: "disponible" | "en_sortie" | "repos";
}

interface MaterielRessource {
  id: string;
  nom: string;
  categorie: "Véhicule" | "Embarcation" | "Quads & VTT" | "Sécurité & Nautisme" | "Spa";
  quantite: number;
  immatriculationOuRef: string;
  dernierControleSecurite: string;
  statut: "operationnel" | "revision_necessaire";
}

export default function GuidesRessourcesPage() {
  const [onglet, setOnglet] = useState<"guides" | "materiel">("guides");
  const [recherche, setRecherche] = useState("");

  const [guides, setGuides] = useState<GuideRessource[]>([
    {
      id: "1",
      nom: "Ousmane Diagne",
      role: "Guide Touristique National",
      telephone: "+221 77 450 88 12",
      langues: ["Français", "Anglais", "Wolof"],
      certifications: ["Carte Professionnelle Ministère Tourisme", "Secourisme Croix-Rouge"],
      statut: "en_sortie",
    },
    {
      id: "2",
      nom: "Babacar Sarr",
      role: "Piroguier / Marin",
      telephone: "+221 70 800 33 44",
      langues: ["Français", "Wolof", "Sérère"],
      certifications: ["Permis Côtier de Navigation", "Sauvetage Aquatique"],
      statut: "disponible",
    },
    {
      id: "3",
      nom: "Ibrahima Touré",
      role: "Chauffeur 4x4",
      telephone: "+221 76 999 11 22",
      langues: ["Français", "Wolof"],
      certifications: ["Permis Poids Lourd / Transport Public", "Conduite Tout-Terrain Sable"],
      statut: "disponible",
    },
    {
      id: "4",
      nom: "Khadija Ba",
      role: "Praticienne Spa",
      telephone: "+221 77 333 44 55",
      langues: ["Français", "Anglais"],
      certifications: ["Diplôme Esthétique & Cosmétologie", "Massage Traditionnel"],
      statut: "disponible",
    },
  ]);

  const [materiel, setMateriel] = useState<MaterielRessource[]>([
    {
      id: "1",
      nom: "Minibus Safari 4x4 Toyota Land Cruiser",
      categorie: "Véhicule",
      quantite: 2,
      immatriculationOuRef: "DK-4589-BB & DK-4590-BB",
      dernierControleSecurite: "15/10/2026",
      statut: "operationnel",
    },
    {
      id: "2",
      nom: "Grande Pirogue Traditionnelle Motorisée 'Saloum'",
      categorie: "Embarcation",
      quantite: 1,
      immatriculationOuRef: "SN-DEL-042",
      dernierControleSecurite: "01/10/2026",
      statut: "operationnel",
    },
    {
      id: "3",
      nom: "Flotte Quads Yamaha Grizzly 450cc",
      categorie: "Quads & VTT",
      quantite: 8,
      immatriculationOuRef: "QD-01 à QD-08",
      dernierControleSecurite: "18/10/2026",
      statut: "operationnel",
    },
    {
      id: "4",
      nom: "Gilets de Sauvetage Homologués CE (Adultes & Enfants)",
      categorie: "Sécurité & Nautisme",
      quantite: 35,
      immatriculationOuRef: "LOT-GILET-2026",
      dernierControleSecurite: "20/10/2026",
      statut: "operationnel",
    },
    {
      id: "5",
      nom: "Vélos Tout-Terrain VTT Scott",
      categorie: "Quads & VTT",
      quantite: 12,
      immatriculationOuRef: "VTT-01 à 12",
      dernierControleSecurite: "10/09/2026",
      statut: "revision_necessaire",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Guides & Ressources de Loisirs
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Équipes d'encadrement certifiées, piroguiers, véhicules 4x4 et contrôles de sécurité
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-surface-border gap-6">
        <button
          onClick={() => setOnglet("guides")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            onglet === "guides"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          Équipe des Guides ({guides.length})
        </button>
        <button
          onClick={() => setOnglet("materiel")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            onglet === "materiel"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Anchor className="w-4 h-4" />
          Flotte & Matériel d'Aventure ({materiel.length} catégories)
        </button>
      </div>

      {/* ONGLET 1 : GUIDES */}
      {onglet === "guides" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="p-5 rounded-xl bg-surface border border-surface-border space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {guide.nom}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--accent)] mt-0.5">
                    {guide.role}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold capitalize ${
                    guide.statut === "disponible"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : guide.statut === "en_sortie"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                      : "bg-surface-muted text-foreground-muted"
                  }`}
                >
                  {guide.statut === "en_sortie" ? "En excursion" : guide.statut}
                </span>
              </div>

              <div className="text-xs space-y-2 pt-2 border-t border-surface-border">
                <div className="flex items-center gap-2 text-foreground-muted">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{guide.telephone}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-foreground-muted">Langues :</span>
                  {guide.langues.map((l, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-surface-muted font-medium text-foreground"
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <div className="space-y-0.5 pt-1">
                  {guide.certifications.map((c, i) => (
                    <div
                      key={i}
                      className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5"
                    >
                      <span>✓</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ONGLET 2 : MATÉRIEL */}
      {onglet === "materiel" && (
        <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3">Équipement</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3 text-center">Quantité</th>
                  <th className="px-4 py-3">Réf / Immatriculation</th>
                  <th className="px-4 py-3">Dernier Contrôle Sécurité</th>
                  <th className="px-4 py-3 text-center">État Opérationnel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {materiel.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-muted/30">
                    <td className="px-4 py-3 font-bold text-foreground">
                      {m.nom}
                    </td>
                    <td className="px-4 py-3 text-foreground-muted text-xs">
                      {m.categorie}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      {m.quantite}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--accent)]">
                      {m.immatriculationOuRef}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      {m.dernierControleSecurite}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          m.statut === "operationnel"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        {m.statut === "operationnel"
                          ? "✓ 100% Opérationnel"
                          : "Révision Requise"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
