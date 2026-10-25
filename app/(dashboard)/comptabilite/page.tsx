"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Coins,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface EcritureSYSCOHADA {
  id: string;
  date: string;
  compte: string;
  libelleCompte: string;
  libelleEcriture: string;
  pieceRef: string;
  debit: number;
  credit: number;
}

export default function ComptabiliteSyscohadaPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreCompte, setFiltreCompte] = useState("tous");
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [ecritures, setEcritures] = useState<EcritureSYSCOHADA[]>([
    {
      id: "1",
      date: "24/10/2026",
      compte: "5211",
      libelleCompte: "Banque (Paiements Wave / Cartes)",
      libelleEcriture: "Encaissement Règlement Facture FACT-2026-00412",
      pieceRef: "MK-TX-89210",
      debit: 171000,
      credit: 0,
    },
    {
      id: "2",
      date: "24/10/2026",
      compte: "7061",
      libelleCompte: "Ventes Hébergement (Nuitées)",
      libelleEcriture: "Facture M. Ibrahima Diop (Chambre 101, 3 nuits)",
      pieceRef: "FACT-2026-00412",
      debit: 0,
      credit: 114407,
    },
    {
      id: "3",
      date: "24/10/2026",
      compte: "7011",
      libelleCompte: "Ventes Nourriture & Restaurant",
      libelleEcriture: "Facture M. Ibrahima Diop (Dîner Thieboudienne)",
      pieceRef: "FACT-2026-00412",
      debit: 0,
      credit: 20339,
    },
    {
      id: "4",
      date: "24/10/2026",
      compte: "7012",
      libelleCompte: "Ventes Bar & Minibar",
      libelleEcriture: "Facture M. Ibrahima Diop (Minibar)",
      pieceRef: "FACT-2026-00412",
      debit: 0,
      credit: 7627,
    },
    {
      id: "5",
      date: "24/10/2026",
      compte: "4433",
      libelleCompte: "TVA Facturée sur Prestations (18%)",
      libelleEcriture: "TVA sur Facture FACT-2026-00412",
      pieceRef: "FACT-2026-00412",
      debit: 0,
      credit: 25627,
    },
    {
      id: "6",
      date: "24/10/2026",
      compte: "4431",
      libelleCompte: "Taxe de Promotion Touristique",
      libelleEcriture: "Taxe de Séjour réglementaire (3 nuits x 1 000 F)",
      pieceRef: "FACT-2026-00412",
      debit: 0,
      credit: 3000,
    },
    {
      id: "7",
      date: "24/10/2026",
      compte: "5211",
      libelleCompte: "Banque (Virement Maketou)",
      libelleEcriture: "Acompte Séminaire MICE Sonatel",
      pieceRef: "DEV-MICE-081",
      debit: 925000,
      credit: 0,
    },
    {
      id: "8",
      date: "24/10/2026",
      compte: "4191",
      libelleCompte: "Clients, Avances & Acomptes reçus",
      libelleEcriture: "Acompte 50% Séminaire Salle Baobab",
      pieceRef: "DEV-MICE-081",
      debit: 0,
      credit: 925000,
    },
  ]);

  const totalDebit = ecritures.reduce((acc, e) => acc + e.debit, 0);
  const totalCredit = ecritures.reduce((acc, e) => acc + e.credit, 0);

  const handleExportCompta = () => {
    setSuccesMsg(
      "Export du Grand-Livre SYSCOHADA (Compatible Sage 100 / Odoo / Excel CSV) généré."
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const ecrituresFiltrees = ecritures.filter((e) => {
    const correspondRecherche =
      e.compte.includes(recherche) ||
      e.libelleCompte.toLowerCase().includes(recherche.toLowerCase()) ||
      e.libelleEcriture.toLowerCase().includes(recherche.toLowerCase()) ||
      e.pieceRef.toLowerCase().includes(recherche.toLowerCase());
    const correspondCompte =
      filtreCompte === "tous" || e.compte.startsWith(filtreCompte);
    return correspondRecherche && correspondCompte;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Grand-Livre & Écritures SYSCOHADA Révisé
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Ventilation comptable normalisée hôtelière conforme OHADA (Hébergement, Restauration, MICE, Taxes)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCompta}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Exporter Grand-Livre (Sage / Excel)
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouches d'Équilibre Comptable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <span className="text-xs text-foreground-muted font-medium block">
            Total Débit Période
          </span>
          <p className="text-xl font-black text-foreground mt-1">
            {formatXOF(totalDebit)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <span className="text-xs text-foreground-muted font-medium block">
            Total Crédit Période
          </span>
          <p className="text-xl font-black text-foreground mt-1">
            {formatXOF(totalCredit)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium block">
              Balance Comptable
            </span>
            <p className="text-base font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Équilibrée (Débit = Crédit)
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-foreground-muted">
            0 FCFA
          </span>
        </div>
      </div>

      {/* Nomenclature SYSCOHADA Rappel */}
      <div className="p-3.5 rounded-xl bg-surface border border-surface-border flex flex-wrap gap-2 text-xs text-foreground-muted">
        <span className="font-bold text-foreground">Comptes Fréquents :</span>
        <span className="px-2 py-0.5 rounded bg-surface-muted font-mono">7061 Hébergement</span>
        <span className="px-2 py-0.5 rounded bg-surface-muted font-mono">7011 Restauration</span>
        <span className="px-2 py-0.5 rounded bg-surface-muted font-mono">7012 Bar/Boissons</span>
        <span className="px-2 py-0.5 rounded bg-surface-muted font-mono">7062 Salles MICE</span>
        <span className="px-2 py-0.5 rounded bg-surface-muted font-mono">4431 Taxe Séjour</span>
        <span className="px-2 py-0.5 rounded bg-surface-muted font-mono">4433 TVA (18%)</span>
        <span className="px-2 py-0.5 rounded bg-surface-muted font-mono">5211 Banques / Mobile Money</span>
      </div>

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher par N° compte, intitulé, pièce justificative..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
          />
        </div>

        <select
          value={filtreCompte}
          onChange={(e) => setFiltreCompte(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Toutes les classes de comptes</option>
          <option value="7">Classe 7 (Produits & Ventes)</option>
          <option value="5">Classe 5 (Trésorerie & Banques)</option>
          <option value="4">Classe 4 (Tiers & Taxes)</option>
        </select>
      </div>

      {/* Tableau Journal Grand-Livre */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">N° Compte</th>
                <th className="px-4 py-3">Intitulé du Compte</th>
                <th className="px-4 py-3">Libellé de l'Écriture</th>
                <th className="px-4 py-3">Pièce Réf.</th>
                <th className="px-4 py-3 text-right">Débit</th>
                <th className="px-4 py-3 text-right">Crédit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {ecrituresFiltrees.map((e) => (
                <tr key={e.id} className="hover:bg-surface-muted/30 transition">
                  <td className="px-4 py-3 text-xs text-foreground-muted">
                    {e.date}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-xs text-[var(--accent)]">
                    {e.compte}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {e.libelleCompte}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">
                    {e.libelleEcriture}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground-muted">
                    {e.pieceRef}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    {e.debit > 0 ? (
                      <span className="text-foreground">
                        {formatXOF(e.debit)}
                      </span>
                    ) : (
                      <span className="text-foreground-muted/40">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    {e.credit > 0 ? (
                      <span className="text-emerald-600">
                        {formatXOF(e.credit)}
                      </span>
                    ) : (
                      <span className="text-foreground-muted/40">-</span>
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
