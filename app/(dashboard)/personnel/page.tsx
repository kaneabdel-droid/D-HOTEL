"use client";

import { useState } from "react";
import {
  UserCheck,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Building,
  Layers,
  Sparkles,
  Phone,
  AlertCircle,
} from "lucide-react";

interface Collaborateur {
  id: string;
  nom: string;
  poste: string;
  departement: "Réception" | "Gouvernance" | "Cuisine" | "Salle & Bar" | "Maintenance" | "Sécurité";
  telephone: string;
  quartAujourdhui: "Matin (07h-15h30)" | "Soir (15h-23h30)" | "Nuit (23h-07h30)" | "Coupé (11h-15h / 18h-23h)" | "Repos Hebdomadaire";
  statutPointage: "present" | "en_pause" | "attendu" | "en_repos";
  heuresSemaine: number;
}

export default function PersonnelPlanningPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreDept, setFiltreDept] = useState("tous");
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([
    {
      id: "1",
      nom: "Fatou Bintou Ndiaye",
      poste: "Chef de Réception",
      departement: "Réception",
      telephone: "+221 77 450 11 22",
      quartAujourdhui: "Matin (07h-15h30)",
      statutPointage: "present",
      heuresSemaine: 38,
    },
    {
      id: "2",
      nom: "Amadou Sow",
      poste: "Maître d'Hôtel",
      departement: "Salle & Bar",
      telephone: "+221 78 120 33 44",
      quartAujourdhui: "Coupé (11h-15h / 18h-23h)",
      statutPointage: "present",
      heuresSemaine: 40,
    },
    {
      id: "3",
      nom: "Cheikh Tidiane Diouf",
      poste: "Chef Exécutif Cuisine",
      departement: "Cuisine",
      telephone: "+221 76 800 55 66",
      quartAujourdhui: "Matin (07h-15h30)",
      statutPointage: "present",
      heuresSemaine: 42,
    },
    {
      id: "4",
      nom: "Aïssatou Sy",
      poste: "Gouvernante Générale",
      departement: "Gouvernance",
      telephone: "+221 77 900 77 88",
      quartAujourdhui: "Matin (07h-15h30)",
      statutPointage: "present",
      heuresSemaine: 36,
    },
    {
      id: "5",
      nom: "Babacar Fall",
      poste: "Technicien de Maintenance",
      departement: "Maintenance",
      telephone: "+221 70 333 99 00",
      quartAujourdhui: "Soir (15h-23h30)",
      statutPointage: "attendu",
      heuresSemaine: 32,
    },
    {
      id: "6",
      nom: "Mamadou Kane",
      poste: "Veilleur de Nuit (Night Auditor)",
      departement: "Réception",
      telephone: "+221 78 444 12 34",
      quartAujourdhui: "Nuit (23h-07h30)",
      statutPointage: "attendu",
      heuresSemaine: 35,
    },
    {
      id: "7",
      nom: "Mariama Diallo",
      poste: "Femme de Chambre",
      departement: "Gouvernance",
      telephone: "+221 77 222 34 56",
      quartAujourdhui: "Repos Hebdomadaire",
      statutPointage: "en_repos",
      heuresSemaine: 35,
    },
  ]);

  const changerQuart = (id: string, nouveauQuart: Collaborateur["quartAujourdhui"]) => {
    setCollaborateurs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quartAujourdhui: nouveauQuart } : c))
    );
    setSuccesMsg("Planning de quart mis à jour.");
    setTimeout(() => setSuccesMsg(null), 3000);
  };

  const collaborateursFiltres = collaborateurs.filter((c) => {
    const correspondRecherche =
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.poste.toLowerCase().includes(recherche.toLowerCase());
    const correspondDept =
      filtreDept === "tous" || c.departement === filtreDept;
    return correspondRecherche && correspondDept;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Personnel, Quarts (Shifts) & Pointage
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Organisation des rotations par département et conformité du temps de repos légal
          </p>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouches Quarts du Jour */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <span className="font-bold text-foreground block">☀️ Quart Matin</span>
          <span className="text-foreground-muted">07h00 - 15h30</span>
          <p className="text-xl font-bold text-emerald-600 mt-2">
            {collaborateurs.filter((c) => c.quartAujourdhui.startsWith("Matin")).length} agents
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <span className="font-bold text-foreground block">🌇 Quart Soir</span>
          <span className="text-foreground-muted">15h00 - 23h30</span>
          <p className="text-xl font-bold text-blue-600 mt-2">
            {collaborateurs.filter((c) => c.quartAujourdhui.startsWith("Soir")).length} agents
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <span className="font-bold text-foreground block">🌙 Quart Nuit</span>
          <span className="text-foreground-muted">23h00 - 07h30</span>
          <p className="text-xl font-bold text-purple-600 mt-2">
            {collaborateurs.filter((c) => c.quartAujourdhui.startsWith("Nuit")).length} agents
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <span className="font-bold text-foreground block">🍽️ Quart Coupé</span>
          <span className="text-foreground-muted">11h-15h / 18h-23h</span>
          <p className="text-xl font-bold text-amber-600 mt-2">
            {collaborateurs.filter((c) => c.quartAujourdhui.startsWith("Coupé")).length} agents
          </p>
        </div>
      </div>

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher par collaborateur, poste, département..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
          />
        </div>

        <select
          value={filtreDept}
          onChange={(e) => setFiltreDept(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Tous les départements</option>
          <option value="Réception">Réception & Front-Desk</option>
          <option value="Gouvernance">Gouvernance & Lingerie</option>
          <option value="Cuisine">Cuisine & Économat</option>
          <option value="Salle & Bar">Salle & Bar</option>
          <option value="Maintenance">Maintenance Technique</option>
        </select>
      </div>

      {/* Tableau du Personnel */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Collaborateur</th>
                <th className="px-4 py-3">Département & Poste</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Quart Assigné Aujourd'hui</th>
                <th className="px-4 py-3 text-center">Pointage</th>
                <th className="px-4 py-3 text-center">Volume Hebdo</th>
                <th className="px-4 py-3 text-center">Changer Quart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {collaborateursFiltres.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/30 transition">
                  <td className="px-4 py-3 font-bold text-foreground">
                    {c.nom}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground block">
                      {c.poste}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {c.departement}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted">
                    {c.telephone}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {c.quartAujourdhui}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold capitalize ${
                        c.statutPointage === "present"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : c.statutPointage === "attendu"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-surface-muted text-foreground-muted"
                      }`}
                    >
                      {c.statutPointage === "present"
                        ? "Présent (Badge)"
                        : c.statutPointage === "attendu"
                        ? "Shift à venir"
                        : "En repos"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-foreground">
                    {c.heuresSemaine}h
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={c.quartAujourdhui}
                      onChange={(e) => changerQuart(c.id, e.target.value as any)}
                      className="px-2 py-1 text-xs rounded bg-surface border border-surface-border font-medium text-foreground"
                    >
                      <option value="Matin (07h-15h30)">Matin</option>
                      <option value="Soir (15h-23h30)">Soir</option>
                      <option value="Nuit (23h-07h30)">Nuit</option>
                      <option value="Coupé (11h-15h / 18h-23h)">Coupé</option>
                      <option value="Repos Hebdomadaire">Repos</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
