"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Save,
  Moon,
  Sun,
  Flame,
  Check,
  UserCheck,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { STATUTS_POINTAGE } from "@/lib/rh";

interface LignePointageCollaborateur {
  salarieId: string;
  matricule: string;
  nomComplet: string;
  poste: string;
  departement: string;
  statut: "present" | "retard" | "demi_journee" | "conge_paye" | "maladie" | "absence_justifiee" | "absence_injustifiee" | "repos_hebdo";
  retardMinutes: number;
  heuresNormales: number;
  heuresSuppJour: number;
  heuresSuppNuit: number;
  heuresDimancheFerie: number;
  remarques?: string;
  enregistre: boolean;
}

export default function PointagePresencesPage() {
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date().toISOString().slice(0, 10));
  const [recherche, setRecherche] = useState("");
  const [filtreDept, setFiltreDept] = useState("tous");
  const [notification, setNotification] = useState<string | null>(null);

  const [lignesPointage, setLignesPointage] = useState<LignePointageCollaborateur[]>([
    {
      salarieId: "1",
      matricule: "SAL-001",
      nomComplet: "Fatou Bintou Ndiaye",
      poste: "Chef de Réception",
      departement: "Réception & Front-Desk",
      statut: "present",
      retardMinutes: 0,
      heuresNormales: 8,
      heuresSuppJour: 2,
      heuresSuppNuit: 0,
      heuresDimancheFerie: 0,
      remarques: "Arrivée VIP à 18h",
      enregistre: true,
    },
    {
      salarieId: "2",
      matricule: "SAL-002",
      nomComplet: "Cheikh Tidiane Diouf",
      poste: "Chef Exécutif Cuisine",
      departement: "Cuisine & Pâtisserie",
      statut: "present",
      retardMinutes: 0,
      heuresNormales: 8,
      heuresSuppJour: 3,
      heuresSuppNuit: 0,
      heuresDimancheFerie: 0,
      remarques: "Préparation dîner de gala",
      enregistre: true,
    },
    {
      salarieId: "3",
      matricule: "SAL-003",
      nomComplet: "Amadou Sow",
      poste: "Maître d'Hôtel",
      departement: "Restaurant, Bar & Room Service",
      statut: "present",
      retardMinutes: 10,
      heuresNormales: 8,
      heuresSuppJour: 1,
      heuresSuppNuit: 2,
      heuresDimancheFerie: 0,
      remarques: "Service du soir prolongé",
      enregistre: true,
    },
    {
      salarieId: "4",
      matricule: "SAL-004",
      nomComplet: "Aïssatou Sy",
      poste: "Gouvernante Générale",
      departement: "Hébergement & Étages (Housekeeping)",
      statut: "present",
      retardMinutes: 0,
      heuresNormales: 8,
      heuresSuppJour: 0,
      heuresSuppNuit: 0,
      heuresDimancheFerie: 0,
      enregistre: true,
    },
    {
      salarieId: "5",
      matricule: "SAIS-005",
      nomComplet: "Mariama Diallo",
      poste: "Femme de chambre (Haute Saison)",
      departement: "Hébergement & Étages (Housekeeping)",
      statut: "present",
      retardMinutes: 0,
      heuresNormales: 8,
      heuresSuppJour: 1,
      heuresSuppNuit: 0,
      heuresDimancheFerie: 0,
      enregistre: true,
    },
    {
      salarieId: "6",
      matricule: "EXT-006",
      nomComplet: "Ousseynou Fall",
      poste: "Extra Barman Banquets",
      departement: "Restaurant, Bar & Room Service",
      statut: "present",
      retardMinutes: 0,
      heuresNormales: 8,
      heuresSuppJour: 0,
      heuresSuppNuit: 4,
      heuresDimancheFerie: 0,
      remarques: "Soirée privée piscine (22h-02h)",
      enregistre: true,
    },
    {
      salarieId: "7",
      matricule: "SAL-009",
      nomComplet: "Ibrahima Ba",
      poste: "Réceptionniste de Nuit",
      departement: "Réception & Front-Desk",
      statut: "repos_hebdo",
      retardMinutes: 0,
      heuresNormales: 0,
      heuresSuppJour: 0,
      heuresSuppNuit: 0,
      heuresDimancheFerie: 0,
      enregistre: true,
    },
    {
      salarieId: "8",
      matricule: "SAL-010",
      nomComplet: "Moussa Sène",
      poste: "Plongeur / Cuisine",
      departement: "Cuisine & Pâtisserie",
      statut: "absence_injustifiee",
      retardMinutes: 0,
      heuresNormales: 0,
      heuresSuppJour: 0,
      heuresSuppNuit: 0,
      heuresDimancheFerie: 0,
      remarques: "Absence non signalée à la prise de service",
      enregistre: true,
    },
  ]);

  const lignesFiltrees = lignesPointage.filter((l) => {
    const matchRecherche =
      l.nomComplet.toLowerCase().includes(recherche.toLowerCase()) ||
      l.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
      l.poste.toLowerCase().includes(recherche.toLowerCase());
    const matchDept = filtreDept === "tous" || l.departement === filtreDept;
    return matchRecherche && matchDept;
  });

  const totalPresents = lignesPointage.filter((l) => l.statut === "present" || l.statut === "retard").length;
  const totalAbsents = lignesPointage.filter((l) => l.statut.includes("absence") || l.statut === "maladie").length;
  const totalHeuresSuppJour = lignesPointage.reduce((acc, l) => acc + l.heuresSuppJour, 0);
  const totalHeuresSuppNuit = lignesPointage.reduce((acc, l) => acc + l.heuresSuppNuit, 0);

  function modifierStatut(salarieId: string, nouveauStatut: any) {
    setLignesPointage(
      lignesPointage.map((l) =>
        l.salarieId === salarieId
          ? {
              ...l,
              statut: nouveauStatut,
              heuresNormales: nouveauStatut === "present" || nouveauStatut === "retard" ? 8 : 0,
              enregistre: false,
            }
          : l
      )
    );
  }

  function modifierHeures(salarieId: string, champ: "heuresSuppJour" | "heuresSuppNuit" | "heuresDimancheFerie" | "retardMinutes", valeur: number) {
    setLignesPointage(
      lignesPointage.map((l) =>
        l.salarieId === salarieId
          ? {
              ...l,
              [champ]: Math.max(0, valeur),
              enregistre: false,
            }
          : l
      )
    );
  }

  function enregistrerTousLesPointages() {
    setLignesPointage(lignesPointage.map((l) => ({ ...l, enregistre: true })));
    setNotification(`Feuille de pointage du ${dateSelectionnee} validée et enregistrée pour la paie.`);
    setTimeout(() => setNotification(null), 5000);
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Pointage & Présences</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Temps & Heures Supp
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enregistrement quotidien des présences, retards, absences déductibles et heures supplémentaires hôtelières (nuit / jour / fériés).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateSelectionnee}
            onChange={(e) => setDateSelectionnee(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={enregistrerTousLesPointages}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            <Save className="h-4 w-4" />
            Valider le pointage
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cartes KPI du jour */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Présents ce Jour</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalPresents}</p>
          <p className="text-xs text-emerald-600 mt-1">En service dans l'établissement</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Absents / Malades</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{totalAbsents}</p>
          <p className="text-xs text-rose-500 mt-1">Dont absences injustifiées à déduire</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Heures Supp. Jour (30%)</span>
            <Sun className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalHeuresSuppJour} h</p>
          <p className="text-xs text-muted-foreground mt-1">Cumulées sur le shift</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Heures de Nuit (50%)</span>
            <Moon className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalHeuresSuppNuit} h</p>
          <p className="text-xs text-muted-foreground mt-1">Entre 22h et 05h du matin</p>
        </div>
      </div>

      {/* Barre de recherche & filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filtrer par nom de collaborateur, matricule ou poste..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filtreDept}
            onChange={(e) => setFiltreDept(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="tous">Tous les départements</option>
            <option value="Réception & Front-Desk">Réception & Front-Desk</option>
            <option value="Hébergement & Étages (Housekeeping)">Hébergement & Étages</option>
            <option value="Cuisine & Pâtisserie">Cuisine & Pâtisserie</option>
            <option value="Restaurant, Bar & Room Service">Restaurant & Bar</option>
            <option value="Maintenance, Froid & Technique">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Grille de pointage interactif */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 py-3">Collaborateur</th>
                <th className="px-4 py-3">Statut Présence</th>
                <th className="px-4 py-3">Heures Normales</th>
                <th className="px-4 py-3">HS Jour (+30%)</th>
                <th className="px-4 py-3">HS Nuit (+50%)</th>
                <th className="px-4 py-3">Retard (min)</th>
                <th className="px-4 py-3">Observations</th>
                <th className="px-4 py-3 text-center">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lignesFiltrees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun collaborateur trouvé pour ce département.
                  </td>
                </tr>
              ) : (
                lignesFiltrees.map((l) => (
                  <tr key={l.salarieId} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{l.nomComplet}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <span className="font-mono text-primary font-medium">{l.matricule}</span>
                        <span>• {l.poste}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={l.statut}
                        onChange={(e) => modifierStatut(l.salarieId, e.target.value)}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary"
                      >
                        {STATUTS_POINTAGE.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="12"
                        step="0.5"
                        value={l.heuresNormales}
                        onChange={(e) =>
                          setLignesPointage(
                            lignesPointage.map((item) =>
                              item.salarieId === l.salarieId
                                ? { ...item, heuresNormales: Number(e.target.value), enregistre: false }
                                : item
                            )
                          )
                        }
                        className="w-16 rounded border border-border bg-background px-2 py-1 text-xs text-center font-mono text-foreground"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={l.heuresSuppJour}
                        onChange={(e) => modifierHeures(l.salarieId, "heuresSuppJour", Number(e.target.value))}
                        className="w-16 rounded border border-border bg-background px-2 py-1 text-xs text-center font-mono text-foreground"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={l.heuresSuppNuit}
                        onChange={(e) => modifierHeures(l.salarieId, "heuresSuppNuit", Number(e.target.value))}
                        className="w-16 rounded border border-border bg-background px-2 py-1 text-xs text-center font-mono text-foreground"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="240"
                        step="5"
                        value={l.retardMinutes}
                        onChange={(e) => modifierHeures(l.salarieId, "retardMinutes", Number(e.target.value))}
                        className="w-16 rounded border border-border bg-background px-2 py-1 text-xs text-center font-mono text-foreground"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Ex: Remplacement shift..."
                        value={l.remarques || ""}
                        onChange={(e) =>
                          setLignesPointage(
                            lignesPointage.map((item) =>
                              item.salarieId === l.salarieId
                                ? { ...item, remarques: e.target.value, enregistre: false }
                                : item
                            )
                          )
                        }
                        className="w-full min-w-[140px] rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      {l.enregistre ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <Check className="h-3 w-3" /> Validé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Non sauvé
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
