"use client";

import { useState } from "react";
import {
  FileText,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Coins,
  QrCode,
  Download,
  Building,
  User,
  Eye,
  CreditCard,
  Smartphone,
  Split,
  Layers,
  X,
  ShieldCheck,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { genererFactureFolioPdf } from "@/lib/pdf/facture-pdf";
import { ModalEncaissementDirect } from "@/components/ModalEncaissementDirect";
import { TransactionDirecte } from "@/lib/paiement-direct-storage";

interface LigneDepense {
  designation: string;
  categorie: string;
  quantite: number;
  pu: number;
  total: number;
}

interface FolioFacture {
  id: string;
  numeroFacture: string;
  client: string;
  chambre: string;
  dates: string;
  nuits: number;
  totalHebergement: number;
  totalRestauration: number;
  totalExtras: number;
  taxeSejour: number;
  totalTTC: number;
  totalRegle: number;
  soldeDu: number;
  statut: "solde" | "ouvert";
  modeReglement: string;
  lignes: LigneDepense[];
}

export default function FacturesFoliosPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [factureSelectionnee, setFactureSelectionnee] = useState<FolioFacture | null>(null);
  const [facturePaiementDirect, setFacturePaiementDirect] = useState<FolioFacture | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const handlePaiementDirectValide = (tx: TransactionDirecte) => {
    setFactures((prev) =>
      prev.map((f) => {
        if (f.id === facturePaiementDirect?.id) {
          const nouveauRegle = f.totalRegle + tx.montant;
          const nouveauSolde = Math.max(0, f.totalTTC - nouveauRegle);
          return {
            ...f,
            totalRegle: nouveauRegle,
            soldeDu: nouveauSolde,
            statut: nouveauSolde === 0 ? "solde" : "ouvert",
            modeReglement: `${tx.methodeLibelle} (Direct établissement - 0% agrégateur)`,
          };
        }
        return f;
      })
    );
    if (factureSelectionnee && factureSelectionnee.id === facturePaiementDirect?.id) {
      const nouveauRegle = factureSelectionnee.totalRegle + tx.montant;
      const nouveauSolde = Math.max(0, factureSelectionnee.totalTTC - nouveauRegle);
      setFactureSelectionnee({
        ...factureSelectionnee,
        totalRegle: nouveauRegle,
        soldeDu: nouveauSolde,
        statut: nouveauSolde === 0 ? "solde" : "ouvert",
        modeReglement: `${tx.methodeLibelle} (Direct établissement - 0% agrégateur)`,
      });
    }
    setFacturePaiementDirect(null);
    setSuccesMsg(`Paiement direct de ${formatXOF(tx.montant)} validé sur ${tx.terminalOuCompteNom} ! 0 FCFA de frais d'agrégateur (économie de ${formatXOF(tx.fraisAggregateurEconomises)}).`);
    setTimeout(() => setSuccesMsg(null), 5000);
  };

  const [factures, setFactures] = useState<FolioFacture[]>([
    {
      id: "1",
      numeroFacture: "FACT-2026-00412",
      client: "M. Ibrahima Diop",
      chambre: "Chambre 101",
      dates: "24/10/2026 ➔ 27/10/2026",
      nuits: 3,
      totalHebergement: 135000,
      totalRestauration: 24000,
      totalExtras: 9000,
      taxeSejour: 3000,
      totalTTC: 171000,
      totalRegle: 171000,
      soldeDu: 0,
      statut: "solde",
      modeReglement: "Wave Mobile Money (Maketou)",
      lignes: [
        { designation: "Nuitée Chambre Standard (3 nuits)", categorie: "Hébergement", quantite: 3, pu: 45000, total: 135000 },
        { designation: "Dîner Thieboudienne Royal (x2)", categorie: "Restaurant", quantite: 2, pu: 12000, total: 24000 },
        { designation: "Consommations Minibar (Gazelle x2 + Kirène)", categorie: "Minibar", quantite: 1, pu: 9000, total: 9000 },
        { designation: "Taxe Touristique Réglementaire (1 000 F/nuit)", categorie: "Taxe", quantite: 3, pu: 1000, total: 3000 },
      ],
    },
    {
      id: "2",
      numeroFacture: "FACT-2026-00413",
      client: "Mme Sophie Martin",
      chambre: "Bungalow Plage 12",
      dates: "24/10/2026 ➔ 29/10/2026",
      nuits: 5,
      totalHebergement: 900000,
      totalRestauration: 85000,
      totalExtras: 67000,
      taxeSejour: 5000,
      totalTTC: 1057000,
      totalRegle: 900000, // Acompte versé
      soldeDu: 157000,
      statut: "ouvert",
      modeReglement: "Carte Visa (Acompte 900k)",
      lignes: [
        { designation: "Séjour Bungalow Plage 5★ (5 nuits)", categorie: "Hébergement", quantite: 5, pu: 180000, total: 900000 },
        { designation: "Champagne Taittinger Brut", categorie: "Bar", quantite: 1, pu: 38000, total: 38000 },
        { designation: "Dîners Gastronomiques Restaurant", categorie: "Restaurant", quantite: 1, pu: 47000, total: 47000 },
        { designation: "Safari Bandia (1 pers)", categorie: "Excursion", quantite: 1, pu: 35000, total: 35000 },
        { designation: "Soin Massage Spa", categorie: "Spa", quantite: 1, pu: 32000, total: 32000 },
        { designation: "Taxe Touristique Réglementaire", categorie: "Taxe", quantite: 5, pu: 1000, total: 5000 },
      ],
    },
    {
      id: "3",
      numeroFacture: "FACT-2026-00414",
      client: "Dr. K. Ndiaye",
      chambre: "Chambre 103",
      dates: "23/10/2026 ➔ 24/10/2026",
      nuits: 1,
      totalHebergement: 65000,
      totalRestauration: 15000,
      totalExtras: 1500,
      taxeSejour: 1000,
      totalTTC: 82500,
      totalRegle: 82500,
      soldeDu: 0,
      statut: "solde",
      modeReglement: "Orange Money",
      lignes: [
        { designation: "Nuitée Chambre Deluxe", categorie: "Hébergement", quantite: 1, pu: 65000, total: 65000 },
        { designation: "Déjeuner Service Chambre", categorie: "Room-Service", quantite: 1, pu: 15000, total: 15000 },
        { designation: "Eau Kirène Minibar", categorie: "Minibar", quantite: 1, pu: 1500, total: 1500 },
        { designation: "Taxe de séjour", categorie: "Taxe", quantite: 1, pu: 1000, total: 1000 },
      ],
    },
  ]);

  const facturesFiltrees = factures.filter((f) => {
    const correspondRecherche =
      f.client.toLowerCase().includes(recherche.toLowerCase()) ||
      f.numeroFacture.toLowerCase().includes(recherche.toLowerCase()) ||
      f.chambre.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut =
      filtreStatut === "tous" || f.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Facturation Hôtelière & Folios de Séjour
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Émission des factures normalisées, consolidation multi-activités et division de note (Split Folio)
          </p>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher par client, chambre, numéro de facture..."
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
          <option value="tous">Toutes les factures</option>
          <option value="ouvert">Folios en cours (Séjours actifs)</option>
          <option value="solde">Factures soldées & archivées</option>
        </select>
      </div>

      {/* Tableau des Factures */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Réf. Facture</th>
                <th className="px-4 py-3">Client & Séjour</th>
                <th className="px-4 py-3">Chambre</th>
                <th className="px-4 py-3 text-right">Hébergement</th>
                <th className="px-4 py-3 text-right">Resto & Extras</th>
                <th className="px-4 py-3 text-right">Total TTC</th>
                <th className="px-4 py-3 text-right">Solde Dû</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Facture A4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {facturesFiltrees.map((f) => {
                const estSolde = f.statut === "solde";

                return (
                  <tr key={f.id} className="hover:bg-surface-muted/30 transition">
                    <td className="px-4 py-3 font-mono font-bold text-xs text-[var(--accent)]">
                      {f.numeroFacture}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-foreground block">
                        {f.client}
                      </span>
                      <span className="text-xs text-foreground-muted">
                        {f.dates} ({f.nuits} nuits)
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground">
                      {f.chambre}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatXOF(f.totalHebergement)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-muted">
                      {formatXOF(f.totalRestauration + f.totalExtras)}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-foreground">
                      {formatXOF(f.totalTTC)}
                    </td>
                    <td className="px-4 py-3 text-right font-black">
                      {f.soldeDu > 0 ? (
                        <span className="text-rose-600">
                          {formatXOF(f.soldeDu)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">
                          0 FCFA
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${estSolde
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                      >
                        {estSolde ? "Soldé" : "En cours"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {!estSolde && f.soldeDu > 0 && (
                          <button
                            type="button"
                            onClick={() => setFacturePaiementDirect(f)}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1 transition shadow-xs cursor-pointer"
                            title="Encaisser direct sur appareil hôtel (0% agrégateur)"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Encaisser</span>
                          </button>
                        )}
                        <button
                          onClick={() => setFactureSelectionnee(f)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] hover:opacity-90 inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Voir A4</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FACTURE OFFICIELLE A4 NORMALISÉE */}
      {factureSelectionnee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            {/* En-tête fixe */}
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-start justify-between shrink-0 bg-surface">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  HÔTEL TERANGA PALACE 5★
                </h3>
                <p className="text-[11px] text-foreground-muted">
                  SARL au capital de 100 000 000 FCFA • NINEA: 009845213 2V9
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                    FACTURE DÉFINITIVE
                  </span>
                  <p className="text-sm font-black font-mono text-[var(--accent)]">
                    {factureSelectionnee.numeroFacture}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFactureSelectionnee(null)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corps défilable */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Cadre Client & Séjour */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-background border border-surface-border">
                  <span className="font-bold text-foreground block mb-1">
                    Facturé à :
                  </span>
                  <p className="text-sm font-black text-foreground">
                    {factureSelectionnee.client}
                  </p>
                  <p className="text-foreground-muted">Client Résident</p>
                  <p className="text-foreground-muted">Mode de paiement : {factureSelectionnee.modeReglement}</p>
                </div>

                <div className="p-3 rounded-xl bg-background border border-surface-border">
                  <span className="font-bold text-foreground block mb-1">
                    Détails du Séjour :
                  </span>
                  <p className="font-bold text-foreground">
                    {factureSelectionnee.chambre}
                  </p>
                  <p className="text-foreground-muted">
                    Période : {factureSelectionnee.dates}
                  </p>
                  <p className="text-foreground-muted">
                    Durée : {factureSelectionnee.nuits} nuitées
                  </p>
                </div>
              </div>

              {/* Lignes de dépenses détaillées */}
              <div className="border border-surface-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-muted/70 text-foreground font-bold border-b border-surface-border">
                    <tr>
                      <th className="px-3 py-2.5">Désignation des Prestations</th>
                      <th className="px-3 py-2.5">Poste</th>
                      <th className="px-3 py-2.5 text-center">Qté</th>
                      <th className="px-3 py-2.5 text-right">P.U. TTC</th>
                      <th className="px-3 py-2.5 text-right">Total TTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {factureSelectionnee.lignes.map((l, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-medium text-foreground">
                          {l.designation}
                        </td>
                        <td className="px-3 py-2 text-foreground-muted">
                          {l.categorie}
                        </td>
                        <td className="px-3 py-2 text-center font-bold">
                          {l.quantite}
                        </td>
                        <td className="px-3 py-2 text-right text-foreground-muted">
                          {formatXOF(l.pu)}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-foreground">
                          {formatXOF(l.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux & Règlements */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 border border-surface-border rounded-lg p-1 bg-white flex items-center justify-center shrink-0">
                    <QrCode className="w-14 h-14 text-black" />
                  </div>
                  <div className="text-[11px] text-foreground-muted">
                    <span className="font-bold text-foreground block">
                      Facture Certifiée Conforme
                    </span>
                    <span>Code QR de vérification fiscale</span>
                    <br />
                    <span>Maketou Ref: MK-TX-89210</span>
                  </div>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 p-3 rounded-xl bg-background border border-surface-border">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Total Prestations HT :</span>
                    <span className="font-bold">{formatXOF(Math.round(factureSelectionnee.totalTTC / 1.18))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">TVA (18%) :</span>
                    <span className="font-bold">{formatXOF(Math.round(factureSelectionnee.totalTTC - factureSelectionnee.totalTTC / 1.18))}</span>
                  </div>
                  <div className="flex justify-between border-t border-surface-border pt-1">
                    <span className="font-black text-sm text-foreground">TOTAL TTC :</span>
                    <span className="font-black text-sm text-foreground">{formatXOF(factureSelectionnee.totalTTC)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Règlements reçus :</span>
                    <span>-{formatXOF(factureSelectionnee.totalRegle)}</span>
                  </div>
                  <div className="flex justify-between border-t border-surface-border pt-1">
                    <span className="font-black text-foreground">SOLDE DÛ :</span>
                    <span className="font-black text-base text-[var(--primary)]">
                      {formatXOF(factureSelectionnee.soldeDu)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions fixes en bas */}
            <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex flex-wrap items-center justify-between gap-3 bg-surface">
              <div>
                {factureSelectionnee.soldeDu > 0 && (
                  <button
                    type="button"
                    onClick={() => setFacturePaiementDirect(factureSelectionnee)}
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Encaisser Solde ({formatXOF(factureSelectionnee.soldeDu)}) Direct Appareil Hôtel</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFactureSelectionnee(null)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await genererFactureFolioPdf({
                      numeroFacture: factureSelectionnee.numeroFacture,
                      client: factureSelectionnee.client,
                      chambre: factureSelectionnee.chambre,
                      dates: factureSelectionnee.dates,
                      nuits: factureSelectionnee.nuits,
                      totalHebergement: factureSelectionnee.totalHebergement,
                      totalRestauration: factureSelectionnee.totalRestauration,
                      totalExtras: factureSelectionnee.totalExtras,
                      taxeSejour: factureSelectionnee.taxeSejour,
                      totalTTC: factureSelectionnee.totalTTC,
                      totalRegle: factureSelectionnee.totalRegle,
                      soldeDu: factureSelectionnee.soldeDu,
                      modeReglement: factureSelectionnee.modeReglement,
                      lignes: factureSelectionnee.lignes,
                    });
                    setSuccesMsg(`Facture officielle ${factureSelectionnee.numeroFacture} téléchargée avec succès (Format PDF A4 haute définition).`);
                    setTimeout(() => setSuccesMsg(null), 4000);
                  }}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  Télécharger la Facture A4 (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALE ENCAISSEMENT DIRECT SUR APPAREILS HÔTEL (ZÉRO AGRÉGATEUR) ── */}
      {facturePaiementDirect && (
        <ModalEncaissementDirect
          montant={facturePaiementDirect.soldeDu}
          clientNom={facturePaiementDirect.client}
          folioOuCommandeRef={facturePaiementDirect.numeroFacture}
          chambreNumero={facturePaiementDirect.chambre}
          pointDeVente="Front-Desk & Réception"
          caissier="Agent de Réception"
          onClose={() => setFacturePaiementDirect(null)}
          onSuccess={handlePaiementDirectValide}
        />
      )}
    </div>
  );
}
