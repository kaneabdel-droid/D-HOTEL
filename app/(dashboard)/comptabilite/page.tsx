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
  Globe,
  Building,
} from "lucide-react";
import { formatMontant, DeviseCode } from "@/lib/currency";
import { MODELES_PAYS, CodePays } from "@/lib/rh";

interface EcritureComptableMultiPays {
  id: string;
  date: string;
  journal: "VTE" | "PAIE" | "BQE" | "CAI" | "ACH";
  compte: string;
  libelleCompte: string;
  libelleEcriture: string;
  pieceRef: string;
  debit: number;
  credit: number;
}

export default function ComptabiliteMultiPaysPage() {
  const [paysCompta, setPaysCompta] = useState<CodePays>("SN");
  const [recherche, setRecherche] = useState("");
  const [filtreJournal, setFiltreJournal] = useState("tous");
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const modele = MODELES_PAYS[paysCompta];

  // Jeux d'écritures pour chaque pays comprenant les ventes hôtelières et les écritures de paie
  const ecrituresParPays: Record<CodePays, EcritureComptableMultiPays[]> = {
    SN: [
      { id: "1", date: "24/10/2026", journal: "VTE", compte: "5211", libelleCompte: "Banque (Paiements Wave / Cartes)", libelleEcriture: "Encaissement Règlement Facture FACT-2026-00412", pieceRef: "MK-TX-89210", debit: 171000, credit: 0 },
      { id: "2", date: "24/10/2026", journal: "VTE", compte: "7061", libelleCompte: "Ventes Hébergement (Nuitées)", libelleEcriture: "Facture M. Ibrahima Diop (Chambre 101, 3 nuits)", pieceRef: "FACT-2026-00412", debit: 0, credit: 114407 },
      { id: "3", date: "24/10/2026", journal: "VTE", compte: "7011", libelleCompte: "Ventes Nourriture & Restaurant", libelleEcriture: "Facture M. Ibrahima Diop (Dîner Thieboudienne)", pieceRef: "FACT-2026-00412", debit: 0, credit: 20339 },
      { id: "4", date: "24/10/2026", journal: "VTE", compte: "4433", libelleCompte: "TVA Facturée sur Prestations (18%)", libelleEcriture: "TVA sur Facture FACT-2026-00412", pieceRef: "FACT-2026-00412", debit: 0, credit: 25627 },
      { id: "5", date: "24/10/2026", journal: "VTE", compte: "4431", libelleCompte: "Taxe de Promotion Touristique", libelleEcriture: "Taxe de Séjour réglementaire", pieceRef: "FACT-2026-00412", debit: 0, credit: 3000 },
      { id: "6", date: "28/10/2026", journal: "PAIE", compte: "6611", libelleCompte: "Appointements et Salaires Bruts", libelleEcriture: "Paie du Personnel Période Octobre 2026", pieceRef: "OD-PAIE-10", debit: 1845000, credit: 0 },
      { id: "7", date: "28/10/2026", journal: "PAIE", compte: "6641", libelleCompte: "Charges Sociales Patronales IPRES/CSS/CFCE", libelleEcriture: "Cotisations Patronales Octobre 2026", pieceRef: "OD-PAIE-10", debit: 250230, credit: 0 },
      { id: "8", date: "28/10/2026", journal: "PAIE", compte: "4211", libelleCompte: "Personnel, Rémunérations Nettes Dues", libelleEcriture: "Virement Salaires Nets Octobre 2026", pieceRef: "OD-PAIE-10", debit: 0, credit: 1635800 },
      { id: "9", date: "28/10/2026", journal: "PAIE", compte: "4311", libelleCompte: "Organismes Sociaux (IPRES & CSS à payer)", libelleEcriture: "Retenues Salariales & Cotisations Patronales", pieceRef: "OD-PAIE-10", debit: 0, credit: 358750 },
      { id: "10", date: "28/10/2026", journal: "PAIE", compte: "4471", libelleCompte: "État, Retenues IR et TRIMF sur Salaires", libelleEcriture: "Impôts retenus à la source pour la DGI", pieceRef: "OD-PAIE-10", debit: 0, credit: 100700 },
    ],
    MR: [
      { id: "MR1", date: "24/10/2026", journal: "VTE", compte: "5210", libelleCompte: "Banque Mauritanie (MRU)", libelleEcriture: "Règlement Séjour Client Suite VIP", pieceRef: "FACT-MR-0012", debit: 45000, credit: 0 },
      { id: "MR2", date: "24/10/2026", journal: "VTE", compte: "7060", libelleCompte: "Prestations d'Hébergement & Chambres", libelleEcriture: "Séjour 4 nuits Chambre Océan", pieceRef: "FACT-MR-0012", debit: 0, credit: 38793 },
      { id: "MR3", date: "24/10/2026", journal: "VTE", compte: "4430", libelleCompte: "TVA Facturée (16%)", libelleEcriture: "TVA sur Séjour Nouakchott", pieceRef: "FACT-MR-0012", debit: 0, credit: 6207 },
      { id: "MR4", date: "28/10/2026", journal: "PAIE", compte: "6610", libelleCompte: "Rémunérations du Personnel (Brut)", libelleEcriture: "Paie du Personnel Hôtelier Nouakchott", pieceRef: "OD-PAIE-MR-10", debit: 78500, credit: 0 },
      { id: "MR5", date: "28/10/2026", journal: "PAIE", compte: "6640", libelleCompte: "Charges Sociales Patronales (CNSS 13% + CNAM 4%)", libelleEcriture: "Charges Patronales CNSS & CNAM", pieceRef: "OD-PAIE-MR-10", debit: 13345, credit: 0 },
      { id: "MR6", date: "28/10/2026", journal: "PAIE", compte: "4210", libelleCompte: "Personnel, Salaires Nets Dus", libelleEcriture: "Virement Salaires Nets MRU", pieceRef: "OD-PAIE-MR-10", debit: 0, credit: 71200 },
      { id: "MR7", date: "28/10/2026", journal: "PAIE", compte: "4310", libelleCompte: "CNSS & CNAM à Payer", libelleEcriture: "Cotisations Sécurité Sociale Mauritanie", pieceRef: "OD-PAIE-MR-10", debit: 0, credit: 14130 },
      { id: "MR8", date: "28/10/2026", journal: "PAIE", compte: "4470", libelleCompte: "Trésor Public, Retenues ITS", libelleEcriture: "Impôt sur Traitements et Salaires retenu", pieceRef: "OD-PAIE-MR-10", debit: 0, credit: 6515 },
    ],
    MA: [
      { id: "MA1", date: "24/10/2026", journal: "VTE", compte: "5141", libelleCompte: "Banque CMI (Paiements Cartes DH)", libelleEcriture: "Règlement Séjour Riad & Suites Marrakech", pieceRef: "FACT-MA-089", debit: 12500, credit: 0 },
      { id: "MA2", date: "24/10/2026", journal: "VTE", compte: "7124", libelleCompte: "Ventes de Nuitées & Hébergement", libelleEcriture: "Hébergement 5 nuits Chambre Atlas", pieceRef: "FACT-MA-089", debit: 0, credit: 11363 },
      { id: "MA3", date: "24/10/2026", journal: "VTE", compte: "4455", libelleCompte: "État, TVA Facturée Hôtellerie (10%)", libelleEcriture: "TVA Touristique Maroc", pieceRef: "FACT-MA-089", debit: 0, credit: 1137 },
      { id: "MA4", date: "28/10/2026", journal: "PAIE", compte: "6171", libelleCompte: "Rémunérations du Personnel (Salaires Bruts)", libelleEcriture: "Livre de Paie Octobre 2026 Marrakech", pieceRef: "JRN-PAIE-MA-10", debit: 64000, credit: 0 },
      { id: "MA5", date: "28/10/2026", journal: "PAIE", compte: "6174", libelleCompte: "Charges Sociales Patronales (CNSS & AMO)", libelleEcriture: "Cotisations Patronales CNSS, Allocations & AMO", pieceRef: "JRN-PAIE-MA-10", debit: 13504, credit: 0 },
      { id: "MA6", date: "28/10/2026", journal: "PAIE", compte: "4432", libelleCompte: "Rémunérations Dues au Personnel", libelleEcriture: "Virement Salaires Nets du Personnel", pieceRef: "JRN-PAIE-MA-10", debit: 0, credit: 54100 },
      { id: "MA7", date: "28/10/2026", journal: "PAIE", compte: "4441", libelleCompte: "CNSS & AMO à Payer", libelleEcriture: "Bordereau Mensuel CNSS / AMO", pieceRef: "JRN-PAIE-MA-10", debit: 0, credit: 17820 },
      { id: "MA8", date: "28/10/2026", journal: "PAIE", compte: "4452", libelleCompte: "État, Impôt sur le Revenu (IR Salaires)", libelleEcriture: "Retenue à la source IR Barème CGI", pieceRef: "JRN-PAIE-MA-10", debit: 0, credit: 5584 },
    ],
    NG: [
      { id: "NG1", date: "24/10/2026", journal: "VTE", compte: "1020", libelleCompte: "Bank Account (Lagos Zenith Bank)", libelleEcriture: "Guest Folio Settlement Room 402", pieceRef: "FOL-NG-202", debit: 480000, credit: 0 },
      { id: "NG2", date: "24/10/2026", journal: "VTE", compte: "4010", libelleCompte: "Room Revenue (Lodging)", libelleEcriture: "Accommodation 3 Nights Deluxe", pieceRef: "FOL-NG-202", debit: 0, credit: 446511 },
      { id: "NG3", date: "24/10/2026", journal: "VTE", compte: "2050", libelleCompte: "Value Added Tax (VAT 7.5%)", libelleEcriture: "Federal Inland Revenue VAT", pieceRef: "FOL-NG-202", debit: 0, credit: 33489 },
      { id: "NG4", date: "28/10/2026", journal: "PAIE", compte: "6000", libelleCompte: "Salaries & Staff Wages (Gross)", libelleEcriture: "Monthly Hotel Payroll Lagos", pieceRef: "PR-NG-10-26", debit: 2450000, credit: 0 },
      { id: "NG5", date: "28/10/2026", journal: "PAIE", compte: "6010", libelleCompte: "Employer Pension Contributions (10%)", libelleEcriture: "Pension Reform Act Employer 10%", pieceRef: "PR-NG-10-26", debit: 245000, credit: 0 },
      { id: "NG6", date: "28/10/2026", journal: "PAIE", compte: "2100", libelleCompte: "Accrued Net Salaries Payable", libelleEcriture: "Staff Bank Transfers Net Pay", pieceRef: "PR-NG-10-26", debit: 0, credit: 1985000 },
      { id: "NG7", date: "28/10/2026", journal: "PAIE", compte: "2120", libelleCompte: "Pension Fund Administrators (PFA)", libelleEcriture: "Pension 8% Employee + 10% Employer", pieceRef: "PR-NG-10-26", debit: 0, credit: 441000 },
      { id: "NG8", date: "28/10/2026", journal: "PAIE", compte: "2110", libelleCompte: "State IRS, PAYE Tax Payable", libelleEcriture: "PAYE Tax Withholding Lagos State", pieceRef: "PR-NG-10-26", debit: 0, credit: 269000 },
    ],
    GM: [
      { id: "GM1", date: "24/10/2026", journal: "VTE", compte: "1010", libelleCompte: "Bank Account (Standard Chartered Banjul)", libelleEcriture: "Guest Settlement Beach Resort", pieceRef: "REC-GM-044", debit: 38000, credit: 0 },
      { id: "GM2", date: "24/10/2026", journal: "VTE", compte: "4000", libelleCompte: "Hotel Lodging Revenue", libelleEcriture: "Bungalow Ocean View 4 Nights", pieceRef: "REC-GM-044", debit: 0, credit: 33043 },
      { id: "GM3", date: "24/10/2026", journal: "VTE", compte: "2010", libelleCompte: "GRA Value Added Tax (15%)", libelleEcriture: "Gambia Revenue Authority VAT", pieceRef: "REC-GM-044", debit: 0, credit: 4957 },
      { id: "GM4", date: "28/10/2026", journal: "PAIE", compte: "6000", libelleCompte: "Staff Salaries & Wages", libelleEcriture: "Monthly Staff Salaries Senegambia", pieceRef: "PR-GM-10-26", debit: 120000, credit: 0 },
      { id: "GM5", date: "28/10/2026", journal: "PAIE", compte: "6010", libelleCompte: "Employer Social Security (SSHFC 10%)", libelleEcriture: "SSHFC National Provident Fund", pieceRef: "PR-GM-10-26", debit: 12000, credit: 0 },
      { id: "GM6", date: "28/10/2026", journal: "PAIE", compte: "2100", libelleCompte: "Net Salaries Payable to Staff", libelleEcriture: "Net Salaries Disbursed", pieceRef: "PR-GM-10-26", debit: 0, credit: 101000 },
      { id: "GM7", date: "28/10/2026", journal: "PAIE", compte: "2120", libelleCompte: "SSHFC Fund Payable", libelleEcriture: "SSHFC 5% Employee + 10% Employer", pieceRef: "PR-GM-10-26", debit: 0, credit: 18000 },
      { id: "GM8", date: "28/10/2026", journal: "PAIE", compte: "2110", libelleCompte: "GRA PAYE Tax Payable", libelleEcriture: "Withholding PAYE Schedule GRA", pieceRef: "PR-GM-10-26", debit: 0, credit: 13000 },
    ],
    GH: [
      { id: "GH1", date: "24/10/2026", journal: "VTE", compte: "1010", libelleCompte: "Bank Account (GCB Accra)", libelleEcriture: "Hotel Folio Check-out Room 305", pieceRef: "FOL-GH-109", debit: 14500, credit: 0 },
      { id: "GH2", date: "24/10/2026", journal: "VTE", compte: "4010", libelleCompte: "Room Accommodation Sales", libelleEcriture: "Executive Suite 3 nights", pieceRef: "FOL-GH-109", debit: 0, credit: 12288 },
      { id: "GH3", date: "24/10/2026", journal: "VTE", compte: "2020", libelleCompte: "GRA VAT & Levies (18%)", libelleEcriture: "GRA VAT, NHIL & GETFund", pieceRef: "FOL-GH-109", debit: 0, credit: 2212 },
      { id: "GH4", date: "28/10/2026", journal: "PAIE", compte: "6010", libelleCompte: "Basic Salaries & Wages", libelleEcriture: "Accra Hotel Staff Payroll", pieceRef: "PR-GH-10-26", debit: 55000, credit: 0 },
      { id: "GH5", date: "28/10/2026", journal: "PAIE", compte: "6030", libelleCompte: "Employer SSNIT Tier 1 & 2 (13%)", libelleEcriture: "SSNIT Employer Contribution", pieceRef: "PR-GH-10-26", debit: 7150, credit: 0 },
      { id: "GH6", date: "28/10/2026", journal: "PAIE", compte: "2110", libelleCompte: "Net Salaries Accrued", libelleEcriture: "Bank Transfers to Staff Accounts", pieceRef: "PR-GH-10-26", debit: 0, credit: 44200 },
      { id: "GH7", date: "28/10/2026", journal: "PAIE", compte: "2130", libelleCompte: "SSNIT Tier 1 & 2 Payable", libelleEcriture: "SSNIT 5.5% Employee + 13% Employer", pieceRef: "PR-GH-10-26", debit: 0, credit: 10175 },
      { id: "GH8", date: "28/10/2026", journal: "PAIE", compte: "2120", libelleCompte: "GRA PAYE Tax Payable", libelleEcriture: "GRA Personal Income Tax Withheld", pieceRef: "PR-GH-10-26", debit: 0, credit: 7775 },
    ],
    PERSO: [
      { id: "P1", date: "24/10/2026", journal: "VTE", compte: "1010", libelleCompte: "Cash & Bank Accounts", libelleEcriture: "International Client Folio", pieceRef: "INV-INT-09", debit: 12000, credit: 0 },
      { id: "P2", date: "24/10/2026", journal: "VTE", compte: "4000", libelleCompte: "Accommodation & Dining Revenue", libelleEcriture: "All-Inclusive Resort Package", pieceRef: "INV-INT-09", debit: 0, credit: 12000 },
      { id: "P3", date: "28/10/2026", journal: "PAIE", compte: "6000", libelleCompte: "Payroll & Salaries Expense", libelleEcriture: "Monthly Staff Salaries Disbursed", pieceRef: "PAY-INT-10", debit: 38000, credit: 0 },
      { id: "P4", date: "28/10/2026", journal: "PAIE", compte: "6010", libelleCompte: "Employer Benefits & Taxes", libelleEcriture: "Employer Social Security Share", pieceRef: "PAY-INT-10", debit: 4940, credit: 0 },
      { id: "P5", date: "28/10/2026", journal: "PAIE", compte: "2100", libelleCompte: "Net Payroll Payable", libelleEcriture: "Employee Net Salary Transfer", pieceRef: "PAY-INT-10", debit: 0, credit: 32600 },
      { id: "P6", date: "28/10/2026", journal: "PAIE", compte: "2120", libelleCompte: "Social Security & Benefits Payable", libelleEcriture: "Employee & Employer Benefits Due", pieceRef: "PAY-INT-10", debit: 0, credit: 7790 },
      { id: "P7", date: "28/10/2026", journal: "PAIE", compte: "2110", libelleCompte: "Withholding Payroll Taxes Payable", libelleEcriture: "Income Taxes Withheld", pieceRef: "PAY-INT-10", debit: 0, credit: 2550 },
    ],
  };

  const ecrituresActuelles = ecrituresParPays[paysCompta] || ecrituresParPays.SN;

  const totalDebit = ecrituresActuelles.reduce((acc, e) => acc + e.debit, 0);
  const totalCredit = ecrituresActuelles.reduce((acc, e) => acc + e.credit, 0);

  const ecrituresFiltrees = ecrituresActuelles.filter((e) => {
    const correspondRecherche =
      e.compte.includes(recherche) ||
      e.libelleCompte.toLowerCase().includes(recherche.toLowerCase()) ||
      e.libelleEcriture.toLowerCase().includes(recherche.toLowerCase()) ||
      e.pieceRef.toLowerCase().includes(recherche.toLowerCase());
    const correspondJournal = filtreJournal === "tous" || e.journal === filtreJournal;
    return correspondRecherche && correspondJournal;
  });

  const handleExportCompta = () => {
    setSuccesMsg(
      `Export du Grand-Livre ${modele.nomPlanComptable} (Compatible Sage / Odoo / Excel en ${modele.symboleDevise}) généré.`
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Grand-Livre & Plans Comptables Multi-Pays
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Conforme SYSCOHADA (Sénégal/UEMOA), PCGM (Maroc), PCGM (Mauritanie) et IFRS (Nigéria, Gambie, Ghana).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCompta}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Exporter Grand-Livre ({modele.symboleDevise})
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* SÉLECTEUR DE PLAN COMPTABLE PAYS */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
            <Globe className="h-4 w-4 text-primary" />
            <span>Référentiel Comptable Hôtelier Actif</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Devise : {modele.nomMonnaie} ({modele.symboleDevise})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(MODELES_PAYS).map(([code, p]) => {
            const estActif = paysCompta === code;
            return (
              <button
                key={code}
                onClick={() => setPaysCompta(code as CodePays)}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                  estActif
                    ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                    : "border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">{code}</span>
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-muted">
                    {p.symboleDevise}
                  </span>
                </div>
                <span className="text-[11px] truncate mt-1">{p.nom.split("(")[0]}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">{p.referentielComptable}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cartouches d'Équilibre Comptable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border shadow-xs">
          <span className="text-xs text-muted-foreground font-medium block">
            Total Débit Période ({modele.symboleDevise})
          </span>
          <p className="text-xl font-black text-foreground mt-1">
            {formatMontant(totalDebit, modele.devise)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-xs">
          <span className="text-xs text-muted-foreground font-medium block">
            Total Crédit Période ({modele.symboleDevise})
          </span>
          <p className="text-xl font-black text-foreground mt-1">
            {formatMontant(totalCredit, modele.devise)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium block">
              Balance Comptable
            </span>
            <p className="text-base font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Équilibrée (Débit = Crédit)
            </p>
          </div>
          <span className="text-[11px] bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded font-mono font-bold">
            Partie Double
          </span>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par numéro de compte, libellé, pièce..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filtreJournal}
            onChange={(e) => setFiltreJournal(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="tous">Tous les journaux</option>
            <option value="VTE">Journal des Ventes Hôtelières</option>
            <option value="PAIE">Journal de Paie & Charges Sociales</option>
            <option value="BQE">Journal de Banque</option>
          </select>
        </div>
      </div>

      {/* Table des Écritures du Grand-Livre */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Journal</th>
                <th className="py-3 px-4">N° Compte ({modele.nomPlanComptable.split("(")[0]})</th>
                <th className="py-3 px-4">Intitulé du Compte</th>
                <th className="py-3 px-4">Libellé de l'Écriture</th>
                <th className="py-3 px-4">Réf. Pièce</th>
                <th className="py-3 px-4 text-right">Débit ({modele.symboleDevise})</th>
                <th className="py-3 px-4 text-right">Crédit ({modele.symboleDevise})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ecrituresFiltrees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Aucune écriture comptable trouvée.
                  </td>
                </tr>
              ) : (
                ecrituresFiltrees.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/30 transition">
                    <td className="py-3 px-4 font-mono text-muted-foreground">{e.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          e.journal === "PAIE"
                            ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                        }`}
                      >
                        {e.journal}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold font-mono text-primary">{e.compte}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{e.libelleCompte}</td>
                    <td className="py-3 px-4 text-muted-foreground">{e.libelleEcriture}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{e.pieceRef}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      {e.debit > 0 ? formatMontant(e.debit, modele.devise) : "—"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      {e.credit > 0 ? formatMontant(e.credit, modele.devise) : "—"}
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
