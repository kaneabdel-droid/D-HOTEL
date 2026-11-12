/**
 * Module d'Encaissement Direct sur Appareils & Comptes de l'Établissement (Zéro Agrégateur)
 * D-HÔTEL — Économie de 100% des frais de commission d'agrégateur (2% à 3.5% préservés)
 */

export interface CompteMarchandDirect {
  id: string;
  type: 'wave' | 'orange_money' | 'free_money' | 'tpe_banque';
  nom: string;
  numeroOuCode: string;
  banqueOuOperateur: string;
  pointDeVente: string;
  actif: boolean;
  qrCodeData?: string;
  instructions?: string;
}

export interface TransactionDirecte {
  id: string;
  date: string;
  heure: string;
  montant: number;
  devise: string;
  methode: 'wave' | 'orange_money' | 'free_money' | 'tpe_carte' | 'especes' | 'chambre';
  methodeLibelle: string;
  referenceExterne: string; // ID transaction Wave, ID Orange Money, N° Autorisation STAN TPE
  terminalOuCompteNom: string;
  clientNom: string;
  folioOuCommandeRef: string;
  pointDeVente: string;
  caissier: string;
  statut: 'valide' | 'annule';
  fraisAggregateurEconomises: number; // 2.5% du montant préservés
  notes?: string;
}

const STORAGE_KEY_COMPTES = 'dhotel_comptes_marchands_directs';
const STORAGE_KEY_TRANSACTIONS = 'dhotel_transactions_directes';

export const COMPTES_MARCHANDS_DEFAUT: CompteMarchandDirect[] = [
  {
    id: 'cpt-wave-1',
    type: 'wave',
    nom: 'Wave Marchand Réception & Général',
    numeroOuCode: '+221 77 120 00 00',
    banqueOuOperateur: 'Wave Business Sénégal',
    pointDeVente: 'Front-Desk & Réception',
    actif: true,
    qrCodeData: 'https://pay.wave.com/m/M_sn_terangapalace_reception',
    instructions: 'Scanner le QR Wave ou envoyer au numéro marchand direct de l’hôtel',
  },
  {
    id: 'cpt-om-1',
    type: 'orange_money',
    nom: 'Orange Money Marchand Principal',
    numeroOuCode: '584912',
    banqueOuOperateur: 'Orange Money Sénégal',
    pointDeVente: 'Front-Desk & Réception',
    actif: true,
    instructions: 'Composer #144#391*584912*Montant# ou scanner le QR code officiel de l’hôtel',
  },
  {
    id: 'cpt-tpe-cbao',
    type: 'tpe_banque',
    nom: 'TPE Bancaire Réception CBAO #01',
    numeroOuCode: 'TPE-CBAO-8812',
    banqueOuOperateur: 'CBAO Attijariwafa Bank (Visa / Mastercard / GIM-UEMOA)',
    pointDeVente: 'Front-Desk / Réception',
    actif: true,
    instructions: 'Insérer la carte bancaire sur le terminal CBAO de la réception et taper le montant',
  },
  {
    id: 'cpt-tpe-sgbs',
    type: 'tpe_banque',
    nom: 'TPE Bancaire Restaurant SGBS #02',
    numeroOuCode: 'TPE-SGBS-4401',
    banqueOuOperateur: 'Société Générale Sénégal (Visa / Mastercard / Contactless)',
    pointDeVente: 'Restaurant Principal',
    actif: true,
    instructions: 'Terminal mobile sans contact au restaurant pour addition à table',
  },
  {
    id: 'cpt-free-1',
    type: 'free_money',
    nom: 'Free Money Marchand',
    numeroOuCode: '90214',
    banqueOuOperateur: 'Free Money Sénégal',
    pointDeVente: 'Tous services',
    actif: false,
    instructions: 'Code Marchand Free Money direct',
  },
];

export const TRANSACTIONS_DIRECTES_DEFAUT: TransactionDirecte[] = [
  {
    id: 'TX-DIR-2026-001',
    date: '2026-11-12',
    heure: '14:25',
    montant: 171000,
    devise: 'XOF',
    methode: 'wave',
    methodeLibelle: 'Wave Direct Marchand (0% agrégateur)',
    referenceExterne: 'W-9842104819',
    terminalOuCompteNom: 'Wave Marchand Réception & Général',
    clientNom: 'M. Ibrahima Diop',
    folioOuCommandeRef: 'Chambre 101 (FACT-2026-00412)',
    pointDeVente: 'Front-Desk / Réception',
    caissier: 'Fatou Bintou Ndiaye',
    statut: 'valide',
    fraisAggregateurEconomises: 4275, // 171 000 * 2.5%
    notes: 'Paiement direct vérifié sur smartphone marchand réception',
  },
  {
    id: 'TX-DIR-2026-002',
    date: '2026-11-12',
    heure: '13:10',
    montant: 48500,
    devise: 'XOF',
    methode: 'orange_money',
    methodeLibelle: 'Orange Money Direct (Code 584912)',
    referenceExterne: 'MP261112.1310.B98214',
    terminalOuCompteNom: 'Orange Money Marchand Principal',
    clientNom: 'Table 4 (Restaurant)',
    folioOuCommandeRef: 'Commande POS #1042',
    pointDeVente: 'Restaurant Principal',
    caissier: 'Amadou Sow',
    statut: 'valide',
    fraisAggregateurEconomises: 1213,
    notes: 'Code marchand composé à table, SMS de validation reçu sur téléphone restaurant',
  },
  {
    id: 'TX-DIR-2026-003',
    date: '2026-11-12',
    heure: '11:45',
    montant: 900000,
    devise: 'XOF',
    methode: 'tpe_carte',
    methodeLibelle: 'TPE Carte Bancaire CBAO (STAN: 045129)',
    referenceExterne: 'STAN-045129 / AUTH-882190',
    terminalOuCompteNom: 'TPE Bancaire Réception CBAO #01',
    clientNom: 'Mme Sophie Martin',
    folioOuCommandeRef: 'Bungalow Plage 12 (FACT-2026-00413)',
    pointDeVente: 'Front-Desk / Réception',
    caissier: 'Fatou Bintou Ndiaye',
    statut: 'valide',
    fraisAggregateurEconomises: 22500, // 900 000 * 2.5% économisés !
    notes: 'Carte Visa Internationale sur TPE physique CBAO. Ticket archivé.',
  },
  {
    id: 'TX-DIR-2026-004',
    date: '2026-11-11',
    heure: '19:30',
    montant: 26000,
    devise: 'XOF',
    methode: 'tpe_carte',
    methodeLibelle: 'TPE Carte Bancaire SGBS (Sans Contact)',
    referenceExterne: 'STAN-019842 / AUTH-331200',
    terminalOuCompteNom: 'TPE Bancaire Restaurant SGBS #02',
    clientNom: 'Client Comptoir Bar',
    folioOuCommandeRef: 'Ticket Bar #408',
    pointDeVente: 'Bar & Paillote',
    caissier: 'Ousmane Diallo',
    statut: 'valide',
    fraisAggregateurEconomises: 650,
    notes: 'Paiement sans contact NFC Mastercard',
  },
];

export function getComptesMarchandsDirects(): CompteMarchandDirect[] {
  if (typeof window === 'undefined') return COMPTES_MARCHANDS_DEFAUT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPTES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Erreur lecture comptes marchands:', e);
  }
  return COMPTES_MARCHANDS_DEFAUT;
}

export function saveComptesMarchandsDirects(comptes: CompteMarchandDirect[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COMPTES, JSON.stringify(comptes));
  } catch (e) {
    console.warn('Erreur sauvegarde comptes marchands:', e);
  }
}

export function getTransactionsDirectes(): TransactionDirecte[] {
  if (typeof window === 'undefined') return TRANSACTIONS_DIRECTES_DEFAUT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Erreur lecture transactions directes:', e);
  }
  return TRANSACTIONS_DIRECTES_DEFAUT;
}

export function saveTransactionsDirectes(transactions: TransactionDirecte[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.warn('Erreur sauvegarde transactions directes:', e);
  }
}

export function enregistrerTransactionDirecte(
  data: Omit<TransactionDirecte, 'id' | 'date' | 'heure' | 'fraisAggregateurEconomises' | 'statut'>
): TransactionDirecte {
  const maintenant = new Date();
  const dateStr = maintenant.toISOString().split('T')[0];
  const heureStr = maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const idStr = `TX-DIR-${Date.now().toString().slice(-6)}`;
  const economies = Math.round(data.montant * 0.025); // 2.5% de frais d'agrégateur préservés

  const nouvelleTransaction: TransactionDirecte = {
    id: idStr,
    date: dateStr,
    heure: heureStr,
    statut: 'valide',
    fraisAggregateurEconomises: economies,
    ...data,
  };

  const existantes = getTransactionsDirectes();
  const misesAJour = [nouvelleTransaction, ...existantes];
  saveTransactionsDirectes(misesAJour);

  return nouvelleTransaction;
}

export function getTotalEconomiesAggregateurs(): {
  totalEconomise: number;
  totalVolumeDirect: number;
  nombreTransactions: number;
} {
  const transactions = getTransactionsDirectes().filter((t) => t.statut === 'valide');
  const totalVolumeDirect = transactions.reduce((acc, t) => acc + (t.montant || 0), 0);
  const totalEconomise = transactions.reduce((acc, t) => acc + (t.fraisAggregateurEconomises || 0), 0);
  return {
    totalEconomise,
    totalVolumeDirect,
    nombreTransactions: transactions.length,
  };
}
