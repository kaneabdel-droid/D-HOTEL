# D-HOTEL — Plateforme Intégrée de Gestion Hôtelière & Resorts

SaaS hôtelier haut de gamme de la suite **DembaSolution** :
- **PMS** (Property Management System) : Chambres, grilles tarifaires multi-saisons, Rack interactif Gantt, réservations, check-in/out, folios clients et fiches de police réglementaires.
- **Housekeeping & Gouvernance** : Statut ménage des chambres en temps réel, application mobile femme de chambre, minibar et maintenance.
- **POS Restauration & Bars** : Caisse tactile (Touch POS) pour tablettes, KDS cuisine, déstockage automatique des recettes et imputation directe sur la note de chambre.
- **MICE, Salles & Piscine** : Devis séminaires, forfaits journée piscine (Day-Pass), banquets et événements.
- **Loisirs & Excursions** : Randonnées pédestres/VTT, safaris, sorties pirogue, gestion des jauges et des guides.
- **Économat & Approvisionnements** : Multi-stocks, PUMP et alertes de seuil.
- **Caisses & Trésorerie** : Multi-caisses avec clôtures aveugles à double contrôle et encaissement en ligne via **Maketou** (Wave, Orange Money, Cartes).
- **Comptabilité & Pilotage** : SYSCOHADA hôtelier, calcul automatique du **RevPAR, TO, ADR et RevPAC**.

## Commandes

```bash
npm run dev      # Lance le serveur Next.js de développement
npm run build    # Compile pour la production
npm run start    # Démarre le serveur de production
npm run typecheck # Vérifie les types TypeScript
```

## Structure du Projet

```
d-hotel/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx                           # Tableau de bord général de direction (KPIs)
│   │   ├── hebergements/rack/page.tsx         # Rack d'occupation interactif (Gantt)
│   │   ├── hebergements/reservations/page.tsx # Gestion des réservations et folios
│   │   ├── restauration/pos/page.tsx          # Caisse tactile Touch POS Restaurant/Bar
│   │   └── gouvernance/page.tsx               # Suivi de ménage & Housekeeping
│   ├── login/page.tsx                         # Connexion multi-modes (Email / Identifiant / Téléphone)
│   ├── globals.css                            # Design system avec les 3 thèmes de prestige
│   └── layout.tsx                             # Layout racine avec polices et sécurité
├── components/
│   ├── AppShell.tsx                           # Shell Slack-like (Sidebar, Ctrl+K, Tiroir mobile)
│   ├── ThemeSwitcher.tsx                      # Sélecteur Palace / Oasis / Midnight
│   └── ClientSecurityShield.tsx               # Protection anti-clickjacking
├── lib/
│   ├── menus.ts                               # Registre des 10 modules métier
│   ├── security.ts                            # Middleware anti-intrusion et anti-scraping
│   └── utils.ts                               # Formatage monétaire FCFA (XOF) et dates
├── supabase/
│   └── migrations/                            # 16 migrations SQL séquentielles
├── utils/supabase/                            # Client factories SSR pour Supabase
├── next.config.ts                             # Headers durcis, CSP et colocalisation
└── vercel.json                                # Région dub1 (Dublin)
```
