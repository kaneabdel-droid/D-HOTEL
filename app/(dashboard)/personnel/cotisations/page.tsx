"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  FileCheck,
  FileText,
  Landmark,
  Percent,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { MOIS_FR } from "@/lib/rh";

interface DeclarationOrganisme {
  organisme: "IPRES" | "CSS" | "DGI_IR" | "DGI_CFCE" | "DGI_TRIMF" | "VRS_PRESTATAIRES";
  nomComplet: string;
  destinataire: string;
  echeance: string;
  assietteBrute: number;
  partSalariale: number;
  partPatronale: number;
  totalAPayer: number;
  statut: "a_declarer" | "declare_en_attente" | "regle";
  referenceBordereau: string;
}

export default function CotisationsFiscalitePage() {
  const [mois, setMois] = useState(2); // Février
  const [annee, setAnnee] = useState(2026);
  const [notification, setNotification] = useState<string | null>(null);

  // Déclarations sociales et fiscales calculées pour la période de février 2026
  const [declarations, setDeclarations] = useState<DeclarationOrganisme[]>([
    {
      organisme: "IPRES",
      nomComplet: "Retraite IPRES (Régime Général 14% + Cadres 16%)",
      destinataire: "Institution de Prévoyance Retraite du Sénégal (IPRES)",
      echeance: "15 Mars 2026",
      assietteBrute: 1845000,
      partSalariale: 108500,
      partPatronale: 162750,
      totalAPayer: 271250,
      statut: "a_declarer",
      referenceBordereau: "BORD-IPRES-2026-02",
    },
    {
      organisme: "CSS",
      nomComplet: "Sécurité Sociale (Prestations Familiales 7% + Accidents Travail 1.5%)",
      destinataire: "Caisse de Sécurité Sociale du Sénégal (CSS)",
      echeance: "15 Mars 2026",
      assietteBrute: 378000, // plafonné à 63 000 FCFA / salarié
      partSalariale: 0,
      partPatronale: 32130,
      totalAPayer: 32130,
      statut: "a_declarer",
      referenceBordereau: "BORD-CSS-2026-02",
    },
    {
      organisme: "DGI_IR",
      nomComplet: "Retenue à la Source IR Salaires (Impôt sur le Revenu progressif)",
      destinataire: "Direction Générale des Impôts et Domaines (DGI)",
      echeance: "15 Mars 2026",
      assietteBrute: 1845000,
      partSalariale: 87500,
      partPatronale: 0,
      totalAPayer: 87500,
      statut: "a_declarer",
      referenceBordereau: "DGI-RTS-2026-02",
    },
    {
      organisme: "DGI_TRIMF",
      nomComplet: "TRIMF (Taxe Représentative Impôt Minimum Fiscal)",
      destinataire: "Direction Générale des Impôts et Domaines (DGI)",
      echeance: "15 Mars 2026",
      assietteBrute: 1845000,
      partSalariale: 13200,
      partPatronale: 0,
      totalAPayer: 13200,
      statut: "a_declarer",
      referenceBordereau: "DGI-TRIMF-2026-02",
    },
    {
      organisme: "DGI_CFCE",
      nomComplet: "CFCE Employeur (Contribution Forfaitaire 3.0%)",
      destinataire: "Direction Générale des Impôts et Domaines (DGI)",
      echeance: "15 Mars 2026",
      assietteBrute: 1845000,
      partSalariale: 0,
      partPatronale: 55350,
      totalAPayer: 55350,
      statut: "a_declarer",
      referenceBordereau: "DGI-CFCE-2026-02",
    },
    {
      organisme: "VRS_PRESTATAIRES",
      nomComplet: "Retenue VRS Prestataires Extérieurs (BNC 5% sur prestations)",
      destinataire: "Direction Générale des Impôts et Domaines (DGI)",
      echeance: "15 Mars 2026",
      assietteBrute: 750000,
      partSalariale: 37500,
      partPatronale: 0,
      totalAPayer: 37500,
      statut: "a_declarer",
      referenceBordereau: "DGI-VRS-BNC-2026-02",
    },
  ]);

  const totalGlobalAPayer = declarations.reduce((acc, d) => acc + d.totalAPayer, 0);
  const totalCotisationsIpresCss = declarations
    .filter((d) => d.organisme === "IPRES" || d.organisme === "CSS")
    .reduce((acc, d) => acc + d.totalAPayer, 0);
  const totalImpotsFiscauxDgi = declarations
    .filter((d) => d.organisme.startsWith("DGI") || d.organisme.startsWith("VRS"))
    .reduce((acc, d) => acc + d.totalAPayer, 0);

  function marquerCommeRegle(organisme: string) {
    setDeclarations(
      declarations.map((d) => (d.organisme === organisme ? { ...d, statut: "regle" } : d))
    );
    setNotification(`La déclaration ${organisme} a été marquée comme télédéclarée et réglée.`);
    setTimeout(() => setNotification(null), 4000);
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Cotisations Sociales & Fiscalité
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Déclarations DGI / IPRES / CSS
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tableau de bord des bordereaux IPRES, CSS, retenues à la source IR/TRIMF, CFCE 3% et VRS sur prestataires extérieurs.
          </p>
        </div>

        {/* Sélecteurs Période */}
        <div className="flex items-center gap-2">
          <select
            value={mois}
            onChange={(e) => setMois(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/20"
          >
            {MOIS_FR.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={annee}
            onChange={(e) => setAnnee(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/20"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cartes KPI Synthèse Déclarative */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase">Total Dette Fiscale & Sociale</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground mt-2">{formatXOF(totalGlobalAPayer)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            À reverser pour {MOIS_FR[mois - 1]} {annee} (Échéance 15 du mois)
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Pôle Social (IPRES + CSS)</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{formatXOF(totalCotisationsIpresCss)}</p>
          <p className="text-xs text-emerald-600 mt-1">Bordereaux de cotisations retraite & prévoyance</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Pôle Fiscal DGI (IR + TRIMF + CFCE + VRS)</span>
            <Landmark className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{formatXOF(totalImpotsFiscauxDgi)}</p>
          <p className="text-xs text-blue-600 mt-1">Déclaration mensuelle de retenues à la source</p>
        </div>
      </div>

      {/* Calendrier des Échéances Officielles */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-300">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-200">
          <Calendar className="h-4 w-4" />
          Calendrier des Échéances Légales au Sénégal
        </div>
        <p className="mt-1">
          • <strong>15 du mois M+1</strong> : Dépôt obligatoire de la déclaration des Retenues sur Salaires (IR, TRIMF, CFCE 3%, VRS 5%) auprès du Centre des Services Fiscaux (DGI).
          <br />
          • <strong>15 du mois M+1</strong> : Télépaiement des cotisations d'assurance vieillesse (IPRES) et prestations familiales / accidents du travail (CSS).
        </p>
      </div>

      {/* Tableau détaillé des Déclarations */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 py-3">Organisme & Déclaration</th>
                <th className="px-4 py-3">Réf. Bordereau</th>
                <th className="px-4 py-3">Échéance</th>
                <th className="px-4 py-3 text-right">Assiette Brute</th>
                <th className="px-4 py-3 text-right">Part Salariale</th>
                <th className="px-4 py-3 text-right">Part Patronale</th>
                <th className="px-4 py-3 text-right">MONTANT À REVERSER</th>
                <th className="px-4 py-3 text-center">Statut & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {declarations.map((d) => (
                <tr key={d.organisme} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <span className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-bold">
                        {d.organisme}
                      </span>
                      <span>{d.nomComplet}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{d.destinataire}</div>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {d.referenceBordereau}
                  </td>

                  <td className="px-4 py-3 text-xs text-foreground font-medium">
                    {d.echeance}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                    {formatXOF(d.assietteBrute)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-xs text-rose-600">
                    {d.partSalariale > 0 ? formatXOF(d.partSalariale) : "—"}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-xs text-blue-600">
                    {d.partPatronale > 0 ? formatXOF(d.partPatronale) : "—"}
                  </td>

                  <td className="px-4 py-3 text-right font-mono font-bold text-foreground text-sm">
                    {formatXOF(d.totalAPayer)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {d.statut === "regle" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Réglé
                      </span>
                    ) : (
                      <button
                        onClick={() => marquerCommeRegle(d.organisme)}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition shadow-2xs"
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        Valider paiement
                      </button>
                    )}
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
