"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Hotel,
  Coins,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Layers,
  Sparkles,
  PieChart,
  Download,
  CheckCircle2,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

export default function DirectionKpisPage() {
  const [periode, setPeriode] = useState<"jour" | "semaine" | "mois" | "annee">("mois");
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const kpis = {
    revpar: 57540,
    revparDelta: "+8.1%",
    revparDeltaPositive: true,
    adr: 68500,
    adrDelta: "+4.2%",
    adrDeltaPositive: true,
    to: 84, // 84%
    toDelta: "+6%",
    toDeltaPositive: true,
    revpac: 89400,
    revpacDelta: "+11.3%",
    revpacDeltaPositive: true,
    caTotalMois: 79400000,
    caTotalDelta: "+14.5%",
    foodCostPercent: 26.4,
    masseSalarialePercent: 24.8,
  };

  const repartitionCA = [
    { pole: "Hébergement & Chambres (PMS)", montant: 49228000, part: 62, couleur: "bg-blue-500" },
    { pole: "Restauration, Bars & Room-Service", montant: 19056000, part: 24, couleur: "bg-amber-500" },
    { pole: "MICE, Salles & Séminaires", montant: 7146000, part: 9, couleur: "bg-purple-500" },
    { pole: "Loisirs, Excursions & Spa", montant: 3970000, part: 5, couleur: "bg-emerald-500" },
  ];

  const previsions = [
    { horizon: "À 30 jours (Novembre 2026)", toPrevu: 88, adrPrevu: 72000, caEstime: 88500000 },
    { horizon: "À 60 jours (Décembre 2026 - Fêtes)", toPrevu: 96, adrPrevu: 85000, caEstime: 112000000 },
    { horizon: "À 90 jours (Janvier 2027)", toPrevu: 82, adrPrevu: 70000, caEstime: 81000000 },
  ];

  const handleExportRapport = () => {
    setSuccesMsg("Rapport analytique Direction Générale (Format PDF Haute Définition) généré.");
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Indicateurs Clés de Direction (RevPAR • TO • ADR • RevPAC)
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Tableau de bord de pilotage financier et prévisionnel d'exploitation hôtelière
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground font-semibold"
          >
            <option value="jour">Aujourd'hui</option>
            <option value="semaine">Cette Semaine</option>
            <option value="mois">Mois en cours (Octobre 2026)</option>
            <option value="annee">Année 2026</option>
          </select>

          <button
            onClick={handleExportRapport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-surface border border-surface-border hover:bg-surface-muted transition shadow-sm text-foreground"
          >
            <Download className="w-4 h-4 text-foreground-muted" />
            Exporter Bilan DG
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Les 4 Piliers Financiers Hôteliers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RevPAR */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span className="font-semibold uppercase tracking-wider">RevPAR</span>
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.revparDelta}
            </span>
          </div>
          <p className="text-2xl font-black text-foreground">
            {formatXOF(kpis.revpar)}
          </p>
          <span className="text-[11px] text-foreground-muted block">
            Revenu moyen par chambre disponible
          </span>
        </div>

        {/* ADR (Prix Moyen) */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span className="font-semibold uppercase tracking-wider">ADR (Prix Moyen)</span>
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.adrDelta}
            </span>
          </div>
          <p className="text-2xl font-black text-foreground">
            {formatXOF(kpis.adr)}
          </p>
          <span className="text-[11px] text-foreground-muted block">
            Tarif moyen réel par chambre louée
          </span>
        </div>

        {/* Taux d'Occupation */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span className="font-semibold uppercase tracking-wider">Taux d'Occupation</span>
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.toDelta}
            </span>
          </div>
          <p className="text-2xl font-black text-[var(--accent)]">
            {kpis.to}%
          </p>
          <span className="text-[11px] text-foreground-muted block">
            39 chambres occupées sur 46 louables
          </span>
        </div>

        {/* RevPAC */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span className="font-semibold uppercase tracking-wider">RevPAC (Par Client)</span>
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.revpacDelta}
            </span>
          </div>
          <p className="text-2xl font-black text-foreground">
            {formatXOF(kpis.revpac)}
          </p>
          <span className="text-[11px] text-foreground-muted block">
            Revenu consolidé par voyageur hébergé
          </span>
        </div>
      </div>

      {/* Ratios Opérationnels et Ventilation CA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventilation CA par Pôle */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h3 className="font-bold text-base text-foreground">
            Ventilation du Chiffre d'Affaires par Pôle d'Activité
          </h3>
          <p className="text-xs text-foreground-muted">
            Total consolidé sur le mois : <strong>{formatXOF(kpis.caTotalMois)}</strong> ({kpis.caTotalDelta} vs N-1)
          </p>

          <div className="space-y-3 pt-2">
            {repartitionCA.map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {r.pole}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-foreground">
                      {formatXOF(r.montant)}
                    </span>
                    <span className="text-foreground-muted ml-2">
                      ({r.part}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${r.couleur} rounded-full`}
                    style={{ width: `${r.part}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ratios Gestion & Maîtrise des Coûts */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Maîtrise des Coûts d'Exploitation & Rentabilité
            </h3>
            <p className="text-xs text-foreground-muted mt-1">
              Surveillance des 2 plus gros postes de charges variables de l'hôtellerie
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-surface-muted/60 border border-surface-border space-y-1">
                <span className="text-xs text-foreground-muted font-semibold block uppercase">
                  Food Cost % (Matière F&B)
                </span>
                <p className="text-2xl font-black text-emerald-600">
                  {kpis.foodCostPercent}%
                </p>
                <span className="text-[11px] text-foreground-muted block">
                  Cible Palace : &lt; 28% (✓ Optimisé)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-muted/60 border border-surface-border space-y-1">
                <span className="text-xs text-foreground-muted font-semibold block uppercase">
                  Masse Salariale / CA
                </span>
                <p className="text-2xl font-black text-blue-600">
                  {kpis.masseSalarialePercent}%
                </p>
                <span className="text-[11px] text-foreground-muted block">
                  Cible hôtelière : &lt; 30% (✓ Maîtrisé)
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary)]/20 text-xs text-foreground">
            <strong>Indicateur de Rentabilité Nette Brute d'Exploitation (RBE) :</strong>{" "}
            Le résultat brut d'exploitation consolidé est estimé à <strong>38.6%</strong> pour le trimestre en cours.
          </div>
        </div>
      </div>

      {/* Prévisionnel à 30 / 60 / 90 Jours */}
      <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-bold text-base text-foreground">
            Prévisionnel des Réservations (Booking Pace à 30 / 60 / 90 Jours)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previsions.map((prev, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-muted/40 border border-surface-border space-y-2"
            >
              <span className="font-bold text-sm text-[var(--accent)] block">
                {prev.horizon}
              </span>
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Taux d'occupation prévisionnel :</span>
                  <span className="font-bold text-foreground">{prev.toPrevu}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Tarif moyen convenu (ADR) :</span>
                  <span className="font-bold text-foreground">{formatXOF(prev.adrPrevu)}</span>
                </div>
                <div className="flex justify-between border-t border-surface-border/60 pt-1">
                  <span className="font-semibold text-foreground">CA Prévisionnel estimé :</span>
                  <span className="font-bold text-emerald-600">{formatXOF(prev.caEstime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
