export interface SousMenuItem {
  titre: string;
  href: string;
  badge?: string | number;
}

export interface MenuItem {
  id: string;
  titre: string;
  icone: string;
  href?: string;
  badge?: string | number;
  items?: SousMenuItem[];
  rolesAutorises?: string[];
}

export const SECTIONS_MENUS: MenuItem[] = [
  {
    id: "dashboard",
    titre: "Tableau de Bord",
    icone: "LayoutDashboard",
    href: "/",
  },
  {
    id: "reception",
    titre: "Front-Desk & Chambres",
    icone: "Hotel",
    items: [
      { titre: "Rack Interactif (Gantt)", href: "/hebergements/rack" },
      { titre: "Réservations", href: "/hebergements/reservations" },
      { titre: "Arrivées & Départs", href: "/hebergements/arrivees-departs" },
      { titre: "Chambres & Grille Tarifaire", href: "/hebergements/chambres" },
      { titre: "Fiches de Police", href: "/hebergements/police" },
    ],
  },
  {
    id: "gouvernance",
    titre: "Gouvernance & Ménage",
    icone: "Sparkles",
    items: [
      { titre: "Statut des Chambres", href: "/gouvernance" },
      { titre: "Minibar & Lingerie", href: "/gouvernance/minibar" },
      { titre: "Maintenance & Pannes", href: "/gouvernance/maintenance" },
    ],
  },
  {
    id: "restauration",
    titre: "Restauration & Bars",
    icone: "UtensilsCrossed",
    items: [
      { titre: "Caisse Tactile (Touch POS)", href: "/restauration/pos" },
      { titre: "Écran Cuisine (KDS)", href: "/restauration/kds" },
      { titre: "Cartes, Menus & Recettes", href: "/restauration/menus" },
    ],
  },
  {
    id: "evenements",
    titre: "MICE, Salles & Piscine",
    icone: "Building",
    items: [
      { titre: "Salles & Séminaires", href: "/evenements/salles" },
      { titre: "Billetterie Piscine (Day-Pass)", href: "/evenements/piscine" },
      { titre: "Spectacles & Soirées", href: "/evenements/spectacles" },
    ],
  },
  {
    id: "loisirs",
    titre: "Excursions & Randonnées",
    icone: "Compass",
    items: [
      { titre: "Planning des Sorties", href: "/loisirs/excursions" },
      { titre: "Guides & Matériel", href: "/loisirs/ressources" },
    ],
  },
  {
    id: "economat",
    titre: "Économat & Stocks",
    icone: "Package",
    items: [
      { titre: "Stocks Multi-Dépôts", href: "/economat/stocks" },
      { titre: "Commandes & Fournisseurs", href: "/economat/achats" },
    ],
  },
  {
    id: "crm",
    titre: "Fichier Clients (CRM)",
    icone: "Users",
    href: "/clients",
  },
  {
    id: "tresorerie",
    titre: "Caisses & Trésorerie",
    icone: "Coins",
    items: [
      { titre: "Sessions de Caisse", href: "/tresorerie/caisses" },
      { titre: "Factures & Folios", href: "/tresorerie/factures" },
    ],
  },
  {
    id: "personnel",
    titre: "Personnel & RH",
    icone: "UserCheck",
    items: [
      { titre: "Planning des Quarts (Shifts)", href: "/personnel" },
      { titre: "Salariés & Prestataires", href: "/personnel/salaries" },
      { titre: "Contrats & Conventions", href: "/personnel/contrats" },
      { titre: "Pointage & Présences", href: "/personnel/pointage" },
      { titre: "Bulletins & Paie", href: "/personnel/paie" },
      { titre: "Cotisations & Impôts", href: "/personnel/cotisations" },
      { titre: "Tronc des Pourboires", href: "/personnel/pourboires" },
    ],
  },
  {
    id: "direction",
    titre: "Comptabilité & KPI",
    icone: "BarChart3",
    items: [
      { titre: "Indicateurs RevPAR / TO / ADR", href: "/direction/kpi" },
      { titre: "Grand-Livre SYSCOHADA", href: "/comptabilite" },
      { titre: "Paramètres de l'Hôtel", href: "/parametres" },
    ],
  },
];
