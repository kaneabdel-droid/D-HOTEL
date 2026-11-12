export interface SousMenuItem {
  titre: string;
  href: string;
  key?: string;
  badge?: string | number;
}

export interface MenuItem {
  id: string;
  titre: string;
  icone: string;
  key?: string;
  href?: string;
  badge?: string | number;
  items?: SousMenuItem[];
  rolesAutorises?: string[];
}

export const SECTIONS_MENUS: MenuItem[] = [
  {
    id: "dashboard",
    titre: "Tableau de Bord",
    key: "nav.dashboard",
    icone: "LayoutDashboard",
    href: "/dashboard",
  },
  {
    id: "reception",
    titre: "Front-Desk & Chambres",
    key: "nav.hebergements",
    icone: "Hotel",
    items: [
      { titre: "Rack Interactif (Gantt)", href: "/hebergements/rack", key: "nav.rack" },
      { titre: "Réservations", href: "/hebergements/reservations", key: "nav.reservations" },
      { titre: "Arrivées & Départs", href: "/hebergements/arrivees-departs", key: "nav.arrivees_departs" },
      { titre: "Chambres & Grille Tarifaire", href: "/hebergements/chambres", key: "nav.chambres" },
      { titre: "Fiches de Police", href: "/hebergements/police", key: "nav.police" },
    ],
  },
  {
    id: "gouvernance",
    titre: "Gouvernance & Ménage",
    key: "nav.gouvernance",
    icone: "Sparkles",
    items: [
      { titre: "Statut des Chambres", href: "/gouvernance", key: "nav.statut_chambres" },
      { titre: "Minibar & Lingerie", href: "/gouvernance/minibar", key: "nav.minibar_lingerie" },
      { titre: "Maintenance & Pannes", href: "/gouvernance/maintenance", key: "nav.maintenance" },
    ],
  },
  {
    id: "restauration",
    titre: "Restauration & Bars",
    key: "nav.restauration",
    icone: "UtensilsCrossed",
    items: [
      { titre: "Caisse Tactile (Touch POS)", href: "/restauration/pos", key: "nav.pos" },
      { titre: "Écran Cuisine (KDS)", href: "/restauration/kds", key: "nav.kds" },
      { titre: "Cartes, Menus & Recettes", href: "/restauration/menus", key: "nav.menus" },
    ],
  },
  {
    id: "evenements",
    titre: "MICE, Salles & Piscine",
    key: "nav.evenements",
    icone: "Building",
    items: [
      { titre: "Salles & Séminaires", href: "/evenements/salles", key: "nav.salles" },
      { titre: "Billetterie Piscine (Day-Pass)", href: "/evenements/piscine", key: "nav.piscine" },
      { titre: "Spectacles & Soirées", href: "/evenements/spectacles", key: "nav.spectacles" },
    ],
  },
  {
    id: "loisirs",
    titre: "Excursions & Randonnées",
    key: "nav.loisirs",
    icone: "Compass",
    items: [
      { titre: "Planning des Sorties", href: "/loisirs/excursions", key: "nav.excursions" },
      { titre: "Guides & Matériel", href: "/loisirs/ressources", key: "nav.ressources" },
    ],
  },
  {
    id: "economat",
    titre: "Économat & Stocks",
    key: "nav.economat",
    icone: "Package",
    items: [
      { titre: "Stocks Multi-Dépôts", href: "/economat/stocks", key: "nav.stocks" },
      { titre: "Commandes & Fournisseurs", href: "/economat/achats", key: "nav.achats" },
    ],
  },
  {
    id: "crm",
    titre: "Fichier Clients (CRM)",
    key: "nav.clients",
    icone: "Users",
    href: "/clients",
  },
  {
    id: "tresorerie",
    titre: "Caisses & Trésorerie",
    key: "nav.tresorerie",
    icone: "Coins",
    items: [
      { titre: "Sessions de Caisse", href: "/tresorerie/caisses", key: "nav.caisses" },
      { titre: "Factures & Folios", href: "/tresorerie/factures", key: "nav.factures" },
      { titre: "Encaissements Directs & TPE", href: "/tresorerie/encaissements-directs", key: "nav.encaissements_directs" },
    ],
  },
  {
    id: "personnel",
    titre: "Personnel & RH",
    key: "nav.personnel",
    icone: "UserCheck",
    items: [
      { titre: "Planning des Quarts (Shifts)", href: "/personnel", key: "nav.shifts" },
      { titre: "Salariés & Prestataires", href: "/personnel/salaries", key: "nav.salaries" },
      { titre: "Contrats & Conventions", href: "/personnel/contrats", key: "nav.contrats" },
      { titre: "Pointage & Présences", href: "/personnel/pointage", key: "nav.pointage" },
      { titre: "Bulletins & Paie", href: "/personnel/paie", key: "nav.paie" },
      { titre: "Cotisations & Impôts", href: "/personnel/cotisations", key: "nav.cotisations" },
      { titre: "Paramètres RH & Législations", href: "/personnel/parametres", key: "nav.parametres_rh" },
      { titre: "Tronc des Pourboires", href: "/personnel/pourboires", key: "nav.pourboires" },
    ],
  },
  {
    id: "direction",
    titre: "Comptabilité & KPI",
    key: "nav.direction",
    icone: "BarChart3",
    items: [
      { titre: "Indicateurs RevPAR / TO / ADR", href: "/direction/kpi", key: "nav.kpi" },
      { titre: "Grand-Livre SYSCOHADA", href: "/comptabilite", key: "nav.comptabilite" },
      { titre: "Paramètres de l'Hôtel", href: "/parametres", key: "nav.parametres" },
      { titre: "Abonnement & Forfaits", href: "/abonnement", key: "nav.abonnement" },
    ],
  },
];
