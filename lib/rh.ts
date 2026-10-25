// d-hotel/lib/rh.ts
// Référentiels légaux, conventions collectives hôtellerie et moteur de calcul de la paie sénégalaise (OHADA / UEMOA)

export const STATUTS_COLLABORATEUR: Record<string, string> = {
  permanent: "Salarié Permanent",
  saisonnier: "Saisonnier (Haute Saison)",
  journalier: "Journalier / Extra Hôtelier",
  prestataire: "Prestataire Extérieur (BNC)",
};

export const TYPES_CONTRAT = [
  { value: "cdi", label: "Contrat à Durée Indéterminée (CDI)" },
  { value: "cdd", label: "Contrat à Durée Déterminée (CDD)" },
  { value: "saisonnier", label: "Contrat Saisonnier Hôtellerie" },
  { value: "journalier", label: "Contrat Journalier / Extra" },
  { value: "prestation", label: "Contrat de Prestation de Services (BNC)" },
  { value: "stage", label: "Convention de Stage Hôtelier" },
];

export const SITUATIONS_FAMILLE = [
  { value: "celibataire", label: "Célibataire" },
  { value: "marie", label: "Marié(e)" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf / Veuve" },
];

export const REGIMES_IPRES = [
  { value: "general", label: "Régime Général (Employé / Agent de Maîtrise)" },
  { value: "cadre", label: "Régime Cadre (Cadre / Direction)" },
  { value: "exempte", label: "Exempté (Prestataire BNC / Stagiaire)" },
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

// Grille de la Convention Collective Nationale de l'Hôtellerie du Sénégal
export interface CategorieConventionnelle {
  code: string;
  intitule: string;
  salaireBaseMinimal: number; // en FCFA
  tauxHoraireMinimal: number; // en FCFA (base 173.33 h/mois)
  exemplesPostes: string;
}

export const GRILLE_HOTEL_CONVENTION: CategorieConventionnelle[] = [
  {
    code: "CAT-1",
    intitule: "Catégorie 1 - Employé de service débutant",
    salaireBaseMinimal: 62500,
    tauxHoraireMinimal: 360,
    exemplesPostes: "Plongeur, Nettoyeur espaces communs, Portier débutant",
  },
  {
    code: "CAT-2",
    intitule: "Catégorie 2 - Manœuvre spécialisé",
    salaireBaseMinimal: 73000,
    tauxHoraireMinimal: 421,
    exemplesPostes: "Aide-lingère, Valet/Femme de chambre débutant(e), Aide-bagagiste",
  },
  {
    code: "CAT-3",
    intitule: "Catégorie 3 - Employé d'étage / Commis",
    salaireBaseMinimal: 87500,
    tauxHoraireMinimal: 505,
    exemplesPostes: "Femme de chambre qualifiée, Commis de cuisine, Garçon de café",
  },
  {
    code: "CAT-4",
    intitule: "Catégorie 4 - Ouvrier qualifié / Réceptionniste junior",
    salaireBaseMinimal: 108000,
    tauxHoraireMinimal: 623,
    exemplesPostes: "Réceptionniste junior, Demi-chef de rang, Cuisinier 2e échelon",
  },
  {
    code: "CAT-5",
    intitule: "Catégorie 5 - Réceptionniste confirmé / Barman / Chef de partie",
    salaireBaseMinimal: 135000,
    tauxHoraireMinimal: 779,
    exemplesPostes: "Réceptionniste bilingue, Barman mixologue, Chef de partie cuisine, Chauffeur VIP",
  },
  {
    code: "CAT-6",
    intitule: "Catégorie 6 - Chef de réception adjoint / Second de cuisine",
    salaireBaseMinimal: 175000,
    tauxHoraireMinimal: 1010,
    exemplesPostes: "Gouvernante d'étage, Second de cuisine, Maître d'hôtel junior",
  },
  {
    code: "CAT-7",
    intitule: "Catégorie 7 - Agent de maîtrise confirmé",
    salaireBaseMinimal: 225000,
    tauxHoraireMinimal: 1298,
    exemplesPostes: "Chef de Réception, Maître d'Hôtel confirmé, Technicien froid hôtelier",
  },
  {
    code: "CAT-8",
    intitule: "Catégorie 8 - Cadre intermédiaire",
    salaireBaseMinimal: 310000,
    tauxHoraireMinimal: 1788,
    exemplesPostes: "Gouvernante Générale, Chef Exécutif Pâtisserie, Responsable Réservations",
  },
  {
    code: "CAT-9",
    intitule: "Catégorie 9 - Cadre supérieur",
    salaireBaseMinimal: 450000,
    tauxHoraireMinimal: 2596,
    exemplesPostes: "Directeur Restauration (F&B), Chef Exécutif Cuisine, Responsable Technique",
  },
  {
    code: "CADRE-DIR",
    intitule: "Hors Catégorie - Direction & Cadre Dirigeant",
    salaireBaseMinimal: 750000,
    tauxHoraireMinimal: 4327,
    exemplesPostes: "Directeur d'Hébergement, Directeur Financier, Directeur Général d'Hôtel",
  },
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

export const MOIS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Barèmes légaux Sénégal
export const PARAMETRES_SOCIAUX_SN = {
  heuresNormalesMois: 173.33, // 40h/semaine
  indemniteTransportLegale: 26000, // Forfait légal non imposable à Dakar
  // Plafonds d'assiette
  plafondIpresGeneral: 432000, // 432 000 FCFA/mois
  plafondIpresCadreTrancheB: 1296000, // 1 296 000 FCFA/mois
  plafondCssFamille: 63000, // 63 000 FCFA/mois
  plafondCssAccident: 63000, // 63 000 FCFA/mois
  // Taux salariaux
  tauxIpresSalarieGeneral: 0.056, // 5.6%
  tauxIpresSalarieCadre: 0.064, // 6.4%
  tauxIpmSalarie: 0.03, // 3.0% (Institut Prévoyance Maladie)
  // Taux patronaux
  tauxIpresPatronalGeneral: 0.084, // 8.4%
  tauxIpresPatronalCadre: 0.096, // 9.6%
  tauxCssFamillePatronal: 0.07, // 7.0%
  tauxCssAccidentPatronal: 0.015, // 1.5% hôtellerie
  tauxIpmPatronal: 0.03, // 3.0%
  tauxCfcePatronal: 0.03, // 3.0% Contribution Forfaitaire Employeur
  // Prestataires BNC
  tauxVrsPrestataireResident: 0.05, // 5% Retenue à la source prestation
  tauxVrsPrestataireNonResident: 0.25, // 25% Retenue prestation non-résident
};

/**
 * Calcul des parts fiscales sénégalaises (Code Général des Impôts)
 * Célibataire : 1 part
 * Marié : 1.5 parts
 * + 0.5 part par enfant à charge
 * Plafond légal : 5 parts
 */
export function calculerPartsFiscales(situation: string, enfants: number = 0): number {
  let parts = situation === "marie" ? 1.5 : 1.0;
  parts += 0.5 * Math.max(0, enfants);
  return Math.min(5.0, Math.max(1.0, parts));
}

/**
 * Calcul TRIMF (Taxe Représentative de l'Impôt sur le Minimum Fiscal)
 * Par palier selon le revenu brut mensuel, multiplié par le nombre de charges de conjoint
 */
export function calculerTrimf(brutMensuel: number, nbConjoints: number = 0): number {
  let tarifBase = 0;
  if (brutMensuel < 50000) {
    tarifBase = 0;
  } else if (brutMensuel <= 100000) {
    tarifBase = 300;
  } else if (brutMensuel <= 150000) {
    tarifBase = 600;
  } else if (brutMensuel <= 200000) {
    tarifBase = 1000;
  } else if (brutMensuel <= 300000) {
    tarifBase = 1500;
  } else if (brutMensuel <= 500000) {
    tarifBase = 2500;
  } else if (brutMensuel <= 750000) {
    tarifBase = 4000;
  } else {
    tarifBase = 6000;
  }
  const coefficient = 1 + Math.max(0, nbConjoints);
  return tarifBase * coefficient;
}

/**
 * Calcul de la retenue mensuelle de l'Impôt sur le Revenu (IR progressif sénégalais)
 * Base annuelle = (Brut annuel - 30% d'abattement forfaitaire plafonné à 900 000 F)
 * Barème progressif annuel par tranches (0% à 40%)
 * Réduction d'impôt selon le nombre de parts fiscales (1 à 5 parts)
 */
export function calculerImpotRevenu(brutImposableMensuel: number, parts: number): number {
  if (brutImposableMensuel <= 0) return 0;

  // Calcul sur base annuelle pour conformité barème CGI
  const brutAnnuel = brutImposableMensuel * 12;
  
  // Abattement forfaitaire pour frais professionnels (30% plafonné à 900 000 FCFA/an)
  const abattement = Math.min(brutAnnuel * 0.3, 900000);
  const revenuNetImposableAnnuel = Math.max(0, brutAnnuel - abattement);

  // Barème progressif annuel sénégalais
  // Tranches annuelles :
  // 0 à 630 000 : 0%
  // 630 001 à 1 500 000 : 20%
  // 1 500 001 à 4 000 000 : 30%
  // 4 000 001 à 8 000 000 : 35%
  // Plus de 8 000 000 : 40%
  let impotBrutAnnuel = 0;
  if (revenuNetImposableAnnuel > 8000000) {
    impotBrutAnnuel += (revenuNetImposableAnnuel - 8000000) * 0.40;
    impotBrutAnnuel += (8000000 - 4000000) * 0.35;
    impotBrutAnnuel += (4000000 - 1500000) * 0.30;
    impotBrutAnnuel += (1500000 - 630000) * 0.20;
  } else if (revenuNetImposableAnnuel > 4000000) {
    impotBrutAnnuel += (revenuNetImposableAnnuel - 4000000) * 0.35;
    impotBrutAnnuel += (4000000 - 1500000) * 0.30;
    impotBrutAnnuel += (1500000 - 630000) * 0.20;
  } else if (revenuNetImposableAnnuel > 1500000) {
    impotBrutAnnuel += (revenuNetImposableAnnuel - 1500000) * 0.30;
    impotBrutAnnuel += (1500000 - 630000) * 0.20;
  } else if (revenuNetImposableAnnuel > 630000) {
    impotBrutAnnuel += (revenuNetImposableAnnuel - 630000) * 0.20;
  }

  // Réduction pour charges de famille selon parts fiscales
  // 1 part : 0%
  // 1.5 parts : 10%
  // 2 parts : 15%
  // 2.5 parts : 20%
  // 3 parts : 25%
  // 3.5 parts : 30%
  // 4 parts : 35%
  // 4.5 parts : 40%
  // 5 parts : 45%
  let reductionPct = 0;
  if (parts >= 5.0) reductionPct = 0.45;
  else if (parts >= 4.5) reductionPct = 0.40;
  else if (parts >= 4.0) reductionPct = 0.35;
  else if (parts >= 3.5) reductionPct = 0.30;
  else if (parts >= 3.0) reductionPct = 0.25;
  else if (parts >= 2.5) reductionPct = 0.20;
  else if (parts >= 2.0) reductionPct = 0.15;
  else if (parts >= 1.5) reductionPct = 0.10;

  const impotNetAnnuel = Math.max(0, impotBrutAnnuel * (1 - reductionPct));
  const impotMensuel = Math.round(impotNetAnnuel / 12);

  return impotMensuel;
}

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
  situationFamiliale: "celibataire" | "marie" | "divorce" | "veuf";
  nombreEnfants: number;
  nombreConjoints: number;
  partsIr: number;
  regimeIpres: "general" | "cadre" | "exempte";
  numeroIpres?: string;
  numeroCss?: string;
  categorieConventionnelle?: string;
  salaireBase: number;
  sursalaire: number;
  primesMensuelles: number;
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
}

export interface BulletinPaieCalcule {
  collaborateurId: string;
  matricule: string;
  nomComplet: string;
  poste: string;
  departement: string;
  categorie: string;
  statut: string;
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

/**
 * Calcul complet du bulletin de paie avec toutes les cotisations et retenues sénégalaises
 */
export function genererCalculBulletin(
  collab: CollaborateurRh,
  mois: number,
  annee: number,
  heuresSuppEffectuees: number = 0,
  joursAbsenceInjustifiee: number = 0,
  acomptesMois: number = 0
): BulletinPaieCalcule {
  const moisLibelle = MOIS_FR[mois - 1];
  const periodeTexte = `${moisLibelle} ${annee}`;
  const joursOuvresMois = 26;
  const joursTravailles = Math.max(0, joursOuvresMois - joursAbsenceInjustifiee);

  const baseMois = collab.salaireBase;
  const sursalaire = collab.sursalaire || 0;
  const primes = collab.primesMensuelles || 0;
  const transport = collab.indemniteTransport ?? PARAMETRES_SOCIAUX_SN.indemniteTransportLegale;
  
  const tauxHoraire = Math.round((baseMois + sursalaire) / PARAMETRES_SOCIAUX_SN.heuresNormalesMois);
  const montantHeuresSupp = Math.round(heuresSuppEffectuees * tauxHoraire * 1.30); // majoration moyenne 130%

  // Retenue sur salaire pour absence injustifiée
  const retenueAbsence = joursAbsenceInjustifiee > 0
    ? Math.round(((baseMois + sursalaire) / joursOuvresMois) * joursAbsenceInjustifiee)
    : 0;

  const salaireBrutTotal = baseMois + sursalaire + primes + transport + montantHeuresSupp - retenueAbsence;
  // Le transport dans la limite légale est exclu du brut imposable
  const brutImposable = Math.max(0, salaireBrutTotal - transport);

  const lignes: LigneBulletinDetail[] = [];

  // 1. Gains
  lignes.push({
    libelle: `Salaire de base conventionnel (${collab.categorieConventionnelle || "Grille"})`,
    type: "gain",
    base: baseMois,
    montantSalarial: baseMois,
  });

  if (sursalaire > 0) {
    lignes.push({
      libelle: "Sursalaire contractuel négocié",
      type: "gain",
      base: sursalaire,
      montantSalarial: sursalaire,
    });
  }

  if (primes > 0) {
    lignes.push({
      libelle: "Primes de fonction / responsabilité hôtelière",
      type: "gain",
      base: primes,
      montantSalarial: primes,
    });
  }

  if (montantHeuresSupp > 0) {
    lignes.push({
      libelle: `Heures supplémentaires hôtellerie (${heuresSuppEffectuees}h maj. 30%)`,
      type: "gain",
      base: heuresSuppEffectuees * tauxHoraire,
      taux: 30,
      montantSalarial: montantHeuresSupp,
    });
  }

  if (transport > 0) {
    lignes.push({
      libelle: "Indemnité légale de transport (exempte d'impôt)",
      type: "gain",
      base: transport,
      montantSalarial: transport,
    });
  }

  // 2. Absences
  if (retenueAbsence > 0) {
    lignes.push({
      libelle: `Déduction absence injustifiée (${joursAbsenceInjustifiee} j)`,
      type: "retenue_absence",
      base: retenueAbsence,
      montantSalarial: -retenueAbsence,
    });
  }

  // Pour les prestataires extérieurs (BNC) : retenue à la source spécifique
  if (collab.statut === "prestataire") {
    const retenueVrs = Math.round(brutImposable * PARAMETRES_SOCIAUX_SN.tauxVrsPrestataireResident);
    lignes.push({
      libelle: "Retenue à la source BNC / Prestataire (VRS 5%)",
      type: "retenue_salariale",
      base: brutImposable,
      taux: 5,
      montantSalarial: retenueVrs,
    });

    const netPrestataire = salaireBrutTotal - retenueVrs - acomptesMois;
    return {
      collaborateurId: collab.id,
      matricule: collab.matricule,
      nomComplet: `${collab.prenom} ${collab.nom}`,
      poste: collab.poste,
      departement: collab.departement,
      categorie: collab.categorieConventionnelle || "Prestataire BNC",
      statut: "Prestataire Extérieur (BNC)",
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
      heuresSuppMontant: 0,
      indemniteTransport: transport,
      salaireBrutTotal,
      brutImposable,
      retenuesAbsences: 0,
      totalRetenuesSalariales: retenueVrs + acomptesMois,
      netAPayer: netPrestataire,
      totalChargesPatronales: 0,
      coutTotalEmployeur: salaireBrutTotal,
      lignes,
    };
  }

  // 3. Retenues salariales & Charges patronales
  // IPRES Général (plafonné à 432 000 F)
  const assietteIpresGen = Math.min(brutImposable, PARAMETRES_SOCIAUX_SN.plafondIpresGeneral);
  const ipresSalGen = Math.round(assietteIpresGen * PARAMETRES_SOCIAUX_SN.tauxIpresSalarieGeneral);
  const ipresPatGen = Math.round(assietteIpresGen * PARAMETRES_SOCIAUX_SN.tauxIpresPatronalGeneral);

  lignes.push({
    libelle: "IPRES Régime Général (Salarié 5.6% / Patronal 8.4%)",
    type: "retenue_salariale",
    base: assietteIpresGen,
    taux: 5.6,
    montantSalarial: ipresSalGen,
    montantPatronal: ipresPatGen,
  });

  // IPRES Cadre (si statut cadre et dépassement plafond 432 000 F jusqu'à 1 296 000 F)
  let ipresSalCadre = 0;
  let ipresPatCadre = 0;
  if (collab.regimeIpres === "cadre" && brutImposable > PARAMETRES_SOCIAUX_SN.plafondIpresGeneral) {
    const assietteCadre = Math.min(
      brutImposable - PARAMETRES_SOCIAUX_SN.plafondIpresGeneral,
      PARAMETRES_SOCIAUX_SN.plafondIpresCadreTrancheB - PARAMETRES_SOCIAUX_SN.plafondIpresGeneral
    );
    ipresSalCadre = Math.round(assietteCadre * PARAMETRES_SOCIAUX_SN.tauxIpresSalarieCadre);
    ipresPatCadre = Math.round(assietteCadre * PARAMETRES_SOCIAUX_SN.tauxIpresPatronalCadre);

    lignes.push({
      libelle: "IPRES Régime Complémentaire Cadres (Tranche B)",
      type: "retenue_salariale",
      base: assietteCadre,
      taux: 6.4,
      montantSalarial: ipresSalCadre,
      montantPatronal: ipresPatCadre,
    });
  }

  // IPM (Institut Prévoyance Maladie)
  const ipmSal = Math.round(brutImposable * PARAMETRES_SOCIAUX_SN.tauxIpmSalarie);
  const ipmPat = Math.round(brutImposable * PARAMETRES_SOCIAUX_SN.tauxIpmPatronal);
  lignes.push({
    libelle: "IPM Santé & Médicale (Part Salariée 3% / Employeur 3%)",
    type: "retenue_salariale",
    base: brutImposable,
    taux: 3.0,
    montantSalarial: ipmSal,
    montantPatronal: ipmPat,
  });

  // Caisse de Sécurité Sociale (CSS - Patronal uniquement)
  const assietteCss = Math.min(brutImposable, PARAMETRES_SOCIAUX_SN.plafondCssFamille);
  const cssFamillePat = Math.round(assietteCss * PARAMETRES_SOCIAUX_SN.tauxCssFamillePatronal);
  const cssAccidentPat = Math.round(assietteCss * PARAMETRES_SOCIAUX_SN.tauxCssAccidentPatronal);

  lignes.push({
    libelle: "CSS Prestations Familiales (Plafond 63 000 FCFA)",
    type: "charge_patronale",
    base: assietteCss,
    taux: 7.0,
    montantSalarial: 0,
    montantPatronal: cssFamillePat,
  });

  lignes.push({
    libelle: "CSS Accidents du Travail & Risques Pro Hôtellerie",
    type: "charge_patronale",
    base: assietteCss,
    taux: 1.5,
    montantSalarial: 0,
    montantPatronal: cssAccidentPat,
  });

  // CFCE (Contribution Forfaitaire à la Charge des Employeurs 3%)
  const cfcePat = Math.round(brutImposable * PARAMETRES_SOCIAUX_SN.tauxCfcePatronal);
  lignes.push({
    libelle: "CFCE Employeur (3.0% sur brut imposable)",
    type: "charge_patronale",
    base: brutImposable,
    taux: 3.0,
    montantSalarial: 0,
    montantPatronal: cfcePat,
  });

  // Fiscalité : TRIMF
  const trimf = calculerTrimf(brutImposable, collab.nombreConjoints);
  lignes.push({
    libelle: `TRIMF (Taxe Représentative Impôt Min. Fiscal - ${1 + collab.nombreConjoints} part(s))`,
    type: "retenue_salariale",
    base: brutImposable,
    montantSalarial: trimf,
  });

  // Fiscalité : Impôt sur le Revenu (IR)
  const partsFiscales = collab.partsIr || calculerPartsFiscales(collab.situationFamiliale, collab.nombreEnfants);
  const impotRevenu = calculerImpotRevenu(brutImposable, partsFiscales);
  lignes.push({
    libelle: `Retenue IR (Impôt sur le Revenu - ${partsFiscales} part(s) fiscale(s))`,
    type: "retenue_salariale",
    base: brutImposable,
    montantSalarial: impotRevenu,
  });

  // Acompte éventuel
  if (acomptesMois > 0) {
    lignes.push({
      libelle: "Acompte sur salaire déjà perçu",
      type: "retenue_salariale",
      base: acomptesMois,
      montantSalarial: acomptesMois,
    });
  }

  const totalRetenuesSalariales =
    ipresSalGen + ipresSalCadre + ipmSal + trimf + impotRevenu + acomptesMois;
  const netAPayer = Math.max(0, salaireBrutTotal - totalRetenuesSalariales);

  const totalChargesPatronales =
    ipresPatGen + ipresPatCadre + ipmPat + cssFamillePat + cssAccidentPat + cfcePat;
  const coutTotalEmployeur = salaireBrutTotal + totalChargesPatronales;

  return {
    collaborateurId: collab.id,
    matricule: collab.matricule,
    nomComplet: `${collab.prenom} ${collab.nom}`,
    poste: collab.poste,
    departement: collab.departement,
    categorie: collab.categorieConventionnelle || "Catégorie Hôtelière",
    statut: STATUTS_COLLABORATEUR[collab.statut] || collab.statut,
    periodeMois: mois,
    periodeAnnee: annee,
    periodeTexte,
    joursTravailles,
    joursOuvresMois,
    heuresNormales: PARAMETRES_SOCIAUX_SN.heuresNormalesMois,
    heuresSupp: heuresSuppEffectuees,
    tauxHoraire,
    salaireBase: baseMois,
    sursalaire,
    primes,
    heuresSuppMontant: montantHeuresSupp,
    indemniteTransport: transport,
    salaireBrutTotal,
    brutImposable,
    retenuesAbsences: retenueAbsence,
    totalRetenuesSalariales,
    netAPayer,
    totalChargesPatronales,
    coutTotalEmployeur,
    lignes,
  };
}
