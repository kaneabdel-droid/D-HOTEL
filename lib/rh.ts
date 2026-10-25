// d-hotel/lib/rh.ts
// Référentiels légaux, plans comptables, conventions hôtelières et moteur de calcul multi-pays
// Couvre : Sénégal (OHADA), Mauritanie (PCGM), Maroc (PCGM), Nigéria (IFRS/GAAP), Gambie (GRA/SSHFC), Ghana (SSNIT/GRA) et Personnalisé

import { DeviseCode } from "./currency";

export type CodePays = "SN" | "MR" | "MA" | "NG" | "GM" | "GH" | "PERSO";
export type ReferentielComptable = "SYSCOHADA" | "PCGM_MAROC" | "PCGM_MAURITANIE" | "IFRS_ANGLO";

export const STATUTS_COLLABORATEUR: Record<string, string> = {
  permanent: "Salarié Permanent (CDI)",
  saisonnier: "Saisonnier (Haute Saison)",
  journalier: "Journalier / Extra Hôtelier",
  prestataire: "Prestataire Extérieur (BNC / Honoraires)",
};

export const TYPES_CONTRAT = [
  { value: "cdi", label: "Contrat à Durée Indéterminée (CDI)" },
  { value: "cdd", label: "Contrat à Durée Déterminée (CDD)" },
  { value: "saisonnier", label: "Contrat Saisonnier Hôtellerie" },
  { value: "journalier", label: "Contrat Journalier / Extra de Shift" },
  { value: "prestation", label: "Contrat de Prestation de Services (BNC)" },
  { value: "stage", label: "Convention de Stage Hôtelier" },
];

export const SITUATIONS_FAMILLE = [
  { value: "celibataire", label: "Célibataire" },
  { value: "marie", label: "Marié(e)" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf / Veuve" },
];

export const DEPARTEMENTS_HOTEL = [
  "Réception & Front-Desk",
  "Hébergement & Étages (Housekeeping)",
  "Cuisine & Pâtisserie",
  "Restaurant, Bar & Room Service",
  "MICE, Événements & Piscine",
  "Maintenance, Froid & Technique",
  "Sécurité, Portiers & Bagagerie",
  "Économat, Achats & Logistique",
  "Administration, RH & Comptabilité",
] as const;

export type DepartementHotel = (typeof DEPARTEMENTS_HOTEL)[number];

// Types pour la configuration d'un pays
export interface CategorieConventionnelle {
  code: string;
  intitule: string;
  salaireBaseMinimal: number;
  tauxHoraireMinimal: number;
  exemplesPostes: string;
}

export interface RegleCotisation {
  code: string;
  libelle: string;
  tauxSalarie: number; // en %
  tauxPatronal: number; // en %
  plafondMensuel?: number;
  compteComptable: string;
}

export interface TrancheFiscale {
  min: number;
  max: number | null;
  taux: number; // en %
}

export interface ModelePaysRh {
  code: CodePays;
  nom: string;
  devise: DeviseCode;
  symboleDevise: string;
  nomMonnaie: string;
  referentielComptable: ReferentielComptable;
  nomPlanComptable: string;
  heuresNormalesMois: number;
  majorationHsJour: number; // ex: 30%
  majorationHsNuit: number; // ex: 50%
  majorationHsDimanche: number; // ex: 100%
  indemniteTransportExoneree: number;
  comptesCles: {
    chargesSalaires: string;
    chargesSocialesPatronales: string;
    dettesSalaries: string;
    organismesSociaux: string;
    etatImpots: string;
  };
  cotisations: RegleCotisation[];
  tranchesImpot: TrancheFiscale[];
  typeDeductionFamille: "parts" | "charge_fixe" | "cra_anglo" | "abattement_base" | "aucun";
  montantDeductionParCharge: number; // Ex: 600 DH/an au Maroc
  abattementFraisProPct: number; // Ex: 30% SN, 35% MA
  plafondAbattementAnnuel?: number;
  grilleConventionnelle: CategorieConventionnelle[];
}

// -------------------------------------------------------------
// DÉFINITIONS DÉTAILLÉES DES MODÈLES PAYS
// -------------------------------------------------------------

export const MODELES_PAYS: Record<CodePays, ModelePaysRh> = {
  // 1. SÉNÉGAL (OHADA / UEMOA)
  SN: {
    code: "SN",
    nom: "Sénégal (OHADA / UEMOA)",
    devise: "XOF",
    symboleDevise: "FCFA",
    nomMonnaie: "Franc CFA",
    referentielComptable: "SYSCOHADA",
    nomPlanComptable: "SYSCOHADA Révisé (Comptes classe 6 & 4)",
    heuresNormalesMois: 173.33,
    majorationHsJour: 30,
    majorationHsNuit: 50,
    majorationHsDimanche: 100,
    indemniteTransportExoneree: 26000,
    comptesCles: {
      chargesSalaires: "6611 - Appointements et Salaires",
      chargesSocialesPatronales: "6641 - Charges Sociales Patronales",
      dettesSalaries: "4211 - Personnel, Rémunérations dues",
      organismesSociaux: "4311 - IPRES & CSS à payer",
      etatImpots: "4471 - État, Impôt sur le Revenu retenu",
    },
    cotisations: [
      { code: "IPRES_RG", libelle: "IPRES Régime Général", tauxSalarie: 5.6, tauxPatronal: 8.4, plafondMensuel: 432000, compteComptable: "4311" },
      { code: "IPRES_RC", libelle: "IPRES Cadre Tranche B", tauxSalarie: 6.4, tauxPatronal: 9.6, plafondMensuel: 1296000, compteComptable: "4311" },
      { code: "IPM", libelle: "IPM Assurance Santé", tauxSalarie: 3.0, tauxPatronal: 3.0, compteComptable: "4313" },
      { code: "CSS_PF", libelle: "CSS Prestations Familiales", tauxSalarie: 0, tauxPatronal: 7.0, plafondMensuel: 63000, compteComptable: "4321" },
      { code: "CSS_AT", libelle: "CSS Accidents du Travail Hôtellerie", tauxSalarie: 0, tauxPatronal: 1.5, plafondMensuel: 63000, compteComptable: "4322" },
      { code: "CFCE", libelle: "CFCE Employeur (3.0%)", tauxSalarie: 0, tauxPatronal: 3.0, compteComptable: "4472" },
    ],
    tranchesImpot: [
      { min: 0, max: 630000, taux: 0 },
      { min: 630000, max: 1500000, taux: 20 },
      { min: 1500000, max: 4000000, taux: 30 },
      { min: 4000000, max: 8000000, taux: 35 },
      { min: 8000000, max: null, taux: 40 },
    ],
    typeDeductionFamille: "parts",
    montantDeductionParCharge: 0,
    abattementFraisProPct: 30,
    plafondAbattementAnnuel: 900000,
    grilleConventionnelle: [
      { code: "CAT-1", intitule: "Catégorie 1 - Service débutant", salaireBaseMinimal: 62500, tauxHoraireMinimal: 360, exemplesPostes: "Plongeur, Nettoyeur espaces communs" },
      { code: "CAT-3", intitule: "Catégorie 3 - Employé d'étage", salaireBaseMinimal: 87500, tauxHoraireMinimal: 505, exemplesPostes: "Femme de chambre, Commis cuisine" },
      { code: "CAT-5", intitule: "Catégorie 5 - Barman / Réceptionniste", salaireBaseMinimal: 135000, tauxHoraireMinimal: 779, exemplesPostes: "Réceptionniste, Barman, Chef de partie" },
      { code: "CAT-7", intitule: "Catégorie 7 - Agent de maîtrise", salaireBaseMinimal: 225000, tauxHoraireMinimal: 1298, exemplesPostes: "Chef de Réception, Maître d'Hôtel" },
      { code: "CAT-9", intitule: "Catégorie 9 - Cadre supérieur", salaireBaseMinimal: 450000, tauxHoraireMinimal: 2596, exemplesPostes: "Chef Exécutif Cuisine, Directeur F&B" },
      { code: "CADRE-DIR", intitule: "Hors Catégorie - Direction", salaireBaseMinimal: 750000, tauxHoraireMinimal: 4327, exemplesPostes: "Directeur d'Hébergement, Directeur Général" },
    ],
  },

  // 2. MAURITANIE (PCGM / CGI Mauritanie)
  MR: {
    code: "MR",
    nom: "Mauritanie (PCGM / CGI Mauritanie)",
    devise: "MRU",
    symboleDevise: "MRU",
    nomMonnaie: "Ouguiya Mauritanien",
    referentielComptable: "PCGM_MAURITANIE",
    nomPlanComptable: "Plan Comptable Général Mauritanien (PCGM)",
    heuresNormalesMois: 173.33,
    majorationHsJour: 25,
    majorationHsNuit: 50,
    majorationHsDimanche: 100,
    indemniteTransportExoneree: 1500,
    comptesCles: {
      chargesSalaires: "6610 - Rémunérations du Personnel",
      chargesSocialesPatronales: "6640 - Charges Sociales (CNSS/CNAM)",
      dettesSalaries: "4210 - Personnel, Salaires Nets Dus",
      organismesSociaux: "4310 - CNSS & CNAM à payer",
      etatImpots: "4470 - Trésor Public, Retenue ITS",
    },
    cotisations: [
      { code: "CNSS_SAL", libelle: "CNSS Retraite Salarié", tauxSalarie: 1.0, tauxPatronal: 0, plafondMensuel: 15000, compteComptable: "4310" },
      { code: "CNSS_PAT", libelle: "CNSS Prestations & Retraite Patronale", tauxSalarie: 0, tauxPatronal: 13.0, plafondMensuel: 15000, compteComptable: "4310" },
      { code: "CNAM_PAT", libelle: "CNAM Assurance Maladie Employeur", tauxSalarie: 0, tauxPatronal: 4.0, compteComptable: "4320" },
      { code: "MEDECINE_TRAVAIL", libelle: "Médecine du Travail", tauxSalarie: 0, tauxPatronal: 2.0, compteComptable: "4330" },
    ],
    // ITS Mauritanien (mensuel) : 0-6000 MRU exonéré, 6001-21000 à 15%, 21001-40000 à 25%, >40000 à 40%
    tranchesImpot: [
      { min: 0, max: 72000, taux: 0 },
      { min: 72000, max: 252000, taux: 15 },
      { min: 252000, max: 480000, taux: 25 },
      { min: 480000, max: null, taux: 40 },
    ],
    typeDeductionFamille: "aucun",
    montantDeductionParCharge: 0,
    abattementFraisProPct: 0,
    grilleConventionnelle: [
      { code: "MR-CAT-1", intitule: "Catégorie 1 - Service hôtelier", salaireBaseMinimal: 4500, tauxHoraireMinimal: 26, exemplesPostes: "Plongeur, Nettoyeur espaces communs" },
      { code: "MR-CAT-3", intitule: "Catégorie 3 - Employé d'étage", salaireBaseMinimal: 6200, tauxHoraireMinimal: 36, exemplesPostes: "Valet/Femme de chambre, Commis" },
      { code: "MR-CAT-5", intitule: "Catégorie 5 - Réceptionniste / Cuisinier", salaireBaseMinimal: 10500, tauxHoraireMinimal: 61, exemplesPostes: "Réceptionniste, Cuisinier qualifié" },
      { code: "MR-CAT-7", intitule: "Catégorie 7 - Maître d'Hôtel / Gouvernante", salaireBaseMinimal: 18000, tauxHoraireMinimal: 104, exemplesPostes: "Maître d'hôtel, Chef de réception" },
      { code: "MR-CAT-9", intitule: "Catégorie 9 - Chef Exécutif / Cadre", salaireBaseMinimal: 32000, tauxHoraireMinimal: 185, exemplesPostes: "Chef de cuisine, Directeur F&B" },
    ],
  },

  // 3. MAROC (PCGM Maroc / CGI 2026)
  MA: {
    code: "MA",
    nom: "Maroc (PCGM / CGI Maroc)",
    devise: "MAD",
    symboleDevise: "DH",
    nomMonnaie: "Dirham Marocain",
    referentielComptable: "PCGM_MAROC",
    nomPlanComptable: "Plan Comptable Général Marocain (PCGM)",
    heuresNormalesMois: 191, // 44h/semaine au Maroc
    majorationHsJour: 25,
    majorationHsNuit: 50,
    majorationHsDimanche: 100,
    indemniteTransportExoneree: 500,
    comptesCles: {
      chargesSalaires: "6171 - Rémunérations du Personnel",
      chargesSocialesPatronales: "6174 - Charges Sociales Patronales",
      dettesSalaries: "4432 - Rémunérations dues au personnel",
      organismesSociaux: "4441 - CNSS & AMO à payer",
      etatImpots: "4452 - État, Impôt sur le Revenu (IR Salaires)",
    },
    cotisations: [
      { code: "CNSS_PREST_SAL", libelle: "CNSS Prestations Salariales (4.48%)", tauxSalarie: 4.48, tauxPatronal: 8.98, plafondMensuel: 6000, compteComptable: "4441" },
      { code: "CNSS_ALLOC_FAM", libelle: "CNSS Allocations Familiales", tauxSalarie: 0, tauxPatronal: 6.40, compteComptable: "4441" },
      { code: "TAXE_FORM_PRO", libelle: "Taxe de Formation Professionnelle", tauxSalarie: 0, tauxPatronal: 1.60, compteComptable: "4448" },
      { code: "AMO_BASE", libelle: "AMO Assurance Maladie Obligatoire", tauxSalarie: 2.26, tauxPatronal: 4.11, compteComptable: "4443" },
    ],
    // Barème annuel IR Maroc (CGI 2026)
    tranchesImpot: [
      { min: 0, max: 40000, taux: 0 },
      { min: 40000, max: 60000, taux: 10 },
      { min: 60000, max: 80000, taux: 20 },
      { min: 80000, max: 100000, taux: 30 },
      { min: 100000, max: 180000, taux: 34 },
      { min: 180000, max: null, taux: 37 },
    ],
    typeDeductionFamille: "charge_fixe",
    montantDeductionParCharge: 600, // 600 DH/an par personne à charge (max 6 charges = 3 600 DH)
    abattementFraisProPct: 35, // 35% si brut annuel <= 78 000 DH, plafonné à 35 000 DH
    plafondAbattementAnnuel: 35000,
    grilleConventionnelle: [
      { code: "MA-CAT-1", intitule: "Catégorie 1 - Service général SMIG", salaireBaseMinimal: 3120, tauxHoraireMinimal: 16.3, exemplesPostes: "Plongeur, Commis d'étage" },
      { code: "MA-CAT-3", intitule: "Catégorie 3 - Femme de chambre / Valet", salaireBaseMinimal: 3800, tauxHoraireMinimal: 19.9, exemplesPostes: "Femme de chambre, Bagagiste" },
      { code: "MA-CAT-5", intitule: "Catégorie 5 - Réceptionniste / Demi-chef de rang", salaireBaseMinimal: 5500, tauxHoraireMinimal: 28.8, exemplesPostes: "Réceptionniste bilingue, Chef de partie" },
      { code: "MA-CAT-7", intitule: "Catégorie 7 - Maître d'Hôtel / Sous-chef", salaireBaseMinimal: 9500, tauxHoraireMinimal: 49.7, exemplesPostes: "Maître d'hôtel, Sous-chef cuisine" },
      { code: "MA-CAT-9", intitule: "Catégorie 9 - Chef Exécutif / Directeur F&B", salaireBaseMinimal: 18000, tauxHoraireMinimal: 94.2, exemplesPostes: "Chef exécutif, Directeur hébergement" },
    ],
  },

  // 4. NIGÉRIA (Nigerian GAAP / PITA 2025)
  NG: {
    code: "NG",
    nom: "Nigéria (IFRS / CAMA / PITA 2025)",
    devise: "NGN",
    symboleDevise: "₦",
    nomMonnaie: "Naira Nigérian",
    referentielComptable: "IFRS_ANGLO",
    nomPlanComptable: "Nigerian Standard Chart of Accounts (IFRS)",
    heuresNormalesMois: 173.33,
    majorationHsJour: 25,
    majorationHsNuit: 50,
    majorationHsDimanche: 100,
    indemniteTransportExoneree: 20000,
    comptesCles: {
      chargesSalaires: "6000 - Salaries and Staff Wages",
      chargesSocialesPatronales: "6010 - Employer Pension & Social Contributions",
      dettesSalaries: "2100 - Accrued Payroll & Net Salaries",
      organismesSociaux: "2120 - Pension Funds & NHF Payable",
      etatImpots: "2110 - State IRS, PAYE Tax Payable",
    },
    cotisations: [
      { code: "PENSION_PRA", libelle: "Pension Reform Act (PRA)", tauxSalarie: 8.0, tauxPatronal: 10.0, compteComptable: "2120" },
      { code: "NHF", libelle: "National Housing Fund (NHF)", tauxSalarie: 2.5, tauxPatronal: 0, compteComptable: "2125" },
      { code: "NSITF", libelle: "NSITF Employee Compensation", tauxSalarie: 0, tauxPatronal: 1.0, compteComptable: "2126" },
      { code: "ITF", libelle: "Industrial Training Fund (ITF)", tauxSalarie: 0, tauxPatronal: 1.0, compteComptable: "2127" },
    ],
    // Barème annuel PITA Nigéria
    tranchesImpot: [
      { min: 0, max: 300000, taux: 7 },
      { min: 300000, max: 600000, taux: 11 },
      { min: 600000, max: 1100000, taux: 15 },
      { min: 1100000, max: 1600000, taux: 19 },
      { min: 1600000, max: 3200000, taux: 21 },
      { min: 3200000, max: null, taux: 24 },
    ],
    typeDeductionFamille: "cra_anglo", // Consolidated Relief Allowance (200k + 20% brut)
    montantDeductionParCharge: 0,
    abattementFraisProPct: 20,
    grilleConventionnelle: [
      { code: "NG-CAT-1", intitule: "Grade 1 - General Steward", salaireBaseMinimal: 70000, tauxHoraireMinimal: 404, exemplesPostes: "Kitchen Steward, Room Attendant Assistant" },
      { code: "NG-CAT-3", intitule: "Grade 3 - Housekeeper / Waiter", salaireBaseMinimal: 95000, tauxHoraireMinimal: 548, exemplesPostes: "Room Attendant, Waiter, Porter" },
      { code: "NG-CAT-5", intitule: "Grade 5 - Front Desk / Bartender", salaireBaseMinimal: 150000, tauxHoraireMinimal: 865, exemplesPostes: "Front Desk Officer, Mixologist, Demi-Chef" },
      { code: "NG-CAT-7", intitule: "Grade 7 - Supervisor / Sous Chef", salaireBaseMinimal: 260000, tauxHoraireMinimal: 1500, exemplesPostes: "Duty Manager, Sous Chef, Banquet Head" },
      { code: "NG-CAT-9", intitule: "Grade 9 - Executive Chef / F&B Director", salaireBaseMinimal: 550000, tauxHoraireMinimal: 3173, exemplesPostes: "Executive Chef, Operations Manager" },
    ],
  },

  // 5. GAMBIE (GRA / SSHFC)
  GM: {
    code: "GM",
    nom: "Gambie (GRA / SSHFC)",
    devise: "GMD",
    symboleDevise: "D",
    nomMonnaie: "Dalasi Gambien",
    referentielComptable: "IFRS_ANGLO",
    nomPlanComptable: "Gambia Standard Chart of Accounts (Companies Act)",
    heuresNormalesMois: 173.33,
    majorationHsJour: 25,
    majorationHsNuit: 50,
    majorationHsDimanche: 100,
    indemniteTransportExoneree: 1000,
    comptesCles: {
      chargesSalaires: "6000 - Salaries & Staff Wages",
      chargesSocialesPatronales: "6010 - Social Security Contributions",
      dettesSalaries: "2100 - Net Salaries Payable",
      organismesSociaux: "2120 - SSHFC Provident Fund Payable",
      etatImpots: "2110 - GRA, PAYE Tax Payable",
    },
    cotisations: [
      { code: "SSHFC_NPF", libelle: "SSHFC National Provident Fund", tauxSalarie: 5.0, tauxPatronal: 10.0, compteComptable: "2120" },
      { code: "SSHFC_ICF", libelle: "SSHFC Injury Compensation Fund", tauxSalarie: 0, tauxPatronal: 1.0, plafondMensuel: 1500, compteComptable: "2121" },
    ],
    // Barème mensuel GRA Gambie (ramené en annuel)
    tranchesImpot: [
      { min: 0, max: 24000, taux: 0 },
      { min: 24000, max: 48000, taux: 5 },
      { min: 48000, max: 72000, taux: 10 },
      { min: 72000, max: 96000, taux: 15 },
      { min: 96000, max: 120000, taux: 20 },
      { min: 120000, max: null, taux: 25 },
    ],
    typeDeductionFamille: "aucun",
    montantDeductionParCharge: 0,
    abattementFraisProPct: 0,
    grilleConventionnelle: [
      { code: "GM-CAT-1", intitule: "Grade 1 - Kitchen Porter", salaireBaseMinimal: 4000, tauxHoraireMinimal: 23, exemplesPostes: "Dishwasher, Pool Cleaner" },
      { code: "GM-CAT-3", intitule: "Grade 3 - Housekeeper / Waiter", salaireBaseMinimal: 5500, tauxHoraireMinimal: 32, exemplesPostes: "Room Maid, Restaurant Waiter" },
      { code: "GM-CAT-5", intitule: "Grade 5 - Receptionist / Bartender", salaireBaseMinimal: 8500, tauxHoraireMinimal: 49, exemplesPostes: "Front Desk Agent, Barman" },
      { code: "GM-CAT-7", intitule: "Grade 7 - Supervisor / Head Chef", salaireBaseMinimal: 15000, tauxHoraireMinimal: 86, exemplesPostes: "Head Receptionist, Sous Chef" },
      { code: "GM-CAT-9", intitule: "Grade 9 - Hotel Operations Manager", salaireBaseMinimal: 30000, tauxHoraireMinimal: 173, exemplesPostes: "F&B Manager, Resident Manager" },
    ],
  },

  // 6. GHANA (GRA / SSNIT Tier 1 & 2)
  GH: {
    code: "GH",
    nom: "Ghana (GRA / SSNIT / IFRS)",
    devise: "GHS",
    symboleDevise: "GH₵",
    nomMonnaie: "Cedi Ghanéen",
    referentielComptable: "IFRS_ANGLO",
    nomPlanComptable: "Ghana Standard Chart of Accounts (IFRS)",
    heuresNormalesMois: 173.33,
    majorationHsJour: 25,
    majorationHsNuit: 50,
    majorationHsDimanche: 100,
    indemniteTransportExoneree: 200,
    comptesCles: {
      chargesSalaires: "6010 - Basic Salaries & Wages",
      chargesSocialesPatronales: "6030 - SSNIT Employer Contributions",
      dettesSalaries: "2110 - Net Salaries Payable",
      organismesSociaux: "2130 - SSNIT Tier 1 & 2 Payable",
      etatImpots: "2120 - GRA PAYE Tax Payable",
    },
    cotisations: [
      { code: "SSNIT_TIER1_2", libelle: "SSNIT Tier 1 & Tier 2 Pension", tauxSalarie: 5.5, tauxPatronal: 13.0, compteComptable: "2130" },
    ],
    // Barème mensuel GRA Ghana (multiplié par 12)
    tranchesImpot: [
      { min: 0, max: 5880, taux: 0 },
      { min: 5880, max: 7200, taux: 5 },
      { min: 7200, max: 8760, taux: 10 },
      { min: 8760, max: 46760, taux: 17.5 },
      { min: 46760, max: 240000, taux: 25 },
      { min: 240000, max: 600000, taux: 30 },
      { min: 600000, max: null, taux: 35 },
    ],
    typeDeductionFamille: "aucun",
    montantDeductionParCharge: 0,
    abattementFraisProPct: 0,
    grilleConventionnelle: [
      { code: "GH-CAT-1", intitule: "Tier 1 - Kitchen & Cleaning Staff", salaireBaseMinimal: 900, tauxHoraireMinimal: 5.2, exemplesPostes: "Dishwasher, Janitor" },
      { code: "GH-CAT-3", intitule: "Tier 3 - Housekeeping Attendant", salaireBaseMinimal: 1300, tauxHoraireMinimal: 7.5, exemplesPostes: "Chambermaid, Bellhop" },
      { code: "GH-CAT-5", intitule: "Tier 5 - Front Office / Line Cook", salaireBaseMinimal: 2200, tauxHoraireMinimal: 12.7, exemplesPostes: "Front Desk Clerk, Bartender, Line Cook" },
      { code: "GH-CAT-7", intitule: "Tier 7 - Assistant Manager", salaireBaseMinimal: 4200, tauxHoraireMinimal: 24.2, exemplesPostes: "Head Housekeeper, Chef de Partie" },
      { code: "GH-CAT-9", intitule: "Tier 9 - Executive Management", salaireBaseMinimal: 9500, tauxHoraireMinimal: 54.8, exemplesPostes: "F&B Director, Hotel General Manager" },
    ],
  },

  // 7. PERSONNALISÉ (HORS SÉNÉGAL / INTERNATIONAL)
  PERSO: {
    code: "PERSO",
    nom: "Paramétrage Sur-Mesure / Hors Sénégal",
    devise: "USD",
    symboleDevise: "$",
    nomMonnaie: "Dollar US / Monnaie Paramétrable",
    referentielComptable: "IFRS_ANGLO",
    nomPlanComptable: "Plan Comptable Hôtelier Personnalisé",
    heuresNormalesMois: 173.33,
    majorationHsJour: 25,
    majorationHsNuit: 50,
    majorationHsDimanche: 100,
    indemniteTransportExoneree: 0,
    comptesCles: {
      chargesSalaires: "6000 - Payroll Expense",
      chargesSocialesPatronales: "6010 - Employer Taxes & Benefits",
      dettesSalaries: "2100 - Net Payroll Payable",
      organismesSociaux: "2120 - Social Security & Benefits Payable",
      etatImpots: "2110 - Payroll Withholding Taxes Payable",
    },
    cotisations: [
      { code: "RETRAITE_PERSO", libelle: "Caisse de Retraite Obligatoire", tauxSalarie: 5.0, tauxPatronal: 8.0, compteComptable: "2120" },
      { code: "SANTE_PERSO", libelle: "Assurance Santé / Maladie", tauxSalarie: 2.5, tauxPatronal: 3.5, compteComptable: "2125" },
      { code: "RISQUES_PRO_PERSO", libelle: "Accidents du Travail", tauxSalarie: 0, tauxPatronal: 1.5, compteComptable: "2126" },
    ],
    tranchesImpot: [
      { min: 0, max: 12000, taux: 0 },
      { min: 12000, max: 30000, taux: 10 },
      { min: 30000, max: 60000, taux: 20 },
      { min: 60000, max: 100000, taux: 30 },
      { min: 100000, max: null, taux: 35 },
    ],
    typeDeductionFamille: "charge_fixe",
    montantDeductionParCharge: 300,
    abattementFraisProPct: 10,
    plafondAbattementAnnuel: 5000,
    grilleConventionnelle: [
      { code: "P-CAT-1", intitule: "Niveau 1 - Personnel Opérationnel", salaireBaseMinimal: 500, tauxHoraireMinimal: 2.88, exemplesPostes: "Service d'étage, Plongeur" },
      { code: "P-CAT-3", intitule: "Niveau 3 - Employé Qualifié", salaireBaseMinimal: 900, tauxHoraireMinimal: 5.19, exemplesPostes: "Réceptionniste, Cuisinier, Barman" },
      { code: "P-CAT-5", intitule: "Niveau 5 - Maîtrise / Superviseur", salaireBaseMinimal: 1800, tauxHoraireMinimal: 10.38, exemplesPostes: "Chef de Réception, Maître d'Hôtel" },
      { code: "P-CAT-7", intitule: "Niveau 7 - Cadre Supérieur & Direction", salaireBaseMinimal: 3500, tauxHoraireMinimal: 20.19, exemplesPostes: "Chef Exécutif, Directeur Général" },
    ],
  },
};

export const MOIS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export const STATUTS_POINTAGE = [
  { value: "present", label: "Présent", couleur: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { value: "retard", label: "Retard constaté", couleur: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "demi_journee", label: "Demi-journée", couleur: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "conge_paye", label: "Congé Payé Annuel", couleur: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  { value: "maladie", label: "Maladie (Justifiée)", couleur: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  { value: "absence_justifiee", label: "Absence Justifiée (Autorisée)", couleur: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { value: "absence_injustifiee", label: "Absence Injustifiée (Déduite)", couleur: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  { value: "conge_sans_solde", label: "Congé Sans Solde", couleur: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20" },
  { value: "repos_hebdo", label: "Repos Hebdomadaire", couleur: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
];

export interface CollaborateurRh {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  statut: "permanent" | "saisonnier" | "journalier" | "prestataire";
  typeContrat: string;
  poste: string;
  departement: DepartementHotel;
  dateEmbauche: string;
  telephone: string;
  email?: string;
  paysCode?: CodePays;
  situationFamiliale: "celibataire" | "marie" | "divorce" | "veuf";
  nombreEnfants: number;
  nombreConjoints: number;
  partsIr: number;
  regimeIpres?: string;
  numeroSecu?: string;
  numeroIpres?: string;
  numeroCss?: string;
  categorieConventionnelle?: string;
  
  // Rémunération complète
  salaireBase: number;
  sursalaire: number;
  primesMensuelles: number;
  avantagesEnNature?: number; // Logement, véhicule, repas
  indemniteTransport: number;
  
  modePaiement: "virement" | "wave" | "orange_money" | "cheque" | "especes";
  coordonneesBancaires?: string;
}

export interface LigneBulletinDetail {
  libelle: string;
  type: "gain" | "retenue_absence" | "retenue_salariale" | "charge_patronale";
  base: number;
  taux?: number;
  montantSalarial: number;
  montantPatronal?: number;
  compteComptable?: string;
}

export interface BulletinPaieCalcule {
  collaborateurId: string;
  matricule: string;
  nomComplet: string;
  poste: string;
  departement: string;
  categorie: string;
  statut: string;
  paysCode: CodePays;
  devise: DeviseCode;
  symboleDevise: string;
  periodeMois: number;
  periodeAnnee: number;
  periodeTexte: string;
  joursTravailles: number;
  joursOuvresMois: number;
  heuresNormales: number;
  heuresSupp: number;
  tauxHoraire: number;
  
  // Totaux
  salaireBase: number;
  sursalaire: number;
  primes: number;
  avantagesEnNature: number;
  heuresSuppMontant: number;
  indemniteTransport: number;
  salaireBrutTotal: number;
  brutImposable: number;
  
  retenuesAbsences: number;
  totalRetenuesSalariales: number;
  netAPayer: number;
  
  totalChargesPatronales: number;
  coutTotalEmployeur: number;
  
  lignes: LigneBulletinDetail[];
}

export function calculerPartsFiscales(situation: string, enfants: number = 0): number {
  let parts = situation === "marie" ? 1.5 : 1.0;
  parts += 0.5 * Math.max(0, enfants);
  return Math.min(5.0, Math.max(1.0, parts));
}

/**
 * Moteur universel de calcul de la paie multi-pays et personnalisable
 */
export function genererCalculBulletin(
  collab: CollaborateurRh,
  mois: number,
  annee: number,
  heuresSuppJour: number = 0,
  heuresSuppNuit: number = 0,
  joursAbsenceInjustifiee: number = 0,
  acomptesMois: number = 0,
  paysForce?: CodePays
): BulletinPaieCalcule {
  const pays: CodePays = paysForce || collab.paysCode || "SN";
  const modele = MODELES_PAYS[pays] || MODELES_PAYS.SN;

  const moisLibelle = MOIS_FR[mois - 1];
  const periodeTexte = `${moisLibelle} ${annee}`;
  const joursOuvresMois = 26;
  const joursTravailles = Math.max(0, joursOuvresMois - joursAbsenceInjustifiee);

  const baseMois = collab.salaireBase;
  const sursalaire = collab.sursalaire || 0;
  const primes = collab.primesMensuelles || 0;
  const avantages = collab.avantagesEnNature || 0;
  const transport = collab.indemniteTransport ?? modele.indemniteTransportExoneree;

  const tauxHoraire = Math.round((baseMois + sursalaire) / modele.heuresNormalesMois);
  const montantHsJour = Math.round(heuresSuppJour * tauxHoraire * (1 + modele.majorationHsJour / 100));
  const montantHsNuit = Math.round(heuresSuppNuit * tauxHoraire * (1 + modele.majorationHsNuit / 100));
  const montantHeuresSupp = montantHsJour + montantHsNuit;
  const totalHs = heuresSuppJour + heuresSuppNuit;

  const retenueAbsence = joursAbsenceInjustifiee > 0
    ? Math.round(((baseMois + sursalaire) / joursOuvresMois) * joursAbsenceInjustifiee)
    : 0;

  const salaireBrutTotal = baseMois + sursalaire + primes + avantages + transport + montantHeuresSupp - retenueAbsence;
  const brutImposable = Math.max(0, salaireBrutTotal - transport);

  const lignes: LigneBulletinDetail[] = [];

  // 1. GAINS & ÉLÉMENTS DE RÉMUNÉRATION
  lignes.push({
    libelle: `Salaire de base conventionnel (${collab.categorieConventionnelle || "Grille"})`,
    type: "gain",
    base: baseMois,
    montantSalarial: baseMois,
    compteComptable: modele.comptesCles.chargesSalaires,
  });

  if (sursalaire > 0) {
    lignes.push({
      libelle: "Sursalaire contractuel négocié",
      type: "gain",
      base: sursalaire,
      montantSalarial: sursalaire,
      compteComptable: modele.comptesCles.chargesSalaires,
    });
  }

  if (primes > 0) {
    lignes.push({
      libelle: "Primes mensuelles (fonction / panier / responsabilité)",
      type: "gain",
      base: primes,
      montantSalarial: primes,
      compteComptable: modele.comptesCles.chargesSalaires,
    });
  }

  if (avantages > 0) {
    lignes.push({
      libelle: "Avantages en nature (logement / nourriture / véhicule)",
      type: "gain",
      base: avantages,
      montantSalarial: avantages,
      compteComptable: modele.comptesCles.chargesSalaires,
    });
  }

  if (montantHsJour > 0) {
    lignes.push({
      libelle: `Heures supplémentaires jour (${heuresSuppJour}h maj. +${modele.majorationHsJour}%)`,
      type: "gain",
      base: heuresSuppJour * tauxHoraire,
      taux: modele.majorationHsJour,
      montantSalarial: montantHsJour,
      compteComptable: modele.comptesCles.chargesSalaires,
    });
  }

  if (montantHsNuit > 0) {
    lignes.push({
      libelle: `Heures supplémentaires nuit (${heuresSuppNuit}h maj. +${modele.majorationHsNuit}%)`,
      type: "gain",
      base: heuresSuppNuit * tauxHoraire,
      taux: modele.majorationHsNuit,
      montantSalarial: montantHsNuit,
      compteComptable: modele.comptesCles.chargesSalaires,
    });
  }

  if (transport > 0) {
    lignes.push({
      libelle: "Indemnité de transport légale",
      type: "gain",
      base: transport,
      montantSalarial: transport,
      compteComptable: modele.comptesCles.chargesSalaires,
    });
  }

  // 2. DÉDUCTION ABSENCE
  if (retenueAbsence > 0) {
    lignes.push({
      libelle: `Déduction absence injustifiée (${joursAbsenceInjustifiee} j)`,
      type: "retenue_absence",
      base: retenueAbsence,
      montantSalarial: -retenueAbsence,
    });
  }

  // CAS PRESTATAIRE BNC
  if (collab.statut === "prestataire") {
    const tauxVrs = pays === "MR" ? 5 : pays === "MA" ? 10 : pays === "NG" ? 5 : 5;
    const retenueVrs = Math.round((brutImposable * tauxVrs) / 100);
    lignes.push({
      libelle: `Retenue à la source prestation extérieure (VRS ${tauxVrs}%)`,
      type: "retenue_salariale",
      base: brutImposable,
      taux: tauxVrs,
      montantSalarial: retenueVrs,
      compteComptable: modele.comptesCles.etatImpots,
    });
    const netPrest = salaireBrutTotal - retenueVrs - acomptesMois;
    return {
      collaborateurId: collab.id,
      matricule: collab.matricule,
      nomComplet: `${collab.prenom} ${collab.nom}`,
      poste: collab.poste,
      departement: collab.departement,
      categorie: "Prestataire BNC / Forfait",
      statut: STATUTS_COLLABORATEUR[collab.statut] || collab.statut,
      paysCode: pays,
      devise: modele.devise,
      symboleDevise: modele.symboleDevise,
      periodeMois: mois,
      periodeAnnee: annee,
      periodeTexte,
      joursTravailles,
      joursOuvresMois,
      heuresNormales: 0,
      heuresSupp: 0,
      tauxHoraire: 0,
      salaireBase: baseMois,
      sursalaire,
      primes,
      avantagesEnNature: avantages,
      heuresSuppMontant: 0,
      indemniteTransport: transport,
      salaireBrutTotal,
      brutImposable,
      retenuesAbsences: 0,
      totalRetenuesSalariales: retenueVrs + acomptesMois,
      netAPayer: netPrest,
      totalChargesPatronales: 0,
      coutTotalEmployeur: salaireBrutTotal,
      lignes,
    };
  }

  // 3. COTISATIONS SOCIALES DU PAYS
  let totalCotisSalariales = 0;
  let totalCotisPatronales = 0;

  for (const c of modele.cotisations) {
    const assiette = c.plafondMensuel ? Math.min(brutImposable, c.plafondMensuel) : brutImposable;
    const partSal = Math.round((assiette * c.tauxSalarie) / 100);
    const partPat = Math.round((assiette * c.tauxPatronal) / 100);

    totalCotisSalariales += partSal;
    totalCotisPatronales += partPat;

    if (partSal > 0) {
      lignes.push({
        libelle: `${c.libelle} (${c.tauxSalarie}% sal.)`,
        type: "retenue_salariale",
        base: assiette,
        taux: c.tauxSalarie,
        montantSalarial: partSal,
        montantPatronal: partPat,
        compteComptable: c.compteComptable,
      });
    } else if (partPat > 0) {
      lignes.push({
        libelle: `${c.libelle} (Part Employeur ${c.tauxPatronal}%)`,
        type: "charge_patronale",
        base: assiette,
        taux: c.tauxPatronal,
        montantSalarial: 0,
        montantPatronal: partPat,
        compteComptable: c.compteComptable,
      });
    }
  }

  // 4. FISCALITÉ (IR / PAYE / ITS DU PAYS)
  const brutAnnuel = brutImposable * 12;
  const abattementAnnuel = modele.abattementFraisProPct > 0
    ? Math.min(brutAnnuel * (modele.abattementFraisProPct / 100), modele.plafondAbattementAnnuel || Infinity)
    : 0;
  const baseImposableAnnuelle = Math.max(0, brutAnnuel - abattementAnnuel);

  let impotBrutAnnuel = 0;
  for (const tr of modele.tranchesImpot) {
    if (baseImposableAnnuelle > tr.min) {
      const assietteTranche = tr.max ? Math.min(baseImposableAnnuelle, tr.max) - tr.min : baseImposableAnnuelle - tr.min;
      if (assietteTranche > 0) {
        impotBrutAnnuel += assietteTranche * (tr.taux / 100);
      }
    }
  }

  // Déductions pour charges de famille
  let reductionAnnuelle = 0;
  if (modele.typeDeductionFamille === "parts") {
    const parts = collab.partsIr || calculerPartsFiscales(collab.situationFamiliale, collab.nombreEnfants);
    const pct = parts >= 5 ? 0.45 : parts >= 4 ? 0.35 : parts >= 3 ? 0.25 : parts >= 2 ? 0.15 : parts >= 1.5 ? 0.10 : 0;
    reductionAnnuelle = impotBrutAnnuel * pct;
  } else if (modele.typeDeductionFamille === "charge_fixe") {
    const nbCharges = Math.min(6, (collab.situationFamiliale === "marie" ? 1 : 0) + collab.nombreEnfants);
    reductionAnnuelle = nbCharges * modele.montantDeductionParCharge;
  } else if (modele.typeDeductionFamille === "cra_anglo") {
    // Nigeria CRA : 200 000 ₦ ou 1% brut + 20% brut
    const cra = Math.max(200000, brutAnnuel * 0.01) + brutAnnuel * 0.20;
    reductionAnnuelle = Math.min(impotBrutAnnuel, cra * 0.15);
  }

  const impotNetAnnuel = Math.max(0, impotBrutAnnuel - reductionAnnuelle);
  const impotMensuel = Math.round(impotNetAnnuel / 12);

  if (impotMensuel > 0) {
    lignes.push({
      libelle: `Impôt sur Salaires (${modele.code === "SN" ? "Retenue IR" : modele.code === "MA" ? "IR Salaires" : modele.code === "MR" ? "ITS" : "PAYE Tax"})`,
      type: "retenue_salariale",
      base: brutImposable,
      montantSalarial: impotMensuel,
      compteComptable: modele.comptesCles.etatImpots,
    });
  }

  // Acompte
  if (acomptesMois > 0) {
    lignes.push({
      libelle: "Acompte sur salaire déjà perçu",
      type: "retenue_salariale",
      base: acomptesMois,
      montantSalarial: acomptesMois,
      compteComptable: "4281",
    });
  }

  const totalRetenuesSalariales = totalCotisSalariales + impotMensuel + acomptesMois;
  const netAPayer = Math.max(0, salaireBrutTotal - totalRetenuesSalariales);
  const coutTotalEmployeur = salaireBrutTotal + totalCotisPatronales;

  return {
    collaborateurId: collab.id,
    matricule: collab.matricule,
    nomComplet: `${collab.prenom} ${collab.nom}`,
    poste: collab.poste,
    departement: collab.departement,
    categorie: collab.categorieConventionnelle || "Grille Nationale",
    statut: STATUTS_COLLABORATEUR[collab.statut] || collab.statut,
    paysCode: pays,
    devise: modele.devise,
    symboleDevise: modele.symboleDevise,
    periodeMois: mois,
    periodeAnnee: annee,
    periodeTexte,
    joursTravailles,
    joursOuvresMois,
    heuresNormales: modele.heuresNormalesMois,
    heuresSupp: totalHs,
    tauxHoraire,
    salaireBase: baseMois,
    sursalaire,
    primes,
    avantagesEnNature: avantages,
    heuresSuppMontant: montantHeuresSupp,
    indemniteTransport: transport,
    salaireBrutTotal,
    brutImposable,
    retenuesAbsences: retenueAbsence,
    totalRetenuesSalariales,
    netAPayer,
    totalChargesPatronales: totalCotisPatronales,
    coutTotalEmployeur,
    lignes,
  };
}

// Rétrocompatibilité avec les anciens modules de D-HOTEL
export const GRILLE_HOTEL_CONVENTION = MODELES_PAYS.SN.grilleConventionnelle;
export const REGIMES_IPRES = [
  { value: "general", label: "Régime Général" },
  { value: "cadre", label: "Régime Cadre" },
  { value: "exempte", label: "Exempté" },
];
