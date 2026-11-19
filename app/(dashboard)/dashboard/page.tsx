"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Hotel,
  TrendingUp,
  Users,
  Coins,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  LogOut,
  LogIn,
  AlertTriangle,
  Clock,
  UtensilsCrossed,
  Compass,
  Building,
  CheckCircle2,
  PlusCircle,
  BedDouble,
  Wallet,
  Receipt,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { loadHotelData } from "@/lib/hotel-storage";

interface Chambre {
  id: string;
  numero: string;
  etage: string;
  batiment: string;
  typeId: string;
  typeNom: string;
  prixBase: number;
  capaciteAdultes: number;
  capaciteEnfants: number;
  statutOccupation: "libre" | "occupee" | "reservee";
  statutMenage: "propre" | "en_cours" | "a_nettoyer" | "hors_service";
}

interface Reservation {
  id: string;
  code: string;
  client: string;
  telephone: string;
  chambre: string;
  typeChambre: string;
  dateArrivee: string;
  dateDepart: string;
  nuits: number;
  personnes: string;
  montantTotal: number;
  acompteVerse: number;
  soldeRestant: number;
  statut: "confirmee" | "en_attente" | "annulee" | "terminee";
  heureArriveePrevue?: string;
  modePaiement?: string;
}

interface ClientCRM {
  id: string;
  civilite: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  nationalite: string;
  categorie: "VIP Gold" | "Entreprise" | "Particulier" | "Diplomate";
  nbSejours: number;
  dateCreation?: string;
}

interface TransactionItem {
  id: string;
  date: string;
  heure: string;
  montant: number;
  methodeLibelle: string;
  motif: string;
  client: string;
}

const DEFAULT_CHAMBRES: Chambre[] = [
  { id: "1", numero: "101", etage: "RDC", batiment: "Principal", typeId: "std", typeNom: "Chambre Standard", prixBase: 45000, capaciteAdultes: 2, capaciteEnfants: 0, statutOccupation: "occupee", statutMenage: "propre" },
  { id: "2", numero: "102", etage: "RDC", batiment: "Principal", typeId: "std", typeNom: "Chambre Standard", prixBase: 45000, capaciteAdultes: 2, capaciteEnfants: 1, statutOccupation: "libre", statutMenage: "propre" },
  { id: "3", numero: "103", etage: "1er étage", batiment: "Principal", typeId: "dlx", typeNom: "Chambre Deluxe Balcon", prixBase: 65000, capaciteAdultes: 2, capaciteEnfants: 1, statutOccupation: "occupee", statutMenage: "propre" },
  { id: "4", numero: "201", etage: "2e étage", batiment: "Aile Ouest", typeId: "dlx", typeNom: "Chambre Deluxe Vue Mer", prixBase: 75000, capaciteAdultes: 2, capaciteEnfants: 1, statutOccupation: "reservee", statutMenage: "propre" },
  { id: "5", numero: "202", etage: "2e étage", batiment: "Aile Ouest", typeId: "dlx", typeNom: "Chambre Deluxe Vue Mer", prixBase: 75000, capaciteAdultes: 2, capaciteEnfants: 0, statutOccupation: "libre", statutMenage: "a_nettoyer" },
  { id: "6", numero: "301", etage: "3e étage", batiment: "Panoramique", typeId: "ste", typeNom: "Suite Junior Prestige", prixBase: 120000, capaciteAdultes: 2, capaciteEnfants: 2, statutOccupation: "occupee", statutMenage: "propre" },
  { id: "7", numero: "401", etage: "Penthouse", batiment: "Panoramique", typeId: "pres", typeNom: "Suite Présidentielle", prixBase: 250000, capaciteAdultes: 4, capaciteEnfants: 2, statutOccupation: "reservee", statutMenage: "propre" },
  { id: "8", numero: "B01", etage: "Plage", batiment: "Bungalows", typeId: "bung", typeNom: "Bungalow Pieds dans l'Eau", prixBase: 95000, capaciteAdultes: 2, capaciteEnfants: 1, statutOccupation: "occupee", statutMenage: "en_cours" },
];

const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: "res-1",
    code: "RES-EX-00421",
    client: "M. Ibrahima Diop",
    telephone: "+221 77 450 12 34",
    chambre: "Chambre 101",
    typeChambre: "Chambre Standard",
    dateArrivee: "2026-11-15",
    dateDepart: "2026-11-18",
    nuits: 3,
    personnes: "2 adultes",
    montantTotal: 135000,
    acompteVerse: 135000,
    soldeRestant: 0,
    statut: "confirmee",
    heureArriveePrevue: "14h30",
    modePaiement: "Wave",
  },
  {
    id: "res-2",
    code: "RES-EX-00422",
    client: "Mme Sophie Martin",
    telephone: "+33 6 12 34 56 78",
    chambre: "Bungalow B01",
    typeChambre: "Bungalow Vue Mer",
    dateArrivee: "2026-11-15",
    dateDepart: "2026-11-20",
    nuits: 5,
    personnes: "1 adulte",
    montantTotal: 475000,
    acompteVerse: 250000,
    soldeRestant: 225000,
    statut: "confirmee",
    heureArriveePrevue: "15h00",
    modePaiement: "Carte Bancaire",
  },
  {
    id: "res-3",
    code: "RES-EX-00423",
    client: "Ambassadeur M. Jean-Luc Dubois",
    telephone: "+33 6 88 99 00 11",
    chambre: "Suite Panoramique 301",
    typeChambre: "Suite Junior Prestige",
    dateArrivee: "2026-11-16",
    dateDepart: "2026-11-22",
    nuits: 6,
    personnes: "2 adultes",
    montantTotal: 720000,
    acompteVerse: 720000,
    soldeRestant: 0,
    statut: "confirmee",
    heureArriveePrevue: "18h00",
    modePaiement: "Virement Bancaire",
  },
  {
    id: "res-4",
    code: "RES-EX-00424",
    client: "Mme Marième Sow",
    telephone: "+221 78 555 43 21",
    chambre: "Chambre 103",
    typeChambre: "Chambre Deluxe Balcon",
    dateArrivee: "2026-11-17",
    dateDepart: "2026-11-19",
    nuits: 2,
    personnes: "2 adultes + 1 enfant",
    montantTotal: 130000,
    acompteVerse: 70000,
    soldeRestant: 60000,
    statut: "confirmee",
    heureArriveePrevue: "13h00",
    modePaiement: "Orange Money",
  },
];

const DEFAULT_CLIENTS: ClientCRM[] = [
  { id: "cli-1", civilite: "M.", nom: "DIOP", prenom: "Ibrahima", telephone: "+221 77 450 12 34", email: "i.diop@telecom-sn.com", nationalite: "Sénégalaise", categorie: "VIP Gold", nbSejours: 6, dateCreation: "2026-10-10" },
  { id: "cli-2", civilite: "Mme", nom: "MARTIN", prenom: "Sophie", telephone: "+33 6 12 34 56 78", email: "sophie.martin@paris-conseil.fr", nationalite: "Française", categorie: "Particulier", nbSejours: 2, dateCreation: "2026-10-15" },
  { id: "cli-3", civilite: "S.E.", nom: "DUBOIS", prenom: "Jean-Luc", telephone: "+33 6 88 99 00 11", email: "jldubois@diplomatie.eu", nationalite: "Belge", categorie: "Diplomate", nbSejours: 4, dateCreation: "2026-09-01" },
  { id: "cli-4", civilite: "Mme", nom: "SOW", prenom: "Marième", telephone: "+221 78 555 43 21", email: "m.sow@banque-atlantique.sn", nationalite: "Sénégalaise", categorie: "Entreprise", nbSejours: 8, dateCreation: "2026-08-12" },
];

const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  { id: "tx-1", date: "Aujourd'hui", heure: "11h20", montant: 135000, methodeLibelle: "Wave Direct", motif: "Règlement Séjour - Ch. 101", client: "Ibrahima Diop" },
  { id: "tx-2", date: "Aujourd'hui", heure: "10h45", montant: 250000, methodeLibelle: "TPE Carte Bancaire", motif: "Acompte Séjour - Bung. B01", client: "Sophie Martin" },
  { id: "tx-3", date: "Aujourd'hui", heure: "09h15", montant: 720000, methodeLibelle: "Virement Direct", motif: "Règlement Suite 301 - S.E. Dubois", client: "Jean-Luc Dubois" },
  { id: "tx-4", date: "Hier", heure: "19h30", montant: 42500, methodeLibelle: "Orange Money Direct", motif: "Addition Restaurant Teranga", client: "Marième Sow" },
];

export default function DashboardPage() {
  const { t, isRTL } = useTranslation();

  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<ClientCRM[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isExemple, setIsExemple] = useState(false);

  useEffect(() => {
    const chData = loadHotelData<Chambre>("dhotel_chambres", DEFAULT_CHAMBRES);
    const resData = loadHotelData<Reservation>("dhotel_reservations", DEFAULT_RESERVATIONS);
    const cliData = loadHotelData<ClientCRM>("dhotel_clients", DEFAULT_CLIENTS);

    setChambres(chData.items);
    setReservations(resData.items);
    setClients(cliData.items);
    setTransactions(DEFAULT_TRANSACTIONS);
    setIsExemple(chData.isExempleFiligrane);
  }, []);

  // Calculs dynamiques d'exploitation
  const totalChambres = chambres.length > 0 ? (isExemple ? 46 : chambres.length) : 46;
  const chambresOccupees = chambres.length > 0 ? (isExemple ? 34 : chambres.filter(c => c.statutOccupation === "occupee").length) : 34;
  const chambresLibresPropres = chambres.length > 0 ? (isExemple ? 6 : chambres.filter(c => c.statutOccupation === "libre" && c.statutMenage === "propre").length) : 6;
  const chambresNettoyage = chambres.length > 0 ? (isExemple ? 4 : chambres.filter(c => c.statutMenage === "en_cours" || c.statutMenage === "a_nettoyer").length) : 4;
  const chambresMaintenance = chambres.length > 0 ? (isExemple ? 2 : chambres.filter(c => c.statutMenage === "hors_service").length) : 2;

  const tauxOccupation = totalChambres > 0 ? Math.round((chambresOccupees / totalChambres) * 100) : 0;
  const pctLibre = Math.round((chambresLibresPropres / totalChambres) * 100);
  const pctOccupe = Math.round((chambresOccupees / totalChambres) * 100);
  const pctNettoyage = Math.round((chambresNettoyage / totalChambres) * 100);
  const pctMaintenance = Math.max(0, 100 - pctLibre - pctOccupe - pctNettoyage);

  const arriveesDuJour = isExemple ? 12 : reservations.filter(r => r.statut === "confirmee").length;
  const departsDuJour = isExemple ? 7 : Math.max(1, Math.round(arriveesDuJour * 0.6));
  const caJour = 4120000;

  return (
    <div className="space-y-6">
      {/* ── BANNIÈRE D'ACCUEIL & ACTIONS RAPIDES ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Hotel className="w-3.5 h-3.5" />
            <span>Exploitation Hôtelière Ouverte</span>
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground">
            {t("dashboard.title") || "Tableau de Bord Hôtelier"}
          </h2>
          <p className="text-sm text-foreground-muted">
            {t("dashboard.subtitle") || "Vue d'ensemble en temps réel des flux d'hébergement, arrivées, départs et trésorerie."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/hebergements/reservations"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Réservation</span>
          </Link>

          <Link
            href="/hebergements/rack"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:brightness-105 shadow-sm transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Planning Rack</span>
          </Link>

          <Link
            href="/tresorerie/caisses"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-surface-border bg-surface text-foreground text-xs font-semibold hover:bg-background transition-all"
          >
            <Coins className="w-4 h-4" />
            <span>Caisses Front-Desk</span>
          </Link>
        </div>
      </div>

      {/* Message de bienvenue établissement neuf */}
      {isExemple && (
        <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Bienvenue dans votre établissement hôtelier !</p>
              <p className="text-foreground-muted mt-0.5">
                Votre cockpit est prêt. Des données de référence sont affichées en filigrane. Dès l&apos;enregistrement de vos premières chambres, réservations et encaissements, vos statistiques en direct s&apos;afficheront automatiquement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 4 INDICATEURS CLÉS (TOP KPI CARDS) ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 : Taux d'Occupation */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              {t("dashboard.kpi_occupancy") || "Taux d'Occupation"}
            </span>
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Hotel className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2">
            {tauxOccupation}%
          </p>
          <div className="w-full bg-surface-border h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${tauxOccupation}%` }}
            />
          </div>
          <span className="text-xs text-foreground-muted mt-1 block font-medium">
            {chambresOccupees} / {totalChambres} chambres louées
          </span>
        </div>

        {/* KPI 2 : Arrivées & Départs du Jour */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              Mouvements du Jour
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2">
            {arriveesDuJour} <span className="text-xs font-normal text-foreground-muted">arrivées</span>
          </p>
          <span className="text-xs text-foreground-muted mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {departsDuJour} départs prévus aujourd&apos;hui
          </span>
        </div>

        {/* KPI 3 : Disponibilité Immédiate */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              Chambres Disponibles
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2">
            {chambresLibresPropres} <span className="text-xs font-normal text-foreground-muted">prêtes</span>
          </p>
          <span className="text-xs text-foreground-muted mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Propres & prêtes à louer immédiatement
          </span>
        </div>

        {/* KPI 4 : Recettes du Jour (CA Réalisé) */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              {t("dashboard.kpi_revenue_today") || "Recettes du Jour"}
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2 truncate">
            {formatXOF(caJour)}
          </p>
          <span className="text-xs text-amber-600 font-bold block mt-1">
            Encaissements directs & règlements
          </span>
        </div>
      </div>

      {/* ── 2 WIDGETS ANALYTIQUES & OPÉRATIONNELS ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Widget 1 : État du Parc de Chambres & Housekeeping */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-surface-border bg-background/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {t("dashboard.room_status_overview") || "État du Parc & Gouvernance"}
                </h3>
                <p className="text-xs text-foreground-muted">Disponibilité, propreté et maintenance des étages</p>
              </div>
            </div>
            <Link href="/hebergements/chambres" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Gestion chambres <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </Link>
          </div>

          <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
            {/* Chiffres Globaux */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-xl p-4 border border-surface-border">
                <span className="text-xs font-medium text-foreground-muted block">Propres & Libres</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                  {chambresLibresPropres} <span className="text-xs font-normal text-foreground-muted">chambres</span>
                </span>
                <span className="text-[11px] text-foreground-muted">Prêtes pour attribution</span>
              </div>
              <div className="bg-background rounded-xl p-4 border border-surface-border">
                <span className="text-xs font-medium text-foreground-muted block">En Cours de Séjour</span>
                <span className="text-2xl font-extrabold text-primary mt-1 block">
                  {chambresOccupees} <span className="text-xs font-normal text-foreground-muted">occupées</span>
                </span>
                <span className="text-[11px] text-foreground-muted">{tauxOccupation}% de taux d&apos;occupation</span>
              </div>
            </div>

            {/* Barre de répartition de la capacité */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-foreground">Répartition du Parc ({totalChambres} clés)</span>
                <span className="text-emerald-600 font-bold">{chambresLibresPropres} disponibles</span>
              </div>
              <div className="w-full h-3.5 bg-surface-border rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${pctLibre}%` }} className="bg-emerald-500 transition-all duration-500" title={`Libres: ${pctLibre}%`} />
                <div style={{ width: `${pctOccupe}%` }} className="bg-primary transition-all duration-500" title={`Occupées: ${pctOccupe}%`} />
                <div style={{ width: `${pctNettoyage}%` }} className="bg-amber-400 transition-all duration-500" title={`Nettoyage: ${pctNettoyage}%`} />
                <div style={{ width: `${pctMaintenance}%` }} className="bg-rose-500 transition-all duration-500" title={`Maintenance: ${pctMaintenance}%`} />
              </div>
              <div className="flex items-center gap-4 text-[11px] font-medium mt-2 text-foreground-muted">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Libres ({chambresLibresPropres})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Occupées ({chambresOccupees})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Ménage ({chambresNettoyage})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Panne ({chambresMaintenance})</span>
              </div>
            </div>

            {/* Badges d'alerte et de service */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-border/60">
              <div className="p-3 rounded-xl border bg-background border-surface-border text-foreground-muted flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight text-foreground">Standard Gouvernance 5★</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Audit de propreté certifié</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-background border-surface-border text-foreground-muted flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight text-foreground">Conciergerie & Front-Desk</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Service ouvert 24h/24</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2 : Flux des Arrivées du Jour (Check-in attendus) */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-surface-border bg-background/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {t("dashboard.upcoming_arrivals") || "Arrivées Attendues Aujourd'hui"}
                </h3>
                <p className="text-xs text-foreground-muted">Check-in et accueil personnalisé des clients</p>
              </div>
            </div>
            <Link href="/hebergements/arrivees-departs" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Tous les flux <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </Link>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="divide-y divide-surface-border/60">
              {DEFAULT_RESERVATIONS.slice(0, 4).map((r) => (
                <div key={r.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-xs sm:text-sm truncate">{r.client}</span>
                        <span className="text-[11px] text-foreground-muted shrink-0">({r.personnes})</span>
                        <span className="font-mono text-[10px] text-primary shrink-0">{r.code}</span>
                      </div>
                      <p className="text-[11px] text-foreground-muted truncate">
                        {r.chambre} • {r.nuits} nuits • Acompte : {r.modePaiement || "Wave"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] shrink-0 self-end sm:self-auto flex items-center gap-2">
                    <span className="font-medium text-foreground-muted">Arrivée : {r.heureArriveePrevue || "14h00"}</span>
                    <Link
                      href="/hebergements/arrivees-departs"
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all"
                    >
                      Check-in
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <span className="text-xs text-foreground-muted">
                {arriveesDuJour} arrivées programmées pour la journée
              </span>
              <Link href="/hebergements/rack" className="text-xs font-bold text-primary hover:underline">
                Accéder au Rack Interactif ➔
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 COLONNES OPÉRATIONNELLES (TRÉSORERIE, DERNIERS RÈGLEMENTS, DERNIERS CLIENTS) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne 1 : Aperçu Financier Global & Caisse */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-surface-border bg-background/50">
            <h3 className="text-lg font-semibold leading-6 text-foreground">Trésorerie & Caisses du Jour</h3>
            <p className="text-xs text-foreground-muted mt-0.5">Encaissements hébergement, restauration & TPE</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-surface space-y-6">
            <div className="space-y-4">
              {/* Encart Caisse Principale */}
              <div className="p-4 rounded-xl bg-background border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground">Caisse Réception & Front-Desk</span>
                      <span className="text-[10px] text-foreground-muted block">Espèces, Wave & TPE Carte</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold font-heading text-foreground">
                    {formatXOF(caJour)}
                  </span>
                  <span className="text-xs text-foreground-muted block mt-1">
                    Recettes cumulées de la journée en cours
                  </span>
                </div>
              </div>

              {/* Ventilation Restauration & Activités */}
              <div className="p-4 rounded-xl bg-background border border-surface-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                      <UtensilsCrossed className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Restauration, Bar & MICE</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 font-mono">
                    {formatXOF(980000)}
                  </span>
                </div>
                <p className="text-[11px] text-foreground-muted mt-1">
                  Points de vente POS & séminaires ouverts
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <Link
                href="/tresorerie/caisses"
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Accéder au journal de caisse <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Colonne 2 : Derniers Encaissements & Règlements */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-surface-border bg-background/50">
            <h3 className="text-lg font-semibold leading-6 text-foreground">Derniers Règlements Encaissés</h3>
            <p className="text-xs text-foreground-muted mt-0.5">Transactions directes sans commission d&apos;agrégateur</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-surface">
            <div className="divide-y divide-surface-border">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate" title={tx.client}>
                      {tx.client}
                    </p>
                    <div className="text-xs text-foreground-muted mt-0.5 flex items-center gap-2">
                      <span>{tx.heure}</span>
                      <span>• {tx.methodeLibelle}</span>
                      <span className="truncate hidden sm:inline">({tx.motif})</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      +{tx.montant.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border">
              <Link
                href="/tresorerie/encaissements-directs"
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Voir tous les encaissements <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Colonne 3 : Derniers Clients Enregistrés */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-surface-border bg-background/50">
            <h3 className="text-lg font-semibold leading-6 text-foreground">Derniers Clients Enregistrés</h3>
            <p className="text-xs text-foreground-muted mt-0.5">Fiches hôtes et profils CRM récents</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-surface">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {clients.slice(0, 5).map((cli, idx) => (
                  <li key={cli.id || idx} className="relative pb-8">
                    {idx !== Math.min(clients.length, 5) - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-surface-border" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-surface text-primary">
                          <Users className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {cli.civilite} {cli.prenom} {cli.nom}
                          </p>
                          <p className="text-xs text-foreground-muted truncate">
                            {cli.categorie} • {cli.nationalite}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs text-foreground-muted">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                            {cli.nbSejours} séjours
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border">
              <Link href="/clients" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                Voir l&apos;annuaire clients <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
